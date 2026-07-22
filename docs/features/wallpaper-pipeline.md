# 壁纸 / 氛围视频资产管线

本页记录视频资产从源文件到运行的工程链路（与 [companion.md](./companion.md) 互补，偏"资产/构建"）。

## 1. 资产来源与体积

- 源：`assets/Wallpaper_Presence/*.mp4`（H.264）。原始素材来自 Steam 游戏 `BSide Olivia Lin Test`（约 2.9 GB，见下方 §6 拷贝记录），复制到 `~/Code/Agent/ani/assets/`。
- 数量：A/B/C 三模式 × R1/R2/R3 × 时间点(1200/1730/2000) = **27 个壁纸 MP4** + 每模式 3 个过渡视频（共 36 个）。
- 氛围：`assets/Wallpaper_Ambience/*.mp3`（音频，ambient_loop_1..22），~89 MB。
- 叠加：`desktop/src/assets/textures/leaves-overlay.mp4`（见 §4）。

## 2. 模式 / R 层 / 时间 → 文件 对应表

| 模式 | R 层 | 时间 | MP4 文件 | MP3 选取 | MP3 时长 (s) |
| --- | --- | --- | --- | --- | --- |
| A — 日常 | R1 | 1200 | A_R1_1200.mp4 | ambient_loop_1.mp3 | 130.96 |
| | | 1730 | A_R1_1730.mp4 | ambient_loop_2.mp3 | 188.84 |
| | | 2000 | A_R1_2000.mp4 | ambient_loop_3.mp3 | 153.56 |
| | R2 | 1200 | A_R2_1200.mp4 | ambient_loop_4.mp3 | 158.88 |
| | | 1730 | A_R2_1730.mp4 | ambient_loop_5.mp3 | 192.68 |
| | | 2000 | A_R2_2000.mp4 | ambient_loop_6.mp3 | 187.20 |
| | R3 | 1200 | A_R3_1200.mp4 | ambient_loop_7.mp3 | 189.64 |
| | | 1730 | A_R3_1730.mp4 | ambient_loop_8.mp3 | 267.60 |
| | | 2000 | A_R3_2000.mp4 | ambient_loop_9.mp3 | 173.80 |
| B — 创作 | R1 | 1200 | B_R1_1200.mp4 | ambient_loop_10.mp3 | 266.40 |
| | | 1730 | B_R1_1730.mp4 | ambient_loop_11.mp3 | 220.80 |
| | | 2000 | B_R1_2000.mp4 | ambient_loop_12.mp3 | 213.36 |
| | R2 | 1200 | B_R2_1200.mp4 | ambient_loop_13.mp3 | 167.32 |
| | | 1730 | B_R2_1730.mp4 | ambient_loop_14.mp3 | 167.84 |
| | | 2000 | B_R2_2000.mp4 | ambient_loop_15.mp3 | 132.72 |
| | R3 | 1200 | B_R3_1200.mp4 | ambient_loop_16.mp3 | 212.40 |
| | | 1730 | B_R3_1730.mp4 | ambient_loop_17.mp3 | 162.88 |
| | | 2000 | B_R3_2000.mp4 | ambient_loop_18.mp3 | 141.96 |
| C — 思考 | R1 | 1200 | C_R1_1200.mp4 | ambient_loop_19.mp3 | 137.28 |
| | | 1730 | C_R1_1730.mp4 | ambient_loop_20.mp3 | 182.44 |
| | | 2000 | C_R1_2000.mp4 | ambient_loop_21.mp3 | 171.60 |
| | R2 | 1200 | C_R2_1200.mp4 | ambient_loop_22.mp3 | 148.36 |
| | | 1730 | C_R2_1730.mp4 | ambient_loop_10.mp3 | 266.40（循环后继续下一段） |
| | | 2000 | C_R2_2000.mp4 | ambient_loop_11.mp3 | 220.80 |
| | R3 | 1200 | C_R3_1200.mp4 | ambient_loop_12.mp3 | 213.36 |
| | | 1730 | C_R3_1730.mp4 | ambient_loop_13.mp3 | 167.32 |
| | | 2000 | C_R3_2000.mp4 | ambient_loop_14.mp3 | 167.84 |
| 过渡（所有模式统一） | — | — | `*_Transition_*.mp4` | ambient_loop_22.mp3（最中性） | 148.36 |

说明：
- 模式（A/B/C）对应三套主题：日常、创作、思考。
- R 层（R1 → R2 → R3）循环：播放完 R1 对应 MP3 后进入 R2，随后 R3，再回 R1（见 [companion.md](./companion.md) 的音频驱动）。
- 时间点（1200/1730/2000）在同一 R 层内选取不同 MP3，提供昼夜氛围变化。
- 过渡视频使用唯一的 ambient_loop_22.mp3（最中性），确保切换不突兀。

## 3. 为何转码为 AV1 .webm

- 软件解码（见 [GPU/视频策略](../desktop/gpu-video.md)）下，AV1 在目标机器（NVIDIA+Wayland）稳定。
- `.webm` 体积远小于 `.mp4`，利于本地分发。
- Electron 内置 Chromium 支持 AV1 软件解码。

## 4. 转码命令（实际使用的 fish 脚本）

硬件加速转码（NVENC），单个文件示例：

```fish
ffmpeg \
    -hwaccel cuda \
    -hwaccel_output_format cuda \
    -i A_R2_1200.mp4 \
    -c:v av1_nvenc \
    -preset p4 \
    -cq 22 \
    -an \
    A_R2_1200.webm
```

批量转码（fish）：

```fish
for f in *.mp4
    set out (string replace '.mp4' '.webm' "$f")
    if test -f "$out"
        echo "跳过: $out 已存在"
        continue
    end
    ffmpeg \
        -hwaccel cuda \
        -hwaccel_output_format cuda \
        -i "$f" \
        -c:v av1_nvenc -preset p4 -cq 22 -an \
        -progress pipe:1 \
        "$out"
end
```

转码后校验（跳过已确认的两个文件）：

```fish
set skip_files C_R1_1200.webm C_R1_1730.webm
for f in C_*.webm
    if contains $f $skip_files
        echo "跳过: $f"
        continue
    end
    ffmpeg -hwaccel cuda -hwaccel_output_format cuda -v error -i "$f" -f null -
end
```

> 落叶叠加层 `leaves-overlay` 走 `mp4`（非 webm），原因见 [companion.md](./companion.md)：`<source>` 的 `type` 必须匹配，AV1 webm 在 `<source type="video/mp4">` 下静默失败，故回退为 `.mp4`。

## 5. 资产不进 Git

- `.gitignore` 排除 `assets/Wallpaper_Presence`、`assets/Wallpaper_Ambience`、`*.webm`。
- 原因：GitHub 单文件 100 MB 上限、仓库 ~1 GB 软上限，数 GB 资产不可能入库。
- 发行：安装包 / 对象存储分发，`assets/README` 说明获取方式。
- 渲染进程用 Vite 的 `import` 引入资产 URL（构建期注入）；运行时经 `app://local/...` 或打包后 asset URL 加载。
- `*.webm` / `*.mp4` 的 TS 模块声明在 `desktop/src/assets.d.ts`。

## 6. 环境准备（NVIDIA VAAPI 驱动）

在 Arch Linux + Wayland 上让 NVDEC/VAAPI 可用（即便硬解在 Electron 中被关闭，驱动本身仍建议安装）：

```bash
yay -S libva-nvidia-driver
vainfo   # 验证：VA-API NVDEC driver [direct backend]，应列出 AV1Profile0 等
```

`vainfo` 输出应含 `Driver version: VA-API NVDEC driver [direct backend]` 且支持 `VAProfileAV1Profile0`。

## 7. 资产拷贝来源记录

原始素材来自 Steam 游戏目录（示例路径）：

```
/home/yuki/.local/share/Steam/steamapps/common/BSide Olivia Lin Test/0.0.9.615/assets
cp -rf assets/ ~/Code/Agent/ani/
```

`Wallpaper_Presence` ≈ 2.9 GB，`Wallpaper_Ambience` ≈ 89 MB（不同机器 du 结果略有差异）。

## 8. 踩坑：B 模式（创作）解码失败

- 现象：B 模式视频在软件解码下"重试也不成功"。
- 现状：代码已加 4s 超时 + `play()` 拒绝重试 + 移除 `currentSrc===''` 早退，但仍偶发。
- 嫌疑：B 的 9 个 webm 编码参数与 A/C 不同；未彻底诊断。
- 排查方向：加 `video.onError` 捕获 `MediaError.code/message`；或 B 文件用与 A/C 相同 ffmpeg 参数（`av1_nvenc -preset p4 -cq 22`）重转。
