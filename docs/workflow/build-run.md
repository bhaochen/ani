# 构建 / 运行 / 调试

本页汇总常用命令与开发工作流（来自 `package.json` scripts）。

## 1. 依赖与准备

```
npm install          # 含 postinstall 补丁 (scripts/patch-pi-sdk.cjs)
```

## 2. 开发运行

| 命令 | 作用 |
| --- | --- |
| `npm start` | 构建全部（preload/renderer/splash/theme）+ 启动 Electron（生产式，无 devtools 热更） |
| `npm run start:dev` | 同上但带 devtools + 热重载（开发首选） |
| `npm run start:vite` | 仅 vite 模式启动 |
| `npm run dev:web` | 纯浏览器模式（不含桌面能力），便于前端快速迭代 |
| `npm run dev:renderer` | 单独跑 vite dev server |

## 3. 构建（分入口）

```
npm run build:renderer   # 主 UI
npm run build:splash     # 启动画面
npm run build:theme      # 主题
npm run build:preload    # preload
npm run build:main       # 主进程
npm run build:client     # 一次性全构建
npm run build:server     # Node 服务
```

## 4. 质量保障

| 命令 | 作用 |
| --- | --- |
| `npm run typecheck` | tsc 多配置类型检查（含 node/test） |
| `npm run lint` | eslint |
| `npm test` | vitest 全量（排除缓存/dist） |
| `npm run test:watch` | vitest watch |

## 5. 打包 / 发布

| 命令 | 产物 |
| --- | --- |
| `npm run pack` | 本地目录包（`electron-builder --dir`） |
| `npm run dist` | macOS dmg |
| `npm run dist:win` | Windows nsis |
| `npm run dist:linux` | Linux AppImage / deb |

## 6. 调试要点

- 主进程日志：启动 Electron 的终端。
- 渲染进程：开发模式 DevTools（F12）。
- 视频/解码问题：先看 `desktop/main.cjs` 是否命中 NVIDIA+Wayland 开关（见 desktop/gpu-video.md）。
- 组件错误：被 `RegionalErrorBoundary` 隔离，定位到具体 Region。

## 7. 典型开发循环

1. `npm run start:dev` 启动。
2. 改 `desktop/src/react/**` → 热更生效。
3. 改主进程/`core` → 需重启 Electron。
4. `npm run lint && npm test && npm run typecheck` 跑质量门。
5. 提交（见 git-assets.md：资产不入库）。
