import os
import sys
import json
import subprocess
import numpy as np
from PIL import Image
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

print("=== Generating Isabela Serene Closed-Lips Idle & Seamless Intro Handoff ===")

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
    mask_mid = (img_float > 235.0) & (img_float < 248.0)
    t = (img_float - 235.0) / 13.0
    t_smooth = t * t * (3.0 - 2.0 * t) # smoothstep
    img_float[mask_mid] = 235.0 + t_smooth[mask_mid] * (255.0 - 235.0)
    img_float[img_float >= 248.0] = 255.0
    return np.clip(img_float, 0, 255).astype(np.uint8)

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

# Check pristine base frame f_0084.png
base_frame_path = '/tmp/model4_intro_frames/f_0084.png'
assert os.path.exists(base_frame_path), f"Missing {base_frame_path}"
base_im = Image.open(base_frame_path).convert('RGB')
w, h = base_im.size
assert (w, h) == (1920, 1080)

# Build 48 frames (2.0s @ 24fps) with subtle, serene organic micro-breathing motion
# Harmonic closed-loop oscillation: 0.5 * (1 - cos(2 * pi * t / N))
# Exactly zero position, velocity, and acceleration discontinuity at wrap t=0 and t=N
idle_dir = '/tmp/isabela_perfect_idle'
os.makedirs(idle_dir, exist_ok=True)

N_IDLE = 48
idle_images = []

# Isabela's face center
cx = 1136.0
cy = 486.0

for t in range(N_IDLE):
    phase = 2.0 * np.pi * t / float(N_IDLE)
    # Natural subtle sway and breathing:
    # dy: vertical respiration lift (up and down by ~2.5 pixels)
    # dx: subtle lateral shift (~0.8 pixel)
    # rot: subtle tilt (~0.25 deg)
    # scale: micro scale respiration expansion (~0.2%)
    s_t = 0.5 * (1.0 - np.cos(phase))
    s_t2 = np.sin(phase)
    
    dy = -2.6 * s_t
    dx = 0.8 * s_t2
    d_deg = 0.22 * s_t2
    d_scale = 1.0 + 0.0025 * s_t
    
    # We apply the affine transformation with PIL using high-quality BICUBIC/LANCZOS
    # Affine transform matrix in PIL maps output (x, y) to input (x', y'):
    # x' = a*x + b*y + c
    # y' = d*x + e*y + f
    rad = np.radians(-d_deg)
    cos_r = np.cos(rad) / d_scale
    sin_r = np.sin(rad) / d_scale
    
    # Rotation & scaling centered around (cx, cy), then translated by (dx, dy)
    # (x' - cx) = cos_r * (x - cx - dx) - sin_r * (y - cy - dy)
    # (y' - cy) = sin_r * (x - cx - dx) + cos_r * (y - cy - dy)
    a = cos_r
    b = -sin_r
    c = cx - cos_r * (cx + dx) + sin_r * (cy + dy)
    
    d = sin_r
    e = cos_r
    f = cy - sin_r * (cx + dx) - cos_r * (cy + dy)
    
    aff_im = base_im.transform(
        (w, h),
        Image.AFFINE,
        (a, b, c, d, e, f),
        resample=Image.Resampling.BICUBIC,
        fillcolor=(255, 255, 255)
    )
    
    # Clean up background curve to pure white
    clean_arr = apply_white_curve(np.array(aff_im))
    clean_im = Image.fromarray(clean_arr)
    clean_im.save(f"{idle_dir}/f_{t:04d}.png")
    idle_images.append(clean_im)

print(f"Generated {len(idle_images)} idle frames with strictly closed lips.")

# Render model4-idle.mp4
out_idle_mp4 = "public/media/model4-idle.mp4"
subprocess.run(
    f"ffmpeg -y -framerate 24 -i {idle_dir}/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -preset fast -movflags +faststart {out_idle_mp4}",
    shell=True, check=True
)
print(f"Saved {out_idle_mp4}")

# Save model4-end.webp from idle frame 0
out_end_webp = "public/media/model4-end.webp"
idle_images[0].save(out_end_webp, "WEBP", quality=95)
print(f"Saved {out_end_webp}")

# Save model4-poster.webp
out_poster_webp = "public/media/model4-poster.webp"
# Poster is frame 0 of intro
intro_f0 = Image.open('/tmp/model4_intro_frames/f_0001.png')
intro_f0_clean = Image.fromarray(apply_white_curve(np.array(intro_f0)))
intro_f0_clean.save(out_poster_webp, "WEBP", quality=95)
print(f"Saved {out_poster_webp}")

# Now build the 87 intro frames with smooth handoff ramp to idle frame 0
intro_dir = '/tmp/isabela_perfect_intro'
os.makedirs(intro_dir, exist_ok=True)

ramp_len = 10
intro_clean_images = []

for i in range(1, 88):
    fpath = f'/tmp/model4_intro_frames/f_{i:04d}.png'
    raw_im = Image.open(fpath)
    raw_arr = apply_white_curve(np.array(raw_im))
    
    # Blend last ramp_len frames into idle_images[0]
    frame_idx = i - 1 # 0 to 86
    if frame_idx >= 87 - ramp_len:
        k = frame_idx - (87 - ramp_len)
        alpha = float(k + 1) / float(ramp_len)
        alpha_smooth = alpha * alpha * (3.0 - 2.0 * alpha)
        arr_f = raw_arr.astype(np.float32) * (1.0 - alpha_smooth) + np.array(idle_images[0], dtype=np.float32) * alpha_smooth
        raw_arr = np.clip(arr_f, 0, 255).astype(np.uint8)
    
    clean_im = Image.fromarray(raw_arr)
    clean_im.save(f"{intro_dir}/f_{frame_idx:04d}.png")
    intro_clean_images.append(clean_im)

out_intro_mp4 = "public/media/model4-intro.mp4"
subprocess.run(
    f"ffmpeg -y -framerate 24 -i {intro_dir}/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -preset fast -movflags +faststart {out_intro_mp4}",
    shell=True, check=True
)
print(f"Saved {out_intro_mp4}")

# Update tracks.json for 'isabela' and 'model4'
print("Extracting facial tracking landmarks for Intro and Idle...")
intro_tracks = []
base_span = None
for im in intro_clean_images:
    pts, base_span = extract_landmarks(im, base_span)
    if pts is None and len(intro_tracks) > 0:
        pts = intro_tracks[-1]
    intro_tracks.append(pts)

idle_tracks = []
for im in idle_images:
    pts, base_span = extract_landmarks(im, base_span)
    if pts is None and len(idle_tracks) > 0:
        pts = idle_tracks[-1]
    idle_tracks.append(pts)

intro_tracks = smooth_track_series(intro_tracks)
idle_tracks = smooth_track_series(idle_tracks)

# Perfect seamless boundary match in tracks
intro_tracks[-1] = [list(pt) for pt in idle_tracks[0]]
idle_tracks[-1] = [list(pt) for pt in idle_tracks[0]]

with open('src/tracks.json', 'r') as f:
    tracks_data = json.load(f)

tracks_data['isabela'] = {
    'intro': intro_tracks,
    'idle': idle_tracks
}
tracks_data['model4'] = {
    'intro': intro_tracks,
    'idle': idle_tracks
}

with open('src/tracks.json', 'w') as f:
    json.dump(tracks_data, f, indent=2)
print("Updated src/tracks.json successfully!")
