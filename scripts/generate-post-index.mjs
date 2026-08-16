#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";

const SITE_ORIGIN = "https://docs.martinhe.co.uk";

const SECTIONS = {
  "blog/posts": {
    title: "Docs — Blog",
    description: "Posts from docs.martinhe.co.uk/blog",
    pagePath: "/blog/",
    postPath: "/blog/post.html",
    feedFile: "blog/feed.xml"
  },
  "memrise/posts": {
    title: "Docs — Memrise",
    description: "Unofficial Memrise updates and documentation",
    pagePath: "/memrise/",
    postPath: "/memrise/post.html",
    feedFile: "memrise/feed.xml"
  }
};

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function parsePost(md, file) {
  const titleMatch = md.match(/^#\s+(.+)$/m);
  const dataMatch = md.match(/```post-data\s*([\s\S]*?)```/);
  let meta = {};
  if (dataMatch) {
    try {
      meta = JSON.parse(dataMatch[1]);
    } catch {
      meta = {};
    }
  }
  const body = md
    .replace(/```post-data[\s\S]*?```/gi, " ")
    .replace(/^#\s+.+$/m, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`\[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return {
    file,
    title: (titleMatch && titleMatch[1].trim()) || file,
    meta,
    excerpt: (meta.summary || body).slice(0, 400)
  };
}

function rfc822(dateStr) {
  if (!dateStr) return new Date().toUTCString();
  const d = new Date(dateStr + "T00:00:00Z");
  return isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
}

function buildFeed(section, posts) {
  const items = posts
    .slice()
    .sort(function (a, b) {
      return String(b.meta.date || "").localeCompare(String(a.meta.date || ""));
    })
    .map(function (post) {
      const link = SITE_ORIGIN + section.postPath + "?post=" + encodeURIComponent(post.file);
      return [
        "    <item>",
        "      <title>" + escapeXml(post.title) + "</title>",
        "      <link>" + escapeXml(link) + "</link>",
        "      <guid isPermaLink=\"true\">" + escapeXml(link) + "</guid>",
        "      <pubDate>" + rfc822(post.meta.date) + "</pubDate>",
        "      <description>" + escapeXml(post.excerpt) + "</description>",
        "    </item>"
      ].join("\n");
    })
    .join("\n");

  return [
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<rss version=\"2.0\">",
    "  <channel>",
    "    <title>" + escapeXml(section.title) + "</title>",
    "    <link>" + escapeXml(SITE_ORIGIN + section.pagePath) + "</link>",
    "    <description>" + escapeXml(section.description) + "</description>",
    "    <language>en</language>",
    items,
    "  </channel>",
    "</rss>",
    ""
  ].join("\n");
}

async function main() {
  const rootDir = process.cwd();
  const relDir = process.argv[2] || "posts";
  const postsDir = path.join(rootDir, relDir);
  const outputFile = path.join(postsDir, "index.json");

  const entries = await fs.readdir(postsDir, { withFileTypes: true });
  const postFiles = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => /\.md$/i.test(name))
    .sort((left, right) => right.localeCompare(left, "en"));

  const payload = `${JSON.stringify(postFiles, null, 2)}\n`;
  await fs.writeFile(outputFile, payload, "utf8");
  console.log(`Updated ${relDir}/index.json with ${postFiles.length} post(s).`);

  const section = SECTIONS[relDir.replace(/\\/g, "/")];
  if (!section) return;

  const posts = [];
  for (const file of postFiles) {
    const md = await fs.readFile(path.join(postsDir, file), "utf8");
    posts.push(parsePost(md, file));
  }

  const feedPath = path.join(rootDir, section.feedFile);
  await fs.writeFile(feedPath, buildFeed(section, posts), "utf8");
  console.log(`Updated ${section.feedFile} with ${posts.length} item(s).`);
}

main().catch((error) => {
  console.error("Failed to generate posts/index.json:", error);
  process.exitCode = 1;
});
