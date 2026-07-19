import { useEffect, useState, useRef, useCallback } from 'react';
import { useStore } from '../../stores';
import styles from './CompanionPage.module.css';

// Helper: get current time slot based on system clock
function getTimeSlot(): '1200' | '1730' | '2000' {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  if (minutes >= 360 && minutes < 1050) return '1200'; // 06:00 – 17:29
  if (minutes >= 1050 && minutes < 1200) return '1730'; // 17:30 – 19:59
  return '2000'; // 20:00 – 05:59
}

// Mapping from mode‑R‑slot to ambient mp3 (based on assets/README.md)
const ambientMap: Record<string, Record<string, Record<string, string>>> = {
  A: {
    R1: { '1200': 'ambient_loop_1.mp3', '1730': 'ambient_loop_2.mp3', '2000': 'ambient_loop_3.mp3' },
    R2: { '1200': 'ambient_loop_4.mp3', '1730': 'ambient_loop_5.mp3', '2000': 'ambient_loop_6.mp3' },
    R3: { '1200': 'ambient_loop_7.mp3', '1730': 'ambient_loop_8.mp3', '2000': 'ambient_loop_9.mp3' },
  },
  B: {
    R1: { '1200': 'ambient_loop_10.mp3', '1730': 'ambient_loop_11.mp3', '2000': 'ambient_loop_12.mp3' },
    R2: { '1200': 'ambient_loop_13.mp3', '1730': 'ambient_loop_14.mp3', '2000': 'ambient_loop_15.mp3' },
    R3: { '1200': 'ambient_loop_16.mp3', '1730': 'ambient_loop_17.mp3', '2000': 'ambient_loop_18.mp3' },
  },
  C: {
    R1: { '1200': 'ambient_loop_19.mp3', '1730': 'ambient_loop_20.mp3', '2000': 'ambient_loop_21.mp3' },
    R2: { '1200': 'ambient_loop_22.mp3', '1730': 'ambient_loop_10.mp3', '2000': 'ambient_loop_11.mp3' },
    R3: { '1200': 'ambient_loop_12.mp3', '1730': 'ambient_loop_13.mp3', '2000': 'ambient_loop_14.mp3' },
  },
};

// Build app:// URL for a project-relative asset path
// e.g. app://local/assets/Wallpaper_Presence/A_R1_1200.webm
function appAssetUrl(relativePath: string): string {
  return `app://local/${relativePath}`;
}

// A single wallpaper video layer. Keeps the same DOM node across src changes
// (keyed by slot index, not src) so we only reload+play when the src prop
// actually changes — no remount, no black frame. Reports readiness so the
// parent can promote it once it can actually render frames.
function WallpaperLayer({
  src,
  active,
  loop,
  onReady,
  onEnded,
  className,
}: {
  src: string;
  active: boolean;
  loop: boolean;
  onReady: (src: string) => void;
  onEnded?: () => void;
  className: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const lastSrc = useRef<string>('');
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || !src) {
      // No source (e.g. slot cleared after a crossfade): stop any pending retry
      // so we never call play() on an element with no supported sources.
      if (retryTimer.current) clearTimeout(retryTimer.current);
      return;
    }
    if (lastSrc.current !== src) {
      lastSrc.current = src;
      v.load();
    }
    const tryPlay = () => {
      let p: Promise<void> | undefined;
      try {
        // play() can throw synchronously with "no supported sources" if the
        // element has no src yet; swallow it and retry shortly. NOTE: do NOT
        // use v.currentSrc === '' to bail out — currentSrc is empty while the
        // source is still loading (before the first frame), which is expected
        // and must not stop retrying.
        p = v.play();
      } catch {
        p = undefined;
      }
      if (p && typeof p.catch === 'function') {
        // autoplay/pipeline can reject (hidden tab, decoder not ready). Retry
        // shortly — a later attempt often succeeds (matches the "switch away
        // and back" workaround the user observed).
        if (retryTimer.current) clearTimeout(retryTimer.current);
        retryTimer.current = setTimeout(tryPlay, 250);
      }
    };
    tryPlay();
    return () => {
      if (retryTimer.current) clearTimeout(retryTimer.current);
    };
  }, [src]);

  if (!src) return null;

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      muted
      loop={loop}
      onCanPlay={() => onReady(src)}
      onLoadedData={() => onReady(src)}
      onPlaying={() => onReady(src)}
      onEnded={onEnded}
      className={className}
      data-active={active ? 'true' : 'false'}
    />
  );
}

