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

print("=== Replicating Camila's Exact Idle Motion for Isabela (Model 4) ===")

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

# 4. Load Camila Motion Profile
with open('/tmp/camila_motion_profile.json', 'r') as f:
    camila = json.load(f)

base_nx = camila[0]['nose_x']
base_ny = camila[0]['nose_y']
base_rot = camila[0]['rot_deg']
base_scale = camila[0]['scale']

dx_list = [m['nose_x'] - base_nx for m in camila]
dy_list = [m['nose_y'] - base_ny for m in camila]
rot_list = [m['rot_deg'] - base_rot for m in camila]
scale_list = [m['scale'] / base_scale for m in camila]

# Taper last 6 frames to ensure seamless closure at frame 47 -> frame 0
taper_len = 6
for k in range(taper_len):
    idx = 48 - taper_len + k
    alpha = (k + 1.0) / float(taper_len + 1.0)
    s_alpha = alpha * alpha * (3.0 - 2.0 * alpha)
    dx_list[idx] *= (1.0 - s_alpha)
    dy_list[idx] *= (1.0 - s_alpha)
    rot_list[idx] *= (1.0 - s_alpha)
    scale_list[idx] = 1.0 + (scale_list[idx] - 1.0) * (1.0 - s_alpha)

dx_list[0] = 0.0
dy_list[0] = 0.0
rot_list[0] = 0.0
scale_list[0] = 1.0

# 5. Deformation Grid with Torso Grounding
H, W, _ = im87.shape
grid_x = np.tile(np.arange(W, dtype=np.float32), (H, 1))
grid_y = np.tile(np.arange(H, dtype=np.float32)[:, None], (1, W))

# Vertical compliance:
# y <= 620: 1.0 (head & neck)
# y in 620..1080: smooth transition down to 0.35 at bottom
y_arr = np.arange(H, dtype=np.float32)
w_y = np.ones(H, dtype=np.float32)
mask_blend = y_arr > 620.0
t_b = (y_arr[mask_blend] - 620.0) / (1080.0 - 620.0)
t_b_smooth = t_b * t_b * (3.0 - 2.0 * t_b)
w_y[mask_blend] = 1.0 - 0.65 * t_b_smooth
w_grid = np.tile(w_y[:, None], (1, W))

pivot_x = 1136.4
pivot_y = 850.0

# 6. Generate 48 Idle Frames
out_dir = '/tmp/isabela_camila_replicated'
os.makedirs(out_dir, exist_ok=True)
idle_clean_images = []

print("Rendering 48 idle frames replicating Camila motion...")
for i in range(48):
    dx = dx_list[i]
    dy = dy_list[i]
    rot = np.radians(rot_list[i])
    s = scale_list[i]
    
    eff_rot = rot * w_grid
    eff_dx = dx * w_grid
    eff_dy = dy * w_grid
    eff_s = 1.0 + (s - 1.0) * w_grid
    
    inv_s = 1.0 / eff_s
    cos_t = np.cos(-eff_rot) * inv_s
    sin_t = np.sin(-eff_rot) * inv_s
    
    x_rel = grid_x - pivot_x - eff_dx
    y_rel = grid_y - pivot_y - eff_dy
    
    src_x = (pivot_x + cos_t * x_rel - sin_t * y_rel).astype(np.float32)
    src_y = (pivot_y + sin_t * x_rel + cos_t * y_rel).astype(np.float32)
    
    warped = cv2.remap(im87, src_x, src_y, interpolation=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REFLECT)
    clean = apply_white_curve(warped)
    pil_frame = Image.fromarray(clean)
    pil_frame.save(f'{out_dir}/f_{i:04d}.png')
    idle_clean_images.append(pil_frame)

print(f"  [OK] Saved 48 frames in {out_dir}")

# Check loop continuity
f0_arr = np.array(idle_clean_images[0], dtype=float)
f47_arr = np.array(idle_clean_images[-1], dtype=float)
diff_wrap = np.abs(f47_arr - f0_arr).mean()
print(f"  [VERIFY] Idle wrap diff (Frame 47 vs Frame 0): {diff_wrap:.4f}")

# 7. Encode public/media/model4-idle.mp4
idle_mp4 = 'public/media/model4-idle.mp4'
cmd_idle = [
    'ffmpeg', '-y',
    '-framerate', '24',
    '-i', f'{out_dir}/f_%04d.png',
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
intro_frames_dir = '/tmp/isabela_intro_replicated'
os.makedirs(intro_frames_dir, exist_ok=True)
intro_clean_images = []

for i in range(1, 88):
    src_p = f'/tmp/model4_intro_frames/f_{i:04d}.png'
    raw_im = np.array(Image.open(src_p).convert('RGB'))
    clean_im = apply_white_curve(raw_im)
    
    # Hand-off blend on last 4 frames
    if i >= 84:
        blend_t = (i - 83) / 4.0
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
print("\n=== ISABELA REPLICATION COMPLETE ===")
