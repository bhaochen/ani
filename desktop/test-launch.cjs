const { app, BrowserWindow, protocol } = require("electron");
const fs = require("fs");
const path = require("path");

// 复刻 desktop/main.cjs 的 app:// 协议注册逻辑，否则页面与视频都无法加载。
function registerAppProtocol() {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: "app",
      privileges: {
        bypassCSP: true,
        stream: true,
        supportFetchAPI: true,
        corsEnabled: true,
        secure: true,
      },
    },
  ]);
}

const APP_PROTOCOL_MIME = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
  ".mov": "video/quicktime",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".m4a": "audio/mp4",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".json": "application/json",
  ".css": "text/css",
  ".js": "text/javascript",
  ".html": "text/html",
};

function installAppHandler() {
  const projectRoot = path.resolve(__dirname, "..");
  protocol.handle("app", async (request) => {
    const url = new URL(request.url);
    const filePath = path.join(projectRoot, decodeURIComponent(url.pathname));
    let stat;
    try {
      stat = fs.statSync(filePath);
    } catch {
      return new Response("Not found", { status: 404 });
    }
    if (!stat.isFile()) {
      return new Response("Not found", { status: 404 });
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = APP_PROTOCOL_MIME[ext] || "application/octet-stream";
    const total = stat.size;
    const rangeHeader = request.headers.get("range");
    if (rangeHeader) {
      const match = /bytes=(\d*)-(\d*)/.exec(rangeHeader);
      if (match) {
        const start = match[1] ? parseInt(match[1], 10) : 0;
        const end = match[2] ? parseInt(match[2], 10) : total - 1;
        if (!Number.isNaN(start) && start < total && end >= start && end < total) {
          const chunk = fs.readFileSync(filePath).subarray(start, end + 1);
          return new Response(chunk, {
            status: 206,
            headers: {
              "Content-Type": contentType,
              "Content-Range": `bytes ${start}-${end}/${total}`,
              "Accept-Ranges": "bytes",
              "Content-Length": String(end - start + 1),
            },
          });
        }
      }
    }
    const data = fs.readFileSync(filePath);
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Accept-Ranges": "bytes",
        "Content-Length": String(total),
      },
    });
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: `${__dirname}/preload.cjs`,
    },
  });
  win.webContents.on("did-fail-load", (_, errorCode, errorDescription) => {
    console.error("[test-launch] did-fail-load:", errorCode, errorDescription);
  });
  // 弹一个可见窗口，直接播放已转好的 wallpaper webm，肉眼确认能显示
  const html = `<!doctype html><html><body style="margin:0;background:#000">
    <video src="app://local/assets/Wallpaper_Presence/A_R1_1200.webm"
           autoplay muted loop controls
           style="width:100%;height:100%;object-fit:contain;background:#000"></video>
  </body></html>`;
  win.loadURL("data:text/html," + encodeURIComponent(html));
  return win;
}

// 允许通过环境变量 GPU_FLAGS 注入启动参数做对照实验，例如：
//   GPU_FLAGS="--use-gl=angle --use-angle=gl" \
//   ELECTRON_OZONE_PLATFORM_HINT=wayland electron desktop/test-launch.cjs
// 注意：必须在 app ready 之前 appendSwitch 才生效。
if (process.env.GPU_FLAGS) {
  for (const f of process.env.GPU_FLAGS.split(/\s+/).filter(Boolean)) {
    const clean = f.replace(/^--/, "");
    const eq = clean.indexOf("=");
    if (eq === -1) app.commandLine.appendSwitch(clean);
    else app.commandLine.appendSwitch(clean.slice(0, eq), clean.slice(eq + 1));
  }
}

registerAppProtocol();
app.whenReady().then(async () => {
  installAppHandler();
  const gpu = await app.getGPUInfo("complete");
  const fs0 = gpu.featureStatus || {};
  console.log("[test-launch] GPU featureStatus:", JSON.stringify(fs0));
  createWindow();
  const win = require("electron").BrowserWindow.getAllWindows()[0];
  // 周期性打印视频状态，便于确认是否真正解码出画面
  let ticks = 0;
  const timer = setInterval(async () => {
    if (win.isDestroyed()) {
      clearInterval(timer);
      return;
    }
    try {
      const s = await win.webContents.executeJavaScript(
        `(function(){const v=document.querySelector('video');if(!v)return{no:true};return{rs:v.readyState,ns:v.networkState,cur:v.currentTime,dur:v.duration,err:v.error&&v.error.code};})()`
      );
      console.log(`[test-launch] video@${ticks++}:`, JSON.stringify(s));
      if (s && s.rs >= 2 && s.cur > 0) {
        console.log("[test-launch] SUCCESS: video is decoding/playing");
        clearInterval(timer);
      }
    } catch {}
  }, 1500);
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
