# 状态管理（Zustand Slice 模式）

本页讲解 `desktop/src/react/stores/` 的状态组织方式，偏"设计模式"。

## 1. 总体设计

- 使用 **Zustand**（轻量、无 Provider 包裹、按需 selector 订阅）。
- 状态按**领域切片（slice）**拆分，再组合进一个根 store（`index.ts`）。
- 每个 slice 通常配套 `*-slice.ts`（状态+action 定义）与 `*-actions.ts`（异步 action）。

## 2. 典型 slice 清单（节选）

| slice | 关注点 |
| --- | --- |
| `ui-slice` | UI 全局态：当前 tab、陪伴模式/层、弹层 |
| `chat-slice` / `chat-types` | 对话消息、流式 |
| `session-slice` | 会话列表/当前会话 |
| `agent-slice` / `agent-activity-slice` | Agent 与活动 |
| `model-slice` | 模型选择 |
| `settings-modal-actions` | 设置弹层 |
| `plugin-ui-slice` | 插件 UI 状态 |
| `toast-slice` | 全局提示 |
| `input-slice` | 输入框草稿（带持久化） |

## 3. 一个 slice 的写法（模式）

```ts
// ui-slice.ts
interface UiSlice {
  companionMode: "A" | "B" | "C";
  companionRLayer: "R1" | "R2" | "R3";
  setCompanionMode: (m: UiSlice["companionMode"]) => void;
  setCompanionRLayer: (r: UiSlice["companionRLayer"]) => void;
}
```

- 同步 action 直接定义在 slice 内。
- 复杂/异步流程抽到 `*-actions.ts`，通过 `get()` / `set()` 读写。
- 跨 slice 协作通过根 store 的 `getState()` 互调，避免循环依赖。

## 4. 为什么用 slice 而非单一大 store？

- **可维护性**：每个领域独立文件，diff 清晰。
- **按需订阅**：组件用 selector 只订阅关心的字段，减少重渲染。
- **可测试**：单个 slice 可独立初始化与断言。
- **懒组合**：根 store 在 `index.ts` 用 `create(...combine(slices))` 组合。

## 5. 持久化

- 草稿类（`input-slice`）通过 `input-draft-persistence.ts` 落盘（localStorage / 文件）。
- 设置类通过 `settings` 相关 action 同步到后端/本地配置。
- 陪伴层等瞬时 UI 态**不持久化**（刷新即默认）。

## 6. 与 Server 的关系

- store 是**客户端缓存 + 乐观更新**层。
- 真源（source of truth）在 Server（`core/`、`server/`）。
- 渲染进程通过 services 拉取后写入 store；用户操作先写 store（乐观），再异步同步到 Server。
