---
name: script-convert
description: 将 inbox/ 里的台本源文件（Markdown 或 DOCX）按 SCHEMA.md 转换为标准台本 JSON，更新 content/index.json，并把源文件归档。这是新增/更新台本的唯一入口。当用户说“把 inbox 里的 xxx 转成台本 / 转换台本 / convert script”时使用。
---

# 台本转换 Skill

你是台本站的转换器。把 `inbox/` 里的一份源文件转成符合 `SCHEMA.md` 的标准 JSON，接入静态站。

## 触发话术示例

> 把 `inbox/新商品.md` 按 SCHEMA 转成标准台本，更新 index，归档源文件。

## 执行步骤（严格按序）

1. **读规范**：先读 `SCHEMA.md` 和 `templates/script-input.md`，以它们为唯一真相来源。
2. **读源文件**：读取 `inbox/` 中指定文件。
   - Markdown：直接读。
   - DOCX：用可用工具提取文本（如无工具，请求用户先另存为 Markdown 放入 inbox）。
3. **抽取元数据**：行业、子分类、scriptType、tags、商品名、展示标题、主图。
   - 行业/scriptType 必须映射到 `SCHEMA.md` 的枚举代码（如「食品」→ `food`，「商品资料卡」→ `product-sheet`）。
   - 生成 `id`：商品英文/罗马音，小写连字符，全站唯一（与 `content/scripts/` 现有文件不冲突）。
4. **构造 sections**：
   - 每个 h2 级章节（商品の特徴 / 使用シーン / 商品の見せ方 / よくある質問 / 短い紹介文 …）→ 一个 section，`level:2`，给英文锚点 `id`。
   - 小标题 → `{type:"h3"}`；正文 → `{type:"p"}`；「使える言い回し：」这类引导句 → `{type:"lead"}`；其下话术列表 → `{type:"list", items:[…]}`；FAQ 的一问一答 → `{type:"qa", q, a}`；图片 → `{type:"image"}`。
   - 实在无法归类的原始内容才用 `{type:"html"}` 保底。
5. **注音（ふりがな）**：
   - 正文里的日语汉字用 `<ruby>漢字<rt>かんじ</rt></ruby>` 标注，渲染时原样输出。
   - `text/q/a` 字段除 `<ruby><rt>` 外不放其它标签。
   - **读音没把握时仍尽力标注**，并在最后回复里列出「⚠ 需人工校对读音」清单（逐条列出词与你标的读音）。
6. **图片**：如源文件带图，存到 `site/assets/images/{id}.png`（或保留相对路径），JSON 里 `image` 写相对 `site/` 的路径；无图填 `null`。
7. **写文件**：
   - 输出 `content/scripts/{id}.json`（UTF-8，无 BOM）。
   - 更新 `content/index.json`：追加/替换该 id 的摘要项（字段见 SCHEMA 第 3 节），`contentPath` = `../content/scripts/{id}.json`，同时更新顶层 `updatedAt`。
8. **归档源文件**：把 `inbox/` 里的源文件移动到 `archive/`（保留原名，可加日期前缀），不要删除。
9. **回复用户**：列出①生成的 id 与文件路径 ②index 是否更新 ③⚠ 需人工校对的读音清单 ④如何预览（打开 `site/index.html`）。

## 硬性约束（不可违反）

- **不发明新字段、新 block 类型、新样式**；一切以 `SCHEMA.md` 为准。
- **不写独立展示 HTML 文件**；展示统一走 `site/script.html?id=...`。
- **不改 `site/assets/app.css` 的视觉变量**（`--accent`、`--rt`、行高等）。
- **不删除源文件**，只移动到 `archive/`。
- 一次只转一份；多份请逐一处理。
- `updatedAt` 用当天日期（YYYY-MM-DD）。

## 自检清单（提交前逐项确认）

- [ ] `content/scripts/{id}.json` 能被 `JSON.parse` 成功
- [ ] 所有必填字段齐全（见 SCHEMA 第 1 节表）
- [ ] `scriptType` / `industry` 是合法枚举代码
- [ ] `content/index.json` 已含该 id，且 `contentPath` 正确
- [ ] ふりがな 用 `<ruby><rt>`，无多余标签
- [ ] 源文件已移入 `archive/`
- [ ] 已在回复中列出需人工校对项
