// Soft name-gate + presenter switch. No accounts: a name, stored on the device,
// tags submissions so the Board shows real participation. ?author=1 = presenter.
(function () {
  var KEY = "htrap-name";
  var params = new URLSearchParams(location.search);
  if (params.get("author") === "1") document.body.classList.add("author");
  function get() { try { return localStorage.getItem(KEY) || ""; } catch (e) { return ""; } }
  function set(n) { try { localStorage.setItem(KEY, n); } catch (e) {} }
  window.HTRAPname = get;

  document.addEventListener("DOMContentLoaded", function () {
    var practice = document.getElementById("practice");
    var input = document.getElementById("scanName");
    if (input && get()) input.value = get();
    if (input) input.addEventListener("change", function () { if (this.value.trim()) set(this.value.trim()); });
    if (!practice || get() || params.get("author") === "1") return;

    var room = (typeof ROOM !== "undefined") ? ROOM : "disi";
    var ov = document.createElement("div"); ov.className = "namegate";
    var box = document.createElement("div"); box.className = "ngbox";
    box.innerHTML = "<h2>Join the room</h2><p>Enter a name to scan and submit.<br>Room: <b>" +
      room + "</b></p>";
    var ni = document.createElement("input"); ni.maxLength = 40; ni.placeholder = "your name";
    var bt = document.createElement("button"); bt.className = "btn"; bt.textContent = "Join";
    box.appendChild(ni); box.appendChild(bt); ov.appendChild(box); document.body.appendChild(ov);
    ni.focus();
    function join() { var v = ni.value.trim(); if (!v) { ni.focus(); return; } set(v); if (input) input.value = v; ov.remove(); }
    bt.addEventListener("click", join);
    ni.addEventListener("keydown", function (e) { if (e.key === "Enter") join(); });
  });
})();
