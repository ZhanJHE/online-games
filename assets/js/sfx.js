/* 小游戏合集 · 音效
 * 用 Web Audio 现场合成，不加载任何音频文件。
 * 页面里调用 SFX.play("tick") 即可；右下角（或标题栏）自动加一个静音开关。
 * 静音状态存在 localStorage 的 sfx.muted，全站共用。
 */

(function () {
  "use strict";

  var KEY = "sfx.muted";
  var AC = window.AudioContext || window.webkitAudioContext;
  var ctx = null;
  var master = null;
  var muted = false;
  var lastPlay = {};

  try { muted = localStorage.getItem(KEY) === "1"; } catch (e) {}

  function ensure() {
    if (!AC) return null;
    try {
      if (!ctx) {
        ctx = new AC();
        var lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 2600;
        master = ctx.createGain();
        master.gain.value = 0.55;
        master.connect(lp);
        lp.connect(ctx.destination);
      }
      if (ctx.state === "suspended") {
        var p = ctx.resume();
        if (p && p.catch) p.catch(function () {});
      }
      return ctx;
    } catch (e) {
      ctx = null;
      return null;
    }
  }

  function note(freq, dur, opt) {
    var c = ensure();
    if (!c) return;
    opt = opt || {};
    try {
      var t0 = c.currentTime + (opt.delay || 0);
      var o = c.createOscillator();
      var g = c.createGain();
      o.type = opt.type || "sine";
      o.frequency.setValueAtTime(freq, t0);
      if (opt.to) o.frequency.exponentialRampToValueAtTime(opt.to, t0 + dur);

      var peak = opt.gain == null ? 0.12 : opt.gain;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

      o.connect(g);
      g.connect(master);
      o.start(t0);
      o.stop(t0 + dur + 0.02);
    } catch (e) {}
  }

  function noise(dur, gain, cutoff) {
    var c = ensure();
    if (!c) return;
    try {
      var len = Math.max(1, Math.floor(c.sampleRate * dur));
      var buf = c.createBuffer(1, len, c.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / len);
      }
      var src = c.createBufferSource();
      src.buffer = buf;

      var f = c.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = cutoff || 700;

      var g = c.createGain();
      g.gain.value = gain;

      src.connect(f);
      f.connect(g);
      g.connect(master);
      src.start();
    } catch (e) {}
  }

  var SOUNDS = {
    tick: function () { note(1180, 0.035, { gain: 0.10 }); },
    place: function () {
      note(520, 0.07, { type: "triangle", gain: 0.14 });
      note(780, 0.05, { gain: 0.06, delay: 0.03 });
    },
    flip: function () { note(600, 0.06, { type: "triangle", gain: 0.10 }); },
    select: function () { note(880, 0.045, { gain: 0.09 }); },
    match: function () {
      note(784, 0.08, { gain: 0.12 });
      note(1046, 0.12, { gain: 0.10, delay: 0.075 });
    },
    miss: function () { note(246, 0.14, { gain: 0.11, to: 196 }); },
    eat: function () {
      note(660, 0.05, { gain: 0.11 });
      note(990, 0.07, { gain: 0.07, delay: 0.04 });
    },
    brick: function () { note(740, 0.045, { type: "triangle", gain: 0.11 }); },
    boom: function () {
      noise(0.22, 0.14, 650);
      note(90, 0.18, { gain: 0.16, to: 55 });
    },
    lose: function () {
      note(392, 0.16, { gain: 0.11, to: 330 });
      note(262, 0.3, { gain: 0.11, to: 196, delay: 0.15 });
    },
    win: function () {
      [523, 659, 784, 1047].forEach(function (f, i) {
        note(f, 0.18, { gain: 0.11, delay: i * 0.09 });
      });
    },
    spin: function () {
      note(220, 0.38, { gain: 0.07, to: 440 });
      noise(0.3, 0.025, 900);
    }
  };

  function play(name) {
    if (muted) return;
    var fn = SOUNDS[name];
    if (!fn) return;
    var now = Date.now();
    if (lastPlay[name] && now - lastPlay[name] < 50) return;
    lastPlay[name] = now;
    fn();
  }

  /* ---------- 开关 ---------- */

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M4 9.5h3l4-3.5v12l-4-3.5H4z"/>' +
    '<path d="M16 9a4.5 4.5 0 0 1 0 6"/>' +
    '<path d="M18.5 6.5a8 8 0 0 1 0 11"/></svg>';

  var ICON_MUTE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M4 9.5h3l4-3.5v12l-4-3.5H4z"/>' +
    '<path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>';

  var CSS = '.sfx-toggle{display:inline-flex;align-items:center;justify-content:center;' +
    'width:32px;height:32px;padding:0;border:0;border-radius:2px;background:transparent;' +
    'color:var(--ink-3,#9A9199);cursor:pointer;transition:color .16s ease,opacity .16s ease}' +
    '.sfx-toggle:hover{color:var(--accent,#B08D57)}' +
    '.sfx-toggle:focus-visible{outline:2px solid currentColor;outline-offset:2px}' +
    '.sfx-toggle svg{width:18px;height:18px;display:block}' +
    '.sfx-toggle .i-mute{display:none}' +
    '.sfx-toggle[aria-pressed="true"] .i-on{display:none}' +
    '.sfx-toggle[aria-pressed="true"] .i-mute{display:block}' +
    '.game-top .sfx-toggle{position:absolute;right:0;top:-2px}' +
    '.game-top .game-tag{right:38px}' +
    '.sfx-toggle--float{position:fixed;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));' +
    'z-index:9999;width:36px;height:36px;border:1px solid rgba(43,37,51,.18);border-radius:50%;' +
    'background:rgba(247,241,231,.88);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);' +
    'box-shadow:0 6px 16px -12px rgba(43,37,51,.7)}';

  var btn = null;

  function sync() {
    if (!btn) return;
    btn.setAttribute("aria-pressed", muted ? "true" : "false");
    btn.setAttribute("aria-label", muted ? "开启音效" : "关闭音效");
    btn.title = muted ? "开启音效" : "关闭音效";
  }

  function toggle() {
    muted = !muted;
    try { localStorage.setItem(KEY, muted ? "1" : "0"); } catch (e) {}
    sync();
    if (!muted) play("select");
  }

  function mount() {
    if (document.getElementById("sfx-style") === null) {
      var st = document.createElement("style");
      st.id = "sfx-style";
      st.textContent = CSS;
      document.head.appendChild(st);
    }

    btn = document.createElement("button");
    btn.type = "button";
    btn.className = "sfx-toggle";
    btn.innerHTML = '<span class="i-on">' + ICON + '</span><span class="i-mute">' + ICON_MUTE + '</span>';
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    });
    sync();

    var header = document.querySelector(".game-top");
    if (header) {
      header.appendChild(btn);
    } else {
      btn.classList.add("sfx-toggle--float");
      document.body.appendChild(btn);
    }
  }

  window.SFX = {
    play: play,
    toggle: toggle,
    isMuted: function () { return muted; }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();