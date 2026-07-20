# 陪伴页（CompanionPage）

本页拆解 `desktop/src/react/components/app/CompanionPage.tsx` 这一真实功能模块：
壁纸视频背景 + R 层循环 + 模式切换 + 沉浸式展开。适合作为"复杂前端功能"案例学习。

## 1. 功能目标

一个**常驻背景**的陪伴界面：
- 全屏壁纸视频循环播放（不随页面切换被杀）。
- 叠加"R 层"（R1/R2/R3 三个氛围层），由氛围音 `ended` 事件驱动循环切换（音频不循环）。
- 三种模式：A=日常、B=创作、C=思考，从 store 读取 `companionMode`。
- 右下角可"沉浸式展开"成全屏。

## 2. 关键设计决策

### 2.1 始终挂载 + visibility:hidden（不 display:none）

- 视频必须**持续解码**，否则重新挂载会有黑帧/卡顿。
- 切到其它页面时用 `visibility:hidden`（仍解码、占据布局），而非 `display:none`（会销毁渲染上下文）。
- 这是规避"视频重新加载黑屏"的核心技巧。

### 2.2 双槽位就绪门控交叉淡入（WallpaperLayer）

切换视频源时不能"直接换 src"造成黑屏，做法：
- 维护**两个 `<video>` 槽位**（active / inactive）。
- 新 src 加载到 inactive 槽位；监听 `canplay`/`loadeddata`/`playing` 就绪后，父层把 inactive 提升为 active（交叉淡入）。
- 若 **4 秒内未就绪**（`READY_TIMEOUT_MS=4000`），强制提升，旧层继续播 → 永不黑屏。
- 关键修复：移除了 `currentSrc===''` 的错误早退判断（会导致 B 模式永不就绪）。

### 2.3 R 层由音频驱动

- 氛围 MP3 播放，`ended` 事件触发 R1→R2→R3→R1 循环。
- **视频始终循环**（`loop`），不因 R 层切换而重挂载（避免 TDZ/卡顿）。
- 早期版本用 `key` 重挂载视频导致问题，已改为状态驱动、不重挂载。

### 2.4 模式切换

- `companionMode` ∈ {A,B,C}，存于 `ui-slice`（`setCompanionMode`）。
- 模式变化触发过渡视频（time-slot 改变），由 WallpaperLayer 的切换逻辑承载。

## 3. 沉浸式展开

- 右下角玻璃质 pill 按钮，Apple-minimal 圆角框 + 箭头（↗ 展开 / ↙ 收起）。
- 静止 `opacity:0.5`，hover 显现，`rotate(90deg)` 动画。
- `.expanded`：`position:fixed; inset:0; z-index:1000`，覆盖全屏。

## 4. 侧边栏模式切换器（CompanionModeRail）

- `CompanionModeRail.tsx` + `.module.css`：单行分段控件（日常/创作/思考），风格对齐顶部 tab 栏。
- 挂载在左侧栏 `sidebar-companion-content`（`ChatSidebar` 内，仅 `currentTab==='companion'` 显示），
  用 `margin-top:auto` + 背景 + 顶边，像频道底部栏。

## 5. 落叶叠加层（LeavesOverlay）

- `leaves-overlay.webm` 全局氛围叠加（叶影），可选开关。
- 设置 → 界面（`hana-leaves-overlay`，localStorage）控制显隐。
- 该 webm 在 `.gitignore` 排除，不进仓库。

## 6. CSS 要点

- `.video-layer` / `.companion-video` 用 `object-fit: cover`：填满任意容器、无黑边。
- 玻璃态：`backdrop-filter: blur()` + 半透明背景 + 细边框。

## 7. 测试覆盖

- `vitest` 覆盖：交叉淡入、双槽位 `canplay` 提升、超时兜底、快速切换、图标方向。
- 这些测试验证了"永不黑屏"的时序逻辑，是功能正确性的护城河。
