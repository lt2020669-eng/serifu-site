// 零依赖本地静态服务器：node serve.js  → 打开 http://localhost:8787/site/
// 用于本地预览（浏览器出于安全会拦截 file:// 直接读取 JSON，故用本服务器）。
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 8787;
const TYPES = {
  ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8",
  ".js":"text/javascript; charset=utf-8", ".json":"application/json; charset=utf-8",
  ".png":"image/png", ".jpg":"image/jpeg", ".jpeg":"image/jpeg",
  ".webp":"image/webp", ".svg":"image/svg+xml", ".gif":"image/gif",
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/site/index.html";
  const filePath = path.join(ROOT, urlPath);
  // 防目录穿越
  if (!filePath.startsWith(ROOT)){ res.writeHead(403); res.end("Forbidden"); return; }
  fs.readFile(filePath, (err, buf) => {
    if (err){ res.writeHead(404, {"Content-Type":"text/plain; charset=utf-8"}); res.end("404 Not Found: " + urlPath); return; }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream" });
    res.end(buf);
  });
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}/site/index.html`;
  console.log("台本站已启动：" + url);
  console.log("按 Ctrl+C 停止。");
  // 尝试自动打开浏览器（Windows）
  try{
    const { exec } = require("child_process");
    if (process.platform === "win32") exec(`start "" "${url}"`);
    else if (process.platform === "darwin") exec(`open "${url}"`);
    else exec(`xdg-open "${url}"`);
  }catch(_){}
});
