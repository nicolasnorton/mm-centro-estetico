import os
import sys
import json
import subprocess
import numpy as np
from PIL import Image
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

# Initialize MediaPipe FaceLandmarker
base_options = python.BaseOptions(model_asset_path='/tmp/face_landmarker.task')
options = vision.FaceLandmarkerOptions(
    base_options=base_options,
    output_face_blendshapes=False,
    output_facial_transformation_matrixes=False,
    num_faces=1
)
detector = vision.FaceLandmarker.create_from_options(options)

MODELS = [
    {
        'id': 'valentina',
        'alias': 'model2',
        'raw_intro': '/tmp/model2_raw_intro.mp4',
        'raw_idle': '/tmp/model2_raw_idle_perfect.mp4',
        'exact_end_f86': '/tmp/model2_exact_end_f86.png',
        'out_intro': 'public/media/model2-intro.mp4',
        'out_idle': 'public/media/model2-idle.mp4',
        'out_poster': 'public/media/model2-poster.webp',
        'out_end': 'public/media/model2-end.webp',
        'markers': ['Elasticidad', 'Colágeno', 'Firmeza']
    },
    {
        'id': 'camila',
        'alias': 'model3',
        'raw_intro': '/tmp/model3_raw_intro.mp4',
        'raw_idle': '/tmp/model3_raw_idle_perfect.mp4',
        'exact_end_f86': '/tmp/model3_exact_end_f86.png',
        'out_intro': 'public/media/model3-intro.mp4',
        'out_idle': 'public/media/model3-idle.mp4',
        'out_poster': 'public/media/model3-poster.webp',
        'out_end': 'public/media/model3-end.webp',
        'markers': ['Hidratación', 'Oxigenación', 'Textura']
    },
    {
        'id': 'isabela',
        'alias': 'model4',
        'raw_intro': '/tmp/model4_raw_intro.mp4',
        'raw_idle': '/tmp/model4_raw_idle_perfect.mp4',
        'exact_end_f86': '/tmp/model4_exact_end_f86.png',
        'out_intro': 'public/media/model4-intro.mp4',
        'out_idle': 'public/media/model4-idle.mp4',
        'out_poster': 'public/media/model4-poster.webp',
        'out_end': 'public/media/model4-end.webp',
        'markers': ['Tonicidad', 'Vitalidad', 'Armonía']
    }
]

def apply_white_curve(arr):
    # arr is uint8 (H, W, 3)
    # Smoothly map background pixels (> 235) to solid 255
    img_float = arr.astype(np.float32)
    mask_mid = (img_float > 235.0) & (img_float < 248.0)
    t = (img_float - 235.0) / 13.0
    t_smooth = t * t * (3.0 - 2.0 * t) # smoothstep
    img_float[mask_mid] = 235.0 + t_smooth[mask_mid] * (255.0 - 235.0)
    img_float[img_float >= 248.0] = 255.0
    return np.clip(img_float, 0, 255).astype(np.uint8)

def transform_frame(im_pil, shift_x=160):
    # Upscale 1280x720 to 1920x1080 with Lanczos
    scaled = im_pil.resize((1920, 1080), Image.Resampling.LANCZOS)
    arr = np.array(scaled)
    # Shift right by shift_x (pad left with 255, crop right)
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
    if n <= 2:
        return series
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

def process_intro(raw_video, out_video, out_poster, out_end, shift_x=160):
    print(f"  [Intro] Decoding {raw_video}...")
    tmp_dir = f"/tmp/proc_intro_{os.path.basename(raw_video)}"
    os.makedirs(tmp_dir, exist_ok=True)
    subprocess.run(
        f"ffmpeg -y -i {raw_video} -vframes 87 -vsync 0 {tmp_dir}/f_%04d.png",
        shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )
    frame_files = sorted([os.path.join(tmp_dir, f) for f in os.listdir(tmp_dir) if f.endswith('.png')])[:87]
    
    transformed_dir = f"{tmp_dir}_clean"
    os.makedirs(transformed_dir, exist_ok=True)
    
    track_pts = []
    base_span = None
    last_valid_pts = None
    
    for i, fpath in enumerate(frame_files):
        im = Image.open(fpath)
        clean_im = transform_frame(im, shift_x=shift_x)
        out_frame_path = f"{transformed_dir}/f_{i:04d}.png"
        clean_im.save(out_frame_path)
        
        pts, base_span = extract_landmarks(clean_im, base_span)
        if pts is not None:
            track_pts.append(pts)
            last_valid_pts = pts
        else:
            track_pts.append(last_valid_pts if last_valid_pts else [[58.0, 22.0, 1.0], [66.0, 38.0, 1.0], [52.0, 48.0, 1.0]])
            
        if i == 0:
            clean_im.save(out_poster, 'WEBP', quality=95)
            print(f"    Saved poster: {out_poster}")
        if i == len(frame_files) - 1:
            clean_im.save(out_end, 'WEBP', quality=95)
            print(f"    Saved end frame: {out_end}")

    # Re-encode to 1080p 24fps mp4
    subprocess.run(
        f"ffmpeg -y -framerate 24 -i {transformed_dir}/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -preset fast {out_video}",
        shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )
    print(f"    Saved intro video: {out_video} ({len(frame_files)} frames)")
    return smooth_track_series(track_pts)

