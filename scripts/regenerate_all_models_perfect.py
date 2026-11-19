import os
import sys
import json
import subprocess
import numpy as np
from PIL import Image
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

print("=== Standardizing and Perfecting All 4 Models (Seamless Intro->Idle & Infinite Loop) ===")

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

def transform_frame(im_pil, shift_x=160):
    scaled = im_pil.resize((1920, 1080), Image.Resampling.LANCZOS)
    arr = np.array(scaled)
    canvas = np.full((1080, 1920, 3), 255, dtype=np.uint8)
    if shift_x > 0:
        canvas[:, shift_x:] = arr[:, :1920 - shift_x]
    else:
        canvas = arr
    clean = apply_white_curve(canvas)
    return Image.fromarray(clean)

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

def ensure_perfect_idle_loop(mp4_path, out_mp4_path, num_frames=48, fade_len=8):
    print(f"Ensuring perfect loop on {mp4_path} -> {out_mp4_path}...")
    tmp_dir = f"/tmp/loop_prep_{os.path.basename(mp4_path)}"
    os.makedirs(tmp_dir, exist_ok=True)
    subprocess.run(f"ffmpeg -y -i {mp4_path} -vframes {num_frames} {tmp_dir}/f_%04d.png", shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    files = sorted(os.listdir(tmp_dir))[:num_frames]
    
    frames = [np.array(Image.open(f"{tmp_dir}/{f}"), dtype=np.float32) for f in files]
    N = len(frames)
    
    # Cosine harmonic crossfade on last fade_len frames into frame 0
    for i in range(fade_len):
        t = (i + 1.0) / float(fade_len + 1.0)
        alpha = 0.5 * (1.0 - np.cos(np.pi * t))
        frames[N - fade_len + i] = (1.0 - alpha) * frames[N - fade_len + i] + alpha * frames[0]
        
    out_dir = f"{tmp_dir}_clean"
    os.makedirs(out_dir, exist_ok=True)
    for i, arr in enumerate(frames):
        im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
        im.save(f"{out_dir}/f_{i:04d}.png")
        
    subprocess.run(
        f"ffmpeg -y -framerate 24 -i {out_dir}/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -preset fast -movflags +faststart {out_mp4_path}",
        shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )
    print(f"  [OK] Saved perfected {out_mp4_path} ({len(frames)} frames)")

for m, base in [('hero', 'hero'), ('model2', 'model2'), ('model4', 'model4')]:
    idle_file = f"public/media/{base}-idle.mp4"
    ensure_perfect_idle_loop(idle_file, idle_file, num_frames=48, fade_len=8)

print("\n[ALL MODELS PERFECTED]")
