# Markdown 编辑器与预览

本页讲解内置的 Markdown 编辑/预览能力，对应 News 中的「通用 Markdown 编辑器」「批量块操作」「marquee 选区」「报刊式排版」。

## 1. 通用预览（PreviewEditor）

- `feat: add universal markdown preview chrome` / `feat: universal markdown preview chrome`：统一 Markdown 预览外壳。
- `desktop/src/react/components/PreviewEditor.tsx` 是核心编辑器组件，`PreviewPanel.tsx` 承载面板。
- `feat(editor): add draggable Markdown block handles`：块级**拖拽手柄**，可重排块。

## 2. 块操作（Block Ops）

- `feat(editor): add batch Markdown block actions`：批量块操作（多选后统一处理）。
- `feat: add markdown block marquee selection`：**marquee 选区**——框选多个 Markdown 块。
- `feat(editor): align blockquote Grabber` / `copy raw Markdown block selections`：块级 Grabber 对齐与复制原始 Markdown。
- 块级交互加固（`d673e9a2` 等）：drop 指示器锚定文档、几何对齐、圆角矩形工具条。

## 3. 报刊式排版（Newsprint）

`feat(typography)` 2026-07-07：

- Markdown 预览改用 **newsprint 基线网格**（`newsprint baseline-grid structure`）。
- 字体度量切换为 `PT Serif`（`--tool-bg` 全主题加深一档，非任务语义借用 `--overlay-subtle`）。
- reading 默认切换为报刊指标（reading defaults switch to newsprint metrics）。
- `feat(preview): rhythm snap for tables and code blocks`：表格与代码块节奏对齐。

## 4. 上下文菜单

- `feat(editor): add markdown editor context menu`：编辑器右键菜单，含格式工具条。
- `feat: internalize EditorContextMenu into PreviewEditor for universal coverage`：菜单内化为 PreviewEditor 通用覆盖。

## 5. 任务族形态

- `feat(chat)`：任务族卡片收敛（Subagent/Workflow 卡用同一容器），工具条去 accent 竖线/呼吸点，四角圆角矩形。
- `ChatResourceCard` 支持 `task` variant，连续 Subagent 卡融合。

## 6. 相关

- 编辑器与 [Subagent](./subagent.md) 的卡片形态、`ChatResourceCard` 共享设计语言。
- 代码块/表格渲染依赖 `markdown-it`（含 `markdown-it-task-lists` 复选框渲染）。

## 7. 面试要点

- "块级编辑怎么保证不破坏原始 Markdown？"——选区/拖拽操作作用于 AST 块边界，复制走 raw Markdown，渲染与源码解耦。
- "报刊排版的意义？"——长文阅读舒适度（基线网格 + 衬线字体 + 节奏对齐），区别于代码型 UI。
