// Re-lay every .parallel as ONE grid so line i of the left column and line i of the
// right column share a single row — original↔translation and original↔scansion align
// perfectly, at a standardized size, regardless of wraps or column labels.
(function () {
  function slice(nl) { return Array.prototype.slice.call(nl); }
  function mk(cls, txt) { var d = document.createElement("div"); d.className = cls; if (txt != null) d.textContent = txt; return d; }

  // Return { rows:[node…], attr:[node…], label } for one module.
  function extract(el) {
    if (el.classList.contains("allit"))
      return { rows: slice(el.querySelectorAll(".al-line")), attr: slice(el.querySelectorAll(".al-attr")) };
    if (el.classList.contains("scanbox") || el.classList.contains("scanmod")) {
      var lab = el.querySelector(".trlabel");
      return { rows: slice(el.querySelectorAll(".sline")),
               attr: slice(el.querySelectorAll(".sattr, .scannote")), label: lab && lab.textContent };
    }
    if (el.classList.contains("poem"))   // rhyme-mapped poem: keep its badge+text lines and stanza gaps
      return { rows: slice(el.children).filter(function (c) { return c.classList && (c.classList.contains("pline") || c.classList.contains("pgap")); }),
               attr: slice(el.querySelectorAll(".pattr, .pmeta")) };
    // plain text .verse
    var label = el.querySelector(".trlabel");
    var clone = el.cloneNode(true); var cl = clone.querySelector(".trlabel"); if (cl) cl.remove();
    var rows = [], attr = [];
    clone.textContent.replace(/\r/g, "").split("\n").forEach(function (ln) {
      var t = ln.replace(/\s+$/, ""); if (!t.trim()) return;
      (t.trim().charAt(0) === "—" ? attr : rows).push(mk("pa-txt", t));
    });
    return { rows: rows, attr: attr.map(function (n) { return n; }), label: label && label.textContent };
  }

  function cell(node) {
    var c = mk("pa-cell");
    if (node) { if (node.nodeType === 1) { c.classList.add("pa-el"); c.appendChild(node); } else c.appendChild(node); }
    return c;
  }
  function attrCell(nodes) {
    var c = mk("pa-cell pa-acell");
    nodes.forEach(function (n) { if (n.nodeType === 1) c.appendChild(n); else c.appendChild(mk("pa-txt", n.textContent || n)); });
    return c;
  }

  function align(p) {
    var kids = slice(p.children).filter(function (c) {
      return c.classList.contains("verse") || c.classList.contains("allit") ||
             c.classList.contains("scanbox") || c.classList.contains("scanmod") ||
             c.classList.contains("poem");
    });
    if (kids.length !== 2) return;
    var L = extract(kids[0]), R = extract(kids[1]);
    var g = mk("palign");
    g.appendChild(mk("pa-h", L.label || "")); g.appendChild(mk("pa-h", R.label || ""));
    var li = 0, ri = 0;                              // pair line-for-line; a stanza gap on the left gets an empty right cell
    while (li < L.rows.length || ri < R.rows.length) {
      var lrow = L.rows[li];
      if (lrow && lrow.classList && lrow.classList.contains("pgap")) { g.appendChild(cell(lrow)); g.appendChild(cell(null)); li++; continue; }
      g.appendChild(cell(lrow || null)); g.appendChild(cell(R.rows[ri] || null)); li++; ri++;
    }
    g.appendChild(attrCell(L.attr)); g.appendChild(attrCell(R.attr));
    p.replaceWith(g);
  }

  window.addEventListener("load", function () { slice(document.querySelectorAll(".parallel")).forEach(align); });
})();
