/* 简单访问验证码门。验证码在 passcode.js（window.SITE_PASSCODE）。
   通过后本次浏览器会话内不再重复询问（sessionStorage）。 */
(function () {
  var KEY = "serifu_gate_ok_v1";
  var root = document.documentElement;

  // 本次会话已验证过 → 直接放行
  try { if (sessionStorage.getItem(KEY) === "1") return; } catch (e) {}

  // 先隐藏正文，避免内容闪现（门覆盖层例外）
  var style = document.createElement("style");
  style.textContent =
    "html.gate-locked body{visibility:hidden !important}" +
    "#gate-overlay{visibility:visible !important}" +
    "#gate-overlay{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;" +
    "background:#f4f4f5;font-family:'Hiragino Kaku Gothic ProN','Yu Gothic','Meiryo','Noto Sans CJK JP','Noto Sans SC','Microsoft YaHei',sans-serif}" +
    "#gate-overlay .box{background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:32px 28px;max-width:340px;width:calc(100% - 40px);text-align:center;box-shadow:0 10px 40px rgba(0,0,0,.08)}" +
    "#gate-overlay .logo{font-size:32px;margin-bottom:6px}" +
    "#gate-overlay h1{font-size:19px;margin:0 0 4px;color:#1a1a1a}" +
    "#gate-overlay p{font-size:13px;color:#6b7280;margin:0 0 18px}" +
    "#gate-overlay input{width:100%;font-size:26px;letter-spacing:.5em;text-align:center;padding:12px 10px;border:1px solid #e5e7eb;border-radius:10px;color:#1a1a1a;background:#fafaf9}" +
    "#gate-overlay input:focus{outline:none;border-color:#c2410c}" +
    "#gate-overlay button{width:100%;margin-top:14px;font-size:16px;padding:11px;border:none;border-radius:10px;background:#c2410c;color:#fff;cursor:pointer}" +
    "#gate-overlay button:hover{background:#a63a0b}" +
    "#gate-overlay .err{color:#dc2626;font-size:13px;min-height:18px;margin-top:10px}";
  root.appendChild(style);
  root.classList.add("gate-locked");

  function build() {
    var ov = document.createElement("div");
    ov.id = "gate-overlay";
    ov.innerHTML =
      '<div class="box">' +
      '<div class="logo">🔒</div>' +
      '<h1>请输入访问验证码</h1>' +
      '<p>本站内容仅限受邀人员查看</p>' +
      '<input id="gate-input" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="4" autocomplete="off" placeholder="••••">' +
      '<div class="err" id="gate-err"></div>' +
      '<button id="gate-btn" type="button">进入</button>' +
      '</div>';
    (document.body || root).appendChild(ov);

    var input = ov.querySelector("#gate-input");
    var err = ov.querySelector("#gate-err");
    var btn = ov.querySelector("#gate-btn");
    try { input.focus(); } catch (e) {}

    function submit() {
      var v = (input.value || "").trim();
      if (v === String(window.SITE_PASSCODE)) {
        try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
        ov.parentNode && ov.parentNode.removeChild(ov);
        root.classList.remove("gate-locked");
      } else {
        err.textContent = "验证码不正确，请重试";
        input.value = "";
        input.focus();
      }
    }
    btn.addEventListener("click", submit);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") submit(); });
    // 只允许数字
    input.addEventListener("input", function () { input.value = input.value.replace(/\D/g, ""); });
  }

  if (document.body) build();
  else document.addEventListener("DOMContentLoaded", build);
})();
