# 插件系统（Plugins）

本页讲解 HanaAgent 的插件架构：插件能贡献什么、如何隔离运行、以及内置插件示例。
契合 News 中的「Plugin UI 面板」「Plugin Card Protocol」「插件体系扩充」。

## 1. 插件能贡献什么

插件通过 **SDK**（`packages/plugin-sdk` + `packages/plugin-protocol` + `packages/plugin-runtime` + `packages/plugin-components`）声明两类 UI 贡献：

- **Page Tab**：在 ChannelTabBar 中新增一个独立页面（`PluginPageView`）。
- **Sidebar Widget**：在标题栏/侧边栏挂小组件（`PluginWidgetView`、`WidgetButtons`）。

同时插件可贡献：
- **工具（tools）**：Agent 可调用的自定义工具。
- **技能（skills）**：随插件自动启用（`plugin skill 跟随插件自动启用`）。
- **资源监听（resource watch）**：监听工作区文件变更（见 `core/plugin-dev-service.ts`）。

## 2. 插件加载与运行时

- `core/plugin-manager.ts`：扫描插件、加载 page/widget UI 贡献、装配工具与技能。
- `core/plugin-context.ts` / `plugin-route-request-context.ts`：注入插件上下文（含 `sessionPath`、当前 `agentId`）到路由与工具执行。
- `core/plugin-dev-service.ts` / `plugin-dev-tools.ts`：开发期热重载与调试循环（`feat(plugin): stabilize SDK discovery and dev loop`）。
- `core/plugin-asset-session-service.ts` / `plugin-surface-session-service.ts`：插件的资产与会话生命周期。
- `minAppVersion` 检查：加载时跳过不兼容插件（`feat: minAppVersion check`）。

## 3. 隔离与安全（iframe 票据）

插件 UI 跑在**独立 iframe 沙箱**，不能直接访问主进程。鉴权靠 **iframe ticket**：

- `core/plugin-iframe-ticket-service.ts` 签发 `PluginIframeTicket`：
  - 绑定 `pluginId` + `surfacePath` + `principalId`。
  - TTL 默认 5 分钟（`DEFAULT_PLUGIN_IFRAME_TICKET_TTL_MS`）。
  - 用持久化的 ticket key（`plugin-iframe-ticket-key`）签名，伪造/过期即 `PluginIframeTicketError`（403）。
- 渲染进程经 preload 受限 API + ticket 调主进程，越权访问被拒。

## 4. Plugin Card Protocol

插件工具结果可渲染为富卡片（`feat: Plugin Card Protocol`）：

- 工具返回 `details.card` 时，渲染层从历史 `<card>` 标签重建 `plugin_card` 块。
- 系统自动注入 `pluginId` 到工具结果。
- v2 支持 deferred（延迟）结果卡片（`feat: deferred subagent, plugin card v2`）。

## 5. 内置插件（plugins/）

| 插件 | 能力 |
| --- | --- |
| `image-gen` | 图像生成系统插件（见 [图像生成](#6-图像生成-image-gen)） |
| `beautify` | 输出美化（默认开启） |
| `media` | 媒体处理 |
| `office` | 办公文档处理 |
| `mcp` | Model Context Protocol 接入 |
| `jimeng-cli` | 即梦 CLI 封装 |

## 6. 图像生成（image-gen）

- `feat(image-gen)`：系统插件 + `MediaTab` 设置页 + provider 模型类型支持。
- `image-gen` 的 `TaskStore` 从 dreamina 抽取（taskId 重命名 + adapterId），支持异步任务轮询（`lib/agent-review` 等协作）。
- provider 重构（`feat: refactor image generation providers`）统一多供应商接入。

## 7. 开发插件

- `core/plugin-dev-service.ts` 提供本地插件发现与 dev 循环上下文。
- 插件源码放 `plugins/<name>/`，经 `packages/plugin-sdk` 的类型与运行时契约开发。
- 调试：开发模式热重载，无需重新打包。

## 8. 面试要点

- "插件为什么用 iframe？"——进程/上下文隔离，避免插件 JS 污染主应用、越权访问 DOM/主进程。
- "iframe 怎么鉴权？"——短期签名票据（pluginId+surface+principal+TTL），伪造/过期拒绝。
- "插件能贡献哪些 UI？"——page tab + sidebar widget，外加工具与技能。
