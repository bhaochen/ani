# Subagent 与跨会话协作

本页讲解子代理（Subagent）复用机制与跨 Session 协作（session-collab），对应 News 中的
「Subagent 复用」「三段式重构」「跨 Session 协作 v0」。

## 1. Subagent 复用实例

`feat(subagent)` 2026-05-31 引入**单 subagent 复用实例**：

- 每个 subagent 用 `reuseKey` 标识；同一 `reuseKey` 的调用复用同一实例（带 `resume` 续接 + **串行锁**），避免重复冷启动。
- **per-session 作用域**：复用实例绑定到当前会话，不同对话各自独立、**互不串味**。
- 复用实例后缀显示在子助手卡片（聊天流 + 右侧活动卡）。
- `executeIsolated` 加 `resume` 续接能力，是 subagent 复用的基础。

## 2. 三段式重构（ActivityHub）

`feat: 改造三阶段` 2026-05-30 统一 **Agent Activity 真相源**为 `ActivityHub`（`lib/activity-hub.ts`）：

- 之前活动数据散落多处，重构后所有活动事件经 ActivityHub 单一数据链汇聚。
- 右侧 subagent 卡复刻**群聊**形态（agent 行 + 点击展开实时流）。

## 3. 跨 Session 协作（session-collab v0）

`feat(session-collab)` 2026-07-10 落地跨会话协作，核心文件 `core/bridge-session-manager.ts` 与 `server/routes/session-collab.ts`：

- **工具读侧**：`manual` / `list` / `read` 读取目标 session 内容。
- **工具写侧**：`draft` 挂载、提取器与 `apply` 路由。
- **投递单点**：空闲提交 / 跑动插入 / 竞态兜底，保证跨会话消息不重复不乱序。
- **草稿**：one-shot 存储；发送/创建走**草稿确认卡**。
- **来源标记**：`ChatMessage.origin` 记录消息来自哪个 session，透出到历史与实时事件。
- **工具装配**：subagent 拦截、bridge 快照裁剪与分类登记。

## 4. 延迟结果（Deferred Subagent）

- `feat: deferred subagent` / `check-deferred` 工具：subagent 结果可**延迟返回**，不阻塞主流程。
- 协调逻辑在 `lib/deferred-result-*`（coordinator / store / notification / payload）与 `server/deferred-result-*`。
- 与 Plugin Card v2 协同（`feat: deferred subagent, plugin card v2`）。

## 5. 面试要点

- "subagent 复用怎么防串味？"——per-session 作用域 + reuseKey 串行锁 + resume 续接。
- "跨会话协作怎么保证一致性？"——投递单点（空闲/跑动/竞态兜底）+ origin 标记 + draft 确认卡。
- "延迟结果有什么用？"——长任务不阻塞主对话，结果就绪后通过卡片/事件回灌。
