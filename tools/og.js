/* 生成分享缩略图：node tools/og.js → assets/og.png（1200×630）
 * 用本机 Chrome 无头模式截封面，微信/QQ 分享时会用它当缩略图。
 */
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9334;
const ROOT = path.join(__dirname, "..");
const FILE_URL = "file:///" + path.join(ROOT, "index.html").replace(/\\/g, "/");
const OUT = path.join(ROOT, "assets", "og.png");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const chrome = spawn(CHROME, [
    "--headless=new", `--remote-debugging-port=${PORT}`, "--disable-gpu",
    "--hide-scrollbars", "--no-first-run", "--no-default-browser-check",
    "--user-data-dir=" + path.join(process.env.TEMP, "dsh-og-profile"),
    "--window-size=1200,630", "about:blank"
  ], { stdio: "ignore" });

  try {
    let target = null;
    for (let i = 0; i < 40 && !target; i++) {
      await sleep(250);
      try {
        const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
        target = list.find((t) => t.type === "page");
      } catch (e) {}
    }
    if (!target) throw new Error("连不上 Chrome 调试端口");

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    let id = 0;
    const pending = new Map();
    ws.addEventListener("message", (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
    });
    await new Promise((res, rej) => {
      ws.addEventListener("open", res);
      ws.addEventListener("error", rej);
    });
    const send = (method, params) => new Promise((res, rej) => {
      const mid = ++id;
      pending.set(mid, (m) => (m.error ? rej(new Error(m.error.message)) : res(m.result)));
      ws.send(JSON.stringify({ id: mid, method, params: params || {} }));
    });

    await send("Page.enable");
    await send("Emulation.setDeviceMetricsOverride", {
      width: 1200, height: 630, deviceScaleFactor: 1, mobile: false
    });
    await send("Page.navigate", { url: FILE_URL });
    await sleep(1400);
    // 首页现在有 24 张卡，630 高放不下：隐藏工具条，只留前 12 张，必要时整体缩放
    await send("Runtime.evaluate", {
      expression: `(function () {
        var st = document.createElement("style");
        st.textContent = ".home-foot,.home-tools,.find-hint,.empty{display:none!important}" +
          ".home-top{margin-bottom:16px}" +
          ".home-rule{margin-top:12px}" +
          ".grid{gap:10px}" +
          ".card{min-height:120px;padding:14px 12px 12px}" +
          ".card-icon{width:38px;height:38px;margin-bottom:2px}" +
          ".card-icon svg{width:30px;height:30px}" +
          ".card-name{font-size:16px}" +
          ".card-desc{font-size:12px}";
        document.head.appendChild(st);

        var cards = Array.prototype.slice.call(document.querySelectorAll(".grid .card"));
        cards.slice(12).forEach(function (el) { el.parentNode.removeChild(el); });

        var p = document.querySelector(".page");
        var h = p ? p.scrollHeight : document.documentElement.scrollHeight;
        if (h > 630) document.documentElement.style.zoom = String(630 / h);
        return h;
      })()`
    });
    await sleep(300);
    const { data } = await send("Page.captureScreenshot", { format: "png" });
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, Buffer.from(data, "base64"));
    console.log("已生成", path.relative(ROOT, OUT));
    ws.close();
  } finally {
    chrome.kill();
  }
}

main().catch((e) => { console.error("失败：", e.message); process.exit(1); });
