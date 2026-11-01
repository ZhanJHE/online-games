/* 全站自检：node tools/check-pages.js [baseUrl]
 *
 * 页面清单来自 assets/data/games.js，每个游戏的断言在 tools/smoke.js。
 * 依次打开首页、23 个游戏、赞助作者，做结构断言和一次交互冒烟，
 * 游戏页额外检查音效模块和静音开关，收集 console 报错与未捕获异常，
 * 每页截图到 开发文档/预览/站点/。
 * 不传参数时用本地 file://，传线上地址就检查线上。
 */

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const { GAMES, CATS } = require("../assets/data/games.js");
const SMOKE = require("./smoke.js");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9336;
const ROOT = path.join(__dirname, "..");

const arg = process.argv[2] || "";
const FILE_BASE = "file:///" + ROOT.replace(/\\/g, "/") + "/";
const BASE = arg || FILE_BASE;
const IS_REMOTE = /^https?:/i.test(BASE);
const OUT = path.join(ROOT, "开发文档", "预览", IS_REMOTE ? "站点-线上" : "站点");
// file:// 下目录不会自动加载 index.html，统一补上文件名
const url = (p) => BASE + p + (p === "" || p.endsWith("/") ? "index.html" : "");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pad2 = (n) => String(n).padStart(2, "0");

/* ---------- 数据自检 ---------- */

const GAME_LIST = GAMES.filter((g) => g.cat !== "sponsor");
const SPONSOR = GAMES.find((g) => g.id === "sponsor");
const CAT_IDS = CATS.map((c) => c.id);

if (!SPONSOR) throw new Error("games.js 里找不到赞助作者卡片");
if (GAMES[GAMES.length - 1].id !== "sponsor") throw new Error("赞助作者必须排在最后");

