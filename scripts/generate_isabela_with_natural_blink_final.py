import os
import sys
import json
import subprocess
import cv2
import numpy as np
from PIL import Image
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

print("=== Generating Isabela: Natural Serene Closed-Lip Video with Gentle Realistic Blink ===")

# 1. Initialize MediaPipe Face Landmarker
base_options = python.BaseOptions(model_asset_path='/tmp/face_landmarker.task')
options = vision.FaceLandmarkerOptions(
    base_options=base_options,
    output_face_blendshapes=False,
    output_facial_transformation_matrixes=False,
    num_faces=1
)
detector = vision.FaceLandmarker.create_from_options(options)

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

# 2. Base frame with pristine closed-lip smile
base_im = Image.open('/tmp/model4_intro_frames/f_0087.png').convert('RGB')
blink_im = Image.open('/tmp/eval_idle_geom_model4/f_0037.png').convert('RGB')

arr_base = np.array(base_im)
arr_blink = np.array(blink_im)

res_base = detector.detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=arr_base))
res_blink = detector.detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=arr_blink))

lm_base = res_base.face_landmarks[0]
lm_blink = res_blink.face_landmarks[0]

# Precise affine warp for right and left eye eyelids
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

# Eyeball feather masks
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
    if blink_factor <= 0.001:
        return arr_base.copy()
    bf = float(np.clip(blink_factor, 0.0, 1.0))
    res = arr_base.astype(np.float32).copy()
    res = res * (1.0 - bf * mask_r) + warped_blink_r.astype(np.float32) * (bf * mask_r)
    res = res * (1.0 - bf * mask_l) + warped_blink_l.astype(np.float32) * (bf * mask_l)
    return np.clip(res, 0, 255).astype(np.uint8)

# Natural 7-frame blink schedule centered around frame 24
blink_schedule = {
    21: 0.20,
    22: 0.60,
    23: 0.95,
    24: 1.00,
    25: 0.85,
    26: 0.50,
    27: 0.20,
}

# 3. Generate 48 Idle Frames (2.0s @ 24fps)
idle_dir = '/tmp/isabela_blink_idle_final'
os.makedirs(idle_dir, exist_ok=True)

pivot = (960.0, 780.0) # neck/chest pivot
px, py = pivot
N_IDLE = 48
idle_clean_images = []

print("Generating 48 idle frames with subtle breathing, serene closed smile, and natural blink...")
for f in range(N_IDLE):
    ang = 2.0 * np.pi * f / float(N_IDLE)
    s_sin = np.sin(ang)
    s_cos = 0.5 * (1.0 - np.cos(ang))
    
    rot_deg = 1.4 * s_sin
    tx = 7.0 * s_sin
    ty = -12.0 * s_cos
    scale = 1.0 + 0.006 * s_cos
    
    bf = blink_schedule.get(f, 0.0)
    frame_arr = get_base_frame_with_blink(bf)
    pil_frame = Image.fromarray(frame_arr)
    
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
    clean_im.save(f'{idle_dir}/f_{f:04d}.png')
    idle_clean_images.append(clean_im)

out_idle_mp4 = "public/media/model4-idle.mp4"
subprocess.run(
    f"ffmpeg -y -framerate 24 -i {idle_dir}/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -preset fast -movflags +faststart {out_idle_mp4}",
    shell=True, check=True
)
print(f"  [OK] Saved {out_idle_mp4} (48 frames)")

# Save model4-end.webp from idle frame 0
out_end_webp = "public/media/model4-end.webp"
idle_clean_images[0].save(out_end_webp, "WEBP", quality=95)
print(f"  [OK] Saved {out_end_webp}")

# 4. Generate 87 Intro Frames
intro_source_dir = '/tmp/model4_intro_frames'
intro_dir = '/tmp/isabela_blink_intro_final'
os.makedirs(intro_dir, exist_ok=True)

N_INTRO = 87
intro_clean_images = []

