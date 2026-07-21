<p align="center">
  <img src=".github/assets/banner.jpg" width="100%" alt="HanaAgent Banner">
</p>

<p align="center">
  <img src=".github/assets/HanaAgent-280.png" width="80" alt="HanaAgent">
</p>

<h1 align="center">HanaAgent</h1>

<p align="center">一个有记忆、有灵魂的私人 AI 助理</p>

<p align="center"><a href="README_EN.md">English</a></p>

[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)](https://github.com/liliMozi/openhanako/releases)
## 📢 News

- **2026-07-17** 🍃 陪伴页打磨 — 修复 `LeavesOverlay` 因 `*.webm` 与 `<source type="video/mp4">` 不匹配导致的叠加层不显示，回退为 `leaves-overlay.mp4`；设置 → 界面 → 外观 下的「晴天模式」现已正常叠加**叶片阴影**。
- **2026-07-17** 🖥️ 默认工作台重命名 — 默认目录由 `OH-WorkSpace` 改为 `ANI-WorkSpace`（`~/Desktop/ANI-WorkSpace`），旧目录手动 `mv` 即可迁移，不再内建自动迁移逻辑。
- **2026-07-17** 🎴 壁纸无缝切换 — 引入**双槽位就绪门控交叉淡入**（`WallpaperLayer`），新视频 `canplay`/`playing` 就绪后才提升为 active；`READY_TIMEOUT_MS=4000` 超时兜底，旧层持续播放，模式/分区快速切换**永不黑屏**；修复 B 模式（创作）因 `currentSrc==''` 早退而永不就绪的问题。
- **2026-07-17** 🔘 陪伴模式栏 — 左侧栏（陪伴 tab）新增单行**分段控件**（日常 / 创作 / 思考），风格对齐顶部 tab 与频道底栏，由 `ui-slice` 的 `companionMode` 驱动。
- **2026-07-17** ⛶ 沉浸式展开 — 陪伴页右下角 **Apple-minimal 玻璃质**按钮（↗/↙ 方向箭头，`opacity:0.5` 静止 hover 显现，`rotate(90deg)` 动画），切换 `.expanded`（`position:fixed; inset:0; z-index:1000`）。
- **2026-07-17** 🎥 视频解码稳定性 — 在 **NVIDIA + Wayland** 下关闭 `disable-accelerated-video-decode` 并启用 `enable-unsafe-swiftshader`，统一走**软件解码**（AV1/VP9），规避 NVDEC/VAAPI 的 `vaEndPicture failed` 冻结；壁纸源由 `H.264` 转码为 `AV1 .webm`。
- **2026-07-17** 🧩 区域容错 — `CompanionPage` 常驻挂载（`visibility:hidden` 而非 `display:none`）保持解码上下文；R 层由**氛围音 `ended`** 驱动循环（R1→R2→R3），视频始终 `loop` 不再重挂载，修复 TDZ 崩溃与黑帧。
- **2026-07-12** 🚀 热更新管线 — 新增 **hot-update train** 发布流水线（`artifact-core` 库含 ustar 安全解压 / manifest 验签 / 指针存储 / 激活流程）；自动更新改为**只检查不下载**，下载与应用由用户点击触发；崩溃回退后向用户明确提示。
- **2026-07-10** 🔒 数据目录加固 — `data epoch` 单调闸拒止旧内核打开新格式数据；同目录**内核互斥**（token 认证探测）；`loopback` 端口随机分配与运行期自愈，弃用固定默认 `14500`。
- **2026-07-10** 🤝 跨 Session 协作 v0 — 工具读/写侧、draft 挂载、投递单点（空闲提交 / 跑动插入 / 竞态兜底）、草稿确认卡与 Agent 来源消息卡，桥接快照裁剪与分类登记。
- **2026-07-08** 🔎 会话内搜索 — `Cmd+F` 会话内查找栏 + 消息级命中路由（`/api/sessions/find`），命中可跳到最佳匹配消息；`chat-find` slice 管理 keyed 查找态与定位意图。
- **2026-07-07** 📰 报刊式排版 — Markdown 预览改用 **newsprint** 基线网格与 `PT Serif` 字体度量（`--tool-bg` 全主题加深一档），reading 默认切换为报刊指标。
- **2026-07-04** 🧠 记忆流水线 — 周重编译改为**滚动每日摘要传送带**，今日记忆编译增量 + summary watermark；新增四段式记忆编辑器（按天/周条目），editable facts 提升为 canonical facts 管线。
- **2026-06-28** 📝 通用 Markdown 编辑器 — `EditorContextMenu` 内化为 `PreviewEditor` 通用覆盖，圆角格式工具条；块级**拖拽手柄**、批量块操作与 **marquee 选区**。
- **2026-06-22** 🧩 插件体系扩充 — `native chat surface cards`、资源监听 helper、SDK 发现与开发循环稳定；`resource-io` 统一远端资源预览访问与权威审计。
- **2026-06-21** 📡 资源 IO 后端订阅 — `resource-io` provider 调度层 + 后端订阅 API，文件工具与 watch 收敛，workbench 变更事件（增删改/重命名）驱动预览重载。
- **2026-06-21** 💬 钉钉桥接 — 新增 **DingTalk bridge adapter**，并持续增强 **Plugin Card Protocol**（iframe 卡片从 `tool_end` 渲染、自动注入 `pluginId`）。
- **2026-05-31** 🤖 Subagent 复用 — 单 subagent **复用实例**（`reuseKey` + `resume` 续接 + 串行锁），per-session 作用域互不串味；右侧 subagent 卡复刻群聊（agent 行 + 点击展开实时流）。
- **2026-05-30** 🔧 三段式重构 — 统一 **Agent Activity 真相源**（ActivityHub）数据链；Workflow 改为 per-agent 工具开关（默认关）并接入 agent。
- **2026-05-25** 🏷️ 分发面更名 — distribution surface 重命名为 **HanaAgent**；重构 image-gen providers；新增 onboarding 记忆设置与 session 搜索/归档入口。
- **2026-04-08** 🗃️ 统一迁移框架 — 数据迁移框架收敛（`fix #356` 悬空 provider 引用）；模型引用全线切到 `(provider, id)` **复合键**。
- **2026-04-01** 🔌 插件兼容 — `minAppVersion` 检查跳过不兼容插件；**deepseek/qwen** provider-compat 子模块与 reasoning 内容兜底提取。
- **2026-03-31** 🧩 插件 UI 面板 — 插件可声明 **page tab + sidebar widget** 双贡献；`PluginPageView`/`PluginWidgetView` + 动态 `ChannelTabBar`/`WidgetButtons`，`plugin-ui` slice 与初始化。
- **2026-03-29** 🎨 图像生成系统插件 — `image-gen` 系统插件 + `MediaTab` 设置页 + provider 模型类型支持；plugin route context 与 session bus 携带 `agentId`。

<details>
<summary>Earlier news</summary>

- **2026-07-15** 📝 模块化开发文档 — 新增 `docs/`（架构 / 桌面 / 渲染 / 状态 / 功能 / 工作流 / 复习），基于实际代码结构，含 **NVIDIA+Wayland 视频硬解**踩坑与面试速记。
- **2026-07-15** 🗂️ 资产管线 — `.gitignore` 排除 `assets/Wallpaper_Presence`、`Wallpaper_Ambience` 与 `*.webm`（约 6 GB 视频不进仓库），通过安装包 / 对象存储分发。
- **2026-07-05** 🪞 镜像发布 — 构建后镜像到 **atomgit**，updater 优先 atomgit 并 GitHub 兜底；新增 release digest 流程。
- **2026-07-02** 🪟 Windows 运行时 — 以 **MinGit** 替换 PortableGit 运行时。
- **2026-06-20** 🖥️ 通用 Markdown 预览 — universal markdown preview chrome 上线。
- **2026-05-23** ⚙️ 自动化 — 新增 plugin automation actions，agents 可直接更新设置。
- **2026-05-21** 📱 移动端 — 改进 mobile titlebar 与键盘布局，bridge sessions 同步进 memory ticker。
- **2026-04** 🏷️ 品牌与重构 — 项目由 `openhanako` 重命名为 **HanaAgent**，数据目录由 `.hanako/HANA_HOME` 迁移为 `.ani/ANI_HOME/aniHome`，并支持 **Node.js 26**（`better-sqlite3` 升级至 `v12.11.1`）。
- **2026-04-03** 🧩 延迟子代理 — deferred subagent、`check-deferred` 工具、plugin card v2、image-gen media routes。
- **2026-04-02** 🖼️ 图像生成 — `image-gen` 从 dreamina 抽取 `TaskStore`（taskId 重命名 + adapterId），新增 deferred result Pi SDK 扩展。
- **2026-03-30** 🔌 PI SDK 升级 — adapter 层 + patch 加固，升级 `PI SDK 0.56.3 → 0.64.0`，bridge 收到消息即发「AgentName 正在输入…」降低体感延迟。
- **2026-03-31** 📌 插件卡片协议 — `<card>` 标签从历史重建 plugin_card blocks，right-click pin/unpin widget 按钮与插件页 tab。
- **2026-02** 🌱 项目创世 — HanaAgent 前身 `openhanako` 起步，致力于把强大的 **Agent 能力**带出命令行，面向每一个坐在电脑前工作的人。

</details>

---

## HanaAgent 是什么

HanaAgent 是一个更加易用的 AI agent，有记忆，有性格，会主动行动，还能多 Agent 在你的电脑上一同工作。

作为助手，Ta 是温柔的：不需要写复杂的配置，不需要理解晦涩的术语。HanaAgent 它不只面向 coder ，而是为每一个坐在电脑前工作的人设计的助手。
作为工具，Ta 是强大的：记住你说过的每一件事，操作你的电脑，浏览网页，搜索信息，读写文件，执行代码，管理日程，还能自主学习新技能。

我开这个项目的初衷是：弥合绝大多数人和 AI Agent 之间的缝隙，让强大的 Agent 能力不再只局限于命令行里。于是我做了比传统 Coding Agent 更多一些的优化：一方面是强化 Agent「像人」的属性，是你和他们沟通更自然；另一方面，因为我本职也是一介文员，所以我也针对日常办公场景做了很多工具性和流程性的优化，敬请探索。
此外，HanaAgent 有比较完备的图形页面。

如果你用过 claude code、codex、Manus 等 CLI 或是图形化的 Agent，你会在 HanaAgent 这里找到熟悉又新奇的感觉。

## 功能特性

**记忆** — 结合主流的记忆方案，自己又发挥了一下，做了个记忆系统，近期的事情记得非常牢固，但目前确实有待优化。

**人格** — 不是千篇一律的"AI 助手"。通过人格模板和自定义人格文件塑造独特的性格，每个 Agent 都有自己的说话方式和行为逻辑，Agent 之间分离做得很好，备份方便，Agent 就是文件夹，后续还会添加备份功能。

**工具** — 读写文件、执行一次性命令或持续终端会话、浏览网页、通过浏览器后端或 API 搜索互联网、截图、分段长截图、媒体预览、检查网页。能力覆盖日常办公的绝大多数场景。也可以通过 server-first CLI 连接同一个 HanaAgent Server，在终端里查看状态、列会话和继续对话。

**SKILLS 支持** — 内置兼容庞大 SKILLS 社区生态，之外，我也做了一些主动的优化：有时候干活之前，Agent 会从 GitHub 安装社区技能，Agent 也可以自己编写并学会新技能，有比较不错的主动性。当然，默认情况给 Agent 做了比较严格的 SKILLS 审核，如果发现 SKILLS 装不上可以自行关闭。

**角色卡与技能包** — Agent 可以导入 / 导出为本地优先的角色卡 zip，按白名单携带人格、头像、可选记忆和 Skills。Skill Bundle 是独立的技能包基础设施，可以在技能管理页分组、拖拽、成组启用，并单独导出为 zip，方便迁移和分享。

**多 Agent** — 创建多个 Agent，各自有独立的记忆、人格和定时任务。Agent 之间可以通过频道群聊协作，也可以互相委派任务。

**书桌** — 每个 Agent 都有自己的书桌，可以放文件、写笺（类似便签，Agent 会主动读取并执行）。支持拖拽操作、文件预览和工作台文件树变更监听，是你和 Agent 之间的异步协作空间。

**全屏媒体查看器** — 聊天里或书桌上的任意图片、SVG、视频，点开就是暗色遮罩的全屏预览：滚轮缩放、拖拽平移，`+` / `−` / `0` 键盘快捷，左右箭头在同会话或同目录的相邻媒体间切换。

**会话管理** — 侧栏支持聊天记录搜索，标题命中优先，必要时继续检索正文；旧会话可以归档后从设置入口恢复或永久删除。聊天正文里的选中文本会进入输入框引用卡片，继续追问时保留原文语境。

**定时任务与心跳** — Agent 可以设置定时任务（Cron），也会定期巡检书桌上的文件变化。当前自动化执行器已经把“什么时候触发”和“做什么”拆开：复杂任务仍让 Agent 后台执行，轻量提醒可以直接发送通知，插件动作也可以被计划调用。

**安全沙盒** — 双层隔离：应用层 PathGuard 四级访问控制 + 操作系统级沙盒（macOS Seatbelt / Linux Bubblewrap / Windows restricted token）。Agent 的权限在你的掌控之中。平时可只读访问系统普通文件，写入和删除限制在工作目录与受控数据目录。Windows 命令沙盒目前是写隔离模型：读取按当前用户权限自然发生，网络也按当前用户网络权限运行；macOS / Linux 的网络隔离仍由对应平台沙盒能力决定。如果你想调整权限，可以在设置 → 安全页面修改沙盒级别；外部网络也可以配置系统代理、手动代理或直连。

**插件系统** — 约定优先的可扩展插件架构。拖拽安装社区插件，插件可以贡献工具、技能、命令、Agent 模板、HTTP 路由、Pi SDK extension、LLM Provider、页面、侧栏 Widget、配置 schema 和后台任务。路由可直接访问核心服务（PluginContext 注入），通过 Session Bus 与 Agent 对话、获取历史、管理 session；插件卡片会进入统一的消息块和历史回放。两级权限模型（restricted / full-access）保障安全，`extensions/`、routes、providers、页面和生命周期能力只在 full-access 插件里生效。

**多平台接入** — 同一个 Agent 可以同时接入 Telegram、飞书、QQ、微信机器人，在任何平台和 Ta 对话，可以远程操作电脑；Bridge 消息会带平台上下文，通知也可以回发到当前外部平台。

**移动端与 LAN 前端** — HanaAgent Server 可以托管 `/mobile/` PWA，手机通过设备访问密钥或本地账号登录，查看会话、继续聊天和管理工作台文件。另一台桌面端也可以通过 LAN URL + access key 连接到已有 HanaAgent Server，继续消费同一套会话和资源。

**国际化** — 界面支持中文、英文、日文、韩文、繁体中文 5 种语言。

## 截图

<p align="center">
  <img src=".github/assets/screenshot-main.jpg" width="100%" alt="HanaAgent 主界面">
</p>

## 快速开始

### 下载安装

**macOS（Apple Silicon / Intel）**：从 [Releases](https://github.com/liliMozi/openhanako/releases) 下载最新 `.dmg`。

应用已通过 Apple Developer ID 签名和公证，macOS 应该可以直接打开。

**Windows**：从 [Releases](https://github.com/liliMozi/openhanako/releases) 下载最新 `.exe` 安装包。

> **Windows SmartScreen 提示：** 安装包暂未经过代码签名，首次运行时 Windows Defender SmartScreen 可能会拦截，点击**更多信息** → **仍要运行**即可，未签名版本的正常现象。

**Linux**：从 [Releases](https://github.com/liliMozi/openhanako/releases) 下载最新 `.AppImage` 或 `.deb`。

### 首次运行

首次启动时，引导向导会带你完成配置：选择语言、输入你的名字、连接模型提供商（API key + base URL），并选择三个模型：**对话模型**（主对话）、**小工具模型**（轻量任务）、**大工具模型**（记忆编译和深度分析）。设置页还可以单独选择**视觉模型**，让文本模型通过 Vision Bridge 处理图片附件。HanaAgent 支持 OpenAI 兼容、Anthropic 风格、OAuth Provider 和 Ollama 本地模型等多类接入。
目前也添加了 OpenAI 的 OAuth 登录，鉴于 Anthropic 会有封号风险，所以暂时不提供。

## 架构

```
core/           引擎编排层 + Manager（含 PluginManager）
lib/            核心库（记忆、工具、沙盒、Bridge 适配器）
server/         Hono HTTP + WebSocket 服务（独立 Node.js 进程）
hub/            调度器、频道路由、事件总线
desktop/        Electron 应用 + React 前端
shared/         跨层共享工具（config schema、error bus、模型引用等）
plugins/        内置系统插件（随应用打包）
skills2set/     内置技能定义
scripts/        构建工具（server 打包、启动器、签名）
tests/          Vitest 测试
```

引擎层协调多个 Manager（Agent、Session、Model、Preferences、Skill、Channel、BridgeSession、Plugin 等），通过统一的 facade 暴露。Hub 负责后台任务（心跳巡检、自动化 / 定时任务、频道路由、Agent 间通信、DM 路由），独立于当前聊天会话运行。

Session 内的用户可见文件通过 `SessionFile` sidecar 统一登记，桌面端、Bridge、Mobile PWA 和其它远程前端按各自能力消费同一份文件身份。各 Bridge adapter 显式声明自己的媒体类型、投递方式与大小限制；插件文件贡献规则见 `PLUGINS.md`。

本机 staged 文件优先由各平台 adapter 直接上传：Telegram / 飞书 / 微信走各自上传接口，QQ 走官方 Bot 分片上传接口，再发送 `msg_type: 7` 富媒体消息。`preferences.bridge.mediaPublicBaseUrl` / `HANA_BRIDGE_PUBLIC_BASE_URL` 只用于仍需公网 URL 的平台或远程 fallback；该 URL 作为 `/api/bridge/media/:token` 临时文件路由的 origin，文件本身仍由短期 token、下载次数和本地路径白名单保护。Hana 不会自动开启公网 tunnel，公网入口必须由用户显式提供。

Server 以独立 Node.js 进程运行（由 Electron spawn 或独立启动），通过 Vite 打包，@vercel/nft 追踪依赖。与 Electron 渲染进程通过 WebSocket 通信。
用户数据目录由 `ANI_HOME` 决定（生产默认 `~/.ani`，开发默认 `~/.ani-dev`）。Hana 管理的 Pi SDK 运行时资源位于 `${ANI_HOME}/runtime/pi-sdk/`；Hana 不依赖 Pi 的全局 agent 目录或 `PI_CODING_AGENT_DIR`。旧版本遗留在 `${ANI_HOME}/.pi/agent/bin/` 的 `fd` / `rg` 只会在首次使用相应搜索工具时复制到新目录，旧文件会原样保留。

## 技术栈

| 层级 | 技术 |
|------|------|
| 桌面端 | Electron 42 |
| 前端 | React 19 + Zustand 5 + CSS Modules |
| 构建 | Vite 7 |
| 服务端 | Hono + @hono/node-server |
| Agent 运行时 | [Pi SDK](https://github.com/badlogic/pi-mono) |
| 数据库 | better-sqlite3（WAL 模式） |
| 测试 | Vitest |
| 国际化 | 5 语言（zh / en / ja / ko / zh-TW） |

## 平台支持

| 平台 | 状态 |
|------|------|
| macOS (Apple Silicon) | 已支持（已签名公证） |
| macOS (Intel) | 已支持 |
| Windows | Beta |
| Linux | 已支持（AppImage / deb） |
| 移动端 (PWA) | v0：同一 HanaAgent Server 的手机会话与工作台访问 |

## 开发

```bash
# 安装依赖
npm install

# Electron 启动（自动构建 renderer）生产式
# 主进程/core 改动	同样需重启
npm start

# 热加载 开发式 自动开（F12 调试）渲染层热更（改 desktop/src/react/** 即时生效）
# 主进程/core 改动	需重启	同样需重启（Electron 主进程不支持热更）
npm run start:dev

# Vite HMR 开发（需先运行 npm run dev:renderer）
npm run start:vite

# 仅启动 server
npm run server

# server-first CLI
npm run cli

# 运行测试
npm test

# 类型检查
npm run typecheck
```

- [官网](https://openhanako.com)
- [提交 Issue](https://github.com/liliMozi/openhanako/issues)
- [安全页](https://github.com/liliMozi/openhanako/security)
- [安全政策](SECURITY.md)
- [插件开发指南](PLUGINS.md)
- [贡献指南](CONTRIBUTING.md)
- [国内 AtomGit 托管](https://gitcode.com/liliMozi/OpenHanako)
