# HanaAgent / Hanako 开发文档

面向**学习**与**面试**的模块化开发文档。本文档基于仓库实际代码结构整理，按主题分目录，便于按需阅读。

> 阅读顺序建议：先看 `architecture/` 建立全局心智模型，再按兴趣深入 `desktop/`、`renderer/`、`state/`。
> `study/` 是速记与面试向提炼，适合快速复习。

## 目录

| 目录 | 内容 | 适合人群 |
| --- | --- | --- |
| [architecture/](./architecture/) | 系统总览、进程模型、后端核心（core/server/lib） | 所有人，先读 |
| [desktop/](./desktop/) | Electron 主进程、生命周期、GPU/视频策略、IPC | 桌面端 / 性能 / 原生方向 |
| [renderer/](./renderer/) | React 渲染层、页面/侧边栏、组件分层 | 前端方向 |
| [state/](./state/) | Zustand store 设计、slice 模式、跨进程状态同步 | 前端 / 状态管理方向 |
| [features/](./features/) | 陪伴页、插件、记忆、Subagent、Provider、编辑器、热更新、资源IO 等 | 想看真实功能实现 |
| [workflow/](./workflow/) | 构建、运行、调试、测试、发布命令 | 上手开发 |
| [study/](./study/) | 概念速记 + 面试问答提炼 | 面试复习 |

## 文档地图（按主题）

### architecture/
- [overview.md](./architecture/overview.md) — 三大运行单元、目录结构、一次发消息的数据流、多入口、区域容错、资产不入库
- [process-model.md](./architecture/process-model.md) — 启动时序、窗口结构、为什么 spawn Server、系统能力、自定义协议、崩溃容错
- [backend-core.md](./architecture/backend-core.md) — HanaEngine facade、Agent 编排、会话、server 路由、数据目录、data epoch 内核互斥、安全模型
- [tech-stack.md](./architecture/tech-stack.md) — 技术栈版本表、平台支持、LAN/Mobile 说明

### desktop/
- [gpu-video.md](./desktop/gpu-video.md) — NVIDIA+Wayland 视频硬解坑与软件解码方案
- [ipc.md](./desktop/ipc.md) — 主↔渲染 IPC、preload 安全、插件 iframe 票据

### renderer/
- [structure.md](./renderer/structure.md) — 目录分层、布局骨架、组件约定、页面示例
- [hooks-services.md](./renderer/hooks-services.md) — 自定义 hooks 与 services 层、视频播放 hook 化、测试

### state/
- [zustand-slices.md](./state/zustand-slices.md) — slice 模式、典型 slice、持久化、与 Server 关系
- [cross-process-sync.md](./state/cross-process-sync.md) — 拉取/流式/乐观更新、一致性、本地优先

### features/
- [companion.md](./features/companion.md) — 陪伴页：壁纸视频、R 层、模式切换、沉浸式展开、落叶叠加
- [wallpaper-pipeline.md](./features/wallpaper-pipeline.md) — 壁纸/氛围视频资产管线、转码、B 模式解码坑
- [plugins.md](./features/plugins.md) — 插件 UI 贡献、加载运行时、iframe 票据隔离、Plugin Card、内置插件、image-gen
- [memory.md](./features/memory.md) — 四层记忆结构、滚动传送带、增量水位线、记忆编辑器
- [subagent.md](./features/subagent.md) — Subagent 复用实例、ActivityHub 三段式、跨 Session 协作、延迟结果
- [providers.md](./features/providers.md) — 模型复合键、provider 注册发现、provider-compat、认证、LLM 客户端
- [editor-preview.md](./features/editor-preview.md) — 通用预览、块操作、marquee、报刊式排版、任务族形态
- [update-pipeline.md](./features/update-pipeline.md) — hot-update train、artifact-core、更新契约、首启公告、数据加固
- [integrations.md](./features/integrations.md) — 资源 IO、移动端、语音识别、桌面自动化、桥接（钉钉）

### workflow/
- [build-run.md](./workflow/build-run.md) — 构建/运行/调试/打包命令
- [git-assets.md](./workflow/git-assets.md) — .gitignore 设计、大资产不入库、推送自检

### study/
- [cheat-sheet.md](./study/cheat-sheet.md) — 概念卡片 + 高频问答
- [glossary.md](./study/glossary.md) — 术语表

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
