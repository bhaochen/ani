# Electron 主进程与 GPU / 视频解码策略

本页记录一个**真实踩坑**：在 Arch Linux + Wayland + NVIDIA RTX 4060 环境下，Electron 的视频硬解（NVDEC/VAAPI）不稳定，以及如何规避。

> 这是面试 / 复盘里很好的"性能 + 平台兼容"案例。

## 1. 问题现象

- Electron/Chromium 在该环境下走 NVDEC（通过 VAAPI，`libva-nvidia-driver`）解码视频流。
- 解码中途报 `vaEndPicture failed` / `error decoding stream`。
- 结果：壁纸视频**画面冻结**（解码器卡死），但音频可能还在。

## 2. 根因

- Electron 内嵌的 Chromium 版本对"NVIDIA + Wayland + VAAPI"组合的硬件视频解码支持不完整。
- 并非媒体文件或代码问题，而是**平台/驱动/Chromium 三者耦合**的已知不稳定区。

## 3. 解决方案（代码位置：`desktop/main.cjs` 顶部）

在 `app.ready` 前，根据环境探测动态追加启动开关：

```js
const isWayland = !!process.env.WAYLAND_DISPLAY;
const isNvidia  = /* 读 /proc/driver/nvidia 或 LIBVA_DRIVER_NAME */;
if (isWayland && isNvidia) {
  app.commandLine.appendSwitch("disable-accelerated-video-decode");
  app.commandLine.appendSwitch("enable-unsafe-swiftshader");
}
```

- `disable-accelerated-video-decode`：**关闭视频硬解**，统一走软件解码（AV1/VP9 在该机器上稳定）。
- `enable-unsafe-swiftshader`：软件渲染回退（合成层仍用默认 EGL）。
- 合成（compositing）、窗口渲染仍由 GPU 负责，只把"视频解码"这一块挪到 CPU。

## 4. 由此带来的工程约束

- 所有壁纸 `.mp4`（H.264）必须**转码为 AV1 `.webm`**，因为软件解码 AV1 在该机稳定且体积小。
- 转码命令（用户侧，非仓库内）：
  ```
  ffmpeg -i in.mp4 -c:v av1_nvenc -b:v 2M -c:a libopus out.webm
  ```
- 这些 `.webm` 在 `.gitignore` 中被排除（见 [资产 gitignore](./../workflow/git-assets.md)），不进仓库。

## 5. 启示（面试可说）

- "能关的加速先关掉，定位稳定性问题"——先用软件路径证明业务正确，再逐步恢复硬件加速。
- 平台差异（mac/win/linux-wayland）要用**运行时探测 + 启动开关**，不要写死。
- 视频不要 `display:none` 杀掉解码上下文；本项目的"背景持续播放"用 `visibility:hidden`（见 features 文档）。
