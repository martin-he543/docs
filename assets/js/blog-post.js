// Renders a single post into #post-root, reading from window.BLOG_POSTS_DIR
// (a path relative to the page, defaulting to "../posts/") and the "post"
// query-string parameter. Shared by every blog section.
//
// Posts with tagged entries (**[Tag] Title** or headings that contain
// .chg-tag spans) get a toolbar to filter by tag, sort, and search.
// Blog posts without inline tags but with two or more same-level sections
// still get search + sort over those sections.
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

  function tagsFrom(el) {
    return Array.prototype.map.call(el.querySelectorAll(".chg-tag"), function (t) {
      return t.textContent.trim();
    }).filter(Boolean);
  }

  function collectTaggedParagraphEntries(nodes, isHeading) {
    var isEntryMarker = function (el) {
      if (el.tagName !== "P" || !el.querySelector(".chg-tag")) return false;
      var first = el.firstElementChild;
      if (!first) return false;
      return first.tagName === "STRONG" || first.classList.contains("chg-tag");
    };

    var entries = [];
    var currentEntry = null;
    var stack = [];

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
          tags: tagsFrom(el),
          title: el.textContent.trim(),
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
    return entries;
  }

  function collectHeadingEntries(nodes, isHeading) {
    var headings = nodes.filter(isHeading);
    if (headings.length < 2) return [];

    var counts = {};
    headings.forEach(function (h) {
      var lv = Number(h.tagName.charAt(1));
      counts[lv] = (counts[lv] || 0) + 1;
    });
    var sectionLevel = null;
    Object.keys(counts).map(Number).sort(function (a, b) { return a - b; }).forEach(function (lv) {
      if (sectionLevel === null && counts[lv] >= 2) sectionLevel = lv;
    });
    if (sectionLevel === null) return [];

    var entries = [];
    var current = null;
    var stack = [];

    nodes.forEach(function (el) {
      if (isHeading(el)) {
        var level = Number(el.tagName.charAt(1));
        while (stack.length && Number(stack[stack.length - 1].tagName.charAt(1)) >= level) {
          stack.pop();
        }
        if (level === sectionLevel) {
          current = {
            elements: [el],
            ancestors: stack.slice(),
            tags: tagsFrom(el),
            title: el.textContent.trim(),
            text: el.textContent.toLowerCase()
          };
          entries.push(current);
        } else if (level < sectionLevel) {
          current = null;
        } else if (current) {
          current.elements.push(el);
          current.text += " " + el.textContent.toLowerCase();
        }
        stack.push(el);
        return;
      }
      if (current) {
        current.elements.push(el);
        current.text += " " + el.textContent.toLowerCase();
      }
    });
    return entries.length >= 2 ? entries : [];
  }

  // Builds a toolbar that lets you filter by tag, search, and reorder
  // discrete entries — changelog lines or blog-post sections.
  function initChangelogTools(article) {
    var nodes = Array.prototype.slice.call(article.children);
    var isHeading = function (el) { return /^H[1-6]$/.test(el.tagName); };

    var tagged = collectTaggedParagraphEntries(nodes, isHeading);
    var entries = tagged.length ? tagged : collectHeadingEntries(nodes, isHeading);
    var isChangelog = tagged.length > 0;

    if (!entries.length) return;

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
    var tagGroupHeadings = {};
    var parked = document.createDocumentFragment();

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

      Object.keys(tagGroupHeadings).forEach(function (tag) {
        var heading = tagGroupHeadings[tag];
        if (!heading.parentNode) return;
        var any = entries.some(function (e) {
          return !e.elements[0].hidden && e.tags.indexOf(tag) !== -1;
        });
        heading.hidden = uiState.order !== "tag" || !any;
      });
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
    var firstEntryEl = entries[0] && entries[0].elements[0];
    var firstEntryIdx = firstEntryEl ? nodes.indexOf(firstEntryEl) : 0;
    if (firstEntryIdx < 0) firstEntryIdx = 0;

    var preambleEnd = isChangelog && outerLevel !== null
      ? nodes.findIndex(function (el) {
          return isHeading(el) && Number(el.tagName.charAt(1)) === outerLevel;
        })
      : firstEntryIdx;
    if (preambleEnd === -1) preambleEnd = firstEntryIdx;
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
      if (!isChangelog || outerLevel === null) {
        var flat = preamble.slice();
        var list = entries.slice();
        if (order === "oldest") list.reverse();
        list.forEach(function (e) {
          flat.push.apply(flat, e.elements);
        });
        return flat;
      }
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

    function primaryTag(entry) {
      return entry.tags[0] || "Untagged";
    }

    function applyOrder() {
      var frag = document.createDocumentFragment();

      if (uiState.order === "tag" || uiState.order === "title") {
        preamble.forEach(function (el) { frag.appendChild(el); });
        entryHeadings.forEach(function (h) { parked.appendChild(h); });

        if (uiState.order === "title") {
          entries.slice().sort(function (a, b) {
            return a.title.localeCompare(b.title);
          }).forEach(function (e) {
            e.elements.forEach(function (el) { frag.appendChild(el); });
          });
        } else {
          var groups = {};
          allTags.forEach(function (tag) { groups[tag] = []; });
          entries.forEach(function (e) {
            var tag = primaryTag(e);
            if (!groups[tag]) groups[tag] = [];
            groups[tag].push(e);
          });

          Object.keys(groups).sort(function (a, b) { return a.localeCompare(b); }).forEach(function (tag) {
            if (!groups[tag].length) return;
            var heading = tagGroupHeadings[tag];
            if (!heading) {
              heading = document.createElement("h3");
              heading.className = "changelog-tag-group";
              heading.id = "tag-" + tag.toLowerCase().replace(/[^a-z0-9]+/g, "-");
              heading.textContent = tag;
              tagGroupHeadings[tag] = heading;
            }
            heading.hidden = false;
            frag.appendChild(heading);
            groups[tag].forEach(function (e) {
              e.elements.forEach(function (el) { frag.appendChild(el); });
            });
          });
        }
      } else {
        Object.keys(tagGroupHeadings).forEach(function (tag) {
          parked.appendChild(tagGroupHeadings[tag]);
        });
        reorderedNodes(uiState.order).forEach(function (el) { frag.appendChild(el); });
      }

      article.appendChild(frag);
      applyVisibility();
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
    searchInput.placeholder = isChangelog ? "Search this changelog…" : "Search this post…";
    searchInput.setAttribute("aria-label", isChangelog ? "Search this changelog" : "Search this post");
    searchInput.addEventListener("input", function () {
      uiState.search = searchInput.value;
      applyVisibility();
    });
    searchWrap.appendChild(searchInput);

    var sortToggle = document.createElement("div");
    sortToggle.className = "sort-toggle";
    sortToggle.setAttribute("role", "group");
    sortToggle.setAttribute("aria-label", "Sort order");
    var sortOptions = isChangelog
      ? [["newest", "Newest first"], ["oldest", "Oldest first"]].concat(allTags.length ? [["tag", "By tag"]] : [["title", "Title A–Z"]])
      : [["newest", "Original"], ["oldest", "Reversed"]].concat(allTags.length ? [["tag", "By tag"]] : [["title", "Title A–Z"]]);
    sortOptions.forEach(function (opt) {
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
    emptyMsg.textContent = isChangelog ? "No changes match your filters." : "No sections match your filters.";
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
        .map(function (t) {
          return '<a class="tag" href="./index.html?tag=' + encodeURIComponent(t) + '">' + escapeHtml(t) + "</a>";
        })
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
