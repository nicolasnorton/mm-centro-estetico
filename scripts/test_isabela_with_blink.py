import cv2
import numpy as np
from PIL import Image
import os
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

# 1. Base frame with pristine closed lips
base_im = Image.open('/tmp/model4_intro_frames/f_0087.png').convert('RGB')
blink_im = Image.open('/tmp/eval_idle_geom_model4/f_0037.png').convert('RGB')

arr_base = np.array(base_im)
arr_blink = np.array(blink_im)

# 2. MediaPipe to find eye landmarks on base and blink images
base_options = python.BaseOptions(model_asset_path='/tmp/face_landmarker.task')
options = vision.FaceLandmarkerOptions(base_options=base_options, num_faces=1)
detector = vision.FaceLandmarker.create_from_options(options)

res_base = detector.detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=arr_base))
res_blink = detector.detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=arr_blink))

lm_base = res_base.face_landmarks[0]
lm_blink = res_blink.face_landmarks[0]

# Compute precise eye bounding boxes and alignment
# Right eye corners: 33, 133, top: 159
# Left eye corners: 362, 263, top: 386

pts_src_r = np.float32([
    [lm_blink[33].x * 1920, lm_blink[33].y * 1080],
    [lm_blink[133].x * 1920, lm_blink[133].y * 1080],
    [lm_blink[159].x * 1920, lm_blink[159].y * 1080]
])
pts_dst_r = np.float32([
    [lm_base[33].x * 1920, lm_base[33].y * 1080],
    [lm_base[133].x * 1920, lm_base[133].y * 1080],
    [lm_base[159].x * 1920, lm_base[159].y * 1080]
])
M_r = cv2.getAffineTransform(pts_src_r, pts_dst_r)
warped_blink_r = cv2.warpAffine(arr_blink, M_r, (1920, 1080), flags=cv2.INTER_CUBIC)

pts_src_l = np.float32([
    [lm_blink[362].x * 1920, lm_blink[362].y * 1080],
    [lm_blink[263].x * 1920, lm_blink[263].y * 1080],
    [lm_blink[386].x * 1920, lm_blink[386].y * 1080]
])
pts_dst_l = np.float32([
    [lm_base[362].x * 1920, lm_base[362].y * 1080],
    [lm_base[263].x * 1920, lm_base[263].y * 1080],
    [lm_base[386].x * 1920, lm_base[386].y * 1080]
])
M_l = cv2.getAffineTransform(pts_src_l, pts_dst_l)
warped_blink_l = cv2.warpAffine(arr_blink, M_l, (1920, 1080), flags=cv2.INTER_CUBIC)

# Eyeball masks
h, w, _ = arr_base.shape
mask_r = np.zeros((h, w), dtype=np.float32)
mask_l = np.zeros((h, w), dtype=np.float32)

cr_x = (lm_base[33].x + lm_base[133].x) * 0.5 * 1920
cr_y = (lm_base[33].y + lm_base[133].y) * 0.5 * 1080
cl_x = (lm_base[362].x + lm_base[263].x) * 0.5 * 1920
cl_y = (lm_base[362].y + lm_base[263].y) * 0.5 * 1080

cv2.ellipse(mask_r, (int(cr_x), int(cr_y)), (38, 22), 0, 0, 360, 1.0, -1)
cv2.ellipse(mask_l, (int(cl_x), int(cl_y)), (38, 22), 0, 0, 360, 1.0, -1)

mask_r = cv2.GaussianBlur(mask_r, (17, 17), 0)[:, :, None]
mask_l = cv2.GaussianBlur(mask_l, (17, 17), 0)[:, :, None]

def get_base_frame_with_blink(blink_factor):
    """
    blink_factor in [0.0, 1.0]: 0.0 = fully open, 1.0 = fully closed eyelid.
    """
    if blink_factor <= 0.001:
        return arr_base.copy()
        
    bf = float(np.clip(blink_factor, 0.0, 1.0))
    res = arr_base.astype(np.float32).copy()
    
    # Smooth upper eyelid lowering:
    res = res * (1.0 - bf * mask_r) + warped_blink_r.astype(np.float32) * (bf * mask_r)
    res = res * (1.0 - bf * mask_l) + warped_blink_l.astype(np.float32) * (bf * mask_l)
    
    return np.clip(res, 0, 255).astype(np.uint8)

# 3. Test blink profile across 48 frames (2.0s loop)
# A natural relaxed blink happens once during the loop:
# say around frame 20..28 (duration ~350ms):
# frame 20: 0.0
# frame 21: 0.20
# frame 22: 0.60
# frame 23: 0.95
# frame 24: 1.00 (eyes gently closed)
# frame 25: 0.85
# frame 26: 0.50
# frame 27: 0.20
# frame 28: 0.0
blink_schedule = {
    21: 0.20,
    22: 0.60,
    23: 0.95,
    24: 1.00,
    25: 0.85,
    26: 0.50,
    27: 0.20,
}

out_dir = '/tmp/test_blink_48'
os.makedirs(out_dir, exist_ok=True)

pivot = (960.0, 780.0) # neck/chest pivot
px, py = pivot
N = 48

def apply_white_curve(arr):
    img_float = arr.astype(np.float32)
    r = img_float[:, :, 0]
    g = img_float[:, :, 1]
    b = img_float[:, :, 2]
    min_c = np.minimum(np.minimum(r, g), b)
    is_neutral_bg = (min_c >= 210.0) & (np.abs(r - b) < 25.0)
    
    mask_mid = is_neutral_bg & (min_c < 235.0)
    t = (min_c[mask_mid] - 210.0) / 25.0
    t_smooth = t * t * (3.0 - 2.0 * t)
    
    for c in range(3):
        channel = img_float[:, :, c]
        channel[mask_mid] = channel[mask_mid] + t_smooth * (255.0 - channel[mask_mid])
        channel[is_neutral_bg & (min_c >= 235.0)] = 255.0
        img_float[:, :, c] = channel
        
    return np.clip(img_float, 0, 255).astype(np.uint8)

for f in range(N):
    ang = 2.0 * np.pi * f / float(N)
    s_sin = np.sin(ang)
    s_cos = 0.5 * (1.0 - np.cos(ang))
    
    # Same organic breathing & head sway as Valentina (tested & loved by user)
    rot_deg = 1.4 * s_sin
    tx = 7.0 * s_sin
    ty = -12.0 * s_cos
    scale = 1.0 + 0.006 * s_cos
    
    bf = blink_schedule.get(f, 0.0)
    frame_arr = get_base_frame_with_blink(bf)
    pil_frame = Image.fromarray(frame_arr)
    
    # Strict Euclidean similarity transform centered around pivot (960, 780)
    rad = np.radians(rot_deg)
    inv_s = 1.0 / scale
    inv_cos = np.cos(rad) * inv_s
    inv_sin = np.sin(rad) * inv_s
    
    a = inv_cos
    b = inv_sin
    c = px - inv_cos * (px + tx) - inv_sin * (py + ty)
    d = -inv_sin
    e = inv_cos
    f_val = py + inv_sin * (px + tx) - inv_cos * (py + ty)
    
    transformed = pil_frame.transform(
        (1920, 1080),
        Image.Transform.AFFINE,
        (a, b, c, d, e, f_val),
        resample=Image.Resampling.BICUBIC,
        fillcolor=(255, 255, 255)
    )
    
    clean_arr = apply_white_curve(np.array(transformed))
    clean_im = Image.fromarray(clean_arr)
    clean_im.save(f'{out_dir}/f_{f:04d}.png')

print(f"Generated {N} test frames with natural breathing, subtle closed smile, and soft blink.")
