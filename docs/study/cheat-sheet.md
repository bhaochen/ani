# 面试 / 复习速记

本页把前面的文档提炼成"概念卡片 + 高频问答"，适合快速过一遍或面试前复习。

## 概念卡片

- **三大运行单元**：Electron 主进程（壳+系统能力） / Node Server（业务真源） / React 渲染进程（UI）。
- **Server 权威**：渲染 store 是缓存+乐观层；真源在 `core/`+`server/`。
- **Zustand slice 模式**：按领域切 `*-slice.ts` + `*-actions.ts`，根 store 组合，selector 订阅。
- **区域容错**：`RegionalErrorBoundary` 单区出错仅降级该区，不白屏。
- **视频常驻解码**：`visibility:hidden` 而非 `display:none`，避免重挂载黑屏。
- **双槽位交叉淡入**：两个 `<video>`，就绪门控提升 + 4s 超时兜底 → 永不黑屏。
- **NVIDIA+Wayland 视频硬解坑**：关 `disable-accelerated-video-decode` + `enable-unsafe-swiftshader`，走软件解码。
- **资产不入库**：6GB 视频被 `.gitignore` 排除，安装包/对象存储分发。
- **多端复用**：渲染层不直连 Electron API，走 services 抽象 → Web 模式可跑。

## 高频问答

**Q：为什么把业务逻辑放独立 Server，而不是主进程？**
隔离（崩一个不影响另一个）、复用（CLI/Web 共用）、安全（凭证在独立进程）。

**Q：渲染进程状态怎么和后端保持一致？**
Server 真源 + 拉取/流式/乐观更新三种同步；乐观失败回滚；失效由 invalidator 重新拉取。

**Q：视频切换为什么用双槽位而不是换 src？**
换 src 会黑屏/卡顿；双槽位让新视频就绪后再交叉淡入，旧视频继续播，4s 超时强制提升保证不黑。

**Q：为什么不用 display:none 隐藏背景视频？**
会销毁解码上下文，切回时重新加载有黑帧；用 visibility:hidden 保留解码。

**Q：遇到平台相关的 GPU 不稳定怎么处理？**
运行时探测环境（Wayland+NVIDIA），动态追加启动开关关闭不稳定路径（硬解→软解），先用软件路径证业务正确再逐步恢复。

**Q：大文件怎么管理？**
gitignore 排除 + 外部分发；代码只引用 URL，不搬运文件；类型声明（.d.ts）保留以通过编译。

**Q：Zustand 相比 Redux 的优势？**
无 Provider 包裹、按需 selector 订阅、样板代码少、可独立初始化 slice 便于测试。

**Q：Electron 安全配置？**
contextIsolation=true、nodeIntegration=false、preload 白名单、插件 iframe 走 ticket 鉴权。

## 一句话总结

"一个 Electron 壳 + 一个 Node 业务服务 + 一个 React 前端，靠 IPC/本地端口解耦；
状态以 Server 为真源、前端乐观缓存；视频用常驻解码+双槽位交叉淡入规避黑屏；
大资产不进 Git，靠运行时平台探测关闭不稳定硬解。"
