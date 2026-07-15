# 主播使用说明（以 Lily 为例）

这份说明分两部分：**管理员（你）怎么把主播加进来**，和**主播怎么在网页里写笔记**。

---

## 一、管理员：把主播加进来（只需做一次）

1. 让主播先注册一个 GitHub 账号：https://github.com/signup （免费）。拿到她的**用户名**。
2. 打开仓库协作者设置：
   `https://github.com/lt2020669-eng/serifu-site/settings/access`
3. 点 **Add people** → 输入她的 GitHub 用户名 → 选 **Write** 权限 → 发送邀请。
4. 她邮箱/GitHub 会收到邀请，点接受即可。

> ⚠️ Write 权限 = 她能编辑仓库里的文件（技术上不止她自己的文件夹，靠分工约定）。这是「文件式」方案的正常边界。

**新开一个主播空间**（比如以后加 Momo）：把 `content/creators/lily/` 整个文件夹复制成 `content/creators/momo/`，改里面 `profile.json` 的 id/name，再在 `content/creators/creators.json` 里加一条 momo。可以让 AI 助手帮你做。

---

## 二、主播：怎么在网页里写 / 改笔记

全程在浏览器里完成，不用装任何软件。

### 改一篇已有的笔记

1. 打开你的笔记文件夹：
   `https://github.com/lt2020669-eng/serifu-site/tree/main/content/creators/lily/notes`
2. 点开要改的 `.md` 文件（如 `nori-personal-script.md`）。
3. 点右上角的 **铅笔图标 ✏️（Edit this file）**。
4. 直接在文本框里修改内容。写法很简单：
   - `## 标题` = 中标题，`### 小标题` = 小标题
   - `**文字**` = 加粗
   - 空一行 = 分段
5. 改完点右上角绿色 **Commit changes…** → 再点 **Commit changes** 确认。
6. 约 1 分钟后，网站上你的笔记就更新了。

### 新增一篇笔记（两步）

1. 在 notes 文件夹页面点 **Add file → Create new file**，文件名用英文，结尾 `.md`（如 `opening-lines.md`），写入内容后 Commit。
2. 打开 `content/creators/lily/profile.json`，点 ✏️ 编辑，在 `"notes"` 列表里照着样子加一条：
   ```json
   { "file": "opening-lines.md", "title": "开场白合集", "updatedAt": "2026-07-20" }
   ```
   Commit 保存。约 1 分钟后新笔记出现在你的空间里。

### 加一个直播视频

1. 先把视频传到你自己的 YouTube，设为 **不公开 / Unlisted**。
2. 复制视频链接里 `v=` 后面那串 ID（如 `https://www.youtube.com/watch?v=`**`v4F1gFy-hqg`** → ID 是 `v4F1gFy-hqg`）。
3. 编辑 `profile.json` 的 `"videos"` 列表，加一条：
   ```json
   { "title": "第二场直播回放", "youtube": "刚才那串ID" }
   ```
   Commit 保存即可。

---

## 你的空间在哪

网站 → 顶部 **主播空间** → 点你的头像卡片，就是你的专属页，有三块：
**📝 台本·剧本 ｜ 🗒 笔记 ｜ 🎬 直播视频**

访问网站需要输入全站验证码（找管理员要）。
