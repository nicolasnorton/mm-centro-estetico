import os
import sys
import json
import subprocess
import numpy as np
from PIL import Image
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

print("=== Regenerating Camila (Model 3) with Awake, Luminous Gaze & Infinite Seamless Loop ===")

# Initialize MediaPipe FaceLandmarker
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

# 1. PROCESS INTRO (Frames 0 to 86)
print("1. Extracting 87 frames of Camila Intro (raw frames 1 to 87)...")
intro_raw_dir = "/tmp/camila_raw_intro_full"
intro_clean_dir = "/tmp/camila_intro_clean_final"
os.makedirs(intro_clean_dir, exist_ok=True)

intro_files = sorted([os.path.join(intro_raw_dir, f) for f in os.listdir(intro_raw_dir) if f.startswith('f_')])[:87]
assert len(intro_files) == 87, f"Expected 87 frames, got {len(intro_files)}"

# Idle frame 0 raw (raw idle frame 75 -> f_0076.png)
idle_f0_raw = Image.open('/tmp/camila_all_idle/f_0076.png')

ramp_intro = 8
intro_final_images = []
for i, fpath in enumerate(intro_files):
    im = Image.open(fpath)
    if i >= 87 - ramp_intro:
        k = i - (87 - ramp_intro)
        alpha = (k + 1.0) / float(ramp_intro)
        arr_in = np.array(im).astype(np.float32)
        arr_target = np.array(idle_f0_raw).astype(np.float32)
        blended = (1.0 - alpha) * arr_in + alpha * arr_target
        im = Image.fromarray(np.clip(blended, 0, 255).astype(np.uint8))
    intro_final_images.append(im)

intro_tracks = []
base_span = None
last_valid_pts = None

for i, im in enumerate(intro_final_images):
    clean_im = transform_frame(im, shift_x=160)
    out_frame_path = f"{intro_clean_dir}/f_{i:04d}.png"
    clean_im.save(out_frame_path)
    
    pts, base_span = extract_landmarks(clean_im, base_span)
    if pts is not None:
        intro_tracks.append(pts)
        last_valid_pts = pts
    else:
        intro_tracks.append(last_valid_pts if last_valid_pts else [[58.0, 22.0, 1.0], [66.0, 38.0, 1.0], [52.0, 48.0, 1.0]])
        
    if i == 0:
        clean_im.save('public/media/model3-poster.webp', 'WEBP', quality=95)
        print("  [OK] Saved poster: public/media/model3-poster.webp")
    if i == 86:
        clean_im.save('public/media/model3-end.webp', 'WEBP', quality=95)
        print("  [OK] Saved end frame: public/media/model3-end.webp (Awake & Radiant!)")

subprocess.run(
    f"ffmpeg -y -framerate 24 -i {intro_clean_dir}/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -preset fast public/media/model3-intro.mp4",
    shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
)
print("  [OK] Saved intro video: public/media/model3-intro.mp4 (87 frames)")

# 2. PROCESS IDLE LOOP (48 frames = 2.00s exact)
print("2. Extracting 48 frames of Camila Idle Loop (raw idle frames 75 to 122)...")
idle_raw_files = [f"/tmp/camila_all_idle/f_{idx:04d}.png" for idx in range(76, 124)]
assert len(idle_raw_files) == 48, f"Expected 48 frames, got {len(idle_raw_files)}"

idle_raw_images = [np.array(Image.open(f), dtype=np.float32) for f in idle_raw_files]

# Crossfade the last 8 frames into frame 0
fade_len = 8
N = len(idle_raw_images)
for i in range(fade_len):
    alpha = (i + 1.0) / float(fade_len + 1.0)
    idle_raw_images[N - fade_len + i] = (1.0 - alpha) * idle_raw_images[N - fade_len + i] + alpha * idle_raw_images[0]

idle_clean_dir = "/tmp/camila_idle_clean_final"
os.makedirs(idle_clean_dir, exist_ok=True)

idle_tracks = []
base_span = None
last_valid_pts = None

for i, arr in enumerate(idle_raw_images):
    im = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    clean_im = transform_frame(im, shift_x=160)
    out_frame_path = f"{idle_clean_dir}/f_{i:04d}.png"
    clean_im.save(out_frame_path)
    
    pts, base_span = extract_landmarks(clean_im, base_span)
    if pts is not None:
        idle_tracks.append(pts)
        last_valid_pts = pts
    else:
        idle_tracks.append(last_valid_pts if last_valid_pts else [[58.0, 22.0, 1.0], [66.0, 38.0, 1.0], [52.0, 48.0, 1.0]])

subprocess.run(
    f"ffmpeg -y -framerate 24 -i {idle_clean_dir}/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -preset fast public/media/model3-idle.mp4",
    shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
)
print("  [OK] Saved idle video: public/media/model3-idle.mp4 (48 frames)")

# 3. UPDATE TRACKS.JSON
with open('src/tracks.json', 'r') as f:
    tracks = json.load(f)

entry = {
    'fps': 24,
    'markers': ['Hidratación', 'Oxigenación', 'Textura'],
    'intro': smooth_track_series(intro_tracks),
    'idle': smooth_track_series(idle_tracks)
}
tracks['camila'] = entry
tracks['model3'] = entry

with open('src/tracks.json', 'w') as f:
    json.dump(tracks, f, indent=2)

print("  [OK] Updated src/tracks.json for Camila!")
print("\n[SUCCESS] Camila now has an awake, open-eyed, luminous look and an endless, smooth idle loop!")
