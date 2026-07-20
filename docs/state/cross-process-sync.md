# 跨进程状态同步

本页讨论"渲染进程 store"与"后端 Server"之间如何保持一致。

## 1. 架构原则

- **Server 是真源**，渲染 store 是缓存 + 乐观层（见 zustand-slices.md §6）。
- 不在两端各自维护权威状态，避免双真源分裂。

## 2. 三种同步模式

### 2.1 拉取（Fetch on mount / poll）
组件挂载或切换会话时，通过 services 调 Server，结果 `set()` 进 store。
适合低频、读多写少的数据（如会话列表）。

### 2.2 流式（Streaming）
长任务（Agent 回复）走 WS，Server 推送分片 → `streaming-slice` 增量更新。
UI 实时显示，无需轮询。

### 2.3 乐观更新（Optimistic）
用户发消息：先 `chat-slice` 插入 user message 与占位 assistant message，
再异步请求 Server；失败则回滚/标错。提升体感响应。

## 3. 一致性保障

- `session-coordinator`（core 侧）统一管理会话状态演进，前端只是镜像。
- 冲突以 Server 为准：乐观更新若被 Server 拒绝，回滚到服务端返回态。
- 失效（invalidation）：`stream-invalidator.ts` 等负责让过期切片重新拉取。

## 4. 本地优先（Local-first）的部分

- 草稿、设置 UI 偏好、陪伴层选择：本地即可生效，异步/懒同步。
- 通过 `*-persistence.ts` 落盘，重启不丢。

## 5. 面试要点

- "为什么不直接把 Server 状态塞进全局？"——网络延迟、离线、竞态；本地缓存 + 乐观更新是标准解法。
- "双真源怎么防分裂？"——明确 Server 权威 + 单向同步（拉取/流式）+ 乐观回滚。
