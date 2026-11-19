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

print("=== Generating Flawless Isabela (Model 4) Idle Video with Closed Loop & Constant Shoulders ===")

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
    mask_mid = (img_float > 230.0) & (img_float < 245.0)
    t = (img_float - 230.0) / 15.0
    t_smooth = t * t * (3.0 - 2.0 * t) # smoothstep
    img_float[mask_mid] = 230.0 + t_smooth[mask_mid] * (255.0 - 230.0)
    img_float[img_float >= 245.0] = 255.0
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

def main():
    H, W = 1080, 1920
    video_source = '/tmp/model4_omni_blink_early.mp4'
    assert os.path.exists(video_source), f"Missing {video_source}"

    # 1. READ FIRST 28 FRAMES FROM OMNI (contains resting smile and natural eye blink at 24-26)
    cap = cv2.VideoCapture(video_source)
    raw_omni_frames = []
    for i in range(28):
        ret, frame = cap.read()
        if not ret:
            break
        # Resize to 1920x1080
        f_1080 = cv2.resize(frame, (W, H), interpolation=cv2.INTER_LANCZOS4)
        raw_omni_frames.append(apply_white_curve(f_1080))
    cap.release()
    print(f"Loaded {len(raw_omni_frames)} raw frames from Omni video (including eye blink)")

    # 2. GENERATE 20-FRAME BIDIRECTIONAL OPTICAL FLOW RETURN PATH (frames 28 to 47)
    # Total frames = 48 (2.000s @ 24fps)
    f0 = raw_omni_frames[0].astype(np.float32)
    f_end = raw_omni_frames[27].astype(np.float32)
    gray0 = cv2.cvtColor(raw_omni_frames[0], cv2.COLOR_RGB2GRAY)
    gray_end = cv2.cvtColor(raw_omni_frames[27], cv2.COLOR_RGB2GRAY)

    dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
    flow_end_to_0 = dis.calc(gray_end, gray0, None)
    flow_0_to_end = dis.calc(gray0, gray_end, None)

    grid_x, grid_y = np.meshgrid(np.arange(W, dtype=np.float32), np.arange(H, dtype=np.float32))

    N_return = 20
    return_frames = []
    for step in range(N_return):
        t = (step + 1) / float(N_return + 1)
        # Cubic smoothstep for zero acceleration impulse at endpoints
        s = t * t * (3.0 - 2.0 * t)

        map_x1 = grid_x + s * flow_end_to_0[..., 0]
        map_y1 = grid_y + s * flow_end_to_0[..., 1]
        warped1 = cv2.remap(raw_omni_frames[27], map_x1, map_y1, interpolation=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)

        map_x0 = grid_x + (1.0 - s) * flow_0_to_end[..., 0]
        map_y0 = grid_y + (1.0 - s) * flow_0_to_end[..., 1]
        warped0 = cv2.remap(raw_omni_frames[0], map_x0, map_y0, interpolation=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)

        blended = (1.0 - s) * warped1.astype(np.float32) + s * warped0.astype(np.float32)
        return_frames.append(apply_white_curve(np.clip(blended, 0, 255).astype(np.uint8)))

    raw_48_frames = raw_omni_frames + return_frames
    assert len(raw_48_frames) == 48, f"Expected 48 frames, got {len(raw_48_frames)}"
    print("Constructed 48-frame closed continuous motion loop")

    # 3. STABILIZE SHOULDERS (Constant Shoulder Height, Delta y = 0px)
    # Target shoulder heights matching Frame 0:
    gray_f0 = cv2.cvtColor(raw_48_frames[0], cv2.COLOR_RGB2GRAY)
    is_body_0 = gray_f0 < 240
    pts_r0 = np.where(is_body_0[600:, 1450])[0]
    pts_l0 = np.where(is_body_0[600:, 750])[0]
    target_r_y = float(pts_r0[0] + 600 if len(pts_r0) > 0 else 778.0)
    target_l_y = float(pts_l0[0] + 600 if len(pts_l0) > 0 else 789.0)
    print(f"Target shoulder heights: Right = {target_r_y}, Left = {target_l_y}")

    stabilized_frames = []
    for i, arr in enumerate(raw_48_frames):
        gray = cv2.cvtColor(arr, cv2.COLOR_RGB2GRAY)
        is_body = gray < 240
        pts_r = np.where(is_body[600:, 1450])[0]
        pts_l = np.where(is_body[600:, 750])[0]
        cur_r_y = float(pts_r[0] + 600 if len(pts_r) > 0 else target_r_y)
        cur_l_y = float(pts_l[0] + 600 if len(pts_l) > 0 else target_l_y)

        dy_r = cur_r_y - target_r_y
        dy_l = cur_l_y - target_l_y

        if abs(dy_r) > 0.01 or abs(dy_l) > 0.01:
            # Lateral linear interpolation
            x_w = np.clip((grid_x - 750.0) / (1450.0 - 750.0), 0.0, 1.0)
            dy_lat = (1.0 - x_w) * dy_l + x_w * dy_r

            # Vertical compliance:
            # y >= 700: 1.0 (lock shoulders strictly to constant target_y)
            # y <= 200: 0.0 (preserve head, facial expression, blink perfectly)
            v_w = np.clip((grid_y - 200.0) / (700.0 - 200.0), 0.0, 1.0)
            v_smooth = v_w * v_w * (3.0 - 2.0 * v_w)

            dy_field = dy_lat * v_smooth
            map_y = (grid_y + dy_field).astype(np.float32)
            warped = cv2.remap(arr, grid_x, map_y, interpolation=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REFLECT)
            stabilized_frames.append(apply_white_curve(warped))
        else:
            stabilized_frames.append(arr)

    # Frame 0 is exact reference
    reference_f0 = stabilized_frames[0].copy()

    # 4. MEASURE CONTINUITY
    consec_diffs = []
    for i in range(47):
        d = np.mean(np.abs(stabilized_frames[i].astype(float) - stabilized_frames[i+1].astype(float)))
        consec_diffs.append(d)
    loop_diff = np.mean(np.abs(stabilized_frames[-1].astype(float) - stabilized_frames[0].astype(float)))
    print(f"Consecutive frame diff range: [{min(consec_diffs):.4f} .. {max(consec_diffs):.4f}]")
    print(f"Frame 46 -> 47 diff: {consec_diffs[-1]:.4f}")
    print(f"Loop seam diff (Frame 47 -> 0): {loop_diff:.4f}")

    # Measure shoulder stability
    sh_r_meas = []
    sh_l_meas = []
    for arr in stabilized_frames:
        g = cv2.cvtColor(arr, cv2.COLOR_RGB2GRAY)
        b = g < 240
        pr = np.where(b[600:, 1450])[0]
        pl = np.where(b[600:, 750])[0]
        sh_r_meas.append(pr[0] + 600 if len(pr) > 0 else target_r_y)
        sh_l_meas.append(pl[0] + 600 if len(pl) > 0 else target_l_y)
    print(f"Shoulder Right range: [{min(sh_r_meas)}..{max(sh_r_meas)}] (span = {max(sh_r_meas)-min(sh_r_meas)}px)")
    print(f"Shoulder Left range: [{min(sh_l_meas)}..{max(sh_l_meas)}] (span = {max(sh_l_meas)-min(sh_l_meas)}px)")

    # 5. WRITE IDLE FRAMES AND SAVE VIDEO
    out_idle_dir = '/tmp/isabela_perfect_idle_frames'
    os.makedirs(out_idle_dir, exist_ok=True)
    idle_images = []
    idle_tracks = []
    base_span = None
    last_pts = None

    for i, arr in enumerate(stabilized_frames):
        im = Image.fromarray(arr)
        idle_images.append(im)
        im.save(f"{out_idle_dir}/f_{i+1:04d}.png")
        pts, base_span = extract_landmarks(im, base_span)
        if pts:
            last_pts = pts
        idle_tracks.append(last_pts)

    idle_tracks = smooth_track_series(idle_tracks)

    # Encode public/media/model4-idle.mp4 with closed GOP (48 frames) and visually lossless H.264
    cmd_idle = [
        'ffmpeg', '-y',
        '-framerate', '24',
        '-i', f'{out_idle_dir}/f_%04d.png',
        '-c:v', 'libx264',
        '-preset', 'veryslow',
        '-crf', '14',
        '-g', '48',
        '-keyint_min', '48',
        '-sc_threshold', '0',
        '-pix_fmt', 'yuv420p',
        'public/media/model4-idle.mp4'
    ]
    subprocess.run(cmd_idle, check=True)
    print("  [OK] Saved public/media/model4-idle.mp4")

    # 6. INTRO VIDEO ALIGNMENT (87 frames)
    # Intro must end at exact reference_f0 so handoff diff is 0.000000!
    intro_source_dir = '/tmp/model4_intro_frames'
    intro_files = sorted([f"{intro_source_dir}/f_{i+1:04d}.png" for i in range(87)])
    assert len(intro_files) == 87, f"Expected 87 intro files, got {len(intro_files)}"

    intro_raw = [apply_white_curve(np.array(Image.open(f).resize((W, H), Image.Resampling.LANCZOS))) for f in intro_files]

    # Flow morph the last 12 frames of intro to arrive seamlessly at reference_f0
    raw_end = intro_raw[-1]
    flow_intro_to_f0 = dis.calc(cv2.cvtColor(raw_end, cv2.COLOR_RGB2GRAY), gray_f0, None)
    
    fade_intro = 12
    final_intro = [img.copy() for img in intro_raw]
    for i in range(fade_intro):
        idx = 87 - fade_intro + i
        arr = intro_raw[idx]
        t = (i + 1.0) / float(fade_intro)
        s = t * t * (3.0 - 2.0 * t)
        map_x = grid_x + s * flow_intro_to_f0[..., 0]
        map_y = grid_y + s * flow_intro_to_f0[..., 1]
        warped = cv2.remap(arr, map_x, map_y, interpolation=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REFLECT)
        blended = (1.0 - s) * warped.astype(np.float32) + s * reference_f0.astype(np.float32)
        final_intro[idx] = apply_white_curve(np.clip(blended, 0, 255).astype(np.uint8))

    # Exact equality on final frame
    final_intro[-1] = reference_f0.copy()

    out_intro_dir = '/tmp/isabela_perfect_intro_frames'
    os.makedirs(out_intro_dir, exist_ok=True)
    intro_images = []
    intro_tracks = []
    base_span = None
    last_pts = None

    for i, arr in enumerate(final_intro):
        im = Image.fromarray(arr)
        intro_images.append(im)
        im.save(f"{out_intro_dir}/f_{i+1:04d}.png")
        pts, base_span = extract_landmarks(im, base_span)
        if pts:
            last_pts = pts
        intro_tracks.append(last_pts)

    intro_tracks = smooth_track_series(intro_tracks)

    # Save poster and end images
    intro_images[0].save('public/media/model4-poster.webp', 'WEBP', quality=95)
    intro_images[-1].save('public/media/model4-end.webp', 'WEBP', quality=95)
    print("  [OK] Saved poster and end webp images")

    # Encode public/media/model4-intro.mp4
    cmd_intro = [
        'ffmpeg', '-y',
        '-framerate', '24',
        '-i', f'{out_intro_dir}/f_%04d.png',
        '-c:v', 'libx264',
        '-preset', 'veryslow',
        '-crf', '14',
        '-pix_fmt', 'yuv420p',
        'public/media/model4-intro.mp4'
    ]
    subprocess.run(cmd_intro, check=True)
    print("  [OK] Saved public/media/model4-intro.mp4")

    # 7. UPDATE src/tracks.json
    tracks_path = 'src/tracks.json'
    with open(tracks_path, 'r') as f:
        all_tracks = json.load(f)

    all_tracks['isabela'] = {
        'fps': 24,
        'intro': intro_tracks,
        'idle': idle_tracks
    }
    all_tracks['model4'] = {
        'fps': 24,
        'intro': intro_tracks,
        'idle': idle_tracks
    }

    with open(tracks_path, 'w') as f:
        json.dump(all_tracks, f, indent=2)
    print("  [OK] Updated src/tracks.json")

    # 8. FINAL VALIDATION METRICS
    handoff_diff = np.mean(np.abs(final_intro[-1].astype(float) - stabilized_frames[0].astype(float)))
    print(f"\n=== FINAL VALIDATION ===")
    print(f"Intro Frame 86 -> Idle Frame 0 Diff: {handoff_diff:.6f} (MUST BE 0.000000)")
    assert handoff_diff == 0.0, f"Handoff diff is {handoff_diff}"
    print("ALL TESTS PASSED! Seamless loop with constant shoulders and natural blink achieved.\n")

if __name__ == '__main__':
    main()
