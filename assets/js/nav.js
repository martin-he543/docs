(function () {
  var MEMRISE_LOGO_SVG =
    '<svg class="memrise-logo" viewBox="0 0 200 190" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<text x="100" y="78" text-anchor="middle" font-family="\'Baloo 2\', sans-serif" font-weight="800" font-size="76" letter-spacing="-2">MEM</text>' +
    '<text x="100" y="162" text-anchor="middle" font-family="\'Baloo 2\', sans-serif" font-weight="800" font-size="76" letter-spacing="-2">RISE</text>' +
    "</svg>";

  function renderNav(root, opts) {
    var base = (opts && opts.base) || "";
    root.innerHTML =
      '<a href="' + base + 'index.html">Home</a>' +
      '<a href="' + base + 'blog/index.html">Blog</a>' +
      '<a href="' + base + 'memrise/index.html" class="memrise-link">' + MEMRISE_LOGO_SVG + "Memrise</a>";
  }

  function init() {
    var root = document.getElementById("site-nav");
    if (!root) return;
    renderNav(root, { base: root.dataset.base || "" });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
