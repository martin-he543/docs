(function () {
  "use strict";

  // Traced from https://martinhe.co.uk/assets/icons/memrise.png via potrace.
  var MEMRISE_LOGO_SVG =
    '<svg class="memrise-logo" viewBox="0 0 788 744" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<g transform="translate(0,744) scale(0.1,-0.1)" fill="currentColor" stroke="none">' +
    '<path d="M1165 6331 c-129 -7 -165 -18 -198 -62 -20 -28 -19 21 -28 -1404 0 -27 2 -270 5 -538 6 -522 5 -515 58 -565 38 -35 80 -42 251 -42 200 0 216 6 248 87 24 58 24 62 27 512 2 400 1 459 -14 503 -18 56 -15 151 5 171 10 9 19 5 40 -22 14 -18 43 -54 64 -79 21 -25 58 -75 82 -111 68 -104 94 -124 164 -129 52 -4 63 -1 94 22 19 15 64 70 101 124 37 53 93 131 127 172 33 41 66 87 75 103 17 31 38 35 50 10 4 -10 10 -247 13 -528 7 -568 5 -551 75 -583 36 -17 64 -19 212 -18 169 2 172 2 206 28 74 56 69 -27 65 1180 l-4 1081 -40 38 c-22 20 -58 42 -79 48 -52 14 -289 14 -317 0 -41 -21 -78 -64 -114 -129 -20 -36 -42 -72 -49 -80 -7 -8 -40 -64 -74 -125 -66 -116 -96 -164 -193 -310 -34 -49 -72 -107 -86 -127 -13 -21 -31 -38 -38 -38 -12 0 -49 52 -104 147 -108 187 -153 270 -189 348 -79 173 -125 257 -152 281 -33 27 -89 45 -133 42 -16 -1 -84 -4 -150 -7z M3235 6328 c-50 -11 -89 -48 -104 -97 -8 -28 -11 -330 -13 -1074 l-1 -1036 24 -47 c45 -88 -14 -82 860 -80 l771 1 29 33 c34 38 36 67 18 265 -12 137 -28 173 -88 202 -31 15 -66 16 -321 10 -157 -3 -358 -2 -447 2 -140 8 -166 11 -190 29 -49 36 -58 68 -57 190 1 133 17 171 87 199 37 15 69 16 297 10 305 -8 343 -4 386 41 37 39 43 65 51 249 5 119 3 145 -11 172 -27 53 -42 56 -236 50 -206 -6 -456 7 -505 28 -55 22 -75 66 -75 163 0 207 38 221 561 202 l339 -12 45 22 c81 39 85 49 85 237 0 176 -8 210 -53 235 -27 15 -1387 21 -1452 6z M5095 6321 c-22 -10 -55 -35 -74 -56 l-34 -39 8 -145 c4 -80 7 -559 6 -1064 l-2 -918 22 -38 c37 -66 54 -71 256 -71 159 0 181 2 210 20 64 39 63 29 63 559 0 287 4 490 10 505 14 38 37 32 68 -20 15 -25 45 -69 68 -97 22 -29 68 -90 101 -137 33 -47 81 -104 107 -128 39 -36 52 -42 90 -42 25 0 56 4 69 9 23 9 79 73 137 156 32 45 115 155 135 178 37 42 38 21 32 -567 -5 -521 -4 -575 11 -615 30 -77 51 -85 222 -89 183 -5 245 7 287 51 48 49 54 89 47 292 -3 99 -2 331 4 515 6 184 7 457 3 605 -4 149 -5 432 -2 630 3 198 2 378 -3 400 -10 44 -37 80 -76 100 -16 8 -86 14 -186 18 -136 4 -166 2 -197 -11 -44 -21 -89 -77 -125 -156 -31 -69 -146 -301 -164 -331 -57 -92 -90 -149 -99 -168 -18 -40 -85 -141 -96 -144 -10 -4 -95 105 -123 157 -7 14 -26 41 -41 60 -15 19 -34 46 -41 60 -7 14 -25 43 -39 65 -14 22 -45 74 -69 115 -24 41 -56 95 -71 120 -16 25 -40 66 -54 92 -36 68 -93 124 -140 137 -22 6 -94 11 -160 11 -94 0 -129 -4 -160 -19z M4450 3774 c-60 -8 -232 -55 -294 -81 -142 -59 -260 -161 -315 -272 -49 -98 -66 -189 -64 -341 3 -209 43 -362 135 -506 57 -92 280 -301 496 -466 76 -59 148 -163 157 -229 4 -26 2 -72 -5 -104 -15 -73 -70 -136 -137 -159 -71 -24 -210 -21 -347 9 -132 28 -204 32 -245 10 l-29 -14 -7 -256 c-5 -178 -4 -264 3 -280 17 -38 77 -61 213 -84 187 -31 410 -30 542 4 279 71 490 266 584 540 27 76 28 89 28 260 0 160 -3 189 -24 260 -43 148 -122 277 -228 375 -135 125 -243 221 -328 292 -159 133 -195 185 -195 279 0 115 58 181 185 209 50 11 155 2 302 -26 106 -21 146 -10 169 44 23 56 17 434 -8 458 -31 31 -257 74 -413 78 -77 2 -156 2 -175 0z M3140 3603 c-29 -11 -65 -37 -102 -75 -68 -69 -93 -134 -86 -232 8 -121 108 -275 204 -312 55 -21 173 -15 224 11 87 45 172 133 204 210 37 88 27 194 -26 265 -32 44 -123 110 -180 132 -60 22 -175 23 -238 1z M1005 3508 c-20 -17 -41 -40 -48 -52 -9 -15 -12 -125 -14 -401 -6 -1195 -11 -1734 -18 -1842 -7 -114 -6 -124 14 -156 11 -18 31 -38 43 -44 14 -6 123 -9 277 -8 l254 1 24 29 c23 26 25 34 19 99 -19 227 -19 275 -1 322 9 24 28 58 42 74 22 27 31 30 82 30 40 0 71 -7 102 -23 72 -36 225 -162 364 -297 146 -143 243 -209 345 -235 110 -29 204 -6 236 58 14 26 18 74 22 267 5 276 8 268 -105 315 -144 61 -254 142 -268 198 -11 42 12 84 93 171 138 147 204 252 263 416 22 61 24 79 24 270 -1 195 -2 209 -27 280 -90 256 -233 407 -465 496 -149 56 -223 62 -745 63 l-478 0 -35 -31z m880 -543 c109 -19 143 -35 200 -93 59 -59 85 -130 85 -226 0 -80 -9 -113 -63 -226 -73 -153 -186 -249 -324 -277 -146 -30 -228 4 -244 103 -4 27 -8 173 -8 324 -1 246 1 279 18 315 48 104 110 119 336 80z M5402 3519 c-66 -40 -66 -40 -73 -394 -9 -495 -1 -1942 11 -2001 12 -56 44 -95 95 -114 38 -14 1445 -13 1492 1 44 14 70 89 54 153 -6 23 -13 94 -17 157 -8 129 -26 179 -74 204 -26 14 -69 15 -323 9 -343 -7 -500 3 -546 35 -16 12 -39 37 -51 56 -20 32 -21 46 -18 179 l3 145 34 35 c45 47 127 62 272 51 57 -5 194 -9 304 -9 222 -1 242 3 281 61 18 27 22 53 29 170 12 216 11 240 -12 271 -11 15 -35 30 -54 34 -19 4 -191 9 -384 11 -309 3 -355 6 -393 21 -75 32 -82 49 -82 201 0 121 2 135 23 166 39 58 96 72 262 64 267 -13 526 -11 569 5 74 28 79 44 81 257 l1 187 -28 32 -29 33 -699 0 c-661 -1 -700 -2 -728 -20z M3090 2799 c-33 -13 -68 -47 -87 -84 -14 -27 -15 -107 -9 -736 6 -520 4 -733 -4 -808 -14 -120 -6 -140 66 -172 41 -18 59 -19 222 -13 217 8 247 17 283 90 l24 49 -5 370 c-7 539 -6 754 4 990 8 190 7 214 -8 244 -29 56 -74 68 -281 74 -109 3 -190 2 -205 -4z"/>' +
    "</g></svg>";

  var HOME_ICON_SVG =
    '<svg class="nav-icon" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path fill="currentColor" d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/>' +
    "</svg>";

  var BLOG_ICON_SVG =
    '<svg class="nav-icon" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path fill="currentColor" d="M192 32c0 17.7 14.3 32 32 32c123.7 0 224 100.3 224 224c0 17.7 14.3 32 32 32s32-14.3 32-32C512 128.9 383.1 0 224 0c-17.7 0-32 14.3-32 32zm0 96c0 17.7 14.3 32 32 32c70.7 0 128 57.3 128 128c0 17.7 14.3 32 32 32s32-14.3 32-32c0-106-86-192-192-192c-17.7 0-32 14.3-32 32zM96 144c0-26.5-21.5-48-48-48S0 117.5 0 144L0 368c0 79.5 64.5 144 144 144s144-64.5 144-144s-64.5-144-144-144l-16 0 0 96 16 0c26.5 0 48 21.5 48 48s-21.5 48-48 48s-48-21.5-48-48l0-224z"/>' +
    "</svg>";

  var SEARCH_ICON_SVG =
    '<svg class="site-search-icon" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<circle cx="9" cy="9" r="6.5" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
    '<line x1="13.8" y1="13.8" x2="18" y2="18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
    "</svg>";

  function escapeHtml(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function renderNav(root, opts) {
    var base = (opts && opts.base) || "";
    root.innerHTML =
      '<a href="' + base + 'index.html" class="nav-link">' + HOME_ICON_SVG + "Home</a>" +
      '<a href="' + base + 'blog/index.html" class="nav-link">' + BLOG_ICON_SVG + "Blog</a>" +
      '<a href="' + base + 'memrise/index.html" class="memrise-link">' + MEMRISE_LOGO_SVG + "Memrise</a>" +
      '<div class="site-search">' +
        '<div class="site-search-glass">' +
          SEARCH_ICON_SVG +
          '<input type="text" class="site-search-input" placeholder="Search" aria-label="Search site" autocomplete="off" spellcheck="false">' +
        "</div>" +
        '<div class="site-search-results"></div>' +
      "</div>";
  }

  // Strips just enough markdown syntax to leave readable plain text for
  // search matching and result snippets - doesn't need to be exact.
  function stripMarkdown(text) {
    return text
      .replace(/```post-data[\s\S]*?```/gi, " ")
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\[([^\]]+)\]/g, "$1")
      .replace(/[#>*_~]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function buildSearchIndex(base) {
    var sections = [
      { label: "Blog", dir: base + "posts/", postHref: base + "blog/post.html" },
      { label: "Memrise", dir: base + "memrise/posts/", postHref: base + "memrise/post.html" }
    ];

    return Promise.all(
      sections.map(function (sec) {
        return fetch(sec.dir + "index.json")
          .then(function (r) { return r.ok ? r.json() : []; })
          .catch(function () { return []; })
          .then(function (files) {
            return Promise.all(
              files.map(function (file) {
                return fetch(sec.dir + file)
                  .then(function (r) { return r.text(); })
                  .then(function (md) {
                    var parsed = window.SimpleMarkdown
                      ? window.SimpleMarkdown.parsePost(md)
                      : { title: file, meta: {}, body: "" };
                    var meta = parsed.meta || {};
                    return {
                      section: sec.label,
                      href: sec.postHref + "?post=" + encodeURIComponent(file),
                      title: parsed.title || file,
                      tags: meta.tags || [],
                      summary: meta.summary || "",
                      bodyText: stripMarkdown(parsed.body || "")
                    };
                  })
                  .catch(function () { return null; });
              })
            );
          });
      })
    ).then(function (bySection) {
      return bySection.reduce(function (acc, recs) { return acc.concat(recs); }, []).filter(Boolean);
    });
  }

  function scoreRecord(rec, query) {
    var title = rec.title.toLowerCase();
    var tags = rec.tags.join(" ").toLowerCase();
    var summary = rec.summary.toLowerCase();
    var body = rec.bodyText.toLowerCase();

    var ti = title.indexOf(query);
    var tgi = tags.indexOf(query);
    var si = summary.indexOf(query);
    var bi = body.indexOf(query);

    if (ti === -1 && tgi === -1 && si === -1 && bi === -1) return null;

    var score = 0;
    var field = null;

    if (ti !== -1) { score += 100 - Math.min(ti, 50); field = field || "title"; }
    if (tgi !== -1) { score += 50; field = field || "tags"; }
    if (si !== -1) { score += 30; field = field || "summary"; }
    if (bi !== -1) { score += 10; field = field || "body"; }

    return { rec: rec, score: score, field: field };
  }

  function highlightSnippet(text, query, radius) {
    var idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return escapeHtml(text.slice(0, 140));
    var start = Math.max(0, idx - radius);
    var end = Math.min(text.length, idx + query.length + radius);
    var before = escapeHtml(text.slice(start, idx));
    var match = escapeHtml(text.slice(idx, idx + query.length));
    var after = escapeHtml(text.slice(idx + query.length, end));
    return (start > 0 ? "…" : "") + before + "<mark>" + match + "</mark>" + after + (end < text.length ? "…" : "");
  }

  function resultHtml(scored, query, index) {
    var rec = scored.rec;
    var titleHtml = scored.field === "title" ? highlightSnippet(rec.title, query, 60) : escapeHtml(rec.title);
    var snippetSource =
      scored.field === "tags" ? rec.tags.join(", ") :
      scored.field === "summary" ? rec.summary :
      scored.field === "body" ? rec.bodyText :
      rec.summary || rec.bodyText;
    var snippetHtml = scored.field === "title"
      ? escapeHtml(snippetSource.slice(0, 140))
      : highlightSnippet(snippetSource, query, 40);

    return (
      '<a class="search-result" href="' + rec.href + '" style="animation-delay:' + index * 35 + 'ms">' +
        '<span class="search-result-section">' + escapeHtml(rec.section) + "</span>" +
        '<span class="search-result-title">' + titleHtml + "</span>" +
        '<span class="search-result-snippet">' + snippetHtml + "</span>" +
      "</a>"
    );
  }

  function initSearch(nav, base) {
    var wrap = nav.querySelector(".site-search");
    var input = nav.querySelector(".site-search-input");
    var resultsEl = nav.querySelector(".site-search-results");
    if (!wrap || !input || !resultsEl) return;

    var indexPromise = null;
    function ensureIndex() {
      if (!indexPromise) indexPromise = buildSearchIndex(base);
      return indexPromise;
    }

    var activeIndex = -1;

    function setActive(items) {
      Array.prototype.forEach.call(items, function (el, i) {
        el.classList.toggle("is-active", i === activeIndex);
      });
      if (activeIndex >= 0 && items[activeIndex]) {
        items[activeIndex].scrollIntoView({ block: "nearest" });
      }
    }

    function renderResults(scored, query) {
      activeIndex = -1;
      if (!query) {
        resultsEl.classList.remove("is-open");
        resultsEl.innerHTML = "";
        return;
      }
      if (!scored.length) {
        resultsEl.innerHTML = '<p class="search-empty">No matches for “' + escapeHtml(query) + '”.</p>';
        resultsEl.classList.add("is-open");
        return;
      }
      resultsEl.innerHTML = scored.map(function (s, i) { return resultHtml(s, query, i); }).join("");
      resultsEl.classList.add("is-open");
    }

    var debounceTimer = null;
    input.addEventListener("input", function () {
      var query = input.value.trim();
      clearTimeout(debounceTimer);
      if (!query) {
        renderResults([], "");
        return;
      }
      debounceTimer = setTimeout(function () {
        ensureIndex().then(function (records) {
          var current = input.value.trim();
          if (!current) { renderResults([], ""); return; }
          var ql = current.toLowerCase();
          var scored = records
            .map(function (r) { return scoreRecord(r, ql); })
            .filter(Boolean)
            .sort(function (a, b) { return b.score - a.score; })
            .slice(0, 8);
          renderResults(scored, current);
        });
      }, 120);
    });

    input.addEventListener("focus", function () {
      if (input.value.trim() && resultsEl.innerHTML) resultsEl.classList.add("is-open");
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        input.value = "";
        renderResults([], "");
        input.blur();
        return;
      }
      var items = resultsEl.querySelectorAll(".search-result");
      if (!items.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        activeIndex = Math.min(items.length - 1, activeIndex + 1);
        setActive(items);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        activeIndex = Math.max(0, activeIndex - 1);
        setActive(items);
      } else if (e.key === "Enter") {
        e.preventDefault();
        var target = items[activeIndex >= 0 ? activeIndex : 0];
        if (target) window.location.href = target.getAttribute("href");
      }
    });

    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) resultsEl.classList.remove("is-open");
    });
  }

  function init() {
    var root = document.getElementById("site-nav");
    if (!root) return;
    var base = root.dataset.base || "";
    renderNav(root, { base: base });
    initSearch(root, base);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
