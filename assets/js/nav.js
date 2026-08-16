(function () {
  "use strict";

  var MEMRISE_LOGO_SVG =
    '<svg class="memrise-logo" viewBox="0 0 200 190" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<text x="100" y="78" text-anchor="middle" font-family="\'Baloo 2\', sans-serif" font-weight="800" font-size="76" letter-spacing="-2">MEM</text>' +
    '<text x="100" y="162" text-anchor="middle" font-family="\'Baloo 2\', sans-serif" font-weight="800" font-size="76" letter-spacing="-2">RISE</text>' +
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
      '<a href="' + base + 'index.html">Home</a>' +
      '<a href="' + base + 'blog/index.html">Blog</a>' +
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
