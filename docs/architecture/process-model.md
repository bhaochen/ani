# 进程模型与启动流程

本页深入 `desktop/` 主进程的启动顺序与进程协作，偏"运行时"细节。

## 1. 启动时序

`npm start` 实际执行（见 `package.json`）：

```
ensure-windows-sandbox-helper
→ build:preload → build:renderer → build:splash → build:theme
→ node scripts/launch.js electron
```

`launch.js` 最终启动 Electron，进入 `desktop/main.cjs`。

`main.cjs` 内部时序（`desktop/main.cjs:1` 顶部注释）：

1. **创建 splash 窗口**（启动画面，先给用户反馈）。
2. `spawn()` 启动 HanaAgent Server（Node 子进程）。
3. 轮询等待 Server 就绪（本地端口可连接）。
4. 等待主窗口初始化完成。
5. 关闭 splash，显示主窗口（`BrowserWindow`）。
6. 注册优雅关闭（`before-quit`）：先停 Server，再退出。

## 2. 窗口结构

主窗口基于 `BrowserWindow` + `WebContentsView`（用于承载插件 iframe、预览等独立内容）。
splash 是一个轻量 `BrowserWindow`，避免主窗口白屏等待。

## 3. 为什么要 spawn Server 而不是直接在主进程跑业务逻辑？

- **隔离**：渲染进程崩溃不应带走后端；后端崩溃也不应带走窗口。
- **复用**：CLI（`npm run cli`）、Web 模式（`dev:web`）复用同一个 `server/` + `core/`。
- **安全**：敏感逻辑（凭证、provider 鉴权）跑在独立 Node 进程，攻击面更小。

## 4. 系统能力（主进程负责）

| 能力 | 模块 |
| --- | --- |
| 自动更新 | `desktop/auto-updater.cjs` |
| 文件 IO / 监听 | `file-text-io.cjs`、`file-watch-*.cjs`、`workspace-watch-registry.cjs` |
| 保持唤醒（防止息屏） | `keep-awake.cjs`（`powerSaveBlocker`） |
| 登录项 / 自启 | `login-item-settings.cjs` |
| 托盘 / 菜单 | `main.cjs` 内 `Tray` / `Menu` |
| 视频预览 | `video-preview.cjs` |

## 5. 渲染进程访问本地资源：自定义协议

主进程注册 `app://` 协议（`protocol.registerStreamProtocol` 之类），渲染进程用 `app://local/...` 读取本地资产（视频、插件资源）。
好处：绕过 Chromium 的文件系统安全限制，同时可在主进程做鉴权/防目录穿越。

## 6. 进程崩溃与容错

- 渲染进程：`RegionalErrorBoundary` 区域级降级（见架构总览 §5）。
- 主进程：监听 `child` Server 异常，尝试重启或提示用户。
- 视频解码不稳定（见 [GPU 与视频解码](./gpu-video.md)）通过启动参数规避，而非依赖进程重建。
