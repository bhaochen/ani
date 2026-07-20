# 系统架构总览

本页建立全局心智模型：HanaAgent 由一个 **Electron 桌面壳** + 一个 **Node 后端服务** + 一个 **React 渲染前端** 组成。

## 1. 三大进程 / 运行单元

```
┌──────────────────────────────────────────────────────────────┐
│  Electron Main Process  (desktop/main.cjs, Node)              │
│  - 创建 splash 窗口、主窗口 (BrowserWindow / WebContentsView) │
│  - spawn() 启动 HanaAgent Server                              │
│  - GPU / 视频解码策略、Tray、AutoUpdater、IPC 路由            │
└───────────────┬──────────────────────────────────────────────┘
                │ spawn + IPC
┌───────────────▼──────────────────────────────────────────────┐
│  Node Server  (server/, core/)                                │
│  - Agent 编排、会话管理、插件运行时、LLM 客户端              │
│  - 监听本地端口（server-port-selection），供渲染进程访问      │
└───────────────┬──────────────────────────────────────────────┘
                │ HTTP / WebSocket (local port)
┌───────────────▼──────────────────────────────────────────────┐
│  Renderer  (desktop/src/react, Chromium + React)              │
│  - 所有 UI：对话、陪伴页、设置、插件面板                      │
│  - Zustand store 缓存服务端数据，乐观更新                    │
└──────────────────────────────────────────────────────────────┘
```

要点：
- **主进程不直接做 Agent 逻辑**，只负责"拉起服务 + 承载窗口 + 系统能力"。
- **Server 是业务逻辑核心**，可被 CLI（`npm run cli`）、Web（`dev:web`）复用，不绑定 Electron。
- **渲染进程通过本地端口访问 Server**，跨进程解耦，便于测试与多端复用。

## 2. 顶层目录结构

| 路径 | 职责 |
| --- | --- |
| `desktop/` | Electron 主进程、preload、原生模块、启动脚本 |
| `desktop/src/react/` | 渲染进程 React 应用（UI 全部在这里） |
| `core/` | 后端核心：agent、session、plugin、media、provider |
| `server/` | HTTP/WS 服务入口、路由、鉴权 |
| `shared/` | 主进程/渲染进程/服务端共享类型与工具 |
| `packages/` | 可发布的库（如插件 SDK） |
| `plugins/` | 内置插件实现 |
| `lib/` | 通用工具库 |
| `assets/` | 壁纸/氛围音视频（被 gitignore，**不进仓库**） |
| `tests/` | 跨模块测试 |
| `scripts/` | 构建/启动/补丁脚本 |
| `docs/` | 本开发文档 |

## 3. 一次"发消息"的数据流（简化）

1. 用户在 `ChatPage` 输入 → 写入 `chat-slice`（乐观插入 user message）。
2. 渲染进程通过 IPC / 本地 HTTP 调到 `server` 的会话接口。
3. `core/session-coordinator.ts` 编排 Agent 调用 `core/agent.ts` → `core/llm-client.ts` 访问 LLM provider。
4. 流式 token 通过 WS 推送回渲染进程 → `streaming-slice` 更新 UI。
5. 工具调用（tool）由 `core/execution-*` 负责执行边界与租约，结果回流会话。

## 4. 渲染进程多入口（Vite）

`package.json` 里多个 `build:*` 脚本对应不同 Vite 配置：

- `build:renderer` — 主 UI（`vite.config.ts`）
- `build:splash` — 启动画面（`vite.config.splash.ts`）
- `build:theme` — 主题资源（`vite.config.theme.js`）
- `build:preload` — preload 脚本（`vite.config.preload.js`）
- `build:main` — 主进程打包（`vite.config.main.js`）

## 5. 渲染进程的"区域容错"

UI 被拆分为多个 **Region**，每个 Region 外包 `RegionalErrorBoundary`（见 `desktop/src/react/errors/`）。
单个区域组件抛错时，仅该区域显示降级 UI，不影响其它区域与整体窗口。
这是面试里可强调的"错误隔离"设计。

## 6. 资产为什么不在仓库

- 壁纸 `assets/Wallpaper_Presence` ≈ **6 GB**，`Wallpaper_Ambience` ≈ 89 MB。
- GitHub 单文件硬上限 100 MB、仓库软上限约 1 GB。
- 因此 `.gitignore` 排除 `assets/` 全部视频与 `*.webm`；发行时通过安装包 / 对象存储分发。
- 代码中通过 `import` 引用（Vite 在构建期把资产 URL 注入），但资产文件本身不参与版本控制。
