#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";

async function main() {
  const rootDir = process.cwd();
  const postsDir = path.join(rootDir, "posts");
  const outputFile = path.join(postsDir, "index.json");

  const entries = await fs.readdir(postsDir, { withFileTypes: true });
  const postFiles = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => /\.md$/i.test(name))
    .sort((left, right) => right.localeCompare(left, "en"));

  const payload = `${JSON.stringify(postFiles, null, 2)}\n`;
  await fs.writeFile(outputFile, payload, "utf8");

  console.log(`Updated posts/index.json with ${postFiles.length} post(s).`);
}

main().catch((error) => {
  console.error("Failed to generate posts/index.json:", error);
  process.exitCode = 1;
});
