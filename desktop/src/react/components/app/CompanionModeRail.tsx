import { useStore } from '../../stores';
import type { CompanionMode } from '../../stores';
import styles from './CompanionModeRail.module.css';

interface ModeDef {
  mode: CompanionMode;
  label: string;
}

const MODES: ModeDef[] = [
  { mode: 'A', label: '日常' },
  { mode: 'B', label: '创作' },
  { mode: 'C', label: '思考' },
];

export function CompanionModeRail() {
  const companionMode = useStore(s => s.companionMode);
  const setCompanionMode = useStore(s => s.setCompanionMode);
  const rLayer = useStore(s => s.companionRLayer);
  const t = window.t ?? ((p: string) => p);

  const activeIndex = Math.max(0, MODES.findIndex(m => m.mode === companionMode));

  return (
    <section className={styles.rail} data-region="companion-mode" aria-label={t('companion.mode.label')}>
      <div className={styles.row}>
        <span className={styles.label}>{t('companion.mode.title')}</span>
        <span className={styles.layer}>{rLayer}</span>
      </div>
      <div
        className={styles.segment}
        role="tablist"
        aria-label={t('companion.mode.title')}
      >
        <div
          className={styles.segmentSlider}
          style={{ width: `calc((100% - 4px) / ${MODES.length})`, transform: `translateX(${activeIndex * 100}%)` }}
          aria-hidden="true"
        />
        {MODES.map(({ mode, label }) => {
          const active = companionMode === mode;
          return (
            <button
              key={mode}
              type="button"
              role="tab"
              aria-selected={active}
              className={`${styles.segBtn}${active ? ` ${styles.segBtnActive}` : ''}`}
              onClick={() => setCompanionMode(mode)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
