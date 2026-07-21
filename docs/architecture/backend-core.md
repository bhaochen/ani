# 后端核心（core / server / lib）

本页讲解渲染层背后的业务真源：`core/`（编排）、`server/`（HTTP/WS）、`lib/`（通用能力）。
配合 [架构总览](../architecture/overview.md) 食用。

## 1. HanaEngine —— 薄门面（Facade）

`core/engine.ts` 是后端统一入口，持有一组 Manager 并对外暴露 API，自身不写业务逻辑：

| Manager | 职责 |
| --- | --- |
| `AgentManager` | Agent 的 CRUD / 初始化 / 切换 |
| `SessionCoordinator` | 会话生命周期、列表、能力漂移检测 |
| `ConfigCoordinator` | 配置读写、模型、搜索、utility |
| `ChannelManager` | 频道 CRUD / 成员管理 |
| `BridgeSessionManager` | 外部平台（钉钉等）session |
| `ModelManager` | 模型注册与发现 |
| `PreferencesManager` | 全局偏好 |
| `SkillManager` | 技能注册与同步 |
| `PluginManager` | 插件加载与运行时（见 [插件](./plugins.md)） |

启动顺序：先 `migrateConfigScope` / `migrateToProvidersYaml` 等迁移，再 `runMigrations`，最后组装各 Manager。

## 2. Agent 编排（agent.ts / agent-manager.ts）

- `AgentManager` 管理多个 Agent（如 `hanako`、各内置角色），每个 Agent 有独立配置、性格/身份模板（`lib/identity-templates`、`ishiki-templates`）。
- `agent.ts` 封装单次 Agent 运行：组装 system prompt → 调 `llm-client` → 处理工具调用 → 流式回传。
- `execution-*` 系列（`execution-boundary` / `execution-lease-registry` / `execution-router` / `remote-execution-boundary`）负责**工具执行的边界与租约**：隔离、串行锁、远程执行路由，确保子代理/工具不会互相串扰。

## 3. 会话（session-coordinator.ts）

- 会话是用户与 Agent 对话的上下文单元，持久化在 `~/.ani/` 下的 session 文件（jsonl + manifest）。
- `session-coordinator` 统一管理会话状态演进、健康（`session-health`）、快照（`session-cache-snapshot`）、压缩（`session-compactor`）、归档。
- 支持**项目化会话**（`session-projects`）、跨会话协作（`session-collab`，见 [Subagent 与协作](./subagent.md)）。

## 4. 服务层（server/）

`server/` 是 Electron 主进程 `spawn` 出来的独立 Node 服务，监听本地 `loopback` 随机端口（见 `core/server-port-selection.ts`，弃用固定 14500）。

- `routes/`：REST 路由（`chat.ts`、`sessions.ts`、`agents.ts`、`models.ts`、`providers.ts`、`plugins.ts`、`preferences.ts`、`resource-io.ts`、`session-collab.ts`、`mobile-*` 等）。
- `ws-protocol.ts` / `ws-scope.ts`：WebSocket 流式协议（Agent 回复分片、事件广播）。
- `app-events.ts`：跨进程应用事件（如 `leaves-overlay-changed`、`paper-texture-changed`），经 IPC 转发渲染层。
- `session-stream-store` / `deferred-result-*`：流式会话与延迟结果（deferred subagent）的协调。

## 5. 数据目录与持久化（~/.ani）

- 数据根：`ANI_HOME`（默认 `~/.ani`，旧版 `.hanako`）。见 [数据 epoch 与加固](#6-数据-epoch-与内核互斥)。
- `migrations.ts` / `data-epoch-migrations.ts`：统一数据迁移框架，保证旧数据可平滑升级。
- `preferences-manager.ts`：全局偏好真源，渲染层通过 `syncAppearancePrefs` 同步（见 [跨进程同步](../state/cross-process-sync.md)）。

## 6. 数据 epoch 与内核互斥

为防止多版本内核破坏同一份数据（`feat(server)` 2026-07-10）：

- **data epoch 单调闸**：数据写入带 epoch 版本，旧内核拒绝打开新格式数据。
- **内核互斥**：同一数据目录只允许一个内核运行，通过 token 认证探测抢占。
- **loopback 随机端口 + 运行期自愈**：服务端口不再固定，启动冲突时自愈。

## 7. lib/ 通用能力

| 模块 | 职责 |
| --- | --- |
| `lib/memory` | 记忆系统（见 [记忆](./memory.md)） |
| `lib/desk` | 桌面自动化、心跳、cron 调度（`desk-manager` / `cron-scheduler` / `heartbeat`） |
| `lib/bridge` | 外部平台桥接（钉钉等） |
| `lib/character-cards` | 角色卡（Agent 外观/性格） |
| `lib/agent-review` | Agent 自评/审查 |
| `lib/approval-gateway` | 操作审批网关 |
| `lib/deferred-result-*` | 延迟结果协调 |
| `lib/exec-command` | 命令执行封装 |
| `lib/memory` / `lib/diary` | 记忆 / 日记 |

## 8. 安全模型

- `security-principal.ts` / `security-audit-log.ts`：主体身份与审计日志。
- `resource-access-service` / `resource-ticket-service`：资源访问票据，防越权。
- `plugin-iframe-ticket-service`：插件 iframe 鉴权票据（见 [插件](./plugins.md)）。
- `capability-policy` / `grant-registry`：能力策略与授权登记。
