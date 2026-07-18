import { useEffect, useState, useRef } from 'react';
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

  // ── Crossfade between wallpaper videos ──
  // Switching R layer / mode / slot used to remount a single <video> (via key),
  // which produced a black gap while the new source loaded+decoded. Instead we
  // keep two video layers: the active one fades in, the previous one fades out
  // on top (both keep playing, so no freeze), then the old layer is dropped.
  const FADE_MS = 700;
  const [activeSrc, setActiveSrc] = useState(videoSrc);
  const [outgoingSrc, setOutgoingSrc] = useState<string | null>(null);
  const outgoingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (videoSrc === activeSrc) return;
    if (outgoingTimer.current) clearTimeout(outgoingTimer.current);
    setOutgoingSrc(activeSrc);
    setActiveSrc(videoSrc);
    outgoingTimer.current = setTimeout(() => setOutgoingSrc(null), FADE_MS + 80);
    return () => {
      if (outgoingTimer.current) clearTimeout(outgoingTimer.current);
    };
  }, [videoSrc, activeSrc]);

  // Play + set opacity class whenever the active/outgoing sources settle.
  const ensurePlaying = (el: HTMLVideoElement | null) => {
    if (!el) return;
    const p = el.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };

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

  // ── Resolve file URLs via app:// protocol (see declarations above) ──

  return (
    <div className={`${styles['companion-page']}${hidden ? ` ${styles.hidden}` : ''}`}>
      {/* Mode indicator */}
      <div className={styles['companion-mode-label']}>
        {mode === 'A' ? '日常' : mode === 'B' ? '创作' : '思考'} · {rLayer}
      </div>

      {/* Video area – two stacked layers crossfade on source change so the
          wallpaper transition is seamless (no black frame while the new
          source loads/decodes). The looping wallpaper video never drives a
          layer switch; only the non-looping transition clip's `ended` does. */}
      <div className={styles['companion-video-wrap']}>
        <video
          key={activeSrc}
          src={activeSrc}
          autoPlay
          loop={!isTransition}
          muted
          onEnded={handleVideoEnd}
          ref={ensurePlaying}
          className={`${styles['companion-video']} ${styles['video-layer']} ${styles['video-layer-active']}`}
        />
        {outgoingSrc && (
          <video
            key={outgoingSrc}
            src={outgoingSrc}
            autoPlay
            loop
            muted
            ref={ensurePlaying}
            className={`${styles['companion-video']} ${styles['video-layer']} ${styles['video-layer-outgoing']}`}
          />
        )}
      </div>

      {/* Ambient audio – invisible. Not looped: ending advances the R layer. */}
      <audio ref={audioRef} key={audioSrc} src={audioSrc} autoPlay onEnded={handleAudioEnd} />
    </div>
  );
}
