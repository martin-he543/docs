// Renders a post listing into #post-list, reading from window.BLOG_POSTS_DIR
// (a path relative to the page, defaulting to "../posts/"). Lets multiple
// blog sections (e.g. /blog/, /memrise/) share the same rendering logic
// while pointing at separate posts folders. Also renders a toolbar above
// the list for filtering by tag, sorting, and switching list/grid view.
(function () {
  "use strict";

  var postsDir = window.BLOG_POSTS_DIR || "../posts/";
  var listEl = document.getElementById("post-list");
  var introEl = document.getElementById("intro");

  var state = { tags: new Set(), sort: "date-desc", view: "list" };

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    var d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  }

  function postCardHtml(post) {
    var tags = (post.meta.tags || [])
      .map(function (t) { return '<span class="tag">' + escapeHtml(t) + "</span>"; })
      .join("");
    return (
      '<a class="post-card" href="./post.html?post=' + encodeURIComponent(post.file) + '">' +
        '<h2 class="post-card-title">' + escapeHtml(post.title) + "</h2>" +
        (post.meta.summary ? '<p class="post-card-summary">' + escapeHtml(post.meta.summary) + "</p>" : "") +
        '<div class="post-meta">' +
          (post.meta.date ? "<time>" + formatDate(post.meta.date) + "</time>" : "") +
          '<span class="tag-list">' + tags + "</span>" +
        "</div>" +
      "</a>"
    );
  }

  function feedConfig() {
    return window.BLOG_FEED || null;
  }

  function buildFeedSubscribe() {
    var feed = feedConfig();
    if (!feed || !feed.url) return null;

    var abs = feed.absolute || feed.url;
    var encoded = encodeURIComponent(abs);
    var wrap = document.createElement("div");
    wrap.className = "feed-subscribe";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", "Subscribe to RSS");

    var links = [
      { href: feed.url, label: "RSS" },
      { href: "https://feedly.com/i/subscription/feed/" + encoded, label: "Add to Feedly" },
      { href: "https://www.inoreader.com/?add_feed=" + encoded, label: "Add to Inoreader" },
      { href: "https://www.newsblur.com/?url=" + encoded, label: "Add to NewsBlur" }
    ];

    links.forEach(function (item, i) {
      var a = document.createElement("a");
      a.className = "feed-btn" + (i === 0 ? " feed-btn--rss" : "");
      a.href = item.href;
      if (i > 0) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      } else {
        a.rel = "alternate";
        a.type = "application/rss+xml";
      }
      a.innerHTML = (i === 0 ? RSS_ICON_SVG : "") + escapeHtml(item.label);
      wrap.appendChild(a);
    });

    return wrap;
  }

  var RSS_ICON_SVG =
    '<svg class="feed-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path fill="currentColor" d="M6.18 17.82a2.18 2.18 0 1 1-4.36 0 2.18 2.18 0 0 1 4.36 0ZM1.5 8.25v3.17c6.15 0 11.08 4.93 11.08 11.08h3.17C15.75 14.33 9.67 8.25 1.5 8.25Zm0-6.75v3.18C13.09 4.68 19.32 10.91 19.32 22.5H22.5C22.5 9.18 12.82 1.5 1.5 1.5Z"/>' +
    "</svg>";

  function buildToolbar(allTags) {
    var toolbar = document.createElement("div");
    toolbar.className = "list-toolbar";

    var feedBar = buildFeedSubscribe();
    if (feedBar) toolbar.appendChild(feedBar);

    var tagFilter = document.createElement("div");
    tagFilter.className = "tag-filter";
    tagFilter.setAttribute("role", "group");
    tagFilter.setAttribute("aria-label", "Filter by tag");

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
        state.tags.clear();
      } else if (state.tags.has(tag)) {
        state.tags.delete(tag);
      } else {
        state.tags.add(tag);
      }
      Array.prototype.forEach.call(tagFilter.children, function (el) {
        var active = el.dataset.tag === "" ? state.tags.size === 0 : state.tags.has(el.dataset.tag);
        el.classList.toggle("is-active", active);
      });
      render();
    });

    var controls = document.createElement("div");
    controls.className = "list-toolbar-controls";

    var sortLabel = document.createElement("label");
    sortLabel.className = "sort-control";
    sortLabel.textContent = "Sort ";
    var sortSelect = document.createElement("select");
    sortSelect.setAttribute("aria-label", "Sort posts");
    [
      ["date-desc", "Newest first"],
      ["date-asc", "Oldest first"],
      ["title-asc", "Title A–Z"],
      ["title-desc", "Title Z–A"],
      ["tag-asc", "Tag A–Z"]
    ].forEach(function (opt) {
      var o = document.createElement("option");
      o.value = opt[0];
      o.textContent = opt[1];
      sortSelect.appendChild(o);
    });
    sortSelect.addEventListener("change", function () {
      state.sort = sortSelect.value;
      render();
    });
    sortLabel.appendChild(sortSelect);

    var viewToggle = document.createElement("div");
    viewToggle.className = "view-toggle";
    viewToggle.setAttribute("role", "group");
    viewToggle.setAttribute("aria-label", "View");
    ["list", "grid"].forEach(function (v) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.view = v;
      btn.textContent = v === "list" ? "List" : "Grid";
      if (v === state.view) btn.classList.add("is-active");
      viewToggle.appendChild(btn);
    });
    viewToggle.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-view]");
      if (!btn) return;
      state.view = btn.dataset.view;
      Array.prototype.forEach.call(viewToggle.children, function (el) {
        el.classList.toggle("is-active", el.dataset.view === state.view);
      });
      render();
    });

    controls.appendChild(sortLabel);
    controls.appendChild(viewToggle);

    toolbar.appendChild(tagFilter);
    toolbar.appendChild(controls);
    return toolbar;
  }

  var allPosts = [];
  var render = function () {};

  fetch(postsDir + "index.json")
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (files) {
      if (!files.length) {
        introEl.textContent = "No posts yet. Add a .md file to " + postsDir + " to get started.";
        return [];
      }
      return Promise.all(
        files.map(function (file) {
          return fetch(postsDir + file)
            .then(function (r) { return r.text(); })
            .then(function (md) {
              var parsed = window.SimpleMarkdown.parsePost(md);
              return { file: file, title: parsed.title || file, meta: parsed.meta };
            })
            .catch(function () { return null; });
        })
      );
    })
    .then(function (posts) {
      allPosts = posts.filter(Boolean);
      if (!allPosts.length) return;

      var tagSet = new Set();
      allPosts.forEach(function (p) {
        (p.meta.tags || []).forEach(function (t) { tagSet.add(t); });
      });
      var allTags = Array.from(tagSet).sort(function (a, b) { return a.localeCompare(b); });

      listEl.parentNode.insertBefore(buildToolbar(allTags), listEl);

      render = function () {
        var visible = allPosts.filter(function (p) {
          if (state.tags.size === 0) return true;
          var tags = p.meta.tags || [];
          return tags.some(function (t) { return state.tags.has(t); });
        });

        visible.sort(function (a, b) {
          switch (state.sort) {
            case "date-asc":
              return (a.meta.date || "").localeCompare(b.meta.date || "");
            case "title-asc":
              return a.title.localeCompare(b.title);
            case "title-desc":
              return b.title.localeCompare(a.title);
            case "tag-asc":
              return (a.meta.tags || []).join(",").localeCompare((b.meta.tags || []).join(",")) ||
                a.title.localeCompare(b.title);
            case "date-desc":
            default:
              return (b.meta.date || "").localeCompare(a.meta.date || "");
          }
        });

        listEl.classList.toggle("post-list--grid", state.view === "grid");
        listEl.innerHTML = "";

        if (!visible.length) {
          var li = document.createElement("li");
          li.className = "empty-state";
          li.textContent = "No posts match the selected tag(s).";
          listEl.appendChild(li);
          return;
        }

        visible.forEach(function (post) {
          var li = document.createElement("li");
          li.innerHTML = postCardHtml(post);
          listEl.appendChild(li);
        });
      };

      render();
    })
    .catch(function (err) {
      introEl.textContent = "Couldn't load posts (" + err.message + ").";
    });
})();
