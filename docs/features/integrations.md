# 资源 IO、移动端与语音

本页汇集若干周边能力：工作区资源监听、移动端、语音识别、桌面自动化。

## 1. 资源 IO（resource-io）

`feat(resource-io)` 2026-06-21 起，核心 `core/resource-service.ts` / `resource-access-service.ts` 与 `server/routes/resource-io.ts`：

- **provider 调度层**：`feat(resource-io): add provider dispatch layer` —— 统一资源读写后端。
- **后端订阅 API**：`feat(resource-io): add backend subscription api` —— 渲染层可订阅资源变更。
- **文件工具收敛**：`feat(resource-io): converge file tools and watches` —— 文件工具与 watch 统一。
- **workbench 变更事件**：emit/receive 增删改/重命名事件，驱动预览重载（`reload viewer from resource events`）。
- **权威审计与同步**：`feat(resource-io): add authority audit and sync catch-up` —— 资源权限审计与落后补同步。
- `feat(resource-io): unify remote resource preview access`：统一远端资源预览访问。
- 与插件协作：插件可注册 **resource watch helpers**（`feat(plugin): add resource watch helpers`）。

## 2. 移动端（Mobile）

`feat` 2026-05-21 等：

- `server/routes/mobile-static.ts` / `mobile-workbench.ts`：移动端静态资源与 workbench 接口。
- 改进 mobile titlebar 与键盘布局（`feat: improve mobile titlebar and keyboard layout`）。
- bridge sessions 同步进 memory ticker。

## 3. 语音识别（Speech Recognition）

- `core/speech-recognition/` + `core/speech-recognition-service.ts`：语音识别服务。
- `server/routes/speech-recognition.ts`：语音 REST 路由。
- 多语言支持（zh-CN / zh-TW 等），TTS 由 provider/插件提供。

## 4. 桌面自动化（Desk）

`lib/desk/`：

- `desk-manager.ts`：桌面自动化总控。
- `cron-scheduler.ts` / `cron-store.ts`：定时任务（cron）。
- `heartbeat.ts`：心跳（默认间隔 `DEFAULT_HEARTBEAT_INTERVAL_MINUTES`，见 `shared/default-workspace-constants.ts`）。
- `agent-run-automation.ts` / `automation-executors.ts` / `automation-normalizer.ts`：自动化执行与归一。
- `permissions.ts`：自动化权限。
- 对应 UI：`desktop/src/react/components/desk/`、`AutomationPanel.tsx`、`desk/DeskSection.tsx`。

## 5. 桥接（Bridge）

- `lib/bridge/` + `core/bridge-session-manager.ts`：外部平台桥接。
- `feat: add DingTalk bridge adapter`：钉钉桥接。
- bridge 收到消息即发「AgentName 正在输入…」降低体感延迟（`feat: bridge 收到消息立刻发送`）。

## 6. 面试要点

- "资源 IO 订阅有什么用？"——文件变更实时驱动预览/索引刷新，无需轮询。
- "桌面自动化如何鉴权？"——`lib/desk/permissions.ts` 控制自动化动作权限，cron 持久化。
