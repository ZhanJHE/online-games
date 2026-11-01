/* 每个游戏的冒烟断言：tools/check-pages.js 按 assets/data/games.js 的顺序跑。
 * 加游戏时在这里补一条，键名必须和 games.js 的 id 一致。
 */

module.exports = {
  tetris: async (ev, sleep) => {
    const w = await ev("document.getElementById('board').width");
    if (!w) throw new Error("画布没有尺寸");
    await ev("document.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowUp',bubbles:true}))");
    await sleep(150);
    await ev("document.dispatchEvent(new KeyboardEvent('keydown',{key:' ',bubbles:true}))");
    await sleep(150);
    const hud = await ev("document.getElementById('score').textContent");
    if (hud === null) throw new Error("分数栏缺失");
    const sw = await ev("(function(){var b=document.querySelector('.sfx-toggle'); if(!b) return 'no'; b.click(); var v=b.getAttribute('aria-pressed'); b.click(); return v;})()");
    if (sw !== "true") throw new Error("音效开关没切换：" + sw);
  },

  wheel: async (ev, sleep) => {
    const w = await ev("document.getElementById('wheel').width");
    if (!w) throw new Error("画布没有尺寸");
    await ev("document.getElementById('spin').click()");
    await sleep(4600);
    const res = await ev("document.getElementById('resText').textContent");
    if (!res) throw new Error("转完没有出结果");
    console.log("   转盘结果：" + res);
  },

  tarot: async (ev) => {
    const n = await ev("QUIZ.length");
    if (n !== 24) throw new Error("题目数 " + n);
    const cards = await ev("Object.keys(CARDS).length");
    if (cards !== 8) throw new Error("牌面数 " + cards);
    const back = await ev("!!document.querySelector('.cover-back')");
    if (!back) throw new Error("缺少返回合集的入口");
    const donate = await ev("!!document.querySelector('.donate')");
    if (donate) throw new Error("赞赏码还在，应该先屏蔽");
  },

  "2048": async (ev, sleep) => {
    const cells = await ev("document.querySelectorAll('.cell').length");
    if (cells !== 16) throw new Error("格子数 " + cells);
    const before = await ev("document.querySelectorAll('.cell:not(:empty)').length");
    if (before !== 2) throw new Error("开局数字块数不对：" + before);
    for (const key of ["ArrowLeft", "ArrowUp", "ArrowDown", "ArrowRight"]) {
      await ev("document.dispatchEvent(new KeyboardEvent('keydown',{key:'" + key + "',bubbles:true}))");
      await sleep(160);
    }
    const after = await ev("document.querySelectorAll('.cell:not(:empty)').length");
    if (after < 3) throw new Error("走了四步还是 " + after + " 块数字，没生成新块");
  },

  memory: async (ev, sleep) => {
    const n = await ev("document.querySelectorAll('.mem-card').length");
    if (n !== 16) throw new Error("牌数 " + n);
    await ev("document.querySelectorAll('.mem-card')[0].click()");
    await sleep(120);
    await ev("document.querySelectorAll('.mem-card')[1].click()");
    await sleep(200);
    const flipped = await ev("document.querySelectorAll('.mem-card.flipped,.mem-card.matched').length");
    if (flipped < 1) throw new Error("点击后没有翻面");
    const moves = await ev("document.getElementById('moves').textContent");
    if (moves !== "1") throw new Error("步数没记上：" + moves);
  },

  snake: async (ev, sleep) => {
    const w = await ev("document.getElementById('board').width");
    if (!w) throw new Error("画布没有尺寸");
    await ev("document.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}))");
    await sleep(500);
    const score = await ev("document.getElementById('score').textContent");
    if (score === null) throw new Error("分数栏缺失");
  },

  minesweeper: async (ev, sleep) => {
    const n = await ev("document.querySelectorAll('.ms-cell').length");
    if (n !== 81) throw new Error("格子数 " + n);
    await ev("document.querySelectorAll('.ms-cell')[40].click()");
    await sleep(250);
    const open = await ev("document.querySelectorAll('.ms-cell.open').length");
    if (open < 1) throw new Error("点开后没有挖开的格子");
    const boom = await ev("document.querySelectorAll('.ms-cell.boom').length");
    if (boom > 0) throw new Error("第一次点击就踩雷了");
    console.log("   一挖挖开 " + open + " 格");
  },

  gomoku: async (ev, sleep) => {
    const n = await ev("document.querySelectorAll('.gm-cell').length");
    if (n !== 121) throw new Error("格子数 " + n);
    await ev("document.querySelectorAll('.gm-cell')[60].click()");
    await sleep(150);
    const stones = await ev("document.querySelectorAll('.gm-cell.b').length");
    if (stones !== 1) throw new Error("点下去没落子");
    const turn = await ev("document.getElementById('turn').textContent");
    if (turn !== "白") throw new Error("回合没切换：" + turn);
    await ev("document.getElementById('undo').click()");
    await sleep(100);
    const back = await ev("document.querySelectorAll('.gm-cell.b').length");
    if (back !== 0) throw new Error("悔棋没撤掉");
  },

  breakout: async (ev, sleep) => {
    const w = await ev("document.getElementById('board').width");
    if (!w) throw new Error("画布没有尺寸");
    const hasScore = await ev("!!document.getElementById('score')");
    if (!hasScore) throw new Error("分数栏缺失");
    const prompt = await ev("document.getElementById('overlay').classList.contains('show')");
    if (!prompt) throw new Error("开局没有提示");
    await ev("document.getElementById('start').click()");
    await sleep(700);
    const hidden = await ev("!document.getElementById('overlay').classList.contains('show')");
    if (!hidden) throw new Error("点开始后遮罩没关");
    await ev("document.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}))");
    await sleep(200);
    await ev("document.dispatchEvent(new KeyboardEvent('keyup',{key:'ArrowLeft',bubbles:true}))");
  },

  slide: async (ev, sleep) => {
    const n = await ev("document.querySelectorAll('.sl-tile').length");
    if (n !== 16) throw new Error("格子数 " + n);
    const blanks = await ev("document.querySelectorAll('.sl-tile.blank').length");
    if (blanks !== 1) throw new Error("空格数 " + blanks);
    await ev(`(function(){
      var t = Array.from(document.querySelectorAll('.sl-tile'));
      var bi = t.findIndex(function (x) { return x.classList.contains('blank'); });
      var x = bi % 4, y = (bi / 4) | 0, cand = [];
      if (x > 0) cand.push(bi - 1);
      if (x < 3) cand.push(bi + 1);
      if (y > 0) cand.push(bi - 4);
      if (y < 3) cand.push(bi + 4);
      t[cand[0]].click();
      return cand[0];
    })()`);
    await sleep(120);
    const moves = await ev("document.getElementById('moves').textContent");
    if (moves !== "1") throw new Error("步数没记上：" + moves);
    const still = await ev("document.querySelectorAll('.sl-tile.blank').length");
    if (still !== 1) throw new Error("滑完空格数不对：" + still);
  },

  mole: async (ev, sleep) => {
    const n = await ev("document.querySelectorAll('.hole').length");
    if (n !== 9) throw new Error("洞口数 " + n);
    await ev("document.getElementById('start').click()");
    let up = false;
    for (let i = 0; i < 14 && !up; i++) {
      await sleep(250);
      up = await ev("!!document.querySelector('.hole.up')");
    }
    if (!up) throw new Error("3 秒内没有地鼠冒头");
    await ev("document.querySelector('.hole.up').click()");
    await sleep(150);
    const score = await ev("document.getElementById('score').textContent");
    if (score !== "1") throw new Error("敲中没加分：" + score);
  },

  tictactoe: async (ev, sleep) => {
    const n = await ev("document.querySelectorAll('.ttt-cell').length");
    if (n !== 9) throw new Error("格子数 " + n);
    await ev("document.querySelectorAll('.ttt-cell')[4].click()");
    await sleep(450);
    const x = await ev("document.querySelectorAll('.ttt-cell.x').length");
    const o = await ev("document.querySelectorAll('.ttt-cell.o').length");
    if (x !== 1 || o !== 1) throw new Error("落子后应手不对：X" + x + " O" + o);
  },

  connect4: async (ev, sleep) => {
    const n = await ev("document.querySelectorAll('.c4-cell').length");
    if (n !== 42) throw new Error("格子数 " + n);
    await ev("document.querySelectorAll('.c4-cell')[3].click()");
    await sleep(500);
    const p1 = await ev("document.querySelectorAll('.c4-cell.p1').length");
    const p2 = await ev("document.querySelectorAll('.c4-cell.p2').length");
    if (p1 !== 1 || p2 !== 1) throw new Error("落子后应手不对：红" + p1 + " 黄" + p2);
  },

  pong: async (ev, sleep) => {
    const w = await ev("document.getElementById('board').width");
    if (!w) throw new Error("画布没有尺寸");
    await ev("document.querySelector('.overlay .btn').click()");
    await sleep(600);
    const hidden = await ev("!document.querySelector('.overlay').classList.contains('show')");
    if (!hidden) throw new Error("点开始后遮罩没关");
    await ev("document.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}))");
    await sleep(200);
    await ev("document.dispatchEvent(new KeyboardEvent('keyup',{key:'ArrowDown',bubbles:true}))");
  },

  tiles: async (ev, sleep) => {
    await ev("document.querySelector('.overlay .btn').click()");
    await sleep(100);
    const rows = await ev("document.querySelectorAll('.t-row').length");
    if (rows !== 5) throw new Error("行数 " + rows);
    const ok = await ev(`(function(){
      var cells = document.querySelectorAll('.t-row:last-child .t-cell.black:not(.hit)');
      if (!cells.length) return false;
      cells[0].click();
      return true;
    })()`);
    if (!ok) throw new Error("最下面一行没有黑块");
    await sleep(120);
    const score = await ev("document.getElementById('score').textContent");
    if (score !== "1") throw new Error("踩中没加分：" + score);
  },

  target: async (ev, sleep) => {
    await ev("document.querySelector('.overlay .btn').click()");
    await sleep(800);
    const count = await ev("document.querySelectorAll('.tg-target').length");
    if (!count) throw new Error("没有生成靶子");
    await ev("document.querySelector('.tg-target').click()");
    await sleep(150);
    const score = await ev("document.getElementById('score').textContent");
    if (score === "0") throw new Error("打中靶子没加分");
  },

  reaction: async (ev, sleep) => {
    await ev("document.querySelector('.overlay .btn').click()");
    let go = false;
    for (let i = 0; i < 30 && !go; i++) {
      await sleep(150);
      go = await ev("document.querySelector('.rc-pad').classList.contains('go')");
    }
    if (!go) throw new Error("5 秒内灯没变绿");
    await ev("document.querySelector('.rc-pad').click()");
    await sleep(150);
    const last = await ev("document.getElementById('last').textContent");
    if (!/[0-9]/.test(last)) throw new Error("没有记下反应时间：" + last);
  },

  schulte: async (ev, sleep) => {
    const n = await ev("document.querySelectorAll('.sc-cell').length");
    if (n !== 25) throw new Error("格子数 " + n);
    await ev("document.querySelector('.overlay .btn').click()");
    await sleep(100);
    const clicked = await ev(`(function(){
      var cells = document.querySelectorAll('.sc-cell');
      for (var i = 0; i < cells.length; i++) {
        if (cells[i].textContent === '1') { cells[i].click(); return true; }
      }
      return false;
    })()`);
    if (!clicked) throw new Error("找不到数字 1");
    await sleep(120);
    const prog = await ev("document.getElementById('prog').textContent");
    if (prog !== "1 / 25") throw new Error("进度不对：" + prog);
  },

  simon: async (ev, sleep) => {
    const n = await ev("document.querySelectorAll('.sm-pad').length");
    if (n !== 4) throw new Error("色块数 " + n);
    await ev("document.querySelector('.overlay .btn').click()");
    let on = false;
    for (let i = 0; i < 25 && !on; i++) {
      await sleep(120);
      on = await ev("!!document.querySelector('.sm-pad.on')");
    }
    if (!on) throw new Error("3 秒内没有亮灯");
  },

  sokoban: async (ev, sleep) => {
    await ev("document.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}))");
    await sleep(150);
    const moved = await ev(`(function(){
      var cs = Array.prototype.slice.call(document.querySelectorAll('.sok-cell'));
      var p = document.querySelector('.sok-cell.player');
      return !!p && cs.length > 0;
    })()`);
    if (!moved) throw new Error("玩家不见了");
  },

  twentyfour: async (ev, sleep) => {
    const n = await ev("document.querySelectorAll('.tf-card').length");
    if (n !== 4) throw new Error("牌数 " + n);
    await ev("document.querySelectorAll('.tf-card')[0].click()");
    await ev("document.querySelectorAll('.tf-card')[1].click()");
    await ev("document.getElementById('op-add').click()");
    await sleep(120);
    const left = await ev("document.querySelectorAll('.tf-card').length");
    if (left !== 3) throw new Error("合并后牌数不对：" + left);
  },

  guess: async (ev, sleep) => {
    await ev("document.getElementById('num').value='50'");
    await ev("document.getElementById('submit').click()");
    await sleep(120);
    const msg = await ev("document.getElementById('msg').textContent");
    if (!msg || msg === "先猜一个数") throw new Error("提交后没有反馈");
    const tries = await ev("document.getElementById('tries').textContent");
    if (tries !== "1") throw new Error("次数没记上：" + tries);
  },

  hanoi: async (ev, sleep) => {
    const n = await ev("document.querySelectorAll('.hn-peg').length");
    if (n !== 3) throw new Error("柱子数 " + n);
    await ev("document.querySelectorAll('.hn-peg')[0].click()");
    await ev("document.querySelectorAll('.hn-peg')[1].click()");
    await sleep(120);
    const moves = await ev("document.getElementById('moves').textContent");
    if (moves !== "1") throw new Error("移动没记上：" + moves);
    const disks = await ev("document.querySelectorAll('.hn-disk').length");
    if (disks !== 5) throw new Error("盘子数不对：" + disks);
  }
};