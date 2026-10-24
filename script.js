(() => {
  const views = ["homeView", "installView", "joinView", "helpView", "errorView"];
  const show = (id) => {
    views.forEach(v => document.getElementById(v).classList.toggle("hidden", v !== id));
    window.scrollTo({ top: 0, behavior: "auto" });
    const heading = document.querySelector(`#${id} h1`);
    if (heading) heading.setAttribute("tabindex", "-1"), heading.focus({ preventScroll: true });
  };
  const device = (() => {
    const ua = navigator.userAgent || "";
    if (/iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) return "ios";
    if (/Android/i.test(ua)) return "android";
    if (/Macintosh|Mac OS X/i.test(ua)) return "mac";
    if (/Windows/i.test(ua)) return "windows";
    return "unknown";
  })();
  const installUrls = {
    android: "https://play.google.com/store/apps/details?id=us.zoom.videomeetings",
    ios: "https://apps.apple.com/app/zoom-workplace/id546505307",
    windows: "https://zoom.us/download",
    mac: "https://zoom.us/download",
    unknown: "https://zoom.us/download"
  };
  const deviceNames = { android: "Android फोन किंवा टॅबलेट", ios: "iPhone किंवा iPad", windows: "Windows संगणक", mac: "Mac संगणक", unknown: "तुमचे डिव्हाइस" };
  document.getElementById("installBtn").addEventListener("click", () => {
    document.getElementById("deviceNote").textContent = `तुम्ही ${deviceNames[device]} वापरत असण्याची शक्यता आहे. Zoom च्या अधिकृत डाउनलोड पेजवर जाण्यासाठी खालील बटण दाबा.`;
    const link = document.getElementById("downloadLink");
    link.href = installUrls[device];
    link.textContent = device === "android" ? "Google Play उघडा ↗" : device === "ios" ? "App Store उघडा ↗" : "Zoom चे अधिकृत डाउनलोड पेज उघडा ↗";
    show("installView");
  });
  document.getElementById("joinBtn").addEventListener("click", () => show("joinView"));
  document.getElementById("helpBtn").addEventListener("click", () => show("helpView"));
  document.getElementById("homeLink").addEventListener("click", e => { e.preventDefault(); show("homeView"); });
  document.querySelectorAll("[data-back]").forEach(b => b.addEventListener("click", () => show("homeView")));
  document.getElementById("installDoneBtn").addEventListener("click", () => show("joinView"));
  document.getElementById("helpJoinBtn").addEventListener("click", () => show("joinView"));
  document.getElementById("errorRetryBtn").addEventListener("click", () => show("joinView"));
  document.getElementById("textSizeBtn").addEventListener("click", e => {
    const on = document.body.classList.toggle("large-text");
    e.currentTarget.setAttribute("aria-pressed", String(on));
    e.currentTarget.textContent = on ? "अ− सामान्य मजकूर" : "अ+ मोठा मजकूर";
  });

  const linkTab = document.getElementById("linkTab");
  const idTab = document.getElementById("idTab");
  const linkForm = document.getElementById("linkForm");
  const idForm = document.getElementById("idForm");
  function setTab(which) {
    const isLink = which === "link";
    linkTab.classList.toggle("active", isLink);
    idTab.classList.toggle("active", !isLink);
    linkTab.setAttribute("aria-selected", String(isLink));
    idTab.setAttribute("aria-selected", String(!isLink));
    linkForm.classList.toggle("hidden", !isLink);
    idForm.classList.toggle("hidden", isLink);
  }
  linkTab.addEventListener("click", () => setTab("link"));
  idTab.addEventListener("click", () => setTab("id"));

  function isZoomHost(host) {
    const h = host.toLowerCase().replace(/\.$/, "");
    return h === "zoom.us" || h.endsWith(".zoom.us") || h === "zoom.com" || h.endsWith(".zoom.com");
  }
  function safeZoomUrl(raw) {
    let url;
    try { url = new URL(raw.trim()); } catch (_) { return null; }
    if (!["https:", "http:"].includes(url.protocol) || !isZoomHost(url.hostname)) return null;
    if (!/^\/(j\/|my\/|wc\/|s\/|meeting\/)/i.test(url.pathname)) return null;
    url.protocol = "https:";
    return url;
  }
  linkForm.addEventListener("submit", e => {
    e.preventDefault();
    const input = document.getElementById("meetingLink");
    const error = document.getElementById("linkError");
    const url = safeZoomUrl(input.value);
    if (!url) {
      error.textContent = "कृपया https://zoom.us किंवा Zoom च्या अधिकृत सबडोमेनपासून सुरू होणारी योग्य मीटिंग लिंक पेस्ट करा.";
      input.focus();
      return;
    }
    error.textContent = "";
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  });
  idForm.addEventListener("submit", e => {
    e.preventDefault();
    const rawId = document.getElementById("meetingId").value.trim();
    const id = rawId.replace(/[\s-]/g, "");
    const passcode = document.getElementById("passcode").value.trim();
    const error = document.getElementById("idError");
    if (!/^\d{9,13}$/.test(id)) {
      error.textContent = "कृपया आमंत्रणातील मीटिंग ID टाका. ती साधारणपणे ९ ते १३ अंकांची असते.";
      document.getElementById("meetingId").focus();
      return;
    }
    error.textContent = "";
    const url = new URL(`https://zoom.us/j/${id}`);
    if (passcode) url.searchParams.set("pwd", passcode);
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  });
})();