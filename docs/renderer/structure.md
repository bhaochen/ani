# 渲染进程（React）结构

本页梳理 `desktop/src/react/` 的目录分层与组件组织方式。

## 1. 目录分层

| 目录 | 职责 |
| --- | --- |
| `App.tsx` / `MainContent.tsx` | 应用根、布局骨架 |
| `app/` | 顶层页面与容器组件（`ChatPage`、`CompanionPage`、`ChatSidebar` 等） |
| `components/` | 可复用 UI 组件（按功能再分子目录） |
| `chat/` | 对话相关组件 |
| `stores/` | Zustand 状态（见 state 文档） |
| `services/` | 与 Server/IPC 交互的服务层 |
| `hooks/` | 自定义 React hooks |
| `settings/` | 设置面板 |
| `plugin-ui/` | 插件 UI 承载 |
| `splash/`、`onboarding/`、`mobile/`、`editor/`、`quick-chat/`、`browser-viewer/` | 各场景模块 |
| `ui/` | 基础 UI 原子（按钮、弹层等） |
| `utils/`、`errors/`、`types/` | 工具、错误边界、类型 |
| `__tests__/` | 渲染层单测 |

## 2. 布局骨架

`App.tsx` 组合：标题栏（`AppTitlebar`） + 主内容（`MainContent`） + 各页面（`AppPages`）。
`ChatSidebar` 是左侧栏，根据当前 tab（对话 / 陪伴 / 设置 …）切换内容。

## 3. 组件风格约定

- **CSS Modules**：每个组件配套 `X.module.css`，作用域隔离。
- **错误边界**：Region 级 `RegionalErrorBoundary`，单区出错不白屏。
- **受控与派生**：UI 多从 store 派生（selector），少本地冗余 state。
- **i18n**：文案走 `locales/`（zh / zh-TW …），不在组件里硬编码。

## 4. 页面切换示例：CompanionPage

- `app/CompanionPage.tsx`：陪伴页，全屏视频背景 + R 层（R1/R2/R3）+ 模式（A/B/C）。
- 通过 store 的 `companionMode`、`companionRLayer` 驱动（见 features/companion.md）。
- 支持"沉浸式展开"：右下角玻璃质按钮切换 `.expanded`（fixed inset:0, z-index 1000）。

## 5. 在 Web 模式复用

渲染层不依赖 Electron API 直接写 UI；所有原生能力走 `services/` → IPC/HTTP 抽象，
因此 `dev:web` 能在浏览器跑（仅缺失桌面专属能力）。
