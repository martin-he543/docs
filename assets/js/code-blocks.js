// Wraps fenced <pre><code> blocks with a Gist-style toolbar (Raw + Copy)
// and applies lightweight syntax highlighting.
(function () {
  "use strict";

  var LANG_ALIASES = {
    js: "javascript",
    mjs: "javascript",
    cjs: "javascript",
    ts: "typescript",
    py: "python",
    sh: "bash",
    shell: "bash",
    zsh: "bash",
    yml: "yaml",
    md: "markdown",
    html: "xml",
    htm: "xml",
    svg: "xml",
    cs: "csharp"
  };

  var KEYWORDS = {
    javascript: "break case catch class const continue debugger default delete do else export extends finally for function if import in instanceof let new return static super switch this throw try typeof var void while with yield async await of from as",
    typescript: "break case catch class const continue debugger default delete do else export extends finally for function if import in instanceof let new return static super switch this throw try typeof var void while with yield async await of from as type interface enum implements private public protected readonly abstract declare namespace module as satisfies infer keyof is never unknown any",
    python: "and as assert async await break class continue def del elif else except False finally for from global if import in is lambda None nonlocal not or pass raise return True try while with yield match case",
    bash: "if then else elif fi for while in do done case esac function return break continue local export readonly declare set unset shift test true false echo exit eval source alias",
    go: "break case chan const continue default defer else fallthrough for func go goto if import interface map package range return select struct switch type var",
    rust: "as async await break const continue crate dyn else enum extern false fn for if impl in let loop match mod move mut pub ref return self Self static struct super trait true type unsafe use where while",
    java: "abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while var record sealed permits yield",
    csharp: "abstract as base bool break byte case catch char checked class const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach goto if implicit in int interface internal is lock long namespace new null object operator out override params private protected public readonly ref return sbyte sealed short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using var virtual void volatile while async await record",
    sql: "select from where and or not in is null join left right inner outer on group by order asc desc insert into values update set delete create table alter drop index distinct limit offset having as union all case when then else end",
    css: "important"
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function normalizeLang(lang) {
    var key = String(lang || "").toLowerCase();
    return LANG_ALIASES[key] || key;
  }

  function keywordRe(lang) {
    var words = KEYWORDS[lang];
    if (!words) return null;
    return new RegExp("\\b(?:" + words.trim().split(/\s+/).join("|") + ")\\b", "g");
  }

  function tokenize(src, rules) {
    var tokens = [{ type: "text", value: src }];
    rules.forEach(function (rule) {
      var next = [];
      tokens.forEach(function (tok) {
        if (tok.type !== "text") {
          next.push(tok);
          return;
        }
        var re = new RegExp(rule.re.source, rule.re.flags.includes("g") ? rule.re.flags : rule.re.flags + "g");
        var last = 0;
        var m;
        var text = tok.value;
        while ((m = re.exec(text))) {
          if (m.index > last) next.push({ type: "text", value: text.slice(last, m.index) });
          next.push({ type: rule.type, value: m[0] });
          last = m.index + m[0].length;
          if (!m[0].length) re.lastIndex++;
        }
        if (last < text.length) next.push({ type: "text", value: text.slice(last) });
      });
      tokens = next;
    });
    return tokens;
  }

  function rulesFor(lang) {
    if (lang === "json") {
      return [
        { type: "string", re: /"(?:\\.|[^"\\])*"(?=\s*:)/g },
        { type: "string", re: /"(?:\\.|[^"\\])*"/g },
        { type: "number", re: /-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g },
        { type: "keyword", re: /\b(?:true|false|null)\b/g }
      ];
    }
    if (lang === "xml") {
      return [
        { type: "comment", re: /<!--[\s\S]*?-->/g },
        { type: "string", re: /"[^"]*"|'[^']*'/g },
        { type: "keyword", re: /<\/?[\w:-]+|\/?>/g }
      ];
    }
    if (lang === "css") {
      return [
        { type: "comment", re: /\/\*[\s\S]*?\*\//g },
        { type: "string", re: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g },
        { type: "number", re: /#(?:[0-9a-fA-F]{3,8})\b|\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|s|ms)?\b/g },
        { type: "keyword", re: /@[\w-]+|\b(?:important)\b/g }
      ];
    }
    if (lang === "bash") {
      return [
        { type: "comment", re: /#.*/g },
        { type: "string", re: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g },
        { type: "keyword", re: keywordRe("bash") }
      ].filter(Boolean);
    }
    if (lang === "python") {
      return [
        { type: "comment", re: /#.*/g },
        { type: "string", re: /"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g },
        { type: "number", re: /\b(?:0x[\da-fA-F]+|\d+\.?\d*(?:e[+-]?\d+)?)\b/g },
        { type: "keyword", re: keywordRe("python") }
      ].filter(Boolean);
    }
    if (lang === "sql") {
      return [
        { type: "comment", re: /--.*|\/\*[\s\S]*?\*\//g },
        { type: "string", re: /'(?:''|[^'])*'/g },
        { type: "number", re: /\b\d+(?:\.\d+)?\b/g },
        { type: "keyword", re: keywordRe("sql") }
      ].filter(Boolean);
    }
    if (lang === "yaml") {
      return [
        { type: "comment", re: /#.*/g },
        { type: "string", re: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g },
        { type: "keyword", re: /^[\t ]*[\w.-]+(?=\s*:)/gm },
        { type: "number", re: /\b(?:true|false|null|\d+(?:\.\d+)?)\b/g }
      ];
    }
    if (lang === "markdown") {
      return [
        { type: "comment", re: /<!--[\s\S]*?-->/g },
        { type: "keyword", re: /^#{1,6} .+$/gm },
        { type: "string", re: /`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*/g }
      ];
    }

    var comment = { type: "comment", re: /\/\/.*|\/\*[\s\S]*?\*\//g };
    var string = { type: "string", re: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/g };
    var number = { type: "number", re: /\b(?:0x[\da-fA-F]+|\d+\.?\d*(?:e[+-]?\d+)?)\b/g };
    var kw = keywordRe(lang);
    var rules = [comment, string, number];
    if (kw) rules.push({ type: "keyword", re: kw });
    return rules;
  }

  function highlight(src, lang) {
    lang = normalizeLang(lang);
    if (!lang) return escapeHtml(src);
    return tokenize(src, rulesFor(lang)).map(function (tok) {
      var safe = escapeHtml(tok.value);
      return tok.type === "text" ? safe : '<span class="tok-' + tok.type + '">' + safe + "</span>";
    }).join("");
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy") ? resolve() : reject(new Error("copy failed"));
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }

  function openRaw(text, filename) {
    var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var opened = window.open(url, "_blank");
    if (!opened) {
      var a = document.createElement("a");
      a.href = url;
      a.download = filename || "snippet.txt";
      a.click();
    }
    setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
  }

  function enhancePre(pre) {
    if (pre.closest(".code-block")) return;
    var code = pre.querySelector("code") || pre;
    var raw = code.textContent;
    var langMatch = (code.className || "").match(/language-([^\s]+)/);
    var lang = (pre.getAttribute("data-lang") || (langMatch && langMatch[1]) || "").toLowerCase();
    var filename = pre.getAttribute("data-filename") || "";
    var label = filename || lang || "text";

    if (lang) code.innerHTML = highlight(raw, lang);

    var wrap = document.createElement("div");
    wrap.className = "code-block";
    pre.parentNode.insertBefore(wrap, pre);

    var header = document.createElement("div");
    header.className = "code-block-header";
    header.innerHTML =
      '<span class="code-block-label">' + escapeHtml(label) + "</span>" +
      '<div class="code-block-actions">' +
        '<button type="button" class="code-block-btn" data-action="raw">Raw</button>' +
        '<button type="button" class="code-block-btn" data-action="copy">Copy</button>' +
      "</div>";

    wrap.appendChild(header);
    wrap.appendChild(pre);

    header.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-action]");
      if (!btn) return;
      if (btn.dataset.action === "copy") {
        copyText(raw).then(function () {
          btn.textContent = "Copied";
          setTimeout(function () { btn.textContent = "Copy"; }, 1400);
        }).catch(function () {
          btn.textContent = "Failed";
          setTimeout(function () { btn.textContent = "Copy"; }, 1400);
        });
      } else if (btn.dataset.action === "raw") {
        openRaw(raw, filename || (lang ? "snippet." + lang : "snippet.txt"));
      }
    });
  }

  function enhance(root) {
    var scope = root || document;
    Array.prototype.forEach.call(scope.querySelectorAll("pre"), enhancePre);
  }

  window.enhanceCodeBlocks = enhance;
})();
