# 术语表

本页集中解释文档与代码中反复出现的术语，方便速查。

| 术语 | 含义 |
| --- | --- |
| **Main Process** | Electron 主进程（Node），负责窗口、系统能力、spawn Server |
| **Renderer** | 渲染进程（Chromium + React），所有 UI |
| **Server / core** | Node 后端业务真源（Agent、会话、插件、LLM） |
| **Slice** | Zustand 状态切片（领域模块化） |
| **Selector** | 从 store 选取派生数据的订阅函数 |
| **Region / RegionalErrorBoundary** | UI 容错区域，单区出错降级不白屏 |
| **CompanionPage** | 陪伴页：壁纸视频背景 + R 层 + 模式切换 |
| **R 层 (R1/R2/R3)** | 陪伴页三个氛围层，由音频 ended 驱动循环 |
| **companionMode (A/B/C)** | 陪伴模式：日常 / 创作 / 思考 |
| **WallpaperLayer** | 双槽位视频切换 + 交叉淡入的封装 |
| **READY_TIMEOUT_MS** | 视频就绪超时（4000ms），超时强制提升防黑屏 |
| **visibility:hidden** | 隐藏但保留解码上下文（区别于 display:none） |
| **object-fit: cover** | 视频填满容器、裁切无黑边 |
| **leaves-overlay.webm** | 落叶氛围叠加视频（可选开关） |
| **app:// 协议** | 主进程注册，渲染进程读本地资产的自定义协议 |
| **preload** | 隔离环境下暴露受限 API 给渲染进程的脚本 |
| **AV1 / av1_nvenc** | 视频编码与 NVIDIA 硬件编码器 |
| **NVDEC / VAAPI** | NVIDIA 视频解码 / Linux 视频加速 API |
| **swiftshader** | 软件渲染回退 |
| **Plugin SDK** | 插件开发 SDK（`packages/`），iframe 沙箱 |
| **iframe ticket** | 插件 iframe 鉴权票据服务 |
| **Agent / Session** | 智能体编排单元 / 会话上下文 |
| **Optimistic Update** | 乐观更新：先本地改再异步同步，失败回滚 |
| **Streaming** | WS 流式推送（Agent 回复分片） |

## 缩写

- **WS**：WebSocket
- **IPC**：Inter-Process Communication（进程间通信）
- **TDZ**：Temporal Dead Zone（暂时性死区，JS 变量提升陷阱）
- **SPA**：Single Page Application（本渲染层即 SPA）
