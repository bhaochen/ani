import { describe, it, expect } from 'vitest';
import { resolveWallpaperFile } from '../CompanionPage';

describe('resolveWallpaperFile', () => {
  it('builds a normal looping wallpaper path', () => {
    expect(resolveWallpaperFile('A', 'R1', '1200', false, '1200')).toBe(
      'assets/Wallpaper_Presence/A_R1_1200.webm',
    );
  });

  it('builds a transition path using the FROM slot, not the destination', () => {
    // Regression: previously used the destination slot for both ends
    // (e.g. A_Transition_1730_1730.webm), which does not exist and caused
    // "The element not found sources" after a few hours when crossing a
    // time-slot boundary.
    expect(resolveWallpaperFile('A', 'R1', '1730', true, '1200')).toBe(
      'assets/Wallpaper_Presence/A_Transition_1200_1730.webm',
    );
    expect(resolveWallpaperFile('B', 'R2', '2000', true, '1730')).toBe(
      'assets/Wallpaper_Presence/B_Transition_1730_2000.webm',
    );
    expect(resolveWallpaperFile('C', 'R3', '1200', true, '2000')).toBe(
      'assets/Wallpaper_Presence/C_Transition_2000_1200.webm',
    );
  });

  it('mirrors the from/to slots it is given (component must guarantee from !== to)', () => {
    // The pure helper just mirrors its inputs; the component is responsible
    // for passing a distinct `from` slot (it captures the previous slot at
    // switch time). Assert the exact output so the regression surface is clear.
    expect(resolveWallpaperFile('A', 'R1', '1730', true, '1730')).toBe(
      'assets/Wallpaper_Presence/A_Transition_1730_1730.webm',
    );
  });
});
