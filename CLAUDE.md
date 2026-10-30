# CLAUDE.md

**Read [`AI_PROJECT_MEMORY.md`](AI_PROJECT_MEMORY.md) first.** It is the authoritative
guide to this site's purpose, structure, design system, and conventions. This file is just
the quick orientation; the memory file has the detail.

## TL;DR for working here
- **Static GitHub Pages site** — no build step, no framework, no bundler. Plain
  HTML/CSS/JS. Only runtime deps are KaTeX (CDN) and Google Fonts (clione only).
- Each page is a **single self-contained `.html`** with inline `<style>` + `<script>`
  (exception: `networks/clione.js`). Real-time `<canvas>` + `requestAnimationFrame`
  simulations; equations via KaTeX.
- **Two design families:** the standard dark centered-900px-column template
  (`index.html`, `models/*`, `tools/*`) and the intentionally different full-viewport
  `networks/clione.html`. New custom designs are allowed — keep the dark, minimal,
  scientific feel and shared color tokens unless a page genuinely needs otherwise.
- Design tokens (`--bg #2b2b2b`, `--surface #333`, `--border #444`, `--text #e0e0e0`,
  `--text-dim #888`, `--accent #009ADE`) and the `--gdv-q1..q8` data palette are
  **duplicated per file** — a global change means editing every standard page identically.
- Every model/demo page **cites its source paper** in the `.footer-ref` footer block.
  Don't overclaim results; these are didactic minimal-model demos. Don't invent facts
  about the owner or his research — write "To confirm" instead.

## Run locally (PowerShell, Windows)
```powershell
pwsh -ExecutionPolicy Bypass -File .claude/serve.ps1   # http://localhost:3000
```
Any static server serving the repo root works too.

## Before committing
Page loads with no console errors; canvas + KaTeX work; `../` paths and footer intact;
`index.html` card and `sitemap.xml` updated if pages changed; tokens unchanged or changed
site-wide; terse commit message. Full checklists in `AI_PROJECT_MEMORY.md` §7.
