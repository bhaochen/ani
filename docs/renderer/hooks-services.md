# 自定义 Hooks 与服务层

本页记录渲染进程中"逻辑复用"的两种主要方式：自定义 hooks 与 services 层。

## 1. services/ 层

`desktop/src/react/services/` 是渲染进程访问外部世界的**唯一抽象层**：

- 包装对 Server 的 HTTP/WS 调用。
- 包装对 `window.electronAPI`（preload）的 IPC 调用。
- 处理重试、超时、错误归一化。

好处：组件不直接耦合传输细节；Web 模式可替换为 mock 实现。

## 2. 自定义 Hooks（hooks/）

常见模式：

- **数据获取 hook**：封装"请求 → 写 store → 返回 loading/error"。
- **订阅 hook**：订阅 store 切片或 Server 事件流。
- **副作用 hook**：如媒体播放状态、可见性、键盘快捷键。

示例（概念）：

```tsx
function useCompanionMode() {
  const mode = useUiStore((s) => s.companionMode);
  const setMode = useUiStore((s) => s.setCompanionMode);
  return [mode, setMode] as const;
}
```

## 3. 视频播放的 hook 化

陪伴页的"双槽位就绪门控交叉淡入"逻辑（见 features/companion.md）封装在组件内，
但可提取为 `useWallpaperCrossfade` 类 hook：管理两个 `<video>` 槽位、监听 `canplay/playing`、
超时降级。这能把"时序/容错"与"UI 渲染"解耦，便于单测。

## 4. 测试

`vitest` 覆盖 hook 与纯逻辑（如交叉淡入的槽位选择、超时兜底）。
组件测试用 `@testing-library/react` 验证渲染与交互。
