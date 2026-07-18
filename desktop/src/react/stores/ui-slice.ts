import type { ActivePanel, RightWorkspaceTab, TabType } from '../types';
import type { FileRef } from '../types/file-ref';

export type CompanionMode = 'A' | 'B' | 'C';
export type CompanionRLayer = 'R1' | 'R2' | 'R3';

export interface MediaViewerState {
  files: FileRef[];
  currentId: string;
  origin: 'desk' | 'session';
}

export interface SettingsModalState {
  open: boolean;
  activeTab: string;
}

export interface UiSlice {
  sidebarOpen: boolean;
  sidebarAutoCollapsed: boolean;
  jianOpen: boolean;
  jianAutoCollapsed: boolean;
  previewOpen: boolean;
  welcomeVisible: boolean;
  currentTab: TabType;
  activePanel: ActivePanel;
  rightWorkspaceTab: RightWorkspaceTab;
  jianDrawerOpen: boolean;
  /**
   * 陪伴页当前模式：A=日常 / B=创作 / C=思考。
   * 由陪伴侧边栏底部三滑块切换，驱动 CompanionPage 的视频与氛围音轨。
   */
  companionMode: 'A' | 'B' | 'C';
  /** 陪伴页当前 R 层（R1→R2→R3 循环），由音频结束驱动，供侧边栏显示。 */
  companionRLayer: 'R1' | 'R2' | 'R3';
  locale: string;
  /** Skill 预览 overlay 数据（null = 关闭） */
  skillViewerData: { name: string; baseDir: string; filePath?: string; installed?: boolean } | null;
  /** 媒体预览 overlay 状态（null = 关闭） */
  mediaViewer: MediaViewerState | null;
  /** 主窗口内嵌设置浮层状态 */
  settingsModal: SettingsModalState;
  /** Skill catalog revision; bumped by app_event skills-changed to refresh derived lists. */
  skillCatalogVersion: number;
  /** 频道创建弹窗是否可见 */
  channelCreateOverlayVisible: boolean;
  setSidebarOpen: (open: boolean) => void;
  setSidebarAutoCollapsed: (collapsed: boolean) => void;
  setJianOpen: (open: boolean) => void;
  setJianAutoCollapsed: (collapsed: boolean) => void;
  setPreviewOpen: (open: boolean) => void;
  setWelcomeVisible: (visible: boolean) => void;
  setCurrentTab: (tab: TabType) => void;
  setActivePanel: (panel: ActivePanel) => void;
  setRightWorkspaceTab: (tab: RightWorkspaceTab) => void;
  setJianDrawerOpen: (open: boolean) => void;
  setCompanionMode: (mode: 'A' | 'B' | 'C') => void;
  setCompanionRLayer: (layer: 'R1' | 'R2' | 'R3') => void;
  setChannelCreateOverlayVisible: (visible: boolean) => void;
  setMediaViewer: (state: MediaViewerState | null) => void;
  setSettingsModal: (state: SettingsModalState) => void;
  setMediaViewerCurrent: (id: string) => void;
  closeMediaViewer: () => void;
  toggleSidebar: () => void;
  toggleJian: () => void;
}

export const createUiSlice = (
  set: (partial: Partial<UiSlice> | ((s: UiSlice) => Partial<UiSlice>)) => void
): UiSlice => ({
  sidebarOpen: true,
  sidebarAutoCollapsed: false,
  jianOpen: true,
  jianAutoCollapsed: false,
  previewOpen: false,
  welcomeVisible: true,
  currentTab: 'chat',
  activePanel: null,
  rightWorkspaceTab: 'workspace',
  jianDrawerOpen: false,
  companionMode: 'A',
  companionRLayer: 'R1',
  // Keep locale empty until i18n.load() finishes so the first successful
  // locale sync always triggers a rerender, even for the default zh locale.
  locale: '',
  skillViewerData: null,
  mediaViewer: null,
  settingsModal: { open: false, activeTab: 'agent' },
  skillCatalogVersion: 0,
  channelCreateOverlayVisible: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarAutoCollapsed: (collapsed) => set({ sidebarAutoCollapsed: collapsed }),
  setJianOpen: (open) => set({ jianOpen: open }),
  setJianAutoCollapsed: (collapsed) => set({ jianAutoCollapsed: collapsed }),
  setPreviewOpen: (open) => set({ previewOpen: open }),
  setWelcomeVisible: (visible) => set({ welcomeVisible: visible }),
  setCurrentTab: (tab) => set({ currentTab: tab }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setRightWorkspaceTab: (tab) => set({ rightWorkspaceTab: tab }),
  setJianDrawerOpen: (open) => set({ jianDrawerOpen: open }),
  setCompanionMode: (mode) => set({ companionMode: mode }),
  setCompanionRLayer: (layer) => set({ companionRLayer: layer }),
  setChannelCreateOverlayVisible: (visible) => set({ channelCreateOverlayVisible: visible }),
  setMediaViewer: (state) => set({ mediaViewer: state }),
  setSettingsModal: (state) => set({ settingsModal: state }),
  setMediaViewerCurrent: (id) => set((s) => ({
    mediaViewer: s.mediaViewer ? { ...s.mediaViewer, currentId: id } : null,
  })),
  closeMediaViewer: () => set({ mediaViewer: null }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleJian: () => set((s) => ({ jianOpen: !s.jianOpen })),
});
