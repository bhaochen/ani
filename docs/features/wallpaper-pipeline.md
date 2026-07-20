# 壁纸 / 氛围视频资产管线

本页记录视频资产从源文件到运行的工程链路（与 companion.md 互补，偏"资产/构建"）。

## 1. 资产来源与体积

- 源：`assets/Wallpaper_Presence/*.mp4`（H.264），约 36 个，**总计 ~6 GB**。
- 氛围：`assets/Wallpaper_Ambience/*.mp3`（音频），~89 MB。
- 叠加：`desktop/src/assets/textures/leaves-overlay.webm`。

## 2. 为何转码为 AV1 .webm

- 软件解码（见 desktop/gpu-video.md）下，AV1 在目标机器（NVIDIA+Wayland）稳定。
- `.webm` 体积远小于 `.mp4`，利于本地分发。
- Electron 内置 Chromium 支持 AV1 软件解码。

转码（用户侧，非仓库）：

```
ffmpeg -i Wallpaper_Presence/x.mp4 -c:v av1_nvenc -b:v 2M -c:a libopus x.webm
```

## 3. 资产不进 Git

- `.gitignore` 排除 `assets/Wallpaper_Presence`、`assets/Wallpaper_Ambience`、`*.webm`。
- 原因：GitHub 单文件 100 MB 上限、仓库 ~1 GB 软上限，6 GB 资产不可能入库。
- 发行：安装包 / 对象存储分发，`assets/README` 说明获取方式。

## 4. 代码如何引用

- 渲染进程用 Vite 的 `import` 引入资产 URL（构建期注入）：
  ```ts
  import leavesOverlay from "desktop/src/assets/textures/leaves-overlay.webm";
  ```
- `*.webm` 的 TS 模块声明在 `desktop/src/assets.d.ts`（类型，不是文件本身）。
- 运行时通过 `app://local/...` 或打包后的 asset URL 加载，不在仓库里搬运文件。

## 5. 踩坑：B 模式（创作）解码失败

- 现象：B 模式视频在软件解码下"重试也不成功"。
- 现状：代码已加 4s 超时 + `play()` 拒绝重试 + 移除 `currentSrc===''` 早退，但仍偶发。
- 嫌疑：B 的 9 个 webm 编码参数与 A/C 不同；未彻底诊断。
- 排查方向：加 `video.onError` 捕获 `MediaError.code/message`；或 B 文件用与 A/C 相同 ffmpeg 参数重转。
