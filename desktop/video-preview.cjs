const { app, BrowserWindow, protocol } = require("electron");
const fs = require("fs");
const path = require("path");
const MIME = { ".mp4": "video/mp4", ".webm": "video/webm", ".html": "text/html" };
protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { bypassCSP: true, stream: true, supportFetchAPI: true, corsEnabled: true, secure: true } }]);
const root = "/home/yuki/Code/Agent/ani";
if (process.env.GPU_FLAGS) {
  for (const f of process.env.GPU_FLAGS.split(/\s+/).filter(Boolean)) {
    const c = f.replace(/^--/, ""); const eq = c.indexOf("=");
    if (eq === -1) app.commandLine.appendSwitch(c);
    else app.commandLine.appendSwitch(c.slice(0, eq), c.slice(eq + 1));
  }
}
app.whenReady().then(async () => {
  protocol.handle("app", async (req) => {
    const u = new URL(req.url); const fp = path.join(root, decodeURIComponent(u.pathname));
    let st; try { st = fs.statSync(fp); } catch { return new Response("nf", { status: 404 }); }
    if (!st.isFile()) return new Response("nf", { status: 404 });
    const ext = path.extname(fp).toLowerCase(); const total = st.size; const rh = req.headers.get("range");
    if (rh) { const m = /bytes=(\d*)-(\d*)/.exec(rh); if (m) { const s = m[1] ? +m[1] : 0, e = m[2] ? +m[2] : total - 1; if (s < total && e >= s && e < total) { const c = fs.readFileSync(fp).subarray(s, e + 1); return new Response(c, { status: 206, headers: { "Content-Type": MIME[ext] || "application/octet-stream", "Content-Range": `bytes ${s}-${e}/${total}`, "Accept-Ranges": "bytes", "Content-Length": String(e - s + 1) } }); } } }
    const d = fs.readFileSync(fp); return new Response(d, { status: 200, headers: { "Content-Type": MIME[ext] || "application/octet-stream", "Content-Length": String(total) } });
  });
  const win = new BrowserWindow({ width: 900, height: 600, show: true, webPreferences: { nodeIntegration: false, contextIsolation: true } });
  const html = `<!doctype html><html><body style="margin:0;background:#000"><video id=v src="app://local/assets/Wallpaper_Presence/A_R1_1200.webm" autoplay muted loop style="width:100%;height:100%;object-fit:contain"></video></body></html>`;
  await win.loadURL("data:text/html," + encodeURIComponent(html));
  await new Promise(r => setTimeout(r, 6000));
  const state = await win.webContents.executeJavaScript(`(function(){const v=document.getElementById('v');return {rs:v.readyState,cur:v.currentTime,err:v.error?v.error.code:null,w:v.videoWidth,h:v.videoHeight};})()`);
  const img = await win.webContents.capturePage();
  const png = img.toPNG();
  fs.writeFileSync("/tmp/preview-shot.png", png);
  // 粗略判断非黑像素：用 getImageData 在页面里采样
  const nonBlack = await win.webContents.executeJavaScript(`(function(){const c=document.createElement('canvas');c.width=64;c.height=64;const x=c.getContext('2d');x.drawImage(document.getElementById('v'),0,0,64,64);const d=x.getImageData(0,0,64,64).data;let nb=0;for(let i=0;i<d.length;i+=4){if(d[i]+d[i+1]+d[i+2]>30)nb++;}return nb;})()`).catch(()=>-1);
  console.log("PREVIEW_STATE", JSON.stringify(state));
  console.log("PREVIEW_NONBLACK_PIXELS", nonBlack, "PNG_BYTES", png.length);
  app.quit();
});
