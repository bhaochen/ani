import { useEffect, useState, useRef } from 'react';
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

export function CompanionPage() {
  const [mode] = useState<'A' | 'B' | 'C'>('A');
  const [rLayer, setRLayer] = useState<'R1' | 'R2' | 'R3'>('R1');
  const [slot, setSlot] = useState<'1200' | '1730' | '2000'>(getTimeSlot());
  const [isTransition, setIsTransition] = useState(false);
  const prevSlotRef = useRef(slot);
  const videoRef = useRef<HTMLVideoElement>(null);
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

  // After transition video ends → advance R layer, stop transition
  const handleVideoEnd = () => {
    if (isTransition) {
      setIsTransition(false);
    }
    // R layer cycles: R1 → R2 → R3 → R1
    setRLayer((prev) => (prev === 'R1' ? 'R2' : prev === 'R2' ? 'R3' : 'R1'));
  };

  // ── Resolve file URLs via app:// protocol ──
  const videoFile = isTransition
    ? `assets/Wallpaper_Presence/${mode}_Transition_${prevSlotRef.current}_${slot}.webm`
    : `assets/Wallpaper_Presence/${mode}_${rLayer}_${slot}.webm`;

  const audioFile = isTransition
    ? 'assets/Wallpaper_Ambience/ambient_loop_22.mp3'
    : `assets/Wallpaper_Ambience/${ambientMap[mode]?.[rLayer]?.[slot] ?? ''}`;

  const videoSrc = appAssetUrl(videoFile);
  const audioSrc = appAssetUrl(audioFile);

  return (
    <div className={styles['companion-page']}>
      {/* Mode indicator */}
      <div className={styles['companion-mode-label']}>
        {mode === 'A' ? '日常' : mode === 'B' ? '创作' : '思考'} · {rLayer}
      </div>

      {/* Video area – takes up remaining space */}
      <div className={styles['companion-video-wrap']}>
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          autoPlay
          loop={!isTransition}
          muted
          onEnded={handleVideoEnd}
          className={styles['companion-video']}
        />
      </div>

      {/* Ambient audio – invisible */}
      <audio ref={audioRef} key={audioSrc} src={audioSrc} autoPlay loop />
    </div>
  );
}
