# Welcome to Docs!

This is basically my version of Gist (gist.github.com).

But minus the Microsoft mining my data for AI (I want to host my own data, so it can be crawled by AI! Let's take back control!)

## Blog

The `blog/` pages render markdown files straight out of `posts/` — no build step, no CMS.

To add a post:

1. Create `posts/YYYY-MM-DD-your-slug.md`.
2. Start with a `# Title` line, then a fenced ` ```post-data ` block with JSON metadata:
   ```json
   {
     "date": "2026-08-11",
     "tags": ["example"],
     "summary": "One-line summary shown on the blog index.",
     "coverImage": "optional/path/to/image.png"
   }
   ```
3. Write the rest of the post as normal markdown below it.
4. Push to `main`. A GitHub Action (`.github/workflows/update-post-index.yml`) regenerates `posts/index.json`, and the blog picks it up automatically.

### Other sections

`memrise/` is a second, independent blog section at `docs.martinhe.co.uk/memrise/` — same mechanism, but reading from its own `memrise/posts/` folder instead of `posts/`, so the two don't mix. Add posts there the same way.

To add another section, copy `memrise/index.html` and `memrise/post.html`, point `window.BLOG_POSTS_DIR` at a new folder, and add that folder to `scripts/generate-post-index.mjs`'s targets in `package.json` and `.github/workflows/update-post-index.yml`.

Run `npm run build` locally to regenerate every section's `index.json`, and `npm run dev` to preview the site at `http://localhost:5500`.
