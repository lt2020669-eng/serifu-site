# 台本数据格式 SCHEMA（团队共用）

本文件定义每份台本的 JSON 结构。**所有台本必须遵循此格式**，转换 Skill 与静态站渲染都依赖它。不要发明新字段或新样式。

---

## 1. 单份台本文件：`content/scripts/{id}.json`

```jsonc
{
  "id": "ajitsuke-nori-200",          // 唯一 id，小写英文+数字+连字符
  "title": "味付け海苔 8切200枚",       // 展示标题（可含 <ruby>）
  "productName": "日本橋いなば園 有明産 味付け海苔 8切200枚", // 完整商品名
  "category": {
    "industry": "food",               // 行业代码（见下方枚举）
    "industryLabel": "食品",           // 行业中文名
    "subcategory": "seaweed",         // 子分类代码（可选，自定义）
    "subcategoryLabel": "海苔・乾物"    // 子分类中文名（可选）
  },
  "scriptType": "product-sheet",      // product-sheet | full-script | intro-points
  "tags": ["送料無料", "大容量", "朝食"],// 中文或日文关键词，用于筛选/搜索
  "image": "assets/images/ajitsuke-nori-200.png", // 主图相对路径，可为 null
  "sections": [ /* 见第 2 节 */ ],
  "updatedAt": "2026-07-14"           // YYYY-MM-DD
}
```

### 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `id` | ✅ | 全站唯一。用商品英文/罗马音拼，小写连字符。文件名 = `{id}.json` |
| `title` | ✅ | 详情页大标题。可含 `<ruby>` 注音片段 |
| `productName` | ✅ | 完整商品名（用于搜索、SEO） |
| `category.industry` | ✅ | 行业代码，见枚举 |
| `category.industryLabel` | ✅ | 行业中文名 |
| `category.subcategory` | ❌ | 子分类代码，自定义即可 |
| `category.subcategoryLabel` | ❌ | 子分类中文名 |
| `scriptType` | ✅ | 台本类型，见枚举 |
| `tags` | ✅ | 数组，至少 1 个 |
| `image` | ❌ | 主图相对 `site/` 的路径；无图填 `null` |
| `sections` | ✅ | 内容主体，见第 2 节 |
| `updatedAt` | ✅ | 最后更新日期 |

### 行业代码枚举（`industry`）

| 代码 | 中文名 |
|------|--------|
| `food` | 食品 |
| `apparel` | 服装 |
| `toys` | 玩具 |
| `beauty` | 美妆 |
| `home` | 居家 |
| `other` | 其他 |

> 新增行业时在此表补一行，并同步 `site/assets/app.js` 里的 `INDUSTRIES` 常量。

### 台本类型枚举（`scriptType`）

| 代码 | 中文名 | 用途 |
|------|--------|------|
| `product-sheet` | 商品资料卡 | 结构化卖点+FAQ+见せ方（如味付け海苔） |
| `full-script` | 完整台本 | 从头到尾可念的直播台本 |
| `intro-points` | 介绍要点 | 只列要点/话术，不成整篇 |

---

## 2. `sections[]` 结构

台本正文按 **h2 大节** 组织，每个大节含若干 **block**。

```jsonc
{
  "id": "features",           // 节内锚点 id（英文），用于目录跳转
  "title": "商品の特徴",       // 大节标题（可含 <ruby>）
  "level": 2,                 // 固定为 2（大节）
  "blocks": [
    { "type": "h3", "text": "有明産の海苔を使用" },
    { "type": "p",  "text": "有明産の<ruby>海苔<rt>のり</rt></ruby>を使用した…" },
    { "type": "lead", "text": "使える言い回し：" },
    { "type": "list", "items": ["「…」", "「…」"] },
    { "type": "qa", "q": "何枚入りですか？", "a": "8切サイズが200枚入りです。" },
    { "type": "image", "src": "assets/images/xxx.png", "alt": "" },
    { "type": "html", "html": "<p>任意保底 HTML 片段</p>" }
  ]
}
```

### block 类型

| `type` | 字段 | 渲染 |
|--------|------|------|
| `h3` | `text` | 小节标题（橙色） |
| `p` | `text` | 正文段落 |
| `lead` | `text` | 加粗引导句（如「使える言い回し：」） |
| `list` | `items[]` | 无序列表 / 话术列表 |
| `qa` | `q`, `a` | FAQ 问答对 |
| `image` | `src`, `alt` | 图片 |
| `html` | `html` | **保底**：无法归类的原始 HTML 片段，原样输出 |

### ふりがな（注音）规则

- 正文一律保留 HTML 片段：`<ruby>漢字<rt>かんじ</rt></ruby>`
- 渲染时 **原样输出**，不转义
- 转换时如对读音没把握，仍用 `<ruby>` 尽力标注，并在回复中列出「需人工校对」清单
- **除 `<ruby><rt>` 外，`text` / `q` / `a` 字段不应含其它 HTML 标签**（保底才用 `html` block）

---

## 3. 全站索引：`content/index.json`

只存列表摘要，供首页/列表页快速加载（不含正文）。

```jsonc
{
  "updatedAt": "2026-07-14",
  "scripts": [
    {
      "id": "ajitsuke-nori-200",
      "title": "味付け海苔 8切200枚",
      "productName": "日本橋いなば園 有明産 味付け海苔 8切200枚",
      "industry": "food",
      "industryLabel": "食品",
      "subcategory": "seaweed",
      "subcategoryLabel": "海苔・乾物",
      "scriptType": "product-sheet",
      "tags": ["送料無料", "大容量"],
      "image": "assets/images/ajitsuke-nori-200.png",
      "contentPath": "../content/scripts/ajitsuke-nori-200.json",
      "updatedAt": "2026-07-14"
    }
  ]
}
```

> `contentPath` 是相对 `site/` 页面的路径（页面在 `site/`，数据在 `content/`，故为 `../content/scripts/{id}.json`）。

---

## 4. 视觉约定（不可自由改）

沿用现有台本 CSS 变量：

- `--accent: #c2410c`（主色/大节下划线/小节标题）
- `--rt: #0369a1`（ふりがな注音蓝）
- 正文 `line-height: 2.5`，大字号，移动端可读

新增台本 **不写独立 HTML、不改 CSS**；展示一律走 `site/script.html?id=...`。
