/* ============ 台本站前端（无依赖，纯原生） ============ */

// 行业定义（与 SCHEMA.md 行业枚举保持一致）。新增行业时改这里。
const INDUSTRIES = [
  { code: "food",    label: "食品", emoji: "🍱", live: true  },
  { code: "apparel", label: "服装", emoji: "👕", live: false },
  { code: "toys",    label: "玩具", emoji: "🧸", live: false },
  { code: "beauty",  label: "美妆", emoji: "💄", live: false },
  { code: "home",    label: "居家", emoji: "🏠", live: false },
];

const SCRIPT_TYPE_LABEL = {
  "product-sheet": "商品资料卡",
  "full-script":   "完整台本",
  "intro-points":  "介绍要点",
};

/* ---------- 工具 ---------- */
function qs(name){ return new URLSearchParams(location.search).get(name); }
function el(tag, attrs = {}, children = []){
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)){
    if (k === "class") n.className = v;
    else if (k === "html") n.innerHTML = v;
    else if (k === "text") n.textContent = v;
    else if (v != null) n.setAttribute(k, v);
  }
  for (const c of [].concat(children)) if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  return n;
}
// 去掉 <ruby>/<rt> 等标签，得到纯文本（用于搜索/属性）
function plain(s){ return (s || "").replace(/<[^>]+>/g, "").trim(); }

