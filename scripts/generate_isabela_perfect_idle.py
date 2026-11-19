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

print("=== Generating Isabela: Pure Still Pose, Natural Blink & Subtle Warm Smile ===")

# 1. Initialize MediaPipe Face Landmarker
base_options = python.BaseOptions(model_asset_path='/tmp/face_landmarker.task')
options = vision.FaceLandmarkerOptions(
    base_options=base_options,
    output_face_blendshapes=False,
    output_facial_transformation_matrixes=False,
    num_faces=1
)
detector = vision.FaceLandmarker.create_from_options(options)

# 2. White Curve Function for Pure #FFFFFF Background
def apply_white_curve(arr):
    img_float = arr.astype(np.float32)
    r = img_float[:, :, 0]
    g = img_float[:, :, 1]
    b = img_float[:, :, 2]
    min_c = np.minimum(np.minimum(r, g), b)
    is_neutral_bg = (min_c >= 200.0) & (np.abs(r - b) < 25.0)
    
    mask_mid = is_neutral_bg & (min_c < 235.0)
    t = (min_c[mask_mid] - 200.0) / 35.0
    t_smooth = t * t * (3.0 - 2.0 * t)
    
    for c in range(3):
        channel = img_float[:, :, c]
        channel[mask_mid] = channel[mask_mid] + t_smooth * (255.0 - channel[mask_mid])
        channel[is_neutral_bg & (min_c >= 235.0)] = 255.0
        img_float[:, :, c] = channel
        
    return np.clip(img_float, 0, 255).astype(np.uint8)

# 3. Base Frame
im87_raw = np.array(Image.open('/tmp/model4_intro_frames/f_0087.png').convert('RGB'))
im87 = apply_white_curve(im87_raw)

# Detect landmarks on base frame 87
res87 = detector.detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=im87))
lm87 = res87.face_landmarks[0]

# 4. Prepare Blink Eye Patches
# Real blink frames from model4_intro_frames (same lighting, sealed lips):
# f72 (start closing), f73, f74, f75 (closed), f76, f77, f78 (opening)
blink_frame_map = {
    20: 72,
    21: 73,
    22: 74,
    23: 75,
    24: 75,
    25: 76,
    26: 77,
    27: 78
}

# Landmarks for local eye affine:
# R-eye (viewer left): outer 33, inner 133, eyebrow 70
# L-eye (viewer right): inner 362, outer 263, eyebrow 300
pts_dst_r = np.float32([
    [lm87[33].x * 1920, lm87[33].y * 1080],
    [lm87[133].x * 1920, lm87[133].y * 1080],
    [lm87[70].x * 1920, lm87[70].y * 1080]
])
pts_dst_l = np.float32([
    [lm87[362].x * 1920, lm87[362].y * 1080],
    [lm87[263].x * 1920, lm87[263].y * 1080],
    [lm87[300].x * 1920, lm87[300].y * 1080]
])

# Smooth eye masks
H, W, _ = im87.shape
mask_r = np.zeros((H, W), dtype=np.float32)
mask_l = np.zeros((H, W), dtype=np.float32)

cr_x = (lm87[33].x + lm87[133].x) * 0.5 * 1920
cr_y = (lm87[33].y + lm87[133].y) * 0.5 * 1080
cl_x = (lm87[362].x + lm87[263].x) * 0.5 * 1920
cl_y = (lm87[362].y + lm87[263].y) * 0.5 * 1080

cv2.ellipse(mask_r, (int(cr_x), int(cr_y)), (42, 24), 0, 0, 360, 1.0, -1)
cv2.ellipse(mask_l, (int(cl_x), int(cl_y)), (42, 24), 0, 0, 360, 1.0, -1)

mask_r = cv2.GaussianBlur(mask_r, (17, 17), 0)[:, :, None]
mask_l = cv2.GaussianBlur(mask_l, (17, 17), 0)[:, :, None]

blink_patches = {}
for f_num in [72, 73, 74, 75, 76, 77, 78]:
    im_src = np.array(Image.open(f'/tmp/model4_intro_frames/f_{f_num:04d}.png').convert('RGB'))
    res_src = detector.detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=im_src))
    lm_src = res_src.face_landmarks[0]
    
    pts_src_r = np.float32([
        [lm_src[33].x * 1920, lm_src[33].y * 1080],
        [lm_src[133].x * 1920, lm_src[133].y * 1080],
        [lm_src[70].x * 1920, lm_src[70].y * 1080]
    ])
    pts_src_l = np.float32([
        [lm_src[362].x * 1920, lm_src[362].y * 1080],
        [lm_src[263].x * 1920, lm_src[263].y * 1080],
        [lm_src[300].x * 1920, lm_src[300].y * 1080]
    ])
    
    M_r = cv2.getAffineTransform(pts_src_r, pts_dst_r)
    warped_r = cv2.warpAffine(im_src, M_r, (W, H), flags=cv2.INTER_LANCZOS4)
    
    M_l = cv2.getAffineTransform(pts_src_l, pts_dst_l)
    warped_l = cv2.warpAffine(im_src, M_l, (W, H), flags=cv2.INTER_LANCZOS4)
    
    comp = im87.astype(np.float32).copy()
    comp = comp * (1.0 - mask_r) + warped_r.astype(np.float32) * mask_r
    comp = comp * (1.0 - mask_l) + warped_l.astype(np.float32) * mask_l
    blink_patches[f_num] = np.clip(comp, 0, 255).astype(np.uint8)

print("  [OK] Precomputed real blink patches (f72..f78)")

# 5. Mouth Smile Deformation Field
c_r = np.array([lm87[61].x * 1920, lm87[61].y * 1080])
c_l = np.array([lm87[291].x * 1920, lm87[291].y * 1080])

