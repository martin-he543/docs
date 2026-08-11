// Renders a post listing into #post-list, reading from window.BLOG_POSTS_DIR
// (a path relative to the page, defaulting to "../posts/"). Lets multiple
// blog sections (e.g. /blog/, /memrise/) share the same rendering logic
// while pointing at separate posts folders.
(function () {
  "use strict";

  var postsDir = window.BLOG_POSTS_DIR || "../posts/";
  var listEl = document.getElementById("post-list");
  var introEl = document.getElementById("intro");

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    var d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  }

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
      posts = posts.filter(Boolean);
      posts.sort(function (a, b) {
        return (b.meta.date || "").localeCompare(a.meta.date || "");
      });

      posts.forEach(function (post) {
        var li = document.createElement("li");
        var tags = (post.meta.tags || [])
          .map(function (t) { return '<span class="tag">' + escapeHtml(t) + "</span>"; })
          .join("");

        li.innerHTML =
          '<a class="post-card" href="./post.html?post=' + encodeURIComponent(post.file) + '">' +
            '<h2 class="post-card-title">' + escapeHtml(post.title) + "</h2>" +
            (post.meta.summary ? '<p class="post-card-summary">' + escapeHtml(post.meta.summary) + "</p>" : "") +
            '<div class="post-meta">' +
              (post.meta.date ? "<time>" + formatDate(post.meta.date) + "</time>" : "") +
              '<span class="tag-list">' + tags + "</span>" +
            "</div>" +
          "</a>";
        listEl.appendChild(li);
      });
    })
    .catch(function (err) {
      introEl.textContent = "Couldn't load posts (" + err.message + ").";
    });
})();
