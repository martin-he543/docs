// Minimal, dependency-free markdown -> HTML renderer for the blog.
// Supports headings, bold/italic, inline code, links, images, fenced code
// blocks, blockquotes, ordered/unordered lists, horizontal rules, and
// ::instrument ... ::/instrument font switches.
// Not a full CommonMark implementation - just enough for blog posts.
(function () {
  "use strict";

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // GitHub-style heading slug: strip markdown/punctuation, lowercase, spaces -> hyphens.
  function slugify(text) {
    return (
      text
        .toLowerCase()
        .trim()
        .replace(/[`*_{}[\]()#+.!:;,'"~^|<>=/\\&]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "section"
    );
  }

  // Extracts the leading "# Title" line and the ```post-data``` JSON block.
  // Returns { title, meta, body } where body is the markdown with those
  // pieces removed.
  function parsePost(markdown) {
    var lines = markdown.replace(/\r\n/g, "\n").split("\n");
    var title = "";
    var i = 0;

    while (i < lines.length && lines[i].trim() === "") i++;
    if (i < lines.length && /^#\s+/.test(lines[i])) {
      title = lines[i].replace(/^#\s+/, "").trim();
      i++;
    }

    var rest = lines.slice(i).join("\n");
    var meta = {};
    var dataMatch = rest.match(/```post-data\s*\n([\s\S]*?)```/i);
    if (dataMatch) {
      try {
        meta = JSON.parse(dataMatch[1]) || {};
      } catch (_err) {
        meta = {};
      }
      rest = rest.slice(0, dataMatch.index) + rest.slice(dataMatch.index + dataMatch[0].length);
    }

    return { title: title, meta: meta, body: rest.replace(/^\s+/, "") };
  }

  function renderInline(text) {
    var placeholders = [];
    function stash(html) {
      placeholders.push(html);
      return "\x00" + (placeholders.length - 1) + "\x00";
    }

    // Escape first, then re-introduce formatted HTML via placeholders so
    // markup we generate isn't re-escaped or re-matched.
    var out = escapeHtml(text);

    // Inline code
    out = out.replace(/`([^`]+)`/g, function (_, code) {
      return stash("<code>" + code + "</code>");
    });

    // Images: ![alt](src)
    out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, function (_, alt, src, title) {
      var titleAttr = title ? ' title="' + title + '"' : "";
      return stash('<img src="' + src + '" alt="' + alt + '"' + titleAttr + " loading=\"lazy\">");
    });

    // Links: [text](href)
    out = out.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g, function (_, label, href, title) {
      var titleAttr = title ? ' title="' + title + '"' : "";
      var external = /^https?:\/\//i.test(href);
      var relAttr = external ? ' target="_blank" rel="noopener noreferrer"' : "";
      return stash('<a href="' + href + '"' + titleAttr + relAttr + ">" + label + "</a>");
    });

    // Bracket tags: [Web Core App], [philosophy], etc. Runs after links so
    // [label](href) is left alone. Inserted raw (not stashed) so they still
    // work inside **bold** titles.
    out = out.replace(/\[([^\]\n]{1,48})\](?!\()/g, function (_, raw) {
      var tag = raw.trim();
      if (!tag || /^\d+$/.test(tag) || /^(https?:|mailto:)/i.test(tag)) return "[" + raw + "]";
      var slug = tag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "tag";
      return '<span class="chg-tag chg-tag--' + slug + '">' + tag + "</span>";
    });

    // Font switch first so inner *italic* / **bold** still match.
    // Stash only the tags; leaving inner in place avoids nested
    // placeholders that a single expand pass would print as "0".
    out = out.replace(/::(\w+)\s+([\s\S]*?)::\/\1/g, function (_, name, inner) {
      return stash('<span class="font-' + name.toLowerCase() + '">') + inner.trim() + stash("</span>");
    });

    // Bold + italic
    out = out.replace(/\*\*\*([^*]+)\*\*\*/g, function (_, s) { return stash("<strong><em>" + s + "</em></strong>"); });
    out = out.replace(/\*\*([^*]+)\*\*/g, function (_, s) { return stash("<strong>" + s + "</strong>"); });
    out = out.replace(/\*([^*]+)\*/g, function (_, s) { return stash("<em>" + s + "</em>"); });

    while (/\x00\d+\x00/.test(out)) {
      out = out.replace(/\x00(\d+)\x00/g, function (_, idx) {
        return placeholders[Number(idx)];
      });
    }

    return out;
  }

  function isChangelogEntryLine(line) {
    return /^\*\*\[[^\]]+\]/.test(line);
  }

  function render(markdown) {
    var lines = markdown.replace(/\r\n/g, "\n").split("\n");
    var html = [];
    var i = 0;
    var listStack = []; // stack of "ul" | "ol"
    var paragraphBuf = [];
    var slugCounts = {}; // dedupes heading ids within this render

    function closeLists() {
      while (listStack.length) html.push("</" + listStack.pop() + ">");
    }

    function flushParagraph() {
      if (paragraphBuf.length) {
        html.push("<p>" + renderInline(paragraphBuf.join(" ")) + "</p>");
        paragraphBuf = [];
      }
    }

    while (i < lines.length) {
      var line = lines[i];

      // Fenced code block. Optional language and filename:
      // ```js   or   ```javascript debounce.js
      var fence = line.match(/^```([\w+-]*)(?:\s+(\S+))?\s*$/);
      if (fence) {
        flushParagraph();
        closeLists();
        var lang = fence[1] || "";
        var filename = fence[2] || "";
        var code = [];
        i++;
        while (i < lines.length && !/^```\s*$/.test(lines[i])) {
          code.push(lines[i]);
          i++;
        }
        i++; // skip closing fence
        var cls = lang ? ' class="language-' + lang + '"' : "";
        var preAttrs = "";
        if (lang) preAttrs += ' data-lang="' + escapeHtml(lang) + '"';
        if (filename) preAttrs += ' data-filename="' + escapeHtml(filename) + '"';
        html.push("<pre" + preAttrs + "><code" + cls + ">" + escapeHtml(code.join("\n")) + "</code></pre>");
        continue;
      }

      // Font switch block: ::instrument ... ::/instrument
      var fontClose = line.trim().match(/^::\/(\w+)\s*$/);
      if (fontClose) {
        flushParagraph();
        closeLists();
        html.push("</div>");
        i++;
        continue;
      }
      var fontOpen = line.trim().match(/^::(\w+)\s*$/);
      if (fontOpen) {
        flushParagraph();
        closeLists();
        html.push('<div class="font-' + fontOpen[1].toLowerCase() + '">');
        i++;
        continue;
      }

      // Blank line
      if (line.trim() === "") {
        flushParagraph();
        closeLists();
        i++;
        continue;
      }

      // Headings
      var heading = line.match(/^(#{1,6})\s+(.*)$/);
      if (heading) {
        flushParagraph();
        closeLists();
        var level = heading[1].length;
        var text = heading[2].trim();
        var slug = slugify(text);
        var count = slugCounts[slug] || 0;
        slugCounts[slug] = count + 1;
        var id = count === 0 ? slug : slug + "-" + count;
        html.push('<h' + level + ' id="' + id + '">' + renderInline(text) + "</h" + level + ">");
        i++;
        continue;
      }

      // Horizontal rule
      if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
        flushParagraph();
        closeLists();
        html.push("<hr>");
        i++;
        continue;
      }

      // Blockquote
      if (/^>\s?/.test(line)) {
        flushParagraph();
        closeLists();
        var quoteLines = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) {
          quoteLines.push(lines[i].replace(/^>\s?/, ""));
          i++;
        }
        html.push("<blockquote>" + renderInline(quoteLines.join(" ")) + "</blockquote>");
        continue;
      }

      // Unordered list item
      var ul = line.match(/^(\s*)[-*+]\s+(.*)$/);
      if (ul) {
        flushParagraph();
        if (listStack[listStack.length - 1] !== "ul") {
          closeLists();
          html.push("<ul>");
          listStack.push("ul");
        }
        html.push("<li>" + renderInline(ul[2]) + "</li>");
        i++;
        continue;
      }

      // Ordered list item
      var ol = line.match(/^(\s*)\d+\.\s+(.*)$/);
      if (ol) {
        flushParagraph();
        if (listStack[listStack.length - 1] !== "ol") {
          closeLists();
          html.push("<ol>");
          listStack.push("ol");
        }
        html.push("<li>" + renderInline(ol[2]) + "</li>");
        i++;
        continue;
      }

      // Changelog entry titles stay in their own <p> so article tag
      // filters can treat each change as a discrete, sortable entry.
      if (isChangelogEntryLine(line.trim())) {
        flushParagraph();
        closeLists();
        html.push("<p>" + renderInline(line.trim()) + "</p>");
        i++;
        continue;
      }

      // Default: paragraph text
      closeLists();
      paragraphBuf.push(line.trim());
      i++;
    }

    flushParagraph();
    closeLists();
    return html.join("\n");
  }

  window.SimpleMarkdown = { parsePost: parsePost, render: render };
})();