base_grid_x = np.tile(np.arange(W, dtype=np.float32), (H, 1))
base_grid_y = np.tile(np.arange(H, dtype=np.float32)[:, None], (1, W))

sigma = 22.0
dy = -1.5
dx_r = -0.5
dx_l = +0.5

dist_sq_r = (base_grid_x - c_r[0])**2 + (base_grid_y - c_r[1])**2
w_r = np.exp(-dist_sq_r / (2.0 * sigma**2)).astype(np.float32)

dist_sq_l = (base_grid_x - c_l[0])**2 + (base_grid_y - c_l[1])**2
w_l = np.exp(-dist_sq_l / (2.0 * sigma**2)).astype(np.float32)

disp_x = (w_r * dx_r + w_l * dx_l).astype(np.float32)
disp_y = (w_r * dy + w_l * dy).astype(np.float32)

# 6. Generate 48 Idle Frames
N_IDLE = 48
idle_frames_dir = '/tmp/isabela_idle_perfect'
os.makedirs(idle_frames_dir, exist_ok=True)
idle_clean_images = []

print("Rendering 48 idle frames...")
for f in range(N_IDLE):
    # Base or blink
    if f in blink_frame_map:
        frame_img = blink_patches[blink_frame_map[f]].copy()
    else:
        frame_img = im87.copy()
    
    # Subtle smile modulation: zero at frame 0 and frame 47
    # sin^2(pi * f / 48) gives 0 at f=0 and 0 at f=48
    # At f=47: sin^2(pi * 47 / 48) = 0.00427 (subpixel 0.006px difference)
    # Let's ensure exact 0.0 at f=0 and f=N_IDLE-1 with Hann envelope:
    phase = np.pi * f / float(N_IDLE - 1)
    smile_factor = float(np.sin(phase) ** 2)
    
    if smile_factor > 0.001:
        map_x = (base_grid_x - smile_factor * disp_x).astype(np.float32)
        map_y = (base_grid_y - smile_factor * disp_y).astype(np.float32)
        frame_img = cv2.remap(frame_img, map_x, map_y, interpolation=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REFLECT)
    
    # Apply white curve to guarantee pure #FFFFFF everywhere
    frame_clean = apply_white_curve(frame_img)
    pil_frame = Image.fromarray(frame_clean)
    pil_frame.save(f'{idle_frames_dir}/f_{f:04d}.png')
    idle_clean_images.append(pil_frame)

print(f"  [OK] Saved 48 frames in {idle_frames_dir}")

# Verify exact match between frame 0 and frame 47:
f0_arr = np.array(idle_clean_images[0], dtype=float)
f47_arr = np.array(idle_clean_images[-1], dtype=float)
diff_wrap = np.abs(f47_arr - f0_arr).mean()
print(f"  [VERIFY] Idle wrap diff (Frame 47 vs Frame 0): {diff_wrap:.4f}")

# 7. Encode public/media/model4-idle.mp4
idle_mp4 = 'public/media/model4-idle.mp4'
cmd_idle = [
    'ffmpeg', '-y',
    '-framerate', '24',
    '-i', f'{idle_frames_dir}/f_%04d.png',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-crf', '16',
    '-preset', 'slow',
    '-movflags', '+faststart',
    idle_mp4
]
subprocess.run(cmd_idle, check=True, stderr=subprocess.DEVNULL)
print(f"  [OK] Encoded {idle_mp4}")

# 8. Update model4-end.webp and model4-poster.webp
idle_clean_images[0].save('public/media/model4-end.webp', 'WEBP', quality=95)
idle_clean_images[0].save('public/media/model4-poster.webp', 'WEBP', quality=95)
print("  [OK] Updated model4-end.webp and model4-poster.webp")

# 9. Process Intro Frames (87 frames) with Seamless Handoff
print("Processing 87 intro frames with pure white background and seamless handoff...")
intro_frames_dir = '/tmp/isabela_intro_perfect'
os.makedirs(intro_frames_dir, exist_ok=True)
intro_clean_images = []

for i in range(1, 88):
    src_p = f'/tmp/model4_intro_frames/f_{i:04d}.png'
    raw_im = np.array(Image.open(src_p).convert('RGB'))
    clean_im = apply_white_curve(raw_im)
    
    # Hand-off blend: the last 4 frames (84, 85, 86, 87) smoothly converge to idle frame 0
    if i >= 84:
        blend_t = (i - 83) / 4.0
        # Smooth Hermite interpolation
        blend_s = blend_t * blend_t * (3.0 - 2.0 * blend_t)
        blended = (1.0 - blend_s) * clean_im.astype(np.float32) + blend_s * f0_arr
        clean_im = np.clip(blended, 0, 255).astype(np.uint8)
    
    pil_intro = Image.fromarray(clean_im)
    pil_intro.save(f'{intro_frames_dir}/f_{i-1:04d}.png')
    intro_clean_images.append(pil_intro)

intro_mp4 = 'public/media/model4-intro.mp4'
cmd_intro = [
    'ffmpeg', '-y',
    '-framerate', '24',
    '-i', f'{intro_frames_dir}/f_%04d.png',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-crf', '16',
    '-preset', 'slow',
    '-movflags', '+faststart',
    intro_mp4
]
subprocess.run(cmd_intro, check=True, stderr=subprocess.DEVNULL)
print(f"  [OK] Encoded {intro_mp4}")

# 10. Extract Facial Tracking Landmarks for src/tracks.json
def extract_landmarks(pil_img, base_span=None):
    arr = np.array(pil_img)
    res = detector.detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=arr))
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

# Guarantee perfect loop & handoff continuity in tracks
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
print("\n=== ISABELA REGENERATION COMPLETE ===")