def process_idle(raw_video, out_video, exact_end_f86, target_frames=72, crossfade_frames=10, shift_x=160):
    print(f"  [Idle] Decoding {raw_video} with exact intro end frame...")
    tmp_dir = f"/tmp/proc_idle_{os.path.basename(raw_video)}"
    os.makedirs(tmp_dir, exist_ok=True)
    
    subprocess.run(
        f"ffmpeg -y -i {raw_video} -vframes {target_frames + crossfade_frames} -vsync 0 {tmp_dir}/f_%04d.png",
        shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )
    frame_files = sorted([os.path.join(tmp_dir, f) for f in os.listdir(tmp_dir) if f.endswith('.png')])
    raw_images = [np.array(Image.open(f)) for f in frame_files[:target_frames + crossfade_frames]]
    
    # Load the exact 87th frame of the intro video
    f0_exact = np.array(Image.open(exact_end_f86))
    
    final_frames = []
    # Frame 0 is 100% IDENTICAL to Frame 86 of Intro
    final_frames.append(f0_exact.copy())
    
    # Frames 1..5: smooth ramp from exact intro end to Omni idle video
    ramp_len = 6
    for i in range(1, ramp_len):
        alpha = i / float(ramp_len)
        blended = (1.0 - alpha) * f0_exact.astype(np.float32) + alpha * raw_images[i].astype(np.float32)
        final_frames.append(np.clip(blended, 0, 255).astype(np.uint8))
        
    # Frames ramp_len .. target_frames - crossfade_frames: pure Omni AI video
    mid_end = target_frames - crossfade_frames
    for i in range(ramp_len, mid_end):
        final_frames.append(raw_images[i])
        
    # Frames mid_end .. target_frames - 1: seamless crossfade back into f0_exact
    for i in range(mid_end, target_frames):
        k = i - mid_end
        alpha = (k + 1.0) / (crossfade_frames + 1.0)
        blended = (1.0 - alpha) * raw_images[i].astype(np.float32) + alpha * f0_exact.astype(np.float32)
        final_frames.append(np.clip(blended, 0, 255).astype(np.uint8))
        
    transformed_dir = f"{tmp_dir}_clean"
    os.makedirs(transformed_dir, exist_ok=True)
    
    track_pts = []
    base_span = None
    last_valid_pts = None
    
    for i, arr in enumerate(final_frames):
        im = Image.fromarray(arr)
        clean_im = transform_frame(im, shift_x=shift_x)
        out_frame_path = f"{transformed_dir}/f_{i:04d}.png"
        clean_im.save(out_frame_path)
        
        pts, base_span = extract_landmarks(clean_im, base_span)
        if pts is not None:
            track_pts.append(pts)
            last_valid_pts = pts
        else:
            track_pts.append(last_valid_pts if last_valid_pts else [[58.0, 22.0, 1.0], [66.0, 38.0, 1.0], [52.0, 48.0, 1.0]])

    # Re-encode to 1080p 24fps mp4
    subprocess.run(
        f"ffmpeg -y -framerate 24 -i {transformed_dir}/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -preset fast {out_video}",
        shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
    )
    print(f"    Saved idle video: {out_video} ({len(final_frames)} frames)")
    return smooth_track_series(track_pts)

def main():
    print("=== Processing Perfectly Aligned Omni Videos ===")
    with open('src/tracks.json', 'r') as f:
        tracks_data = json.load(f)

    for cfg in MODELS:
        print(f"\nProcessing {cfg['id'].capitalize()} ({cfg['alias']})...")
        intro_pts = process_intro(
            cfg['raw_intro'], cfg['out_intro'], cfg['out_poster'], cfg['out_end'], shift_x=160
        )
        idle_pts = process_idle(
            cfg['raw_idle'], cfg['out_idle'], cfg['exact_end_f86'], target_frames=72, crossfade_frames=10, shift_x=160
        )
        
        entry = {
            'fps': 24,
            'markers': cfg['markers'],
            'intro': intro_pts,
            'idle': idle_pts
        }
        tracks_data[cfg['id']] = entry
        tracks_data[cfg['alias']] = entry
        print(f"  [OK] Updated tracks for {cfg['id']} and {cfg['alias']}")

    with open('src/tracks.json', 'w') as f:
        json.dump(tracks_data, f, indent=2)
    print("\n[SUCCESS] src/tracks.json updated with 100% aligned frame tracks!")

if __name__ == '__main__':
    main()