const seen = new Set();
for (const g of GAMES) {
  if (seen.has(g.id)) throw new Error("游戏 id 重复：" + g.id);
  seen.add(g.id);
  if (g.cat !== "sponsor" && CAT_IDS.indexOf(g.cat) === -1) throw new Error(g.id + " 的分类不存在：" + g.cat);
  if (!g.icon || g.icon.indexOf("<svg") === -1) throw new Error(g.id + " 缺图标");
  if (!/^#[0-9A-Fa-f]{6}$/.test(g.accent)) throw new Error(g.id + " 主题色不合法：" + g.accent);
  if (!fs.existsSync(path.join(ROOT, g.href))) throw new Error(g.id + " 的页面不存在：" + g.href);
  if (g.cat !== "sponsor" && typeof SMOKE[g.id] !== "function") {
    throw new Error("tools/smoke.js 缺断言：" + g.id);
  }
}

/* ---------- 页面 ---------- */

const CASES = [
  {
    name: "01-home",
    path: "",
    label: "首页",
    async run(ev) {
      const total = GAME_LIST.length + 1;
      const n = await ev("document.querySelectorAll('.card').length");
      if (n !== total) throw new Error("卡片数 " + n + "，应为 " + total);
      const links = await ev("document.querySelectorAll('a.card').length");
      if (links !== total) throw new Error("可点卡片数 " + links);
      const last = await ev("document.querySelectorAll('.card')[document.querySelectorAll('.card').length - 1].getAttribute('href')");
      if (!/sponsor/.test(last)) throw new Error("右下角不是赞助作者：" + last);
      const count = await ev("document.getElementById('gameCount').textContent");
      if (count !== String(GAME_LIST.length)) throw new Error("数量文案 " + count + "，应为 " + GAME_LIST.length);
      const names = await ev("Array.from(document.querySelectorAll('.card-name')).map(e=>e.textContent).join(' / ')");
      const want = ["井字棋", "四子棋", "乒乓", "别踩白块", "打靶", "反应灯", "舒尔特方格", "记忆序列", "推箱子", "24 点", "猜数字", "汉诺塔", "赞助作者"];
      for (const w of want) if (!names.includes(w)) throw new Error("首页缺卡片：" + w);

      const setQ = (v) => `(function(v){var q=document.getElementById('q');q.value=v;q.dispatchEvent(new Event('input',{bubbles:true}));return document.querySelectorAll('.card').length;})(decodeURIComponent('${encodeURIComponent(v)}'))`;

      const q1 = await ev(setQ("棋"));
      if (q1 !== 3) throw new Error("搜「棋」应得 3 张，实际 " + q1);
      const sponsorVisible = await ev("!!document.querySelector('.card[href*=\"sponsor\"]')");
      if (sponsorVisible) throw new Error("搜索时赞助卡不该出现");

      const q2 = await ev(setQ("zzz"));
      if (q2 !== 0) throw new Error("搜「zzz」应为 0 张，实际 " + q2);
      const emptyShown = await ev("!document.getElementById('empty').hasAttribute('hidden')");
      if (!emptyShown) throw new Error("空态没有出现");

      await ev(setQ(""));
      await ev("document.querySelector('.cat[data-cat=\"arcade\"]').click()");
      const arcade = await ev("document.querySelectorAll('.card').length");
      if (arcade !== 6) throw new Error("街机分类应为 6 张，实际 " + arcade);

      await ev("document.querySelector('.cat[data-cat=\"all\"]').click()");
      const all = await ev("document.querySelectorAll('.card').length");
      if (all !== total) throw new Error("回到全部应为 " + total + " 张，实际 " + all);

      const hintHidden = await ev("document.getElementById('findHint').hasAttribute('hidden')");
      if (!hintHidden) throw new Error("清除筛选后提示应该收起");

      await sleep(1200);
      console.log("   卡片：" + names);
    }
  },

  ...GAME_LIST.map((g, i) => ({
    name: pad2(i + 2) + "-" + g.id,
    path: g.href.replace(/index\.html$/, ""),
    label: g.name,
    async run(ev) {
      await SMOKE[g.id](ev, sleep);
    }
  })),

  {
    name: pad2(GAME_LIST.length + 2) + "-sponsor",
    path: "sponsor/",
    label: "赞助作者",
    async run(ev) {
      const line = await ev("document.querySelector('.sponsor-line').textContent");
      if (!/奶茶/.test(line)) throw new Error("引导语不对：" + line);
      const qr = await ev("document.querySelector('.sponsor-qr').getAttribute('src')");
      if (!/pay\.png/.test(qr || "")) throw new Error("赞赏码图没挂上");
      let loaded = false;
      for (let i = 0; i < 16 && !loaded; i++) {
        await sleep(250);
        loaded = await ev("(function(){var i=document.querySelector('.sponsor-qr');return !!(i && i.complete && i.naturalWidth>0);})()");
      }
      if (!loaded) throw new Error("赞赏码图没加载出来");
      const prose = await ev("!!document.querySelector('.prose')");
      if (prose) throw new Error("正文没删干净");
    }
  }
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  console.log("目标：" + BASE);
  console.log("页面：" + CASES.length + " 个（游戏 " + GAME_LIST.length + " 个）");

  const chrome = spawn(CHROME, [
    "--headless=new", `--remote-debugging-port=${PORT}`, "--disable-gpu",
    "--hide-scrollbars", "--no-first-run", "--no-default-browser-check",
    "--user-data-dir=" + path.join(process.env.TEMP, "dsh-check-profile"),
    "--window-size=390,900", "about:blank"
  ], { stdio: "ignore" });

  let ws;
  let failures = 0;

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

    ws = new WebSocket(target.webSocketDebuggerUrl);
    let id = 0;
    const pending = new Map();
    let errors = [];

    ws.addEventListener("message", (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); return; }
      if (m.method === "Runtime.exceptionThrown") {
        errors.push(m.params.exceptionDetails.exception && m.params.exceptionDetails.exception.description
          || m.params.exceptionDetails.text);
      }
      if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") {
        errors.push(m.params.args.map((a) => a.value || a.description || "").join(" "));
      }
    });

    await new Promise((res, rej) => {
      ws.addEventListener("open", res);
      ws.addEventListener("error", rej);
    });

    const send = (method, params) => new Promise((res, rej) => {
      const mid = ++id;
      pending.set(mid, (m) => (m.error ? rej(new Error(method + ": " + m.error.message)) : res(m.result)));
      ws.send(JSON.stringify({ id: mid, method, params: params || {} }));
    });

    await send("Page.enable");
    await send("Runtime.enable");
    await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 900, deviceScaleFactor: 1, mobile: true });

    const ev = async (expr, awaitPromise) => {
      const r = await send("Runtime.evaluate", {
        expression: expr, awaitPromise: !!awaitPromise, returnByValue: true, userGesture: true
      });
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception && r.exceptionDetails.exception.description || "evaluate 失败");
      return r.result && r.result.value;
    };

    const shot = async (name) => {
      const { data } = await send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(OUT, name + ".png"), Buffer.from(data, "base64"));
    };

    for (const c of CASES) {
      errors = [];
      const target_ = url(c.path);
      await send("Page.navigate", { url: target_ });
      await sleep(IS_REMOTE ? 2200 : 1100);

      let ok = true;
      let msg = "";

      if (c.path && c.path !== "sponsor/") {
        const hasSfx = await ev("!!window.SFX");
        const hasBtn = await ev("!!document.querySelector('.sfx-toggle')");
        const audio = await ev("(function(){try{window.SFX.play('tick');}catch(e){return 'throw';}return (window.AudioContext||window.webkitAudioContext)?'ok':'no-audio';})()");
        if (!hasSfx) { ok = false; msg = "音效模块没加载"; }
        else if (!hasBtn) { ok = false; msg = "音效开关没挂上"; }
        else if (audio !== "ok") { ok = false; msg = "音效播不出来：" + audio; }
      }

      try {
        await c.run(ev);
      } catch (e) {
        ok = false;
        msg = e.message;
      }

      const hardErrors = errors.filter((e) => e && !/favicon/i.test(e));
      if (hardErrors.length) {
        ok = false;
        msg = (msg ? msg + " / " : "") + "页面报错：" + hardErrors[0].split("\n")[0];
      }

      await shot(c.name);
      console.log((ok ? "✓ " : "✗ ") + c.label + (ok ? "" : "  → " + msg));
      if (!ok) failures++;
    }

    // 首页另截一张桌面尺寸，高度放到 1600 以便看全 24 张卡
    await send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 1600, deviceScaleFactor: 1, mobile: false });
    await send("Page.navigate", { url: url("") });
    await sleep(1800);
    await shot("00-home-desktop");
    console.log("✓ 首页桌面截图");

    // 老分享链接：根路径 + ?r=牌面，应转发到 tarot 并直接显示结果
    await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 900, deviceScaleFactor: 1, mobile: true });
    await send("Page.navigate", { url: url("") + "?r=moon" });
    await sleep(1500);
    const landed = await ev("location.pathname + location.search");
    const shown = await ev("document.querySelector('#resName') ? document.querySelector('#resName').textContent : ''");
    const okRedirect = /tarot/.test(landed) && shown === "月亮";
    console.log((okRedirect ? "✓ " : "✗ ") + "老链接转发 → " + landed + " 显示：" + shown);
    if (!okRedirect) failures++;
    await shot(pad2(CASES.length + 1) + "-old-link-redirect");

    ws.close();
  } finally {
    if (ws) { try { ws.close(); } catch (e) {} }
    chrome.kill();
  }

  console.log(failures ? `\n${failures} 个页面有问题` : "\n全部通过");
  process.exit(failures ? 1 : 0);
}

main().catch((e) => {
  console.error("失败：" + e.message);
  process.exit(1);
});