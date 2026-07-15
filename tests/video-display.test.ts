import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

// 复刻 desktop/main.cjs 中 app:// 协议 handler 的核心逻辑，
// 验证 <video> 标签能否通过 app://local/assets/... 正确加载并显示视频。
// 视频能否显示取决于两点：
//   1. 返回正确的 MIME（video/mp4），否则浏览器拒绝解码
//   2. 支持 Range 请求（返回 206），否则 Chromium <video> 流式加载会黑屏
const APP_PROTOCOL_MIME: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
  ".mov": "video/quicktime",
};

function resolveAppLocal(filePath: string): string {
  const url = new URL(`app://local/${filePath}`);
  return path.join(projectRoot, decodeURIComponent(url.pathname));
}

function appLocalHandler(filePath: string, rangeHeader?: string) {
  const abs = resolveAppLocal(filePath);
  let stat: fs.Stats;
  try {
    stat = fs.statSync(abs);
  } catch {
    return { status: 404, headers: {}, body: Buffer.alloc(0) };
  }
  if (!stat.isFile()) {
    return { status: 404, headers: {}, body: Buffer.alloc(0) };
  }
  const ext = path.extname(abs).toLowerCase();
  const contentType = APP_PROTOCOL_MIME[ext] || "application/octet-stream";
  const total = stat.size;
  if (rangeHeader) {
    const match = /bytes=(\d*)-(\d*)/.exec(rangeHeader);
    if (match) {
      const start = match[1] ? parseInt(match[1], 10) : 0;
      const end = match[2] ? parseInt(match[2], 10) : total - 1;
      if (!Number.isNaN(start) && start < total && end >= start && end < total) {
        const chunk = fs.readFileSync(abs).subarray(start, end + 1);
        return {
          status: 206,
          headers: {
            "Content-Type": contentType,
            "Content-Range": `bytes ${start}-${end}/${total}`,
            "Accept-Ranges": "bytes",
            "Content-Length": String(end - start + 1),
          },
          body: chunk,
        };
      }
    }
  }
  const data = fs.readFileSync(abs);
  return {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Accept-Ranges": "bytes",
      "Content-Length": String(total),
    },
    body: data,
  };
}

describe("video display via app://local protocol", () => {
  const videoPath = "assets/Wallpaper_Presence/A_R1_1200.mp4";

  it("the video file referenced by video-protocol-test.html actually exists", () => {
    const abs = resolveAppLocal(videoPath);
    expect(fs.existsSync(abs)).toBe(true);
    expect(fs.statSync(abs).isFile()).toBe(true);
  });

  it("serves the mp4 with the correct video/mp4 MIME type", () => {
    const res = appLocalHandler(videoPath);
    expect(res.status).toBe(200);
    expect(res.headers["Content-Type"]).toBe("video/mp4");
    expect(Number(res.headers["Content-Length"])).toBeGreaterThan(0);
  });

  it("supports Range requests with 206 so <video> streams instead of black screen", () => {
    const total = fs.statSync(resolveAppLocal(videoPath)).size;
    const res = appLocalHandler(videoPath, "bytes=0-1023");
    expect(res.status).toBe(206);
    expect(res.headers["Accept-Ranges"]).toBe("bytes");
    expect(res.headers["Content-Range"]).toBe(`bytes 0-1023/${total}`);
    expect(res.body.length).toBe(1024);
  });

  it("rejects an out-of-range request without crashing", () => {
    const total = fs.statSync(resolveAppLocal(videoPath)).size;
    const res = appLocalHandler(videoPath, `bytes=${total}-${total + 10}`);
    expect(res.status).toBe(200);
    expect(Number(res.headers["Content-Length"])).toBe(total);
  });

  it("returns 404 for a missing video path (would trigger onerror in the page)", () => {
    const res = appLocalHandler("assets/Wallpaper_Presence/does-not-exist.mp4");
    expect(res.status).toBe(404);
  });
});
