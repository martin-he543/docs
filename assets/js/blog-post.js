// Renders a single post into #post-root, reading from window.BLOG_POSTS_DIR
// (a path relative to the page, defaulting to "../posts/") and the "post"
// query-string parameter. Shared by every blog section.
//
// Posts written in the changelog style (entries marked with **[Tag] Title**,
// which markdown.js turns into a <strong> containing .chg-tag spans) get an
// extra toolbar for filtering by tag, sorting newest/oldest, and searching
// within the post. Plain posts are unaffected.
(function () {
  "use strict";

  var postsDir = window.BLOG_POSTS_DIR || "../posts/";
  var root = document.getElementById("post-root");

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    var d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  }

  // Nests headings by level, regardless of how deep they go (h1-h6) or
  // whether levels are skipped - same rule Wikipedia's TOC follows.
  function buildTocTree(headings) {
    var root = { level: 0, children: [] };
    var stack = [root];
    headings.forEach(function (h) {
      var node = { level: h.level, id: h.id, text: h.text, children: [] };
      while (stack.length > 1 && stack[stack.length - 1].level >= node.level) {
        stack.pop();
      }
      stack[stack.length - 1].children.push(node);
      stack.push(node);
    });
    return root.children;
  }

  function renderTocList(nodes) {
    var html = "<ul>";
    nodes.forEach(function (node) {
      html += "<li><a href=\"#" + node.id + "\">" + escapeHtml(node.text) + "</a>";
      if (node.children.length) html += renderTocList(node.children);
      html += "</li>";
    });
    return html + "</ul>";
  }

  function renderToc(article) {
    var toc = document.getElementById("toc");
    if (!toc) return;

    var headings = Array.prototype.slice
      .call(article.querySelectorAll("h1, h2, h3, h4, h5, h6"))
      .map(function (el) {
        return { level: Number(el.tagName.charAt(1)), id: el.id, text: el.textContent };
      });

    if (headings.length < 2) {
      toc.hidden = true;
      toc.innerHTML = "";
      return;
    }

    toc.hidden = false;
    toc.innerHTML = '<p class="toc-title">Contents</p>' + renderTocList(buildTocTree(headings));
  }

  // Detects changelog-style entries (a <p> led by a <strong> that contains
  // at least one .chg-tag span) and groups each entry with the paragraphs/
  // lists that follow it, up to the next entry marker or heading. Builds a
  // toolbar that lets you filter by tag, search, and flip newest/oldest.
  function initChangelogTools(article) {
    var nodes = Array.prototype.slice.call(article.children);
    var isHeading = function (el) { return /^H[1-6]$/.test(el.tagName); };
    var isEntryMarker = function (el) {
      return (
        el.tagName === "P" &&
        el.firstElementChild &&
        el.firstElementChild.tagName === "STRONG" &&
        el.querySelector(".chg-tag")
      );
    };

    var entries = [];
    var currentEntry = null;
    var stack = []; // open heading elements, outermost first

    nodes.forEach(function (el) {
      if (isHeading(el)) {
        var level = Number(el.tagName.charAt(1));
        while (stack.length && Number(stack[stack.length - 1].tagName.charAt(1)) >= level) {
          stack.pop();
        }
        stack.push(el);
        currentEntry = null;
        return;
      }
      if (isEntryMarker(el)) {
        currentEntry = {
          elements: [el],
          ancestors: stack.slice(),
          tags: Array.prototype.map.call(el.querySelectorAll(".chg-tag"), function (t) {
            return t.textContent.trim();
          }),
          text: el.textContent.toLowerCase()
        };
        entries.push(currentEntry);
        return;
      }
      if (currentEntry) {
        currentEntry.elements.push(el);
        currentEntry.text += " " + el.textContent.toLowerCase();
      }
    });

    if (!entries.length) return; // not a changelog-style post - nothing to do

    // Which headings own at least one entry (only these are ever hidden).
    var entryHeadings = new Set();
    entries.forEach(function (e) {
      e.ancestors.forEach(function (h) { entryHeadings.add(h); });
    });

    var allTags = Array.from(
      entries.reduce(function (set, e) {
        e.tags.forEach(function (t) { set.add(t); });
        return set;
      }, new Set())
    ).sort(function (a, b) { return a.localeCompare(b); });

    var uiState = { tags: new Set(), search: "", order: "newest" };

    function applyVisibility() {
      var headingVisible = new Set();
      var query = uiState.search.trim().toLowerCase();

      entries.forEach(function (e) {
        var tagOk = uiState.tags.size === 0 || e.tags.some(function (t) { return uiState.tags.has(t); });
        var searchOk = !query || e.text.indexOf(query) !== -1;
        var visible = tagOk && searchOk;
        e.elements.forEach(function (el) { el.hidden = !visible; });
        if (visible) e.ancestors.forEach(function (h) { headingVisible.add(h); });
      });

      entryHeadings.forEach(function (h) {
        h.hidden = !headingVisible.has(h);
      });

      var anyVisible = entries.some(function (e) { return !e.elements[0].hidden; });
      emptyMsg.hidden = anyVisible;
    }

    // Re-orders entries newest/oldest by grouping nodes under the outermost
    // heading level found (e.g. month headings) and, within each group, the
    // next level found (e.g. day headings), then reversing group order.
    // Content is authored newest-first, so "oldest first" is a full reverse;
    // anything before the first outer heading (a preamble) never moves.
    var levels = Array.from(entryHeadings).map(function (h) { return Number(h.tagName.charAt(1)); });
    var outerLevel = levels.length ? Math.min.apply(null, levels) : null;
    var innerLevel = levels.length ? Math.min.apply(null, levels.filter(function (l) { return l > outerLevel; }).concat(Infinity)) : null;

    var originalOrder = nodes.slice();
    var preambleEnd = outerLevel === null ? nodes.length : nodes.findIndex(function (el) {
      return isHeading(el) && Number(el.tagName.charAt(1)) === outerLevel;
    });
    if (preambleEnd === -1) preambleEnd = nodes.length;
    var preamble = originalOrder.slice(0, preambleEnd);
    var rest = originalOrder.slice(preambleEnd);

    function chunkByHeadingLevel(list, level) {
      var chunks = [];
      var current = null;
      list.forEach(function (el) {
        if (isHeading(el) && Number(el.tagName.charAt(1)) === level) {
          current = { heading: el, body: [] };
          chunks.push(current);
        } else if (current) {
          current.body.push(el);
        } else {
          chunks.push({ heading: null, body: [el] });
        }
      });
      return chunks;
    }

    function reorderedNodes(order) {
      if (outerLevel === null) return originalOrder;
      var outerChunks = chunkByHeadingLevel(rest, outerLevel);
      if (order === "oldest") outerChunks = outerChunks.slice().reverse();

      var result = preamble.slice();
      outerChunks.forEach(function (chunk) {
        if (chunk.heading) result.push(chunk.heading);
        if (innerLevel !== Infinity && innerLevel !== null) {
          var innerChunks = chunkByHeadingLevel(chunk.body, innerLevel);
          if (order === "oldest") innerChunks = innerChunks.slice().reverse();
          innerChunks.forEach(function (ic) {
            if (ic.heading) result.push(ic.heading);
            result.push.apply(result, ic.body);
          });
        } else {
          result.push.apply(result, chunk.body);
        }
      });
      return result;
    }

    function applyOrder() {
      var frag = document.createDocumentFragment();
      reorderedNodes(uiState.order).forEach(function (el) { frag.appendChild(el); });
      article.appendChild(frag);
      renderToc(article);
    }

    var toolbar = document.createElement("div");
    toolbar.className = "post-toolbar changelog-toolbar";

    var row = document.createElement("div");
    row.className = "post-toolbar-row";

    var searchWrap = document.createElement("div");
    searchWrap.className = "changelog-search-wrap";
    var searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.className = "changelog-search";
    searchInput.placeholder = "Search this changelog…";
    searchInput.setAttribute("aria-label", "Search this changelog");
    searchInput.addEventListener("input", function () {
      uiState.search = searchInput.value;
      applyVisibility();
    });
    searchWrap.appendChild(searchInput);

    var sortToggle = document.createElement("div");
    sortToggle.className = "sort-toggle";
    sortToggle.setAttribute("role", "group");
    sortToggle.setAttribute("aria-label", "Sort order");
    [["newest", "Newest first"], ["oldest", "Oldest first"]].forEach(function (opt) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.order = opt[0];
      btn.textContent = opt[1];
      if (opt[0] === uiState.order) btn.classList.add("is-active");
      sortToggle.appendChild(btn);
    });
    sortToggle.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-order]");
      if (!btn || btn.dataset.order === uiState.order) return;
      uiState.order = btn.dataset.order;
      Array.prototype.forEach.call(sortToggle.children, function (el) {
        el.classList.toggle("is-active", el.dataset.order === uiState.order);
      });
      applyOrder();
    });

    row.appendChild(searchWrap);
    row.appendChild(sortToggle);

    var tagFilter = document.createElement("div");
    tagFilter.className = "tag-filter";
    tagFilter.setAttribute("role", "group");
    tagFilter.setAttribute("aria-label", "Filter by area");
    var allChip = document.createElement("button");
    allChip.type = "button";
    allChip.className = "tag-chip is-active";
    allChip.dataset.tag = "";
    allChip.textContent = "All";
    tagFilter.appendChild(allChip);
    allTags.forEach(function (tag) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "tag-chip";
      chip.dataset.tag = tag;
      chip.textContent = tag;
      tagFilter.appendChild(chip);
    });
    tagFilter.addEventListener("click", function (e) {
      var chip = e.target.closest(".tag-chip");
      if (!chip) return;
      var tag = chip.dataset.tag;
      if (tag === "") {
        uiState.tags.clear();
      } else if (uiState.tags.has(tag)) {
        uiState.tags.delete(tag);
      } else {
        uiState.tags.add(tag);
      }
      Array.prototype.forEach.call(tagFilter.children, function (el) {
        var active = el.dataset.tag === "" ? uiState.tags.size === 0 : uiState.tags.has(el.dataset.tag);
        el.classList.toggle("is-active", active);
      });
      applyVisibility();
    });

    var emptyMsg = document.createElement("p");
    emptyMsg.className = "changelog-empty";
    emptyMsg.textContent = "No changes match your filters.";
    emptyMsg.hidden = true;

    toolbar.appendChild(row);
    if (allTags.length) toolbar.appendChild(tagFilter);
    toolbar.appendChild(emptyMsg);

    article.parentNode.insertBefore(toolbar, article);
  }

  var file = new URLSearchParams(window.location.search).get("post");

  if (!file) {
    root.innerHTML = '<p class="post-error">No post specified.</p>';
    return;
  }

  fetch(postsDir + file)
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.text();
    })
    .then(function (md) {
      var parsed = window.SimpleMarkdown.parsePost(md);
      var meta = parsed.meta || {};
      var tags = (meta.tags || [])
        .map(function (t) { return '<span class="tag">' + escapeHtml(t) + "</span>"; })
        .join("");

      document.title = (parsed.title || file) + " | Docs";

      root.innerHTML =
        "<h1>" + escapeHtml(parsed.title || file) + "</h1>" +
        '<div class="post-meta">' +
          (meta.date ? "<time>" + formatDate(meta.date) + "</time>" : "") +
          '<span class="tag-list">' + tags + "</span>" +
        "</div>" +
        (meta.summary ? '<p class="post-card-summary">' + escapeHtml(meta.summary) + "</p>" : "") +
        (meta.coverImage ? '<img src="' + postsDir + meta.coverImage + '" alt="">' : "") +
        '<article class="post-body">' + window.SimpleMarkdown.render(parsed.body) + "</article>";

      var article = root.querySelector(".post-body");
      renderToc(article);
      initChangelogTools(article);
    })
    .catch(function (err) {
      root.innerHTML = '<p class="post-error">Couldn\'t load this post (' + escapeHtml(err.message) + ").</p>";
      var toc = document.getElementById("toc");
      if (toc) toc.hidden = true;
    });
})();