print("Generating 87 intro frames with pure white background and seamless handoff...")
for i in range(1, N_INTRO + 1):
    fpath = f'{intro_source_dir}/f_{i:04d}.png'
    raw_im = Image.open(fpath).convert('RGB')
    clean_arr = apply_white_curve(np.array(raw_im))
    
    frame_idx = i - 1 # 0 to 86
    if frame_idx == 85: # Frame 86
        idle_arr = np.array(idle_clean_images[0], dtype=np.float32)
        blended = 0.5 * clean_arr.astype(np.float32) + 0.5 * idle_arr
        clean_arr = np.clip(blended, 0, 255).astype(np.uint8)
    elif frame_idx == 86: # Frame 87 (final)
        clean_arr = np.array(idle_clean_images[0])
        
    clean_im = Image.fromarray(clean_arr)
    clean_im.save(f'{intro_dir}/f_{frame_idx:04d}.png')
    intro_clean_images.append(clean_im)

out_intro_mp4 = "public/media/model4-intro.mp4"
subprocess.run(
    f"ffmpeg -y -framerate 24 -i {intro_dir}/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -preset fast -movflags +faststart {out_intro_mp4}",
    shell=True, check=True
)
print(f"  [OK] Saved {out_intro_mp4} (87 frames)")

out_poster_webp = "public/media/model4-poster.webp"
intro_clean_images[0].save(out_poster_webp, "WEBP", quality=95)
print(f"  [OK] Saved {out_poster_webp}")

# 5. Extract landmarks for tracks.json
def extract_landmarks(im_pil, base_span=None):
    mp_img = mp.Image(image_format=mp.ImageFormat.SRGB, data=np.array(im_pil))
    res = detector.detect(mp_img)
    if not res.face_landmarks:
        return None, base_span
    lms = res.face_landmarks[0]
    p0 = lms[10]   # Forehead
    p1 = lms[340]  # Right cheek / malar
    p2 = lms[205]  # Left cheek / chin
    
    span = abs(lms[152].y - lms[10].y)
    if base_span is None or base_span <= 0:
        base_span = span
    scale = span / base_span if base_span > 0 else 1.0
    scale = float(np.clip(scale, 0.85, 1.25))
    
    pts = [
        [round(p0.x * 100, 2), round(p0.y * 100, 2), round(scale, 2)],
        [round(p1.x * 100, 2), round(p1.y * 100, 2), round(scale, 2)],
        [round(p2.x * 100, 2), round(p2.y * 100, 2), round(scale, 2)]
    ]
    return pts, base_span

def smooth_track_series(series):
    n = len(series)
    if n <= 2: return series
    smoothed = []
    for i in range(n):
        pts = []
        for j in range(3):
            prev_pt = series[max(0, i - 1)][j]
            curr_pt = series[i][j]
            next_pt = series[min(n - 1, i + 1)][j]
            x = 0.2 * prev_pt[0] + 0.6 * curr_pt[0] + 0.2 * next_pt[0]
            y = 0.2 * prev_pt[1] + 0.6 * curr_pt[1] + 0.2 * next_pt[1]
            s = 0.2 * prev_pt[2] + 0.6 * curr_pt[2] + 0.2 * next_pt[2]
            pts.append([round(x, 2), round(y, 2), round(s, 2)])
        smoothed.append(pts)
    return smoothed

print("Extracting tracking landmarks for Intro and Idle...")
intro_tracks = []
base_span = None
for im in intro_clean_images:
    pts, base_span = extract_landmarks(im, base_span)
    if pts is None and len(intro_tracks) > 0:
        pts = intro_tracks[-1]
    intro_tracks.append(pts)

idle_tracks = []
for im in idle_clean_images:
    pts, base_span = extract_landmarks(im, base_span)
    if pts is None and len(idle_tracks) > 0:
        pts = idle_tracks[-1]
    idle_tracks.append(pts)

intro_tracks = smooth_track_series(intro_tracks)
idle_tracks = smooth_track_series(idle_tracks)

intro_tracks[-1] = [list(pt) for pt in idle_tracks[0]]
idle_tracks[-1] = [list(pt) for pt in idle_tracks[0]]

with open('src/tracks.json', 'r') as f:
    tracks_data = json.load(f)

tracks_data['isabela'] = {
    'fps': 24,
    'intro': intro_tracks,
    'idle': idle_tracks
}
tracks_data['model4'] = {
    'fps': 24,
    'intro': intro_tracks,
    'idle': idle_tracks
}

with open('src/tracks.json', 'w') as f:
    json.dump(tracks_data, f, indent=2)

print("  [OK] Updated src/tracks.json successfully!")
print("\n=== ISABELA REGENERATION COMPLETE WITH NATURAL BLINK & CLOSED LIPS ===")
