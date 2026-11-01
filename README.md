# RK的小游戏合集

线上地址：<https://zhanjhe.github.io/online-games/>

23 个网页小游戏，全部纯静态，点开即玩。没有后端、没有框架、没有构建步骤。

| 游戏 | 说明 |
| --- | --- |
| [俄罗斯方块](tetris/index.html) | 10×20 格子，消行得分，越往后越快 |
| [恋爱转盘](wheel/index.html) | 想不明白的事，交给转盘决定 |
| [恋爱塔罗](tarot/index.html) | 24 道题，抽一张属于你的牌，能分享结果 |
| [2048](2048/index.html) | 合并相同数字，凑到 2048 |
| [记忆翻牌](memory/index.html) | 翻两张，把图案配成一对 |
| [贪吃蛇](snake/index.html) | 越吃越长，别撞墙别咬到自己 |
| [扫雷](minesweeper/index.html) | 9×9 藏 10 颗雷，第一次点必定安全 |
| [五子棋](gomoku/index.html) | 11×11，两人同屏，先连成五个胜 |
| [打砖块](breakout/index.html) | 挡板接球，把砖打光，三条命 |
| [数字华容道](slide/index.html) | 4×4 滑块，把 1 到 15 排好 |
| [打地鼠](mole/index.html) | 30 秒一轮，敲到更多地鼠 |
| [井字棋](tictactoe/index.html) | 3×3，人机，AI 偶尔走错 |
| [四子棋](connect4/index.html) | 7×6，点列落子，AI 会堵会连 |
| [乒乓](pong/index.html) | 挡板对打，先到 7 分 |
| [别踩白块](tiles/index.html) | 只点最下面一行的黑块，速度递增 |
| [打靶](target/index.html) | 30 秒，点掉出现的靶子 |
| [反应灯](reaction/index.html) | 灯亮就点，5 轮取平均毫秒 |
| [舒尔特方格](schulte/index.html) | 5×5，按 1 到 25 的顺序点 |
| [记忆序列](simon/index.html) | 看亮灯顺序，跟着按 |
| [推箱子](sokoban/index.html) | 6 关，把箱子推到点上 |
| [24 点](twentyfour/index.html) | 四张牌，用加减乘除凑 24 |
| [猜数字](guess/index.html) | 1 到 100，提示大小 |
| [汉诺塔](hanoi/index.html) | 3 柱 5 盘，最少 31 步 |

## 本地打开

直接双击 `index.html`。所有资源都是相对路径，不需要起服务器，也没有构建步骤。

## 目录

```
index.html        首页，24 个卡片（23 个游戏 + 1 个「赞助作者」），带搜索和分类
sponsor/          赞助作者：一句引导语 + 赞赏码
tetris/ wheel/ tarot/ 2048/ memory/ snake/ minesweeper/ gomoku/ breakout/ slide/ mole/
tictactoe/ connect4/ pong/ tiles/ target/ reaction/ schulte/ simon/ sokoban/ twentyfour/ guess/ hanoi/
assets/           站点公共样式、图标、分享缩略图
assets/data/games.js   首页卡片数据：名字、分类、颜色、图标、路径
assets/js/        公共音效 sfx.js、新游戏外壳 game-kit.js
tarot/assets/     塔罗页自己的样式和脚本
tools/            自检脚本（需要 Node.js）
开发文档/          设计说明、游戏说明、截图
```

旧 11 个游戏的样式和脚本内联在自己的 `index.html` 里；新 12 个用 `game-kit.js` 生成外壳，只写玩法。

## 自检

```powershell
node tools/check-pages.js   # 25 个页面：结构断言 + 交互冒烟 + 截图
node tools/check-data.js    # 塔罗题库均衡性（每张牌必须被选 9 次）
node tools/live-check.js    # 同上，跑线上地址
```

`check-pages.js` 用本机 Chrome 的无头模式跑，页面清单来自 `assets/data/games.js`，每个游戏的断言在 `tools/smoke.js`。走完 25 个页面并截图到 `开发文档/预览/站点/`，有报错会非零退出。脚本里 Chrome 路径是写死的，换机器要改。

## 部署

仓库 `ZhanJHE/online-games`，Pages 走 `main` 分支根目录，`git push` 后自动重建。

```powershell
git add -A
git commit -m "改了什么"
git push
```

## 改内容

- 首页卡片顺序、分类、颜色、图标：改 `assets/data/games.js`
- 加新游戏：写页面 → `assets/data/games.js` 加一条 → `tools/smoke.js` 加一条断言 → 跑自检
- 某个游戏的参数（速度、雷数、关卡、转盘选项等）：见 [开发文档/小游戏说明.md](开发文档/小游戏说明.md)
- 塔罗的题目和文案：`tarot/assets/js/data.js`，改完跑 `node tools/check-data.js`
- 主屏幕图标：`node tools/icon.js` 重新生成 `assets/icon-180.png`
- 赞赏码：替换 `assets/img/pay.png`，文件名不变就不用改代码
- 音效：只改 `assets/js/sfx.js` 里的音色表；每个游戏用 `SFX.play("名字")` 挑音效，静音开关全站共用一个

站点结构、样式约定、验证流程见 [开发文档/站点说明.md](开发文档/站点说明.md)。

作业材料（项目说明、Vibe Coding 记录、提交清单）在 [开发文档/作业提交](开发文档/作业提交)。

## 说明

纯静态，无后端、无第三方接口、无埋点。分数只存在自己浏览器里。仅供娱乐。
