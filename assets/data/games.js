/* 小游戏合集 · 首页卡片数据
 * 加游戏只改这里：加一条 { ... }，再在 tools/smoke.js 补一条断言。
 * cat 必须是 CATS 里的 id；sponsor 不算游戏，永远排最后。
 */

var GAMES = [
  {
    id: "tetris", name: "俄罗斯方块", tag: "TETRIS", cat: "arcade",
    desc: "堆方块、消行，别堆到顶", accent: "#B4626B",
    href: "tetris/index.html", keywords: ["方块", "消行", "掉落"],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="5.5" height="5.5"/><rect x="9" y="9" width="5.5" height="5.5"/><rect x="14.5" y="14.5" width="5.5" height="5.5"/></svg>'
  },
  {
    id: "wheel", name: "恋爱转盘", tag: "SPIN", cat: "fun",
    desc: "转一下，替你做个决定", accent: "#B98A5E",
    href: "wheel/index.html", keywords: ["转盘", "随机", "决定", "选择"],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="7.5"/><path d="M12 5.5v15M4.5 13h15M6.7 7.7l10.6 10.6"/></svg>'
  },
  {
    id: "tarot", name: "恋爱塔罗", tag: "TAROT", cat: "fun",
    desc: "24 道题，抽一张属于你的牌", accent: "#6C6795",
    href: "tarot/index.html", keywords: ["塔罗", "测试", "恋爱", "心理"],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="3" width="12" height="18" rx="1"/><path d="M12 7.6l1.5 3.2 3.2 1.5-3.2 1.5-1.5 3.2-1.5-3.2-3.2-1.5 3.2-1.5z"/></svg>'
  },
  {
    id: "2048", name: "2048", tag: "2048", cat: "puzzle",
    desc: "合并相同数字，凑到 2048", accent: "#D9A94E",
    href: "2048/index.html", keywords: ["数字", "合并", "滑动"],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="7" height="7"/><rect x="13.5" y="3.5" width="7" height="7"/><rect x="3.5" y="13.5" width="7" height="7"/><rect x="13.5" y="13.5" width="7" height="7"/></svg>'
  },
  {
    id: "memory", name: "记忆翻牌", tag: "MEMORY", cat: "reflex",
    desc: "翻两张，把图案配成一对", accent: "#7E7BA6",
    href: "memory/index.html", keywords: ["配对", "翻牌", "记忆"],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="6" width="10" height="14" rx="1"/><path d="M10 3h9a1 1 0 0 1 1 1v13"/><circle cx="9" cy="13" r="1.4"/></svg>'
  },
  {
    id: "snake", name: "贪吃蛇", tag: "SNAKE", cat: "arcade",
    desc: "越吃越长，别咬到自己", accent: "#5D7F6A",
    href: "snake/index.html", keywords: ["蛇", "吃", "方向键"],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6.5h6a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h7"/><circle cx="18.2" cy="18.5" r="1.8"/></svg>'
  },
  {
    id: "minesweeper", name: "扫雷", tag: "MINES", cat: "puzzle",
    desc: "9×9，10 颗雷，别点爆", accent: "#5F8FA8",
    href: "minesweeper/index.html", keywords: ["雷", "排雷", "插旗"],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3v18"/><path d="M7 4.5h9l-2.5 3.2 2.5 3.2H7z"/></svg>'
  },
  {
    id: "gomoku", name: "五子棋", tag: "GOMOKU", cat: "board",
    desc: "横竖斜，先连成五个", accent: "#7C6A55",
    href: "gomoku/index.html", keywords: ["五子", "连五", "双人"],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17"/><path d="M9 3.5v17M15 3.5v17M3.5 9h17M3.5 15h17"/><circle cx="9" cy="9" r="1.7" fill="currentColor" stroke="none"/><circle cx="15" cy="15" r="1.7"/></svg>'
  },
  {
    id: "breakout", name: "打砖块", tag: "BREAKOUT", cat: "arcade",
    desc: "挡板接球，把砖打光", accent: "#A65D4E",
    href: "breakout/index.html", keywords: ["砖", "挡板", "弹球"],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="5" height="3"/><rect x="9.5" y="3.5" width="5" height="3"/><rect x="15.5" y="3.5" width="5" height="3"/><circle cx="12" cy="12" r="1.7"/><path d="M7 19.5h10"/></svg>'
  },
  {
    id: "slide", name: "数字华容道", tag: "SLIDE", cat: "puzzle",
    desc: "滑动数字，从 1 排到 15", accent: "#4F7D7B",
    href: "slide/index.html", keywords: ["华容道", "数字", "滑块", "拼图"],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="7" height="7"/><rect x="13.5" y="3.5" width="7" height="7"/><rect x="3.5" y="13.5" width="7" height="7"/><path d="M14 15.5v4M12 17.5h4"/></svg>'
  },
  {
    id: "mole", name: "打地鼠", tag: "MOLE", cat: "reflex",
    desc: "30 秒，敲到更多老鼠", accent: "#8B6A3F",
    href: "mole/index.html", keywords: ["地鼠", "敲", "手速"],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="19.5" rx="7.5" ry="1.8"/><path d="M8 19.5v-3.1a4 4 0 0 1 8 0v3.1"/><circle cx="10.2" cy="14.6" r=".7" fill="currentColor" stroke="none"/><circle cx="13.8" cy="14.6" r=".7" fill="currentColor" stroke="none"/><path d="M10.8 16.6h2.4"/></svg>'
  },

  {
    id: "tictactoe", name: "井字棋", tag: "TIC TAC TOE", cat: "board",
    desc: "三连就赢，AI 很强", accent: "#6D5D7B",
    href: "tictactoe/index.html", keywords: ["井字", "三连", "圈叉"],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3.5v17M15 3.5v17M3.5 9h17M3.5 15h17"/><path d="M4.6 4.6l2.8 2.8M7.4 4.6L4.6 7.4"/><circle cx="12" cy="12" r="1.7"/></svg>'
  },
  {
    id: "connect4", name: "四子棋", tag: "CONNECT 4", cat: "board",
    desc: "竖向连四个就赢", accent: "#4E6E8E",
    href: "connect4/index.html", keywords: ["四子", "连四", "重力"],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="1"/><path d="M3.5 9h17M3.5 15h17"/><circle cx="8" cy="6.2" r="1.2" fill="currentColor" stroke="none"/><circle cx="16" cy="12" r="1.2" fill="currentColor" stroke="none"/></svg>'
  },
  {
    id: "pong", name: "乒乓", tag: "PONG", cat: "arcade",
    desc: "挡板接球，先到 7 分", accent: "#5C7A6B",
    href: "pong/index.html", keywords: ["乒乓", "对打", "球"],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v16M20 4v16"/><path d="M12 5v14" stroke-dasharray="2 2.4"/><rect x="6" y="9.5" width="2" height="5"/><circle cx="15.5" cy="8.5" r="1.6"/></svg>'
  },
  {
    id: "tiles", name: "别踩白块", tag: "TILES", cat: "arcade",
    desc: "只踩黑块，越点越快", accent: "#7A6A72",
    href: "tiles/index.html", keywords: ["白块", "节奏", "手速"],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="5" height="5"/><rect x="9.5" y="9.5" width="5" height="5" fill="currentColor" stroke="none"/><rect x="15.5" y="3.5" width="5" height="5"/><rect x="3.5" y="15.5" width="5" height="5"/><rect x="15.5" y="15.5" width="5" height="5"/></svg>'
  },
  {
    id: "target", name: "打靶", tag: "TARGET", cat: "arcade",
    desc: "30 秒，点掉更多靶子", accent: "#A8753F",
    href: "target/index.html", keywords: ["靶", "射击", "瞄准"],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill="currentColor"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/></svg>'
  },
  {
    id: "reaction", name: "反应灯", tag: "REACTION", cat: "reflex",
    desc: "灯亮就点，测你的毫秒", accent: "#7F8C4A",
    href: "reaction/index.html", keywords: ["反应", "毫秒", "速度"],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>'
  },
  {
    id: "schulte", name: "舒尔特方格", tag: "SCHULTE", cat: "reflex",
    desc: "1 到 25，按顺序点", accent: "#6B7A8F",
    href: "schulte/index.html", keywords: ["舒尔特", "注意力", "方格"],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17"/><path d="M9.2 3.5v17M14.8 3.5v17M3.5 9.2h17M3.5 14.8h17"/></svg>'
  },
  {
    id: "simon", name: "记忆序列", tag: "SIMON", cat: "reflex",
    desc: "看亮灯顺序，跟着按", accent: "#8E5F6E",
    href: "simon/index.html", keywords: ["记忆", "序列", "色块"],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="3.6"/><circle cx="16" cy="8" r="3.6"/><circle cx="8" cy="16" r="3.6"/><circle cx="16" cy="16" r="3.6"/></svg>'
  },
  {
    id: "sokoban", name: "推箱子", tag: "SOKOBAN", cat: "puzzle",
    desc: "把箱子推到点上", accent: "#7A6A4F",
    href: "sokoban/index.html", keywords: ["推箱子", "箱子", "关卡"],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17"/><rect x="8" y="8" width="8" height="8"/><path d="M10.5 12h3M12 10.5v3"/></svg>'
  },
  {
    id: "twentyfour", name: "24 点", tag: "24 POINT", cat: "puzzle",
    desc: "四张牌，凑出 24", accent: "#7C5C7A",
    href: "twentyfour/index.html", keywords: ["24点", "算数", "数字"],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="1"/><text x="12" y="15.6" text-anchor="middle" font-size="9" font-family="Georgia, serif" fill="currentColor" stroke="none">24</text></svg>'
  },
  {
    id: "guess", name: "猜数字", tag: "GUESS", cat: "puzzle",
    desc: "1 到 100，猜中为止", accent: "#4F6D7A",
    href: "guess/index.html", keywords: ["猜", "数字", "二分"],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M9.8 9.4a2.4 2.4 0 1 1 3.1 2.3c-.7.3-.9.8-.9 1.5v.3"/><circle cx="12" cy="16.4" r=".7" fill="currentColor" stroke="none"/></svg>'
  },
  {
    id: "hanoi", name: "汉诺塔", tag: "HANOI", cat: "puzzle",
    desc: "把五层塔搬过去", accent: "#6A7B5E",
    href: "hanoi/index.html", keywords: ["汉诺塔", "塔", "递归"],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 20h17"/><path d="M7 20v-7M12 20v-7M17 20v-7"/><rect x="5" y="11" width="4" height="2"/><rect x="10" y="13" width="4" height="2"/><rect x="15" y="15" width="4" height="2"/></svg>'
  },

  {
    id: "sponsor", name: "赞助作者", tag: "SPONSOR", cat: "sponsor",
    desc: "请作者喝杯奶茶", accent: "#B08D57",
    href: "sponsor/index.html", keywords: ["赞赏", "奶茶"],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/><path d="M16 11h2.5a2.5 2.5 0 0 1 0 5H16"/><path d="M4 6c1.5 0 1.5 2 3 2s1.5-2 3-2"/></svg>'
  }
];

var CATS = [
  { id: "all", name: "全部" },
  { id: "arcade", name: "街机" },
  { id: "puzzle", name: "益智" },
  { id: "board", name: "棋牌" },
  { id: "reflex", name: "反应记忆" },
  { id: "fun", name: "趣味测试" }
];

if (typeof window !== "undefined") {
  window.GAMES = GAMES;
  window.CATS = CATS;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { GAMES: GAMES, CATS: CATS };
}