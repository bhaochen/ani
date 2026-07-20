ctrl + shift + i









  yay -S libva-nvidia-driver
Sync Explicit (1): libva-nvidia-driver-0.0.17-1
warning: libva-nvidia-driver-0.0.17-1 is up to date -- reinstalling
resolving dependencies...
looking for conflicting packages...

Packages (1) libva-nvidia-driver-0.0.17-1

Total Installed Size:  0.10 MiB
Net Upgrade Size:      0.00 MiB

:: Proceed with installation? [Y/n] y
(1/1) checking keys in keyring                                                    [##############################################] 100%
(1/1) checking package integrity                                                  [##############################################] 100%
(1/1) loading package files                                                       [##############################################] 100%
(1/1) checking for file conflicts                                                 [##############################################] 100%
(1/1) checking available disk space                                               [##############################################] 100%
:: Processing package changes...
(1/1) reinstalling libva-nvidia-driver                                            [##############################################] 100%
:: Running post-transaction hooks...
(1/1) Arming ConditionNeedsUpdate...
  vainfo
Trying display: wayland
vainfo: VA-API version: 1.24 (libva 2.23.0)
vainfo: Driver version: VA-API NVDEC driver [direct backend]
vainfo: Supported profile and entrypoints
      VAProfileMPEG2Simple            :	VAEntrypointVLD
      VAProfileMPEG2Main              :	VAEntrypointVLD
      VAProfileVC1Simple              :	VAEntrypointVLD
      VAProfileVC1Main                :	VAEntrypointVLD
      VAProfileVC1Advanced            :	VAEntrypointVLD
      VAProfileH264Main               :	VAEntrypointVLD
      VAProfileH264High               :	VAEntrypointVLD
      VAProfileH264ConstrainedBaseline:	VAEntrypointVLD
      VAProfileJPEGBaseline           :	VAEntrypointVLD
      VAProfileHEVCMain               :	VAEntrypointVLD
      VAProfileVP8Version0_3          :	VAEntrypointVLD
      VAProfileVP9Profile0            :	VAEntrypointVLD
      VAProfileAV1Profile0            :	VAEntrypointVLD
      VAProfileHEVCMain10             :	VAEntrypointVLD
      VAProfileHEVCMain12             :	VAEntrypointVLD
      VAProfileVP9Profile2            :	VAEntrypointVLD
      VAProfileHEVCMain444            :	VAEntrypointVLD
      VAProfileHEVCMain444_10         :	VAEntrypointVLD
      VAProfileHEVCMain444_12         :	VAEntrypointVLD



















  ffmpeg \
        -hwaccel cuda \
        -hwaccel_output_format cuda \
        -i A_R2_1200.mp4 \
        -c:v av1_nvenc \
        -preset p4 \
        -cq 22 \
        -an \
        A_R2_1200.webm


for f in *.mp4
    set out (string replace '.mp4' '.webm' "$f")

    if test -f "$out"
        echo "跳过: $out 已存在"
        continue
    end

    echo "=============================="
    echo "转换: $f"
    echo "输出: $out"
    echo "=============================="

    ffmpeg \
        -hwaccel cuda \
        -hwaccel_output_format cuda \
        -i "$f" \
        -c:v av1_nvenc \
        -preset p4 \
        -cq 22 \
        -an \
        -progress pipe:1 \
        "$out"
end

set skip_files C_R1_1200.webm C_R1_1730.webm

for f in C_*.webm
    if contains $f $skip_files
        echo "跳过: $f"
        continue
    end

    echo "================================"
    echo "检查: $f"

    ffmpeg \
        -hwaccel cuda \
        -hwaccel_output_format cuda \
        -v error \
        -i "$f" \
        -f null -
end





● 完整对应表（模式 / R 层 / 时间 → MP4 / 对应 MP3）

  ┌──────────────────────────┬──────┬──────┬────────────────────┬───────────────────────────────┬───────────────────────────────┐
  │           模式           │ R 层 │ 时间 │      MP4 文件      │           MP3 选取            │         MP3 时长 (s)          │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │ A — 日常                 │ R1   │ 1200 │ A_R1_1200.mp4      │ ambient_loop_1.mp3            │ 130.96                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │                          │      │ 1730 │ A_R1_1730.mp4      │ ambient_loop_2.mp3            │ 188.84                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │                          │      │ 2000 │ A_R1_2000.mp4      │ ambient_loop_3.mp3            │ 153.56                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │                          │ R2   │ 1200 │ A_R2_1200.mp4      │ ambient_loop_4.mp3            │ 158.88                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │                          │      │ 1730 │ A_R2_1730.mp4      │ ambient_loop_5.mp3            │ 192.68                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │                          │      │ 2000 │ A_R2_2000.mp4      │ ambient_loop_6.mp3            │ 187.20                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │                          │ R3   │ 1200 │ A_R3_1200.mp4      │ ambient_loop_7.mp3            │ 189.64                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │                          │      │ 1730 │ A_R3_1730.mp4      │ ambient_loop_8.mp3            │ 267.60                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │                          │      │ 2000 │ A_R3_2000.mp4      │ ambient_loop_9.mp3            │ 173.80                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │ B — 创作                 │ R1   │ 1200 │ B_R1_1200.mp4      │ ambient_loop_10.mp3           │ 266.40                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │                          │      │ 1730 │ B_R1_1730.mp4      │ ambient_loop_11.mp3           │ 220.80                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │                          │      │ 2000 │ B_R1_2000.mp4      │ ambient_loop_12.mp3           │ 213.36                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │                          │ R2   │ 1200 │ B_R2_1200.mp4      │ ambient_loop_13.mp3           │ 167.32                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │                          │      │ 1730 │ B_R2_1730.mp4      │ ambient_loop_14.mp3           │ 167.84                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │                          │      │ 2000 │ B_R2_2000.mp4      │ ambient_loop_15.mp3           │ 132.72                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │                          │ R3   │ 1200 │ B_R3_1200.mp4      │ ambient_loop_16.mp3           │ 212.40                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │                          │      │ 1730 │ B_R3_1730.mp4      │ ambient_loop_17.mp3           │ 162.88                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │                          │      │ 2000 │ B_R3_2000.mp4      │ ambient_loop_18.mp3           │ 141.96                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │ C — 思考                 │ R1   │ 1200 │ C_R1_1200.mp4      │ ambient_loop_19.mp3           │ 137.28                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │                          │      │ 1730 │ C_R1_1730.mp4      │ ambient_loop_20.mp3           │ 182.44                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │                          │      │ 2000 │ C_R1_2000.mp4      │ ambient_loop_21.mp3           │ 171.60                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │                          │ R2   │ 1200 │ C_R2_1200.mp4      │ ambient_loop_22.mp3           │ 148.36                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │                          │      │ 1730 │ C_R2_1730.mp4      │ ambient_loop_10.mp3           │ 266.40 (循环后继续使用下一段) │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │                          │      │ 2000 │ C_R2_2000.mp4      │ ambient_loop_11.mp3           │ 220.80                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │                          │ R3   │ 1200 │ C_R3_1200.mp4      │ ambient_loop_12.mp3           │ 213.36                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │                          │      │ 1730 │ C_R3_1730.mp4      │ ambient_loop_13.mp3           │ 167.32                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │                          │      │ 2000 │ C_R3_2000.mp4      │ ambient_loop_14.mp3           │ 167.84                        │
  ├──────────────────────────┼──────┼──────┼────────────────────┼───────────────────────────────┼───────────────────────────────┤
  │ 过渡视频（所有模式统一） │ —    │ —    │ *_Transition_*.mp4 │ ambient_loop_22.mp3（最中性） │ 148.36                        │
  └──────────────────────────┴──────┴──────┴────────────────────┴───────────────────────────────┴───────────────────────────────┘

  说明

  - 模式（A/B/C）对应三套主题：日常、创作、思考。
  - R 层（R1 → R2 → R3）循环：播放完 R1 所对应的 MP3 后进入 R2，随后 R3，再回到 R1。
  - 时间点（1200、1730、2000）在同一 R 层内部选取不同的 MP3，以提供昼夜氛围变化。
  - 过渡视频使用唯一的 ambient_loop_22.mp3（最中性），确保切换时不产生突兀感。









A - 日常模式

B - 创作模式

C - 思考模式

R1, R2, R3 第一次 R1 循环完进入 R2 循环, 之后是 R3 之后又是 R1


  tree
.
├── assets
│   ├── Wallpaper_Ambience
│   │   ├── ambient_loop_10.mp3
│   │   ├── ambient_loop_11.mp3
│   │   ├── ambient_loop_12.mp3
│   │   ├── ambient_loop_13.mp3
│   │   ├── ambient_loop_14.mp3
│   │   ├── ambient_loop_15.mp3
│   │   ├── ambient_loop_16.mp3
│   │   ├── ambient_loop_17.mp3
│   │   ├── ambient_loop_18.mp3
│   │   ├── ambient_loop_19.mp3
│   │   ├── ambient_loop_1.mp3
│   │   ├── ambient_loop_20.mp3
│   │   ├── ambient_loop_21.mp3
│   │   ├── ambient_loop_22.mp3
│   │   ├── ambient_loop_2.mp3
│   │   ├── ambient_loop_3.mp3
│   │   ├── ambient_loop_4.mp3
│   │   ├── ambient_loop_5.mp3
│   │   ├── ambient_loop_6.mp3
│   │   ├── ambient_loop_7.mp3
│   │   ├── ambient_loop_8.mp3
│   │   └── ambient_loop_9.mp3
│   └── Wallpaper_Presence
│       ├── A_R1_1200.mp4
│       ├── A_R1_1730.mp4
│       ├── A_R1_2000.mp4
│       ├── A_R2_1200.mp4
│       ├── A_R2_1730.mp4
│       ├── A_R2_2000.mp4
│       ├── A_R3_1200.mp4
│       ├── A_R3_1730.mp4
│       ├── A_R3_2000.mp4
│       ├── A_Transition_1200_1730.mp4
│       ├── A_Transition_1730_2000.mp4
│       ├── A_Transition_2000_1200.mp4
│       ├── B_R1_1200.mp4
│       ├── B_R1_1730.mp4
│       ├── B_R1_2000.mp4
│       ├── B_R2_1200.mp4
│       ├── B_R2_1730.mp4
│       ├── B_R2_2000.mp4
│       ├── B_R3_1200.mp4
│       ├── B_R3_1730.mp4
│       ├── B_R3_2000.mp4
│       ├── B_Transition_1200_1730.mp4
│       ├── B_Transition_1730_2000.mp4
│       ├── B_Transition_2000_1200.mp4
│       ├── C_R1_1200.mp4
│       ├── C_R1_1730.mp4
│       ├── C_R1_2000.mp4
│       ├── C_R2_1200.mp4
│       ├── C_R2_1730.mp4
│       ├── C_R2_2000.mp4
│       ├── C_R3_1200.mp4
│       ├── C_R3_1730.mp4
│       ├── C_R3_2000.mp4
│       ├── C_Transition_1200_1730.mp4
│       ├── C_Transition_1730_2000.mp4
│       └── C_Transition_2000_1200.mp4
├── avcodec-61.dll
├── avfilter-10.dll
├── avformat-61.dll
├── avutil-59.dll
├── CefView
│   ├── chrome_100_percent.pak
│   ├── chrome_200_percent.pak
│   ├── chrome_elf.dll
│   ├── d3dcompiler_47.dll
│   ├── dxcompiler.dll
│   ├── dxil.dll
│   ├── icudtl.dat
│   ├── libcef.dll
│   ├── libEGL.dll
│   ├── libGLESv2.dll
│   ├── locales
│   │   ├── af.pak
│   │   ├── am.pak
│   │   ├── ar.pak
│   │   ├── bg.pak
│   │   ├── bn.pak
│   │   ├── ca.pak
│   │   ├── cs.pak
│   │   ├── da.pak
│   │   ├── de.pak
│   │   ├── el.pak
│   │   ├── en-GB.pak
│   │   ├── en-US.pak
│   │   ├── es-419.pak
│   │   ├── es.pak
│   │   ├── et.pak
│   │   ├── fa.pak
│   │   ├── fil.pak
│   │   ├── fi.pak
│   │   ├── fr.pak
│   │   ├── gu.pak
│   │   ├── he.pak
│   │   ├── hi.pak
│   │   ├── hr.pak
│   │   ├── hu.pak
│   │   ├── id.pak
│   │   ├── it.pak
│   │   ├── ja.pak
│   │   ├── kn.pak
│   │   ├── ko.pak
│   │   ├── lt.pak
│   │   ├── lv.pak
│   │   ├── ml.pak
│   │   ├── mr.pak
│   │   ├── ms.pak
│   │   ├── nb.pak
│   │   ├── nl.pak
│   │   ├── pl.pak
│   │   ├── pt-BR.pak
│   │   ├── pt-PT.pak
│   │   ├── ro.pak
│   │   ├── ru.pak
│   │   ├── sk.pak
│   │   ├── sl.pak
│   │   ├── sr.pak
│   │   ├── sv.pak
│   │   ├── sw.pak
│   │   ├── ta.pak
│   │   ├── te.pak
│   │   ├── th.pak
│   │   ├── tr.pak
│   │   ├── uk.pak
│   │   ├── ur.pak
│   │   ├── vi.pak
│   │   ├── zh-CN.pak
│   │   └── zh-TW.pak
│   ├── Olivia.exe
│   ├── resources.pak
│   ├── v8_context_snapshot.bin
│   ├── vk_swiftshader.dll
│   ├── vk_swiftshader_icd.json
│   └── vulkan-1.dll
├── conf.app.dat
├── HoYoDeviceFpSDK.dll
├── imageformats
│   ├── qgif.dll
│   ├── qicns.dll
│   ├── qico.dll
│   ├── qjpeg.dll
│   ├── qtga.dll
│   ├── qtiff.dll
│   ├── qwbmp.dll
│   └── qwebp.dll
├── NutApp.dll
├── NutBase.dll
├── NutCommon.dll
├── NutCrashMon.exe
├── NutEngine.dll
├── NutGlint.dll
├── NutGui.dll
├── NutMedia.dll
├── NutUiKit.dll
├── NutWavelet.dll
├── NutWaveleter.exe
├── NutWPShlExt.dll
├── Olivia.exe
├── platforms
│   └── qwindows.dll
├── plugins
│   ├── Container
│   │   ├── NutContainerPlugin.dll
│   │   └── NutContainerUI.dll
│   ├── Login
│   │   ├── NutLoginPlugin.dll
│   │   ├── NutLoginThirdparty.dll
│   │   ├── NutLoginUI.dll
│   │   └── steam_api64.dll
│   ├── Studio
│   │   ├── NutLiveChat.dll
│   │   ├── NutLivePlayer.dll
│   │   ├── NutStudioPlugin.dll
│   │   ├── NutStudioUI.dll
│   │   └── NutWebPlayer.dll
│   └── SysTray
│       └── NutSysTrayPlugin.dll
├── QCefView.dll
├── Qt6Core.dll
├── Qt6Gui.dll
├── Qt6OpenGL.dll
├── Qt6OpenGLWidgets.dll
├── Qt6UiTools.dll
├── Qt6Widgets.dll
├── resources
│   ├── feapp.dat
│   ├── feplayer.dat
│   └── webplayer.dat
├── styles
│   └── qmodernwindowsstyle.dll
├── swresample-5.dll
└── swscale-8.dll

15 directories, 182 files
  du -sh assets/Wallpaper_Presence assets/Wallpaper_Ambience
2.9G	assets/Wallpaper_Presence
89M	assets/Wallpaper_Ambience
  ls assets/
 Wallpaper_Ambience   Wallpaper_Presence
  pwd
/home/yuki/.local/share/Steam/steamapps/common/BSide Olivia Lin Test/0.0.9.615
  ls
 assets            conf.app.dat          NutCrashMon.exe   NutWavelet.dll     QCefView.dll           Qt6Widgets.dll
 avcodec-61.dll    HoYoDeviceFpSDK.dll   NutEngine.dll     NutWaveleter.exe   Qt6Core.dll            resources
 avfilter-10.dll   imageformats          NutGlint.dll      NutWPShlExt.dll    Qt6Gui.dll             styles
 avformat-61.dll   NutApp.dll            NutGui.dll        Olivia.exe         Qt6OpenGL.dll          swresample-5.dll
 avutil-59.dll     NutBase.dll           NutMedia.dll      platforms          Qt6OpenGLWidgets.dll   swscale-8.dll
 CefView           NutCommon.dll         NutUiKit.dll      plugins            Qt6UiTools.dll
  cp -rf assets/ ~/Code/Agent/ani/
󰪢 4s 󰉋 → .../BSide Olivia Lin Test/0.0.9.615
    
