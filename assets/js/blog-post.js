// Renders a single post into #post-root, reading from window.BLOG_POSTS_DIR
// (a path relative to the page, defaulting to "../posts/") and the "post"
// query-string parameter. Shared by every blog section.
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

      renderToc(root.querySelector(".post-body"));
    })
    .catch(function (err) {
      root.innerHTML = '<p class="post-error">Couldn\'t load this post (' + escapeHtml(err.message) + ").</p>";
      var toc = document.getElementById("toc");
      if (toc) toc.hidden = true;
    });
})();
