"""Isabela idle loop using ONLY real Gemini Omni frames (no blending, no warping).
Ping-pong: forward 0..TURN, back TURN-1..1, then loops to 0. TURN = blink peak, so the
blink happens once (eyes close going forward, open going back). Intro video is left untouched."""
import os, subprocess, shutil
import cv2, numpy as np
from PIL import Image

W, H = 1920, 1080
SRC = '/tmp/model4_omni_blink_early.mp4'

cap = cv2.VideoCapture(SRC)
frames = []
while len(frames) < 72:  # first 3s are enough
    ok, f = cap.read()
    if not ok: break
    frames.append(cv2.resize(cv2.cvtColor(f, cv2.COLOR_BGR2RGB), (W, H), interpolation=cv2.INTER_LANCZOS4))
cap.release()

# Blink peak: eye band gets darker/most different vs frame 0 (eyes ~ y 340-410, x 980-1290)
eye = lambda a: a[340:410, 980:1290].astype(float)
scores = [np.mean(np.abs(eye(a) - eye(frames[0]))) for a in frames]
TURN = int(np.argmax(scores[6:60])) + 6
print('Eye-diff scores:', [round(s, 1) for s in scores[:60]])
print('TURN (blink peak):', TURN)

idle = frames[:TURN + 1] + frames[TURN - 1:0:-1]
print(f'Idle frames: {len(idle)} ({len(idle)/24:.2f}s)')

d = '/tmp/isa_pp_idle'
shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
for i, a in enumerate(idle):
    Image.fromarray(a).save(f'{d}/f_{i+1:04d}.png')
n = len(idle)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', '24', '-i', f'{d}/f_%04d.png',
                '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p',
                '-g', str(n), '-keyint_min', str(n), '-sc_threshold', '0',
                'public/media/model4-idle.mp4'], check=True)
Image.fromarray(idle[0]).save('public/media/model4-end.webp', 'WEBP', quality=95)

diff = lambda a, b: np.mean(np.abs(a.astype(float) - b.astype(float)))
steps = [diff(idle[i], idle[(i + 1) % n]) for i in range(n)]
print(f'Max step diff incl. seam: {max(steps):.3f}; seam last->0: {steps[-1]:.3f}')
cap = cv2.VideoCapture('public/media/model4-intro.mp4'); last = None
while True:
    ok, f = cap.read()
    if not ok: break
    last = f
print(f'Intro end -> idle start diff: {diff(cv2.cvtColor(last, cv2.COLOR_BGR2RGB), idle[0]):.3f}')
