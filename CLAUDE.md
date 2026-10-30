# CLAUDE.md — `experimental` branch (light version)

Static GitHub Pages site. Plain HTML/CSS/JS, no build step, no framework.

## Rules
- `main` is the live site. Work happens on `experimental`; never push to `main`
  unless Adrien explicitly asks.
- Adrien pushes himself (VS Code). Commit locally, don't try to push.
- Keep it light: fewer pages, shared code, small files.

## Structure
- `assets/css/site.css` — shared tokens and styles for `index.html` and `tools/*`.
  Pages only keep page-specific CSS inline.
- `index.html` — home page (cards).
- `networks/clione.html` + `clione.js` — Clione network; own full-screen design.
  `clione.js` holds the 18 trajectory cases, quantised to 1e-3 and delta-encoded.
- `tools/lissajous.html` — Lissajous tool.

Older pages (neuron models, hysteresis pages, the long AI_PROJECT_MEMORY.md)
are not lost: see `main` and the local branch `archive/hysteresis-work`.
Bring a page back only when asked.

## Widget layout (all simulation pages, incl. neuron models)
Presets -> big plots -> controls (sliders) right under the plots ->
"what is what" legend as a quiet row below the controls -> equations ->
reference. Keep explanations out of the space between plots and controls.
On PC the plots sit side by side and large; on phones they stack.

## Before committing
Page loads without console errors, links work, `sitemap.xml` and the home
cards match the pages that exist.
