# Tech Stack & Platform Support

Quick reference for versions and supported platforms. See [overview.md](./overview.md) for the architecture and [backend-core.md](./backend-core.md) for the server internals.

## Tech stack

| Layer | Technology |
| --- | --- |
| Desktop shell | Electron 42 |
| Frontend | React 19 + Zustand 5 + CSS Modules |
| Build | Vite 7 |
| Server | Hono + `@hono/node-server` |
| Agent runtime | [Pi SDK](https://github.com/badlogic/pi-mono) |
| Database | `better-sqlite3` (WAL mode) |
| Tests | Vitest |
| i18n | 5 languages (zh / en / ja / ko / zh-TW) |

## Platform support

| Platform | Status |
| --- | --- |
| macOS (Apple Silicon) | Supported (signed & notarized) |
| macOS (Intel) | Supported |
| Windows | Beta |
| Linux | Supported (AppImage / deb) |
| Mobile (PWA) | v0: phone access to the same HanaAgent Server's sessions & workbench |

## Notes

- The Server is a standalone Node.js process (spawned by Electron or run standalone), bundled with Vite + `@vercel/nft`.
- The Mobile PWA is served by the HanaAgent Server at `/mobile/`; phones log in via device access key or local account.
- LAN access: another desktop connects over a LAN URL + access key to the same Server and shares the same sessions and resources.
