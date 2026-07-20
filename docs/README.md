# HanaAgent / Hanako 开发文档

面向**学习**与**面试**的模块化开发文档。本文档基于仓库实际代码结构整理，按主题分目录，便于按需阅读。

> 阅读顺序建议：先看 `architecture/` 建立全局心智模型，再按兴趣深入 `desktop/`、`renderer/`、`state/`。
> `study/` 是速记与面试向提炼，适合快速复习。

## 目录

| 目录 | 内容 | 适合人群 |
| --- | --- | --- |
| [architecture/](./architecture/) | 系统总览、进程模型、目录结构、关键数据流 | 所有人，先读 |
| [desktop/](./desktop/) | Electron 主进程、生命周期、GPU/视频策略、IPC | 桌面端 / 性能 / 原生方向 |
| [renderer/](./renderer/) | React 渲染层、页面/侧边栏、组件分层 | 前端方向 |
| [state/](./state/) | Zustand store 设计、slice 模式、跨进程状态同步 | 前端 / 状态管理方向 |
| [features/](./features/) | 陪伴页 / 壁纸视频 / 落叶叠加等具体功能拆解 | 想看真实功能实现 |
| [workflow/](./workflow/) | 构建、运行、调试、测试、发布命令 | 上手开发 |
| [study/](./study/) | 概念速记 + 面试问答提炼 | 面试复习 |

## 技术栈速览

- **桌面壳**：Electron（主进程 Node + 渲染进程 Chromium）
- **渲染层**：React + TypeScript + Vite（多入口：renderer / splash / theme / preload）
- **状态**：Zustand（slice 组合模式）
- **后端**：Node 服务（`core/`、`server/`），Agent 编排、会话、插件、LLM 客户端
- **插件**：独立 SDK（`packages/`、`plugins/`），iframe 沙箱
- **资产**：壁纸/氛围音视频本地资产（`assets/`，已 gitignore，不在仓库内）

## 关键约定

- 主进程与渲染进程通过 **IPC + 自定义协议（`app://`）** 通信；大文件（视频）走 `app://local/...` 直接由渲染进程加载。
- 渲染进程崩溃被 `RegionalErrorBoundary` 捕获，显示"此区域暂时无法显示"而非白屏。
- 资产（视频/音频）体积大，**不进 Git**，由 `.gitignore` 排除；代码只保留引用与 `assets/README` 说明。
