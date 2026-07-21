# 记忆系统（Memory）

本页讲解 HanaAgent 的记忆流水线，对应 News 中的「记忆流水线」「四段式记忆编辑器」。
核心代码在 `lib/memory/`，编译器入口 `lib/memory/compile.ts`。

## 1. 设计目标

让 Agent「有记忆、有灵魂」：近期的事记得牢，长期事实可沉淀，且**编译成本可控**（≤2000 token 的 `memory.md`）。

## 2. 四层记忆结构

| 文件 | 内容 | 生成方式 |
| --- | --- | --- |
| `today.md` | 当天进行中的会话 | `compileToday()` 实时汇编 |
| `daily/{date}.md` | 已结束那天的两三句话日记 | `compileDaily()`（LLM 摘要，独立指纹缓存） |
| `week.md` | 最近 6 个逻辑日装配 | `assembleWeekFromDaily()`（**零 LLM**，纯文件拼装） |
| `longterm.md` | 长期沉淀事实 | `rollDailyWindow()` / `compileLongterm()` fold 进去 |
| `facts.md` | 重要事实（editable） | `compileEditableFacts()`（增量 + 水位线） |

## 3. 滚动传送带（Rolling Conveyor）

```
session 摘要 → compileDaily → assembleWeekFromDaily → rollDailyWindow → longterm
```

- **逻辑日（logical day）**：按 `DAY_BOUNDARY_HOUR` 划分（`lib/memory/time-context.ts`），不是自然日。
- `rollDailyWindow()`：把滚出窗口的 daily 条目 fold 进 `longterm.md` 后删除源文件，控制体积。
- `assemble()`：同步读四个文件拼成 `memory.md`（≤2000 token），注入 system prompt。

## 4. 增量与水位线

- 周重编译（一次性）改为**滚动每日摘要传送带**（`feat: replace weekly memory recompilation with a rolling daily digest conveyor`）。
- 今日记忆编译**增量**进行，带 `summary watermark`（`feat: make today memory compilation incremental with a summary watermark`）。
- `compileEditableFacts()` 是唯一写 `facts.md` 的路径，editable facts 提升为 canonical facts 管线（`feat: promote editable facts memory to the canonical facts pipeline`）。

## 5. 记忆编辑器

`feat: add a four-section memory editor` —— 用户可编辑记忆，分**按天 / 周**条目，写入 `facts` / `daily` / `week` / `longterm` 各段。

## 6. 相关模块

- `memory-search.ts`：记忆检索（语义/关键词）。
- `memory-reflection-runner.ts`：记忆反思（蒸馏为长期洞察）。
- `pinned-memory-store.ts`：置顶记忆（不被滚动窗口淘汰）。
- `memory-ticker.ts`：记忆心跳（定期摘要/同步，bridge sessions 也同步进 ticker）。
- `compiled-memory-snapshot.ts` / `cache-snapshot-observation.ts`：编译快照与缓存观察，保证幂等。

## 7. 面试要点

- "如何控制记忆 token 成本？"——分层 + 滚动窗口 fold 长期化 + 纯文件装配 week（省 LLM）+ 2000 token 上限。
- "为什么不用一次性周重编译？"——增量传送带更稳、可断点续编、避免重复 LLM 开销。
