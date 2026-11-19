import {useEffect, useRef, type CSSProperties} from 'react';
import {brand, models, type ModelProfile} from '../content';
import {useReveals} from '../hooks/useReveals';
import {lerp, range, smoothstep} from '../lib/math';
import {onFrame} from '../lib/scroll';
import tracks from '../tracks.json';
import {BlurText} from './BlurText';
import {Counter} from './Counter';

type Pt = number[]; // [x %, y %, scale]
interface TrackData {
  fps: number;
  intro: Pt[][];
  idle: Pt[][];
}

const allTracks = tracks as unknown as Record<string, TrackData>;

function sample(frames: Pt[][] | undefined, fps: number | undefined, t: number): Pt[] {
  if (!frames || frames.length === 0) {
    return [
      [59.3, 21.9, 1.0],
      [66.6, 37.2, 1.0],
      [53.8, 44.5, 1.0],
    ];
  }
  const safeFps = fps && fps > 0 ? fps : 24;
  const f = Math.min(frames.length - 1, Math.max(0, t * safeFps));
  const a = Math.floor(f);
  const b = Math.min(frames.length - 1, a + 1);
  const k = f - a;
  const frameA = frames[a];
  const frameB = frames[b] || frameA;
  if (!frameA) {
    return [
      [59.3, 21.9, 1.0],
      [66.6, 37.2, 1.0],
      [53.8, 44.5, 1.0],
    ];
  }
  return frameA.map((p, i) => {
    const nextP = frameB[i] || p;
    return p.map((v, j) => lerp(v, nextP[j] ?? v, k));
  });
}

interface HeroProps {
  model: ModelProfile;
  activeModelIndex: number;
  onSelectModel: (index: number) => void;
  reduced: boolean;
}

