import { useStore } from '../../stores';
import type { CompanionMode } from '../../stores';
import styles from './CompanionModeRail.module.css';

interface ModeDef {
  mode: CompanionMode;
  label: string;
  hint: string;
}

const MODES: ModeDef[] = [
  { mode: 'A', label: '日常', hint: 'A' },
  { mode: 'B', label: '创作', hint: 'B' },
  { mode: 'C', label: '思考', hint: 'C' },
];

export function CompanionModeRail() {
  const companionMode = useStore(s => s.companionMode);
  const setCompanionMode = useStore(s => s.setCompanionMode);
  const rLayer = useStore(s => s.companionRLayer);
  const t = window.t ?? ((p: string) => p);

  return (
    <section className={styles.rail} data-region="companion-mode" aria-label={t('companion.mode.label')}>
      <div className={styles.header}>
        <span className={styles.title}>{t('companion.mode.title')}</span>
        <span className={styles.layer}>{rLayer}</span>
      </div>
      <div className={styles.sliders}>
        {MODES.map(({ mode, label, hint }) => {
          const active = companionMode === mode;
          return (
            <button
              key={mode}
              type="button"
              className={`${styles.slider}${active ? ` ${styles.active}` : ''}`}
              role="switch"
              aria-checked={active}
              aria-label={label}
              onClick={() => setCompanionMode(mode)}
            >
              <span className={styles.track} aria-hidden="true">
                <span className={styles.thumb} />
              </span>
              <span className={styles.label}>{label}</span>
              <span className={styles.hint}>{hint}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
