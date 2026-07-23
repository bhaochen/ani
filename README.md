# Ani: Always Near intuitively You

![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Electron](https://img.shields.io/badge/-Electron-47848F?style=flat-square&logo=electron&logoColor=white)
![npm](https://img.shields.io/badge/-npm-CB3837?style=flat-square&logo=npm&logoColor=white)
![Arch Linux](https://img.shields.io/badge/-Arch%20Linux-1793D1?style=flat-square&logo=arch-linux&logoColor=white)

<div align="center">
  <img src="assets/Companion/Talk.png" alt="Ani" width="80%">
</div>

## 📢 News

- **2026-07-17** 🍃 Companion polish — Fixed `LeavesOverlay` not showing because `*.webm` was paired with `<source type="video/mp4">`; reverted to `leaves-overlay.mp4`. The **leaf-shadow** overlay (Settings → Interface → Appearance → "Sunny Mode") now renders correctly.
- **2026-07-17** 🖥️ Default workspace rename — Default directory changed from `OH-WorkSpace` to `ANI-WorkSpace` (`~/Desktop/ANI-WorkSpace`); migrate the old dir manually via `mv`, no built-in auto-migration.
- **2026-07-17** 🎴 Seamless wallpaper switching — Introduced **ready-gated two-slot crossfade** (`WallpaperLayer`): the new video is promoted to active only after `canplay`/`playing`; `READY_TIMEOUT_MS=4000` fallback keeps the old layer playing so mode/slot switches **never go black**. Fixed B-mode (Creation) never becoming ready due to a `currentSrc==''` early bail.
- **2026-07-17** 🔘 Companion mode rail — Added a single-row **segmented control** (Daily / Creation / Thinking) in the left sidebar (Companion tab), styled like the top tab bar and channel bottom bar, driven by `ui-slice`'s `companionMode`.
- **2026-07-17** ⛶ Immersive expand — **Apple-minimal glassmorphism** button at the bottom-right of the companion page (↗/↙ arrows, `opacity:0.5` at rest, reveal on hover, `rotate(90deg)`), toggling `.expanded` (`position:fixed; inset:0; z-index:1000`).
- **2026-07-17** 🎥 Video decode stability — On **NVIDIA + Wayland**, disabled `disable-accelerated-video-decode` and enabled `enable-unsafe-swiftshader` to force **software decode** (AV1/VP9), avoiding NVDEC/VAAPI `vaEndPicture failed` freezes; wallpaper sources transcoded from `H.264` to `AV1 .webm`.
- **2026-07-17** 🧩 Region fault tolerance — `CompanionPage` stays mounted (`visibility:hidden` instead of `display:none`) to preserve the decode context; R-layers cycle on ambient-audio `ended` (R1→R2→R3) while the video always `loop`s (no remount), fixing a TDZ crash and black frames.
- **2026-07-12** 🚀 Hot-update pipeline — Added a **hot-update train** release pipeline (`artifact-core` lib: safe ustar extract / manifest verify / pointer store / activation); auto-update now **checks but does not download**, with download/apply triggered by the user; clear prompt after a crash rollback.
- **2026-07-10** 🔒 Data-directory hardening — `data epoch` monotonic gate rejects old kernels opening new-format data; single-kernel mutual exclusion via token probe; random `loopback` port with runtime self-healing, dropping the fixed default `14500`.
- **2026-07-10** 🤝 Cross-Session Collaboration v0 — Tool read/write sides, draft mounting, single delivery point (idle commit / running insert / race fallback), draft confirmation cards and agent-source message cards, bridge snapshot pruning and classification.
- **2026-07-08** 🔎 In-conversation search — `Cmd+F` in-conversation find bar + message-level hit route (`/api/sessions/find`); hits jump to the best-match message; `chat-find` slice manages keyed find state and locate intent.
- **2026-07-07** 📰 Newsprint typography — Markdown preview switched to a **newsprint** baseline grid with `PT Serif` metrics (`--tool-bg` deepened one notch across all themes); reading defaults moved to newsprint metrics.
- **2026-07-04** 🧠 Memory pipeline — Replaced weekly recompilation with a **rolling daily-digest conveyor**; today's memory compiles incrementally with a summary watermark; added a four-section memory editor (day/week entries); editable facts promoted to the canonical facts pipeline.
- **2026-06-28** 📝 Universal Markdown editor — `EditorContextMenu` internalized into `PreviewEditor` for universal coverage with a rounded format toolbar; block-level **drag handles**, batch block actions, and **marquee selection**.
- **2026-06-22** 🧩 Plugin system expansion — `native chat surface cards`, resource-watch helpers, stabilized SDK discovery and dev loop; `resource-io` unified remote resource preview access with authority audit.
- **2026-06-21** 📡 Resource-IO backend subscription — `resource-io` provider dispatch layer + backend subscription API; file tools and watches converged; workbench mutation events (add/delete/rename) drive preview reload.
- **2026-06-21** 💬 DingTalk bridge — Added a **DingTalk bridge adapter** and kept extending the **Plugin Card Protocol** (iframe cards rendered from `tool_end`, auto-injected `pluginId`).
- **2026-05-31** 🤖 Subagent reuse — Single subagent **reuse instance** (`reuseKey` + `resume` + serial lock), per-session scope so conversations don't cross-contaminate; right-side subagent card mimics a group chat (agent row + click-to-expand live stream).
- **2026-05-30** 🔧 Three-stage refactor — Unified the **Agent Activity source of truth** into `ActivityHub`; Workflow became a per-agent tool toggle (off by default) wired into the agent.
- **2026-05-25** 🏷️ Distribution rename — Distribution surface renamed to **HanaAgent**; refactored image-gen providers; added onboarding memory setup and session search/archive entries.
- **2026-04-08** 🗃️ Unified migration framework — Consolidated the data-migration framework (`fix #356` dangling provider refs); model references moved to the `(provider, id)` **composite key**.
- **2026-04-01** 🔌 Plugin compatibility — `minAppVersion` check skips incompatible plugins; **deepseek/qwen** provider-compat submodules with reasoning-content fallback extraction.
- **2026-03-31** 🧩 Plugin UI panels — Plugins can declare **page tab + sidebar widget** dual contributions; `PluginPageView`/`PluginWidgetView` + dynamic `ChannelTabBar`/`WidgetButtons`, `plugin-ui` slice and initialization.
- **2026-03-29** 🎨 Image-gen system plugin — `image-gen` system plugin + `MediaTab` settings page + provider model-type support; plugin route context and session bus carry `agentId`.

<details>
<summary>Earlier news</summary>

- **2026-07-15** 📝 Modular developer docs — Added `docs/` (architecture / desktop / renderer / state / features / workflow / study) based on the actual code, including the **NVIDIA+Wayland video-decode** gotcha and an interview cheat-sheet.
- **2026-07-15** 🗂️ Asset pipeline — `.gitignore` excludes `assets/Wallpaper_Presence`, `Wallpaper_Ambience`, and `*.webm` (~6 GB of video kept out of the repo), distributed via installer / object storage.
- **2026-07-05** 🪞 Mirror releases — Mirror builds to **atomgit** after build; updater prefers atomgit with GitHub fallback; added release-digest flow.
- **2026-07-02** 🪟 Windows runtime — Replaced PortableGit runtime with **MinGit**.
- **2026-06-20** 🖥️ Universal Markdown preview — Universal markdown preview chrome shipped.
- **2026-05-23** ⚙️ Automation — Added plugin automation actions; agents can update settings directly.
- **2026-05-21** 📱 Mobile — Improved mobile titlebar and keyboard layout; bridge sessions synced into the memory ticker.
- **2026-04** 🏷️ Rebrand & refactor — Project renamed from `openhanako` to **HanaAgent**; data dir migrated from `.hanako/HANA_HOME` to `.ani/ANI_HOME/aniHome`; added **Node.js 26** support (`better-sqlite3` upgraded to `v12.11.1`).
- **2026-04-03** 🧩 Deferred subagent — deferred subagent, `check-deferred` tool, plugin card v2, image-gen media routes.
- **2026-04-02** 🖼️ Image generation — `image-gen` `TaskStore` extracted from dreamina (taskId rename + adapterId); added deferred-result Pi SDK extension.
- **2026-03-30** 🔌 PI SDK upgrade — Adapter layer + patch hardening; upgraded `PI SDK 0.56.3 → 0.64.0`; bridge sends "AgentName is typing…" on message receipt to reduce perceived latency.
- **2026-03-31** 📌 Plugin Card Protocol — Rebuild `plugin_card` blocks from `<card>` tags in history; right-click pin/unpin for widget buttons and plugin page tabs.
- **2026-02** 🌱 Project genesis — HanaAgent's predecessor `openhanako` began, aiming to bring powerful **Agent capability** out of the terminal for everyone working at a computer.

</details>

## ✨ Features

> [!TIP]
> **Ani** is an AI agent with memory and personality that acts on its own initiative — and can run multiple Agents together on your computer.
>
> As a companion, it is gentle: no complex setup, no cryptic jargon. Ani is built not just for coders, but for everyone who works at a computer.
>
> As a tool, it is powerful: it remembers everything you say, operates your machine, browses the web, searches information, reads and writes files, runs code, manages your schedule, and even learns new skills on its own.
>
> The original intent was to close the gap between ordinary people and AI Agents — to take that power out of the terminal. Beyond a typical coding agent, Ani strengthens the "human" side of interaction and, drawing on my own office work, optimizes many tooling and workflow details for daily knowledge work. Explore and enjoy.
>
> Ani also ships a complete graphical interface.

### 🤖 Agent & Personality
- 🧠 **Memory** — A memory system that blends mainstream approaches with custom refinements; recent events are remembered firmly (long-term recall still being optimized).
- 🎭 **Personality** — Not a generic "AI assistant". Personality templates and custom personality files shape a distinct character per Agent — its own voice and behavior logic. Agents are well-isolated, easy to back up (an Agent *is* a folder), with backup tooling on the way.
- 👥 **Multi-Agent** — Create multiple Agents, each with its own memory, personality, and scheduled tasks. Agents collaborate through channel group chats or delegate tasks to one another.

### 🛠️ Capabilities
- 🧰 **Tools** — Read/write files, run one-shot commands or persistent terminal sessions, browse the web, search the internet via a browser backend or APIs, capture screenshots and long scrolling captures, preview media, and inspect pages. Covers the vast majority of daily-office scenarios. A server-first CLI can connect to the same HanaAgent Server to check status, list sessions, and continue conversations from the terminal.
- 🧩 **Skills** — Built-in compatibility with the broad SKILLS community ecosystem, plus proactive optimizations: an Agent can install community skills from GitHub before a task, and can author and learn new skills on its own. Skills review is strict by default; you can disable it if installation is blocked.
- 🃏 **Character Cards & Skill Bundles** — Agents import/export as local-first character-card zips, carrying persona, avatar, optional memory, and Skills via an allowlist. Skill Bundles are standalone skill-pack infrastructure: group, drag, enable in batches, and export individually as zip for migration and sharing.
- 🗂️ **Desk** — Every Agent has its own desk for files and notes (sticky-like; the Agent proactively reads and acts on them). Drag-and-drop, file preview, and workbench file-tree change watching make it an async collaboration space between you and the Agent.
- 🔍 **Full-screen Media Viewer** — Any image, SVG, or video in chat or on the desk opens in a dark-masked full-screen preview: scroll to zoom, drag to pan, `+`/`-`/`0` shortcuts, and arrow keys to move between adjacent media in the same session or folder.

### 💬 Sessions & Automation
- 💬 **Session Management** — Sidebar search prioritizes title hits, then falls back to message bodies; archive old sessions and restore or permanently delete them from Settings. Selected text in a message becomes a quote card in the input, preserving context when you follow up.
- ⏰ **Scheduled Tasks & Heartbeat** — Agents run Cron schedules and periodically inspect desk file changes. The automation executor now separates *when* from *what*: complex jobs still run in the Agent's background, lightweight reminders send notifications directly, and plugin actions can be scheduled too.

### 🔐 Security & Extensibility
- 🛡️ **Security Sandbox** — Two-layer isolation: app-level PathGuard four-tier access control plus OS-level sandboxing (macOS Seatbelt / Linux Bubblewrap / Windows restricted token). The Agent's permissions stay in your hands — read-only to ordinary files by default, writes/deletes confined to the work dir and controlled data dir. Windows uses a write-isolation model; adjust the level in Settings → Security. External network can use a system proxy, manual proxy, or direct connection.
- 🧩 **Plugin System** — Convention-first extensible architecture. Drag to install community plugins; plugins contribute tools, skills, commands, Agent templates, HTTP routes, Pi SDK extensions, LLM Providers, pages, sidebar Widgets, config schema, and background tasks. Routes reach core services directly (via injected `PluginContext`) and talk to Agents through the Session Bus. A two-tier permission model (restricted / full-access) keeps things safe.

### 🌐 Platforms & Reach
- 🌐 **Multi-platform Bridge** — The same Agent connects to Telegram, Feishu, QQ, and WeChat bots at once — talk to it on any platform and operate your computer remotely. Bridge messages carry platform context, and notifications can echo back to the active external platform.
- 📱 **Mobile & LAN Frontend** — The HanaAgent Server hosts a `/mobile/` PWA; phones log in via device access key or local account to view sessions, continue chatting, and manage workbench files. Another desktop connects over LAN URL + access key to the same Server and shares the same sessions and resources.
- 🌍 **Internationalization** — UI in 5 languages: Chinese, English, Japanese, Korean, and Traditional Chinese.

## 🚀 Quick Start

```bash
git clone https://github.com/chenbhao/ani.git && cd ani

hf download chenbhao/ani-assets \
    Wallpaper_Ambience \
    Wallpaper_Presence \
    --repo-type bucket \
    --local-dir assets

# 安装依赖 npm ci 完全按照版本
npm install

# Electron 启动（自动构建 renderer）生产式
# 主进程/core 改动	同样需重启
npm start

# check ~/.ani and ~/.ani-dev

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

On first launch, the **onboarding wizard** helps you pick a language, enter your name, connect a model provider (API key + base URL), and choose **three models** — a **chat model** (main conversation), a **small-tool model** (lightweight tasks), and a **large-tool model** (memory compilation & deep analysis). The Settings page can also pick a **vision model** so a text model processes images via the **Vision Bridge**. HanaAgent supports OpenAI-compatible, Anthropic-style, OAuth, and Ollama local providers; OpenAI OAuth login was added, while Anthropic-style OAuth is **not offered for now** (account-ban risk).

> Details on provider types, the three-model split, and Vision Bridge: **[docs/features/providers.md](./docs/features/providers.md)**.

## 🏗️ Architecture

Ani is a three-part system: an **Electron desktop shell**, a standalone **Node.js backend** (`core/` + `server/`, the source of truth), and a **React renderer**. The engine layer coordinates Managers (Agent, Session, Model, Preferences, Skill, Channel, BridgeSession, Plugin, …) behind a single facade; `hub/` owns background work (heartbeat, automation/scheduled tasks, channel routing, inter-Agent messaging) independent of the active chat.

User-visible session files are registered uniformly via a `SessionFile` sidecar so the desktop client, Bridges, the Mobile PWA, and other remote frontends share one file identity. The Server runs as its own Node.js process (spawned by Electron or standalone), bundled with Vite + `@vercel/nft`, talking to the renderer over WebSocket. User data lives under `ANI_HOME` (production `~/.ani`, dev `~/.ani-dev`).

> Full details — repository layout, cross-surface file identity, Bridge media flow, and the `ANI_HOME` / Pi SDK layout — are in **[docs/architecture/overview.md](./docs/architecture/overview.md)** and **[docs/architecture/backend-core.md](./docs/architecture/backend-core.md)**.

## 🧰 Tech Stack & Platforms

| Layer | Technology |
| --- | --- |
| Desktop shell | Electron 42 |
| Frontend | React 19 + Zustand 5 + CSS Modules |
| Build | Vite 7 |
| Server | Hono + `@hono/node-server` |
| Agent runtime | [Pi SDK](https://github.com/badlogic/pi-mono) |
| Database | `better-sqlite3` (WAL mode) |
| Tests | Vitest |
| i18n | 5 languages (zh / en / ja / ko / zh-TW) |

**Platform support:** macOS (Apple Silicon, signed & notarized) · macOS (Intel) · Windows (Beta) · Linux (AppImage / deb) · Mobile PWA (v0, same-server access).

> Versions, platform status, and LAN/Mobile notes: **[docs/architecture/tech-stack.md](./docs/architecture/tech-stack.md)**.
