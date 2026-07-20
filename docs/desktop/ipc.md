# 主进程 ↔ 渲染进程 IPC

本页梳理 Electron 主进程与 React 渲染进程之间的通信方式与设计约定。

## 1. 通信通道

| 通道 | 用途 | 实现 |
| --- | --- | --- |
| `ipcMain` / `ipcRenderer` | 结构化命令/事件（如开窗、读文件、更新） | `desktop/ipc-wrapper.cjs` 封装 |
| `app://` 协议 | 渲染进程直接读取本地资产（视频/插件资源） | 主进程 `protocol` 注册 |
| 本地 HTTP/WS | 渲染进程访问 Server（Agent/会话/插件） | `server/` 监听本地端口 |

## 2. IPC 封装原则

`desktop/ipc-wrapper.cjs` 把裸 `ipcMain.handle` 包成带类型与错误归一化的 API，避免每个功能点重复错误处理。
渲染侧通过 `preload.cjs` 暴露受限的 `window` 接口（contextIsolation 开启，不直接暴露 Node）。

## 3. preload 与安全

- `contextIsolation: true`、`nodeIntegration: false`（默认安全配置）。
- preload 只暴露白名单方法（如 `window.electronAPI.xxx`）。
- 插件运行在独立 iframe，通过"iframe ticket 服务"鉴权，不能越权访问主进程（见 `core/plugin-iframe-ticket-service.ts`）。

## 4. 一次 IPC 调用的形态（概念）

```ts
// 渲染进程
const result = await window.electronAPI.readFile(path);

// 主进程 (ipc-wrapper)
ipcMain.handle("readFile", async (_e, path) => {
  // 校验路径防穿越 → 调 file-text-io.cjs → 返回
});
```

## 5. 调试技巧

- 主进程日志看终端（`console.log` 在启动 Electron 的 shell）。
- 渲染进程日志用 DevTools（开发模式自动开）。
- `npm run start:dev` 带 devtools 与热更；生产 `npm start` 不带。
