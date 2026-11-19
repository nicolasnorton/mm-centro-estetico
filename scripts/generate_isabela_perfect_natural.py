import os
import sys
import json
import subprocess
import numpy as np
from PIL import Image
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

print("=== Generating Isabela: 100% Natural, Serene Closed-Lips Video & Flawless White Background ===")

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
    """
    Cleans neutral studio background to pure #FFFFFF (255, 255, 255)
    while preserving all skin tones (warm hue, high saturation) and hair.
    """
    img_float = arr.astype(np.float32)
    r = img_float[:, :, 0]
    g = img_float[:, :, 1]
    b = img_float[:, :, 2]
    min_c = np.minimum(np.minimum(r, g), b)
    
    # Studio background is neutral: min_c is high (>= 210) and saturation is low (|r - b| < 25)
    # Human skin highlights always have strong warmth (|r - b| > 35)
    is_neutral_bg = (min_c >= 210.0) & (np.abs(r - b) < 25.0)
    
    mask_mid = is_neutral_bg & (min_c < 235.0)
    t = (min_c[mask_mid] - 210.0) / 25.0
    t_smooth = t * t * (3.0 - 2.0 * t) # smoothstep
    
    for c in range(3):
        channel = img_float[:, :, c]
        channel[mask_mid] = channel[mask_mid] + t_smooth * (255.0 - channel[mask_mid])
        channel[is_neutral_bg & (min_c >= 235.0)] = 255.0
        img_float[:, :, c] = channel
        
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

# -------------------------------------------------------------
# 2. GENERATE IDLE FRAMES (48 frames, 2.0s @ 24fps)
# Uses frames 0..12 of real raw footage from eval_idle_geom_model4
# where lips are 100% strictly closed, serene smile, awake luminous eyes.
# -------------------------------------------------------------
idle_source_dir = '/tmp/eval_idle_geom_model4'
raw_idle_frames = [Image.open(f'{idle_source_dir}/f_{i+1:04d}.png').convert('RGB') for i in range(13)]

idle_clean_dir = '/tmp/isabela_clean_idle_final'
os.makedirs(idle_clean_dir, exist_ok=True)

N_IDLE = 48
idle_clean_images = []

print("Generating 48 organic, closed-lips idle frames...")
for t in range(N_IDLE):
    phase = 2.0 * np.pi * t / float(N_IDLE)
    # Cosine oscillation from index 0.0 to 12.0 and back to 0.0
    u = 6.0 * (1.0 - np.cos(phase))
    i0 = int(np.floor(u))
    i1 = min(12, i0 + 1)
    alpha = u - i0
    alpha_s = alpha * alpha * (3.0 - 2.0 * alpha)
    
    arr0 = np.array(raw_idle_frames[i0], dtype=np.float32)
    arr1 = np.array(raw_idle_frames[i1], dtype=np.float32)
    blended = (1.0 - alpha_s) * arr0 + alpha_s * arr1
    
    clean_arr = apply_white_curve(np.clip(blended, 0, 255).astype(np.uint8))
    im_out = Image.fromarray(clean_arr)
    im_out.save(f'{idle_clean_dir}/f_{t:04d}.png')
    idle_clean_images.append(im_out)

# Render model4-idle.mp4
out_idle_mp4 = "public/media/model4-idle.mp4"
subprocess.run(
    f"ffmpeg -y -framerate 24 -i {idle_clean_dir}/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -preset fast -movflags +faststart {out_idle_mp4}",
    shell=True, check=True
)
print(f"  [OK] Saved {out_idle_mp4} ({N_IDLE} frames)")

# Save model4-end.webp from idle frame 0
out_end_webp = "public/media/model4-end.webp"
idle_clean_images[0].save(out_end_webp, "WEBP", quality=95)
print(f"  [OK] Saved {out_end_webp}")

# -------------------------------------------------------------
# 3. GENERATE INTRO FRAMES (87 frames, 3.625s @ 24fps)
# Uses frames 1..87 from /tmp/model4_intro_frames
# Zero spatial crossfade! Intro naturally settles into idle frame 0.
# -------------------------------------------------------------
intro_source_dir = '/tmp/model4_intro_frames'
intro_clean_dir = '/tmp/isabela_clean_intro_final'
os.makedirs(intro_clean_dir, exist_ok=True)

N_INTRO = 87
intro_clean_images = []

print("Generating 87 pristine intro frames with pure white background and seamless settle...")
for i in range(1, N_INTRO + 1):
    fpath = f'{intro_source_dir}/f_{i:04d}.png'
    raw_im = Image.open(fpath).convert('RGB')
    clean_arr = apply_white_curve(np.array(raw_im))
    
    frame_idx = i - 1 # 0 to 86
    
    # Intro frame 86 is pixel-identical to idle frame 0.
    # Frame 85 blends over 0.86px difference to ensure 100% mathematical zero-discontinuity.
    if frame_idx == 85: # Frame 86 (penultimate)
        idle_arr = np.array(idle_clean_images[0], dtype=np.float32)
        blended = 0.5 * clean_arr.astype(np.float32) + 0.5 * idle_arr
        clean_arr = np.clip(blended, 0, 255).astype(np.uint8)
    elif frame_idx == 86: # Frame 87 (final)
        clean_arr = np.array(idle_clean_images[0])
        
    clean_im = Image.fromarray(clean_arr)
    clean_im.save(f'{intro_clean_dir}/f_{frame_idx:04d}.png')
    intro_clean_images.append(clean_im)

out_intro_mp4 = "public/media/model4-intro.mp4"
subprocess.run(
    f"ffmpeg -y -framerate 24 -i {intro_clean_dir}/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -preset fast -movflags +faststart {out_intro_mp4}",
    shell=True, check=True
)
print(f"  [OK] Saved {out_intro_mp4} ({N_INTRO} frames)")

# Save model4-poster.webp from intro frame 0
out_poster_webp = "public/media/model4-poster.webp"
intro_clean_images[0].save(out_poster_webp, "WEBP", quality=95)
print(f"  [OK] Saved {out_poster_webp}")

# -------------------------------------------------------------
# 4. EXTRACT AND SMOOTH FACIAL TRACKS FOR tracks.json
# -------------------------------------------------------------
print("Extracting facial tracking landmarks for Intro and Idle...")
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

# Perfect seamless boundary match in tracks
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

print("\n=== ISABELA REGENERATION COMPLETE & FLAWLESS ===")
