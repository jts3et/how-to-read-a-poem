// Presenter view toggle — adds body.present, remembered across pages.
(function () {
  var KEY = "htrap-present";
  function apply(on) {
    document.body.classList.toggle("present", on);
    var b = document.getElementById("presentBtn");
    if (b) { b.classList.toggle("active", on); b.textContent = on ? "Presenting" : "Present"; }
  }
  try { apply(localStorage.getItem(KEY) === "1"); } catch (e) {}
  var btn = document.getElementById("presentBtn");
  if (btn) btn.addEventListener("click", function () {
    var on = !document.body.classList.contains("present");
    try { localStorage.setItem(KEY, on ? "1" : "0"); } catch (e) {}
    apply(on);
  });
})();
