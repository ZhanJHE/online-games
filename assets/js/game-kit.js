/* 小游戏合集 · 游戏页外壳
 * 新游戏只写玩法和棋盘样式，标题栏、HUD、遮罩、音效、存储由这里生成。
 * 页面上先引 sfx.js，再引这个文件，然后：
 *   var g = GameKit.mount({ title, tag, accent, tip, hud, actions, stage });
 */

(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function read(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v === null ? fallback : v;
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try { localStorage.setItem(key, String(value)); } catch (e) {}
  }

  function mount(cfg) {
    cfg = cfg || {};

    var page = document.createElement("div");
    page.className = "page page--game";
    if (cfg.accent) page.style.setProperty("--accent", cfg.accent);

    var header = document.createElement("header");
    header.className = "game-top";
    header.innerHTML =
      '<a class="back" href="../index.html">← 返回</a>' +
      '<span class="game-title">' + esc(cfg.title || "") + "</span>" +
      '<span class="game-tag">' + esc(cfg.tag || "") + "</span>";
    page.appendChild(header);

    var hud = null;
    if ((cfg.hud && cfg.hud.length) || (cfg.actions && cfg.actions.length)) {
      hud = document.createElement("div");
      hud.className = "hud";

      (cfg.hud || []).forEach(function (h) {
        var s = document.createElement("span");
        s.innerHTML = esc(h.label) + '<b id="' + esc(h.id) + '">' + esc(h.value == null ? "0" : h.value) + "</b>";
        hud.appendChild(s);
      });

      (cfg.actions || []).forEach(function (a) {
        var b = document.createElement("button");
        b.type = "button";
        b.id = a.id;
        b.className = "btn btn-sm" + (a.ghost === false ? "" : " ghost");
        b.textContent = a.label;
        hud.appendChild(b);
      });

      page.appendChild(hud);
    }

    var main = document.createElement("main");
    main.className = "game-main";

    var stage = document.createElement("div");
    stage.className = "stage";
    stage.innerHTML = cfg.stage || "";

    var overlay = null;
    if (cfg.overlay !== false) {
      overlay = document.createElement("div");
      overlay.className = "overlay";
      overlay.innerHTML =
        '<div class="overlay-card">' +
        '<div class="overlay-title"></div>' +
        '<div class="overlay-text"></div>' +
        '<button class="btn" type="button">再来一局</button>' +
        "</div>";
      stage.appendChild(overlay);
    }

    main.appendChild(stage);
    page.appendChild(main);

    if (cfg.tip) {
      var tip = document.createElement("p");
      tip.className = "game-tip";
      tip.textContent = cfg.tip;
      page.appendChild(tip);
    }

    document.body.appendChild(page);

    var ovTitle = overlay ? overlay.querySelector(".overlay-title") : null;
    var ovText = overlay ? overlay.querySelector(".overlay-text") : null;
    var ovBtn = overlay ? overlay.querySelector(".btn") : null;

    var api = {
      page: page,
      header: header,
      main: main,
      hud: hud,
      stage: stage,
      overlay: overlay,
      $: function (sel) { return page.querySelector(sel); },
      sound: function (name) {
        if (window.SFX) window.SFX.play(name);
      },
      show: function (title, text, btnText) {
        if (!overlay) return;
        ovTitle.textContent = title == null ? "" : title;
        ovText.textContent = text == null ? "" : text;
        if (btnText) ovBtn.textContent = btnText;
        overlay.classList.add("show");
      },
      hide: function () {
        if (overlay) overlay.classList.remove("show");
      },
      onOverlay: function (fn) {
        if (ovBtn) ovBtn.addEventListener("click", fn);
      },
      setHud: function (id, value) {
        var b = document.getElementById(id);
        if (b) b.textContent = String(value);
      },
      best: function () {
        return parseInt(read(cfg.id + ".best", "0"), 10) || 0;
      },
      saveBest: function (v) {
        write(cfg.id + ".best", v);
      },
      get: function (key, fallback) { return read(key, fallback); },
      set: function (key, value) { write(key, value); }
    };

    return api;
  }

  function canvas(cv, w, h) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    var ctx = cv.getContext("2d");
    ctx.scale(dpr, dpr);
    return { ctx: ctx, w: w, h: h };
  }

  function loop(fn) {
    var last = 0;
    function frame(ts) {
      if (!last) last = ts;
      var dt = ts - last;
      last = ts;
      if (dt > 48) dt = 48;
      fn(dt, ts);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function pad(container, onDir, cols) {
    var dirs = cols === 4 ? ["left", "up", "down", "right"] : ["up", "left", "down", "right"];
    var arrows = { up: "↑", left: "←", down: "↓", right: "→" };
    container.className = "pad " + (cols === 4 ? "pad-4" : "pad-3");
    container.innerHTML = "";

    if (cols !== 4) {
      var sp = document.createElement("span");
      sp.className = "spacer";
      container.appendChild(sp);
    }

    dirs.forEach(function (d) {
      var b = document.createElement("button");
      b.type = "button";
      b.dataset.dir = d;
      b.setAttribute("aria-label", { up: "上", down: "下", left: "左", right: "右" }[d]);
      b.textContent = arrows[d];
      b.addEventListener("click", function () { onDir(d); });
      container.appendChild(b);
      if (cols !== 4 && d === "up") {
        var sp2 = document.createElement("span");
        sp2.className = "spacer";
        container.appendChild(sp2);
      }
    });
    return container;
  }

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  window.GameKit = {
    mount: mount,
    canvas: canvas,
    loop: loop,
    pad: pad,
    shuffle: shuffle,
    storage: { get: read, set: write }
  };
})();