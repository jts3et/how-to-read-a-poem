// Docked, resizable split-pane PDF reader. Content stays on the left; the PDF
// docks on the right. Any page loads it; pages can auto-open one via <body data-pdf="id">.
(function () {
  var PDFS = {
    sweeney: { label: "Sweeney Agonistes", src: "./pdfs/sweeney-agonistes.pdf" },
    wasteland: { label: "The Waste Land", src: "./pdfs/the-waste-land.pdf" },
    aistudy: { label: "AI-poetry study (Porter & Machery)", src: "./pdfs/ai-poetry-study.pdf" },
  };
  var WKEY = "htrap-pane-w", OKEY = "htrap-pane-open", CKEY = "htrap-pane-cur";
  var pane, frame, sel, resizer, curId = null;

  function navH() { var t = document.querySelector(".top"); return t ? t.offsetHeight : 52; }
  function clampW(w) { return Math.max(300, Math.min(w, Math.round(window.innerWidth * 0.72))); }
  function width() { var w = parseInt(localStorage.getItem(WKEY), 10); return clampW(w || Math.round(window.innerWidth * 0.45)); }

  function layout() {
    var h = navH(), w = width(), narrow = window.innerWidth <= 820;
    pane.style.top = h + "px";
    resizer.style.top = h + "px";
    if (narrow) {
      pane.style.width = "100vw"; resizer.style.display = "none";
      document.querySelector(".wrap").style.marginRight = "0";
    } else {
      pane.style.width = w + "px"; resizer.style.display = "block"; resizer.style.right = w + "px";
      document.querySelector(".wrap").style.marginRight = w + "px";
    }
  }

  function open(id) {
    if (!PDFS[id]) return;
    curId = id; if (sel) sel.value = id;
    frame.src = PDFS[id].src + "#view=FitH";
    document.body.classList.add("haspane");
    try { localStorage.setItem(OKEY, "1"); localStorage.setItem(CKEY, id); } catch (e) {}
    layout();
  }
  function close() {
    document.body.classList.remove("haspane");
    document.querySelector(".wrap").style.marginRight = "0";
    frame.src = "about:blank";
    try { localStorage.setItem(OKEY, "0"); } catch (e) {}
  }

  function build() {
    var el = function (t, c) { var e = document.createElement(t); if (c) e.className = c; return e; };
    pane = el("div", "pdfpane");
    var head = el("div", "phead");
    sel = document.createElement("select");
    Object.keys(PDFS).forEach(function (k) { sel.appendChild(new Option(PDFS[k].label, k)); });
    sel.addEventListener("change", function () { open(sel.value); });
    var openTab = el("a"); openTab.className = "btn"; openTab.textContent = "↗"; openTab.target = "_blank";
    openTab.title = "Open in a new tab";
    sel.addEventListener("change", function () { openTab.href = PDFS[sel.value].src; });
    var x = el("button", "btn"); x.textContent = "✕"; x.title = "Close pane"; x.addEventListener("click", close);
    head.appendChild(sel); head.appendChild(openTab); var sp = el("span"); sp.style.flex = "1"; head.appendChild(sp); head.appendChild(x);
    frame = el("iframe"); frame.title = "PDF reader"; frame.src = "about:blank";
    pane.appendChild(head); pane.appendChild(frame);
    document.body.appendChild(pane);

    resizer = el("div", "presizer"); document.body.appendChild(resizer);
    var drag = false;
    resizer.addEventListener("mousedown", function (e) { drag = true; e.preventDefault(); document.body.style.userSelect = "none"; });
    window.addEventListener("mousemove", function (e) {
      if (!drag) return; var w = clampW(window.innerWidth - e.clientX);
      try { localStorage.setItem(WKEY, w); } catch (er) {} layout();
    });
    window.addEventListener("mouseup", function () { drag = false; document.body.style.userSelect = ""; });
    window.addEventListener("resize", function () { if (document.body.classList.contains("haspane")) layout(); });

    // nav launcher
    var top = document.querySelector(".top");
    if (top) {
      var b = el("button", "btn"); b.textContent = "⧉ Reading pane"; b.title = "Open the PDF beside the page";
      b.addEventListener("click", function () {
        if (document.body.classList.contains("haspane")) close();
        else open(curId || localStorage.getItem(CKEY) || "sweeney");
      });
      top.appendChild(b);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    build();
    var want = document.body.getAttribute("data-pdf");
    var wide = window.innerWidth > 820;
    if (want && wide) open(want);                                   // auto-open on this page (desktop)
    else if (localStorage.getItem(OKEY) === "1" && wide) open(localStorage.getItem(CKEY) || want || "sweeney");
  });

  window.HTRAPpane = { open: open, close: close };
})();