async function loadIndex(){
  try{
    const res = await fetch("../content/index.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  }catch(e){
    document.querySelector("#app")?.appendChild(
      el("div", { class: "empty", html:
        "无法读取数据（index.json）。<br>如果是双击本地文件打开，浏览器会拦截本地读取——" +
        "请改用「双击 <b>start.bat</b> 启动本地服务器」，或部署到任意静态托管。" })
    );
    throw e;
  }
}

/* ---------- 首页：行业卡片 ---------- */
async function initHome(){
  const app = document.querySelector("#app");
  const data = await loadIndex();
  const counts = {};
  for (const s of data.scripts) counts[s.industry] = (counts[s.industry] || 0) + 1;

  const grid = el("div", { class: "grid" });
  for (const ind of INDUSTRIES){
    const n = counts[ind.code] || 0;
    const live = ind.live && n > 0;
    const card = el(live ? "a" : "div", {
      class: "card" + (live ? "" : " disabled"),
      href: live ? `category.html?industry=${ind.code}` : null,
    }, [
      el("div", { class: "emoji", text: ind.emoji }),
      el("div", { class: "name", text: ind.label }),
      el("div", { class: "meta", text: live ? `${n} 份台本` : "暂无台本" }),
      live ? null : el("span", { class: "badge-soon", text: "即将上线" }),
    ]);
    grid.appendChild(card);
  }
  app.appendChild(grid);
}

/* ---------- 列表页：某行业台本 + 搜索 + 子分类筛选 ---------- */
async function initCategory(){
  const app = document.querySelector("#app");
  const industry = qs("industry") || "food";
  const ind = INDUSTRIES.find(i => i.code === industry);
  const data = await loadIndex();
  let items = data.scripts.filter(s => s.industry === industry);

  document.title = `${ind ? ind.label : industry}台本 · 台本站`;
  document.querySelector("#crumb-industry").textContent = ind ? ind.label : industry;
  document.querySelector("#page-title").textContent = `${ind ? ind.emoji + " " + ind.label : industry}台本`;

  // 子分类
  const subs = [...new Set(items.map(s => s.subcategory).filter(Boolean))];
  const state = { q: "", sub: "" };

  const search = el("input", { type: "search", placeholder: "搜索商品名 / 标题 / 标签…" });
  const chips = el("div", { class: "chips" });
  const listBox = el("div", { class: "list" });

  function render(){
    let rows = items.slice();
    if (state.sub) rows = rows.filter(s => s.subcategory === state.sub);
    if (state.q){
      const q = state.q.toLowerCase();
      rows = rows.filter(s =>
        (plain(s.title) + " " + (s.productName||"") + " " + (s.tags||[]).join(" ")).toLowerCase().includes(q));
    }
    listBox.innerHTML = "";
    if (!rows.length){ listBox.appendChild(el("div", { class: "empty", text: "没有匹配的台本" })); return; }
    for (const s of rows) listBox.appendChild(renderItem(s));
  }

  if (subs.length){
    const mk = (code, label) => {
      const c = el("span", { class: "chip" + (state.sub === code ? " active" : ""), text: label });
      c.onclick = () => { state.sub = code; [...chips.children].forEach(x=>x.classList.remove("active")); c.classList.add("active"); render(); };
      return c;
    };
    chips.appendChild(mk("", "全部"));
    chips.firstChild.classList.add("active");
    const subLabel = {};
    items.forEach(s => { if (s.subcategory) subLabel[s.subcategory] = s.subcategoryLabel || s.subcategory; });
    subs.forEach(code => chips.appendChild(mk(code, subLabel[code])));
  }

  search.addEventListener("input", () => { state.q = search.value; render(); });

  app.appendChild(el("div", { class: "toolbar" }, [search]));
  if (subs.length) app.appendChild(chips);
  app.appendChild(listBox);
  render();
}

function renderItem(s){
  const thumb = s.image
    ? el("img", { class: "thumb", src: s.image, alt: "" })
    : el("div", { class: "thumb placeholder", text: "📄" });
  const tags = el("div", { class: "tags" }, (s.tags||[]).slice(0,4).map(t => el("span", { class:"tag", text:t })));
  return el("a", { class: "item", href: `script.html?id=${encodeURIComponent(s.id)}` }, [
    thumb,
    el("div", { class: "body" }, [
      el("div", { class: "t", html: s.title }),
      el("div", { class: "sub", text: s.productName || "" }),
      tags,
    ]),
    el("span", { class: "type-pill", text: SCRIPT_TYPE_LABEL[s.scriptType] || s.scriptType }),
  ]);
}

/* ---------- 详情页：渲染单份台本 ---------- */
async function initScript(){
  const app = document.querySelector("#app");
  const id = qs("id");
  if (!id){ app.appendChild(el("div", { class:"empty", text:"缺少 id 参数" })); return; }
  let data;
  try{
    const res = await fetch(`../content/scripts/${id}.json`, { cache:"no-cache" });
    if (!res.ok) throw new Error(res.status);
    data = await res.json();
  }catch(e){
    app.appendChild(el("div", { class:"empty", html:
      "无法读取台本。若为双击本地打开，请改用 <b>start.bat</b> 启动本地服务器。" }));
    return;
  }

  document.title = `${plain(data.title)} · 台本站`;
  const ind = INDUSTRIES.find(i => i.code === data.category?.industry);
  const crumbCat = document.querySelector("#crumb-cat");
  if (ind){ crumbCat.textContent = ind.label; crumbCat.href = `category.html?industry=${ind.code}`; }

  const layout = el("div", { class: "script-layout" });
  const toc = el("nav", { class: "toc" }, [ el("div", { class:"toc-title", text:"目录" }) ]);
  const article = el("article", { class: "script" });

  // 标题区
  article.appendChild(el("h1", { class:"headline", html: data.title }));
  if (data.productName) article.appendChild(el("p", { class:"prod", text: data.productName }));
  if (data.tags?.length) article.appendChild(
    el("div", { class:"tag-row" }, data.tags.map(t => el("span",{class:"tag",text:t}))));
  if (data.image) article.appendChild(el("img", { src: data.image, alt: "" }));

  // 各 section
  for (const sec of (data.sections||[])){
    const secId = sec.id || ("sec-" + Math.abs(hash(plain(sec.title))));
    article.appendChild(el("h2", { id: secId, html: sec.title }));
    toc.appendChild(el("a", { href: "#" + secId, html: plain(sec.title) }));
    for (const b of (sec.blocks||[])) article.appendChild(renderBlock(b));
  }

  layout.appendChild(toc);
  layout.appendChild(article);
  app.appendChild(layout);

  setupScrollSpy(toc, article);
}

function renderBlock(b){
  switch (b.type){
    case "h3":   return el("h3", { html: b.text || "" });
    case "lead": return el("p", { class:"lead", html: b.text || "" });
    case "p":    return el("p", { html: b.text || "" });
    case "list": return el("ul", {}, (b.items||[]).map(i => el("li", { html: i })));
    case "image":return el("img", { src: b.src, alt: b.alt || "" });
    case "qa":   return el("div", { class:"qa" }, [
                   el("p", { class:"q", html: b.q || "" }),
                   el("p", { class:"a", html: b.a || "" }),
                 ]);
    case "html": return el("div", { html: b.html || "" });
    default:     return el("p", { html: b.text || "" });
  }
}

function hash(s){ let h=0; for(let i=0;i<s.length;i++){ h=(h<<5)-h+s.charCodeAt(i); h|=0; } return h; }

function setupScrollSpy(toc, article){
  const links = [...toc.querySelectorAll("a")];
  const heads = [...article.querySelectorAll("h2")];
  if (!("IntersectionObserver" in window) || !heads.length) return;
  const io = new IntersectionObserver((entries) => {
    for (const en of entries){
      if (en.isIntersecting){
        const id = en.target.id;
        links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
      }
    }
  }, { rootMargin: "-60px 0px -70% 0px" });
  heads.forEach(h => io.observe(h));
}

/* ---------- 路由：根据 body[data-page] 初始化 ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "home") initHome();
  else if (page === "category") initCategory();
  else if (page === "script") initScript();
});