export function Hero({model, activeModelIndex, onSelectModel, reduced}: HeroProps) {
  const root = useReveals<HTMLElement>();
  const filmsRef = useRef<HTMLDivElement>(null);
  const introVideos = useRef<Record<string, HTMLVideoElement | null>>({});
  const idleVideos = useRef<Record<string, HTMLVideoElement | null>>({});
  const rings = useRef<(HTMLDivElement | null)[]>([]);
  const sweep = useRef<HTMLDivElement>(null);
  const aura = useRef<HTMLDivElement>(null);
  const cardWrap = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const status = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLSpanElement>(null);

  const trackData = allTracks[model.id] || allTracks.sofia;

  useEffect(() => {
    const activeModelId = model.id;
    const v = introVideos.current[activeModelId];
    const w = idleVideos.current[activeModelId];
    const section = root.current;
    if (!v || !w || !section) return;

    // Cursor tracking state (normalized -1..1 from center of viewport)
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let fastX = 0;
    let fastY = 0;

    const onPointerMove = (e: PointerEvent | MouseEvent) => {
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      targetX = Math.max(-1, Math.min(1, (e.clientX / vw - 0.5) * 2));
      targetY = Math.max(-1, Math.min(1, (e.clientY / vh - 0.5) * 2));
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    window.addEventListener('pointermove', onPointerMove, {passive: true});
    document.addEventListener('mouseleave', onPointerLeave);

    // Rings ride the tracked skin points of whichever film is showing, locked to subtle cursor parallax.
    const place = (pts: Pt[], moveX: number, moveY: number) =>
      rings.current.forEach((el, i) => {
        if (!el || !pts[i]) return;
        const [x, y, sc] = pts[i];
        el.style.left = `${x}%`;
        el.style.top = `${y}%`;
        el.style.width = `${4.4 * sc}%`;
        el.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0)`;
      });

    let shown = -1;
    const read = (k: number) => {
      const n = Math.round(k * 100);
      if (n === shown) return;
      shown = n;
      if (bar.current) bar.current.style.transform = `scaleX(${k})`;
      if (pct.current) pct.current.textContent = `${n}%`;
      if (n === 100) {
        if (status.current) status.current.textContent = model.card.done;
        dot.current?.classList.replace('bg-coral', 'bg-sage');
      } else if (n === 0) {
        if (status.current) status.current.textContent = 'Leyendo piel…';
        dot.current?.classList.replace('bg-sage', 'bg-coral');
      }
    };

    const showIdle = () => {
      w.style.opacity = '1';
      v.style.opacity = '0';
    };

    if (reduced) {
      showIdle();
      place(trackData.idle[0], 0, 0);
      read(1);
      rings.current.forEach((el) => el?.classList.add('is-on'));
      return () => {
        window.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('mouseleave', onPointerLeave);
      };
    }

    let phase: 'intro' | 'idle' = 'intro';
    let visible = true;
    let switchedToIdle = false;

    // Seamless handoff from intro to idle at the exact final frame (Frame 86 -> Frame 0)
    const toIdle = () => {
      if (switchedToIdle) return;
      switchedToIdle = true;
      phase = 'idle';
      w.currentTime = 0;
      w.play().then(() => {
        showIdle();
      }).catch(() => {
        showIdle();
      });
    };

    const onTimeUpdate = () => {
      // Trigger handoff only at the very final frame of intro (within 40ms of end)
      if (phase === 'intro' && !switchedToIdle && v.duration) {
        if (v.currentTime >= v.duration - 0.04) {
          toIdle();
        }
      }
    };

    v.addEventListener('timeupdate', onTimeUpdate);
    v.addEventListener('ended', toIdle);

    // Reset visual elements for active model
    read(0);
    rings.current.forEach((el) => el?.classList.remove('is-on'));
    v.currentTime = 0;
    v.style.opacity = '1';
    w.currentTime = 0;
    w.style.opacity = '0';
    
    // Prime idle video at frame 0 so it's ready in decoder memory
    w.pause();
    
    // Start active intro film
    v.play().catch(() => {
      phase = 'idle';
      showIdle();
      toIdle();
    });

    // Pause inactive model films after crossfade window (480ms) to conserve system resources
    const pauseTimer = setTimeout(() => {
      models.forEach((m) => {
        if (m.id !== activeModelId) {
          const inVid = introVideos.current[m.id];
          const idVid = idleVideos.current[m.id];
          if (inVid && !inVid.paused) inVid.pause();
          if (idVid && !idVid.paused) idVid.pause();
        }
      });
    }, 480);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (phase !== 'idle') return;
      if (visible) w.play().catch(() => {});
      else w.pause();
    });
    io.observe(section);

    const off = onFrame(() => {
      if (!visible) return;

      // Smooth cursor interpolation (gentle organic damping)
      curX = lerp(curX, targetX, 0.05);
      curY = lerp(curY, targetY, 0.05);
      fastX = lerp(fastX, targetX, 0.1);
      fastY = lerp(fastY, targetY, 0.1);

      // Subtle, realistic 3D camera parallax following cursor
      // (Complements the lifelike non-rigid video motion without exaggerated swinging)
      const moveX = curX * 10.0;
      const moveY = curY * 6.0;
      const rotY = curX * 1.8;
      const rotX = -curY * 1.2;

      const modelTransform = `perspective(1400px) translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      if (filmsRef.current) {
        filmsRef.current.style.transform = modelTransform;
      }

      // Soft interactive dewy glow following the pointer
      if (aura.current) {
        const auraX = 50 + fastX * 18;
        const auraY = 45 + fastY * 15;
        aura.current.style.background = `radial-gradient(400px circle at ${auraX.toFixed(1)}% ${auraY.toFixed(1)}%, rgba(231, 134, 108, 0.14), rgba(246, 205, 185, 0.06) 45%, transparent 75%)`;
      }

      // Counter-parallax on the live reading card
      if (cardWrap.current) {
        cardWrap.current.style.transform = `translate3d(${(-curX * 5).toFixed(2)}px, ${(-curY * 3.5).toFixed(2)}px, 0)`;
      }

      const activeVid = phase === 'intro' ? v : w;
      const t = phase === 'intro' ? (v.currentTime || 0) : 99;
      place(
        phase === 'intro'
          ? sample(trackData.intro, trackData.fps, activeVid.currentTime || 0)
          : sample(trackData.idle, trackData.fps, activeVid.currentTime || 0),
        moveX,
        moveY
      );
      rings.current.forEach((el, i) => {
        if (el && t > 0.5 + i * 0.35) el.classList.add('is-on');
      });
      const r = range(t, 0.15, 1.6);
      if (sweep.current) {
        sweep.current.style.top = `${lerp(10, 70, smoothstep(r))}%`;
        sweep.current.style.opacity = `${Math.sin(Math.PI * r)}`;
      }
      read(smoothstep(range(t, 0.15, 2.8)));
    });

    return () => {
      off();
      clearTimeout(pauseTimer);
      io.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('mouseleave', onPointerLeave);
      v.removeEventListener('timeupdate', onTimeUpdate);
      v.removeEventListener('ended', toIdle);
    };
  }, [reduced, root, model.id, trackData, model.card.done]);

  return (
    <section ref={root} id="top" className="relative bg-paper md:h-svh md:min-h-[660px]">
      <h1 className="sr-only">
        {model.lead} {model.accent} {model.tail}, {brand.name}
      </h1>

      <div className="hero-frame">
        <div ref={aura} className="pointer-events-none absolute inset-0 transition-opacity duration-500" aria-hidden />
        <div className="hero-stage">
          {/* Isolated film container with multiply blend onto stage aura */}
          <div ref={filmsRef} className="hero-films origin-[52%_38%] will-change-transform">
            {models.map((m) => {
              const isCurrent = m.id === model.id;
              return (
                <div
                  key={m.id}
                  className={`hero-film-slot ${isCurrent ? 'is-active opacity-100' : 'opacity-0'}`}
                  style={{ pointerEvents: isCurrent ? 'auto' : 'none' }}
                >
                  <video
                    ref={(el) => {
                      idleVideos.current[m.id] = el;
                    }}
                    className="opacity-0 will-change-transform"
                    src={m.media.idleVideo}
                    poster={m.media.endImage}
                    muted
                    loop
                    playsInline
                    preload={isCurrent ? 'auto' : 'metadata'}
                    onEnded={(e) => {
                      // Browser loop safety fallback
                      const target = e.currentTarget;
                      target.currentTime = 0;
                      target.play().catch(() => {});
                    }}
                    aria-hidden
                  />
                  <video
                    ref={(el) => {
                      introVideos.current[m.id] = el;
                    }}
                    className="opacity-100 will-change-transform"
                    src={m.media.introVideo}
                    poster={m.media.posterImage}
                    muted
                    playsInline
                    preload={isCurrent ? 'auto' : 'metadata'}
                    aria-label={m.media.altText}
                  />
                </div>
              );
            })}
          </div>

          <div ref={sweep} className="sweep" aria-hidden />
          {model.scans.map((s, i) => (
            <div
              key={`${model.id}-${s.name}`}
              ref={(el) => {
                rings.current[i] = el;
              }}
              className="focus"
              style={
                {
                  left: `${trackData.intro[0][i][0]}%`,
                  top: `${trackData.intro[0][i][1]}%`,
                  '--d': `${i * 120}ms`,
                } as CSSProperties
              }
              aria-hidden
            >
              <svg viewBox="0 0 40 40" className="ring-orbit">
                <circle cx="20" cy="20" r="19" fill="none" stroke="#fff" strokeWidth="0.8" strokeDasharray="1.5 3.2" opacity="0.9" />
              </svg>
              <span className="focus-frame" />
              <span className="ring-core" />
              <span className="absolute top-1/2 left-1/2 size-[3px] -translate-1/2 rounded-full bg-white" />
              <span className="leader" data-side={s.side} />
              <span
                className="ring-label glass flex items-center gap-1.5 rounded-full px-3 py-1 text-small font-medium text-ink"
                data-side={s.side}
              >
                <span className="size-1.5 rounded-full bg-coral" />
                {s.name}
                <span className="text-mute">{s.value}</span>
              </span>
            </div>
          ))}
        </div>
        {/* shoulders melt into the page */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-linear-to-b from-paper/0 via-paper/70 to-paper" />
      </div>

      {/* "Tu piel, finalmente" — top left */}
      <div key={`${model.id}-title`} aria-hidden className="relative z-10 px-5 pt-3 md:absolute md:top-[18%] md:left-7 md:p-0">
        <BlurText as="p" lines={[model.lead]} delay={250} className="font-display text-hero font-medium" />
        <BlurText as="p" lines={[model.accent]} delay={650} className="accent pl-[0.8em] text-[clamp(3.2rem,6.3vw,7rem)] leading-[0.9] text-ink" />
      </div>

      {/* "comprendida." / "renovada." / etc — bottom right */}
      <div key={`${model.id}-tail`} aria-hidden className="relative z-10 px-5 md:absolute md:right-7 md:bottom-[10%] md:p-0 md:text-right">
        <BlurText as="p" lines={[model.tail]} delay={1050} className="font-display text-hero font-medium" />
      </div>

      {/* sub, CTA, trusted — bottom left */}
      <div key={`${model.id}-cta`} className="relative z-10 px-5 pt-6 pb-6 md:absolute md:bottom-[8%] md:left-7 md:p-0">
        <p className="max-w-[20rem] text-copy text-ink/80" data-reveal style={{'--d': '1300ms'} as CSSProperties}>
          {model.sub}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4 md:gap-5" data-reveal style={{'--d': '1450ms'} as CSSProperties}>
          <a
            href={brand.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-full bg-ink py-1.5 pr-1.5 pl-5 text-small font-medium text-paper transition-[background-color,box-shadow] duration-200 hover:bg-coral hover:shadow-md"
          >
            {model.cta}
            <span className="grid size-8 place-items-center rounded-full bg-blush text-ink transition-transform group-hover:translate-x-0.5">
              <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </span>
          </a>
          <span className="flex items-center gap-2.5">
            <span className="flex -space-x-1.5">
              {models.map((m) => (
                <span
                  key={m.id}
                  className="grid size-7 place-items-center rounded-full border-2 border-paper font-display text-small font-bold text-white shadow-xs"
                  style={{background: `linear-gradient(140deg, ${m.avatarColor[0]}, ${m.avatarColor[1]})`}}
                >
                  {m.name[0]}
                </span>
              ))}
            </span>
            <span className="text-small leading-tight text-mute">
              <b className="block font-display text-copy font-semibold tracking-[-0.02em] text-ink">
                <Counter from={brand.trusted.start} to={brand.trusted.end} delay={1200} duration={2600} live reduced={reduced} />
              </b>
              {brand.trusted.label}
            </span>
          </span>
        </div>
      </div>

      {/* live reading card — top right */}
      <div ref={cardWrap} key={`${model.id}-card`} className="relative z-10 px-5 pb-6 will-change-transform md:absolute md:top-[17%] md:right-7 md:w-[16rem] md:p-0">
        <div className="glass rounded-2xl p-4 shadow-sm" data-reveal style={{'--d': '700ms'} as CSSProperties}>
          <div className="flex items-center justify-between text-small font-medium">
            <span className="flex items-center gap-2">
              <span ref={dot} className="size-1.5 rounded-full bg-coral transition-colors duration-700" />
              <span ref={status}>{model.card.title}</span>
            </span>
            <span ref={pct} className="text-mute tabular-nums">
              0%
            </span>
          </div>
          <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-line">
            <div ref={bar} className="h-full origin-left rounded-full bg-linear-to-r from-peach to-coral [transform:scaleX(0)]" />
          </div>
          <ul className="mt-2 divide-y divide-line">
            {model.card.rows.map((r, i) => (
              <li key={`${model.id}-${r.label}`} className="flex items-baseline justify-between py-2">
                <span className="text-small text-mute">{r.label}</span>
                <span className="font-display text-figure font-medium tabular-nums">
                  <Counter to={r.value} delay={1000 + i * 220} duration={2000} reduced={reduced} />
                  {r.suffix}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4 Models Quick Switcher Pill (Floating bottom center) */}
      <div
        className="relative z-20 flex justify-center px-5 pb-6 md:absolute md:bottom-5 md:left-1/2 md:-translate-x-1/2 md:p-0"
        data-reveal
        style={{'--d': '1600ms'} as CSSProperties}
      >
        <div className="glass flex items-center gap-1 rounded-full p-1.5 shadow-lg border border-white/60">
          <span className="hidden sm:inline-block px-2.5 text-small font-medium text-mute">
            Protocolos:
          </span>
          {models.map((m, idx) => {
            const isActive = idx === activeModelIndex;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onSelectModel(idx)}
                className={`group flex items-center gap-1.5 sm:gap-2 rounded-full px-2.5 sm:px-3 py-1.5 text-small font-medium transition-[background-color,color,transform,box-shadow] duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-ink text-paper shadow-xs scale-102'
                    : 'text-ink/75 hover:text-ink hover:bg-white/70'
                }`}
                aria-label={`Ver modelo ${m.name} - ${m.shortFocus}`}
                aria-pressed={isActive}
              >
                <span
                  className="size-2 rounded-full transition-transform group-hover:scale-125"
                  style={{
                    background: isActive
                      ? '#e7866c'
                      : `linear-gradient(135deg, ${m.avatarColor[0]}, ${m.avatarColor[1]})`,
                  }}
                />
                <span>{m.name}</span>
                <span
                  className={`hidden md:inline text-small ${
                    isActive ? 'text-paper/70' : 'text-mute'
                  }`}
                >
                  · {m.shortFocus}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
