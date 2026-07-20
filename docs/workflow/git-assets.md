# Git 与资产忽略策略

本页说明本仓库的 `.gitignore` 设计，尤其**大视频资产为何不进仓库**。

## 1. 被忽略的大资产

| 路径 / 规则 | 原因 |
| --- | --- |
| `assets/Wallpaper_Presence` | ~6 GB 壁纸视频 |
| `assets/Wallpaper_Ambience` | ~89 MB 氛围音频 |
| `*.webm` | 兜底：所有转码视频（含 `leaves-overlay.webm`） |
| `desktop/src/assets/textures/leaves-overlay.webm` | 落叶叠加视频 |

GitHub 限制：单文件 **100 MB** 硬上限，仓库 **~1 GB** 软上限。6 GB 资产不可能入库。

## 2. 保留的小资产（误伤防护）

- `desktop/src/assets/*.png`（角色图、托盘图标，约 1 MB/张）——程序运行时需要，**不忽略**。
- `textures/rice-paper-*.png` 等程序纹理小图——保留。
- 即：只忽略"视频大文件"，不忽略整个 `textures/` 目录。

## 3. 其它关键忽略项

- 用户数据：`agents/`、`user/`（已迁移到 `~/.ani/`）。
- 构建产物：`dist*/`、`desktop/dist-renderer/`、`*.bundle.cjs`、`vendor/`、`node_modules`。
- 凭证：`.env*`、`*.pem`、`*.key`、`secrets.*`、`credentials.json`、`auth.json`。
- 临时/日志：`tmp/`、`*.log`、`test-results/`、`__pycache__`。
- 私有文档：`AGENTS.md`、`.docs/`、`.superpowers/`、`archived/`、`devlog/`、`research/`。

## 4. 重复项清理

- 旧版 `.gitignore` 里 `CLAUDE.md` 出现两次（第 17 与 61 行），已去重保留一处。
- 注意：`CLAUDE.md` 在本仓库被忽略（项目私有），但本开发文档 `docs/` 不忽略、可提交。

## 5. 推送前自检

```
git status --porcelain | grep -iE "webm|Wallpaper"   # 应为空
git check-ignore -v <大文件路径>                       # 确认被忽略
```

本地已有多笔 commit 不含视频资产，可直接 push（不会触发大文件限制）。