export function CompanionPage({ hidden = false }: { hidden?: boolean }) {
  const mode = useStore(s => s.companionMode);
  const [rLayer, setRLayer] = useState<'R1' | 'R2' | 'R3'>('R1');
  const [slot, setSlot] = useState<'1200' | '1730' | '2000'>(getTimeSlot());
  const [isTransition, setIsTransition] = useState(false);
  const prevSlotRef = useRef(slot);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Poll system clock every minute
  useEffect(() => {
    const id = setInterval(() => setSlot(getTimeSlot()), 60_000);
    return () => clearInterval(id);
  }, []);

  // When time slot changes → play transition video first
  useEffect(() => {
    if (prevSlotRef.current !== slot) {
      setIsTransition(true);
    }
    prevSlotRef.current = slot;
  }, [slot]);

  // ── Resolve file URLs via app:// protocol ──
  const videoFile = isTransition
    ? `assets/Wallpaper_Presence/${mode}_Transition_${prevSlotRef.current}_${slot}.webm`
    : `assets/Wallpaper_Presence/${mode}_${rLayer}_${slot}.webm`;

  const audioFile = isTransition
    ? 'assets/Wallpaper_Ambience/ambient_loop_22.mp3'
    : `assets/Wallpaper_Ambience/${ambientMap[mode]?.[rLayer]?.[slot] ?? ''}`;

  const videoSrc = appAssetUrl(videoFile);
  const audioSrc = appAssetUrl(audioFile);

  // ── Crossfade between wallpaper videos (ready-gated, two-slot) ──
  // Switching R layer / mode / slot used to remount a single <video>, which
  // showed a black gap while the new source loaded+decoded. Now two persistent
  // slots are kept: the ACTIVE one keeps playing, while the INACTIVE slot
  // preloads the next source in the background. A switch is only promoted once
  // the next layer can actually play (`onCanPlay`/`onPlaying`), so rapid
  // toggling never reveals a black frame — the old layer stays until the new
  // one is truly ready, then they crossfade.
  const FADE_MS = 700;
  // If the next layer never reports ready (hidden tab / decoder event dropped),
  // still promote after this timeout so a switch is never stuck. The OLD layer
  // keeps playing (visible) the whole time, so waiting longer costs nothing
  // visually — no black frame. This is a last-resort safety net only; in
  // practice the real canplay/playing event fires well before this (software
  // AV1 decode on big B-mode clips can take a few seconds).
  const READY_TIMEOUT_MS = 4000;
  const slotSrcRef = useRef<[string, string]>([videoSrc, '']);
  const activeSlotRef = useRef(0);
  const targetSrcRef = useRef(videoSrc);
  targetSrcRef.current = videoSrc;
  const [slotSrc, setSlotSrc] = useState<[string, string]>(slotSrcRef.current);
  const [slotReady, setSlotReady] = useState<[boolean, boolean]>([true, false]);
  const [activeSlot, setActiveSlot] = useState(0);
  const [outgoingSlot, setOutgoingSlot] = useState<number | null>(null);
  const outgoingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const promoteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const promoteSlot = useCallback((slot: number) => {
    const act = activeSlotRef.current;
    if (slot === act) return;
    if (slotSrcRef.current[slot] !== targetSrcRef.current) return;
    if (promoteTimer.current) clearTimeout(promoteTimer.current);
    if (outgoingTimer.current) clearTimeout(outgoingTimer.current);
    const prevActive = act;
    activeSlotRef.current = slot;
    setActiveSlot(slot);
    setOutgoingSlot(prevActive);
    outgoingTimer.current = setTimeout(() => {
      const cur = slotSrcRef.current;
      const cleared: [string, string] = [...cur];
      cleared[prevActive] = '';
      slotSrcRef.current = cleared;
      setSlotSrc(cleared);
      setOutgoingSlot(null);
    }, FADE_MS + 100);
  }, []);

  // Load the desired source into the inactive slot whenever the target changes.
  useEffect(() => {
    const cur = slotSrcRef.current;
    const act = activeSlotRef.current;
    if (cur[act] === videoSrc) return;
    const inactive = act === 0 ? 1 : 0;
    if (cur[inactive] === videoSrc) return; // already preloading that target
    const next: [string, string] = [...cur];
    next[inactive] = videoSrc;
    slotSrcRef.current = next;
    setSlotSrc(next);
    setSlotReady((prev) => {
      const n: [boolean, boolean] = [...prev];
      n[inactive] = false;
      return n;
    });
    // Safety net: promote even if the ready event never fires.
    if (promoteTimer.current) clearTimeout(promoteTimer.current);
    promoteTimer.current = setTimeout(() => promoteSlot(inactive), READY_TIMEOUT_MS);
  }, [videoSrc, promoteSlot]);

  // Promote the inactive slot to active once it can play and is still the target.
  const handleLayerReady = useCallback((slot: number, src: string) => {
    setSlotReady((prev) => {
      const n: [boolean, boolean] = [...prev];
      n[slot] = true;
      return n;
    });
    if (promoteTimer.current) clearTimeout(promoteTimer.current);
    promoteSlot(slot);
  }, [promoteSlot]);

  // After the (non-looping) transition video ends → stop transition and
  // fall back to the looping wallpaper video. The looping wallpaper video
  // must NEVER trigger a layer switch (it loops forever), so R-layer cycling
  // is driven by the ambient audio ending, not the video.
  const handleVideoEnd = () => {
    if (isTransition) {
      setIsTransition(false);
    }
  };

  // R layer cycles R1 → R2 → R3 → R1, advanced when the ambient MP3 finishes
  // (per design: "after R1's MP3 ends, move to R2"). Audio is not looped so
  // its `ended` event fires and drives the rotation.
  const handleAudioEnd = () => {
    setRLayer((prev) => {
      const next = prev === 'R1' ? 'R2' : prev === 'R2' ? 'R3' : 'R1';
      useStore.getState().setCompanionRLayer(next);
      return next;
    });
  };

  // Keep the sidebar's displayed R layer in sync when mode is switched
  // (which resets the layer to R1) or on first mount.
  useEffect(() => {
    useStore.getState().setCompanionRLayer(rLayer);
  }, [rLayer]);

  // Clean up pending crossfade/promote timers on unmount.
  useEffect(() => {
    return () => {
      if (outgoingTimer.current) clearTimeout(outgoingTimer.current);
      if (promoteTimer.current) clearTimeout(promoteTimer.current);
    };
  }, []);

  // Expand the wallpaper to fill the whole app window (immersive). Toggle.
  const [expanded, setExpanded] = useState(false);

  // ── Resolve file URLs via app:// protocol (see declarations above) ──

  return (
    <div className={`${styles['companion-page']}${hidden ? ` ${styles.hidden}` : ''}${expanded ? ` ${styles.expanded}` : ''}`}>
      {/* Corner-bracket expand/collapse toggle (top-left).
          Normal: ┌ ┐ / └ ┘ (outward brackets = enlarge).
          Expanded: ┘ └ / ┐ ┌ (inward brackets = shrink). */}
      <button
        type="button"
        className={`${styles['expand-toggle']}${expanded ? ` ${styles['expanded-on']}` : ''}`}
        aria-label={expanded ? '退出沉浸' : '充满窗口'}
        aria-pressed={expanded}
        onClick={() => setExpanded((v) => !v)}
      >
        <svg
          className={styles['expand-icon']}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* rounded outer frame — shared by both states */}
          <rect x="4" y="4" width="16" height="16" rx="4.5" />
          {expanded ? (
            /* shrink: arrow points down-left ↙ */
            <path d="M14.5 9.5 L9.5 14.5 M9.5 11.5 V14.5 H12.5" />
          ) : (
            /* enlarge: arrow points up-right ↗ */
            <path d="M9.5 14.5 L14.5 9.5 M14.5 12.5 V9.5 H11.5" />
          )}
        </svg>
      </button>

      {/* Video area – two stacked layers crossfade on source change so the
          wallpaper transition is seamless. The active layer keeps playing
          until the next can actually render (ready-gated), so rapid mode/R
          switches never flash black. The looping wallpaper video never drives
          a layer switch; only the non-looping transition clip's `ended` does. */}
      <div className={styles['companion-video-wrap']}>
        {[0, 1].map((i) => (
          <WallpaperLayer
            key={i}
            src={slotSrc[i]}
            active={i === activeSlot}
            loop={i === activeSlot ? !isTransition : true}
            onReady={(s) => handleLayerReady(i, s)}
            onEnded={i === activeSlot ? handleVideoEnd : undefined}
            className={`${styles['companion-video']} ${styles['video-layer']} ${
              i === activeSlot ? styles['video-layer-active'] : styles['video-layer-outgoing']
            }`}
          />
        ))}
      </div>

      {/* Ambient audio – invisible. Not looped: ending advances the R layer. */}
      <audio ref={audioRef} key={audioSrc} src={audioSrc} autoPlay onEnded={handleAudioEnd} />
    </div>
  );
}
