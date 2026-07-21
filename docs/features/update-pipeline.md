# 热更新与发布管线

本页讲解自动更新与数据安全保障，对应 News 中的「热更新管线」「数据目录加固」「更新卡片」。

## 1. Hot-Update Train 发布流水线

`feat(release)` / `feat(build)` / `feat(runtime)` 2026-07-11：

- **artifact-core 库**：提供 `ustar` 安全解压、manifest 验签、指针存储、激活流程。
- 发布产物为**签名 artifact train**，四平台（mac/win/linux）复用同一份构建产物（`feat(build): renderer 热更新归档改为 CI 单点构建`）。
- 激活流程：下载 → 验签 → 指针切换 → 激活，失败可回退。

## 2. 更新行为（用户主导）

- `feat(update): 自动更新只检查不下载`：启动仅检查更新，**不自动下载**。
- 下载与应用改为**用户点击触发**（更新卡片按内容语义呈现，版本显示统一到已激活内容）。
- `feat(update): 崩溃回退后向用户明确提示`：若更新导致崩溃，回退并给出明确提示。

## 3. 更新契约

- `feat(update): 更新契约版本落地为真实门禁与握手`：更新协议版本成为真实门禁，handshake 校验。
- `feat: add release digest and atomgit mirror flow`：构建后生成 release digest，并镜像到 **atomgit**（`feat: prefer atomgit updater with github fallback`）。
- `feat(cli): hana bundle pull/status`：CLI 手动拉取网页前端。

## 4. 首启公告

- `feat(desktop): 升级后首启公告基建`：`NoticeDialog` + release digest 随包展示（`PostUpdateAnnouncement.tsx`）。
- 用户升级后首次启动看到本次更新内容。

## 5. 数据目录加固

`feat(server)` 2026-07-10（详见 [后端核心](../architecture/backend-core.md#6-数据-epoch-与内核互斥)）：

- **data epoch 单调闸**：旧内核拒绝打开新格式数据。
- **内核互斥**：同目录单内核运行（token 探测）。
- **loopback 随机端口 + 自愈**：弃用固定 14500。

## 6. 面试要点

- "为什么自动更新只检查不下载？"——避免静默大流量下载、给用户控制权、降低崩溃回退风险。
- "怎么保证更新包可信？"——manifest 验签 + 指针存储原子切换 + 失败回退。
- "多版本内核怎么防数据损坏？"——data epoch 单调闸 + 内核互斥。
