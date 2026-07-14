# 台本站

直播带货台本库。按行业浏览，导航为简体中文，台本正文保留日语 + ふりがな注音。纯静态站，无后端、无构建。

## 目录

```
inbox/          放新台本源文件（Markdown / DOCX）
templates/      script-input.md —— 固定输入模板（复制到 Google Doc 用）
content/
  index.json    全站索引（列表摘要）
  scripts/      每份台本一个 JSON
site/           静态站（首页 / 列表 / 详情）+ assets/(css/js/images)
archive/
  html-original/  原始 5 份 HTML（已归档，不删）
.cursor/skills/script-convert/  转换 Skill（新增台本的唯一入口）
SCHEMA.md       数据格式说明（团队共用）
serve.js        本地预览服务器（零依赖）
start.bat       双击启动本地预览（Windows）
```

## 本地预览

浏览器出于安全会拦截 `file://` 直接读取 JSON，所以用自带的小服务器预览：

- **Windows：双击 `start.bat`**，会自动起服务器并打开浏览器。
- 或命令行：`node serve.js`，然后访问 `http://localhost:8787/site/index.html`。

## 日常新增一份台本

1. 复制 `templates/script-input.md` 到 Google Doc（或新建 `.md`），**只填内容**，别改章节标题、别加样式。
2. 导出为 Markdown / DOCX，放进 `inbox/`。
3. 在 Cursor（Agent 模式）里说：
   > 把 `inbox/xxx.md` 按 SCHEMA 转成标准台本，更新 index，归档源文件。
4. Skill 会生成 `content/scripts/{id}.json`、更新 `content/index.json`、把源文件移到 `archive/`，并列出「需人工校对读音」项。
5. 双击 `start.bat` 预览，抽查 ふりがな 与 FAQ。完成。

> 详细字段与约束见 [SCHEMA.md](SCHEMA.md)。**不要手写独立 HTML、不要改 CSS 变量**，展示统一走 `site/script.html?id=...`。

## 在线访问（GitHub Pages）

本仓库已部署到 GitHub Pages。推送到 `main` 后约 1 分钟自动更新。

- 站点入口：见仓库 Settings → Pages 显示的地址（`/site/` 路径）。

## 现有台本（5 份）

| 商品 | 类型 | id |
|------|------|----|
| 味付け海苔 8切200枚 | 商品资料卡 | `ajitsuke-nori-200` |
| フルーツこんにゃくゼリー | 完整台本 | `fruit-konnyaku-jelly` |
| 前田家 訳ありフライドポテトスナック うす塩 | 完整台本 | `maedaya-fried-potato-usujio` |
| 無添加・大容量タイプの干し芋 | 完整台本 | `mutenka-hoshiimo-mega` |
| ソフトドライマンゴー 300g | 介绍要点 | `soft-dried-mango-300` |
