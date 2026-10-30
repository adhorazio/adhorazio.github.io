# AI Project Memory — adhorazio.github.io

> Durable orientation file for any AI assistant editing this repository.
> Read this **before** touching files. Keep it updated when conventions change.
> When unsure about a fact, write **"To confirm"** rather than inventing it.

---

## 1. Project identity

- **What it is:** A small, static personal website hosted on **GitHub Pages** at
  `https://adhorazio.github.io/`. It is a collection of **self-contained interactive
  visualizations** of spiking-neuron models and neural networks.
- **Owner / who it represents:** Adrien d'Hollande — PhD student working on
  **electronic / neuromorphic spiking neural networks (SNNs)**.
- **Scientific context:** Computational & neuromorphic neuroscience. Central theme
  (site tagline): *"How Far Can Minimal Models Reproduce Neural Dynamics?"* — i.e.
  comparing minimal/reduced neuron models (LIF, Izhikevich, AdEx…) against
  biophysically detailed ones (Hodgkin–Huxley) and showing their dynamics live.
- **Intended audience:** Researchers, students, and peers in neuroscience /
  neuromorphic engineering; also a personal showcase. Visitors are assumed to be
  technically literate (comfortable with ODEs, membrane potentials, f–I curves).
- **Intended impression:** Rigorous but elegant; minimalist, dark, "lab instrument"
  aesthetic. Scientifically honest, every model page cites its source paper.

---

## 2. Website structure

Single-repo static site. **No build step** — every page is plain HTML/CSS/JS served
directly. Most pages are a **single self-contained `.html` file** with inline `<style>`
and `<script>` (the only external runtime dep is KaTeX from a CDN, and Google Fonts on
some pages).

```
/                      repo root = site root (GitHub Pages serves from here)
├── index.html         Landing page — card grid linking to all pages
├── README.md          Minimal ("My personal github website")
├── LICENSE            MIT
├── sitemap.xml        SEO sitemap (update when adding/removing pages)
├── AI_PROJECT_MEMORY.md   ← this file
├── CLAUDE.md          Short pointer for Claude Code
├── models/            Single-neuron models (one HTML file each)
│   ├── lif.html              Leaky integrate-and-fire
│   ├── izhikevich.html       Izhikevich simple model
│   ├── hodgkin-huxley.html   Conductance-based HH
│   ├── alif.html             Analogue LIF — adaptation (Iw±) + self-excitation
│   └── adex.html             Adaptive exponential I&F
├── networks/          Network-level demos
│   ├── clione.html           Barycentric firing-rate dynamics (DIFFERENT design — see §3)
│   └── clione.js             External JS for clione (the one page that splits JS out)
├── tools/             General toolkit
│   └── lissajous.html        Parametric signal figures
├── assets/
│   └── img/           SVG assets: AP_HH.svg (header logo on index), HH_Spike.svg,
│                      minimal_brain.svg, sign.svg
└── .claude/           Local dev tooling (not part of the deployed site)
    ├── serve.ps1      PowerShell static file server (see §6)
    └── launch.json    Debug config that runs serve.ps1 on port 3000
```

- **Content location:** Content lives *inline* in each page's HTML — there is no CMS,
  no markdown content, no templating. Each page = markup + its own physics simulation.
- **Styles:** Defined inline per-page inside `<style>` in `<head>`. There is **no shared
  CSS file** — the design system is duplicated by convention (same CSS variable block at
  the top of each file). Changing the global look means editing each page.
- **Scripts / interactivity:** Inline `<script>` per page (except `clione.js`). Pages run
  real-time `<canvas>` simulations driven by `requestAnimationFrame`. Equations rendered
  with **KaTeX** loaded from jsDelivr CDN.
- **Assets:** SVGs under `assets/img/`. The index header spike (`AP_HH.svg`) carries its
  geoviz-red color **in the SVG itself** (`stroke:#FF1F5B` = `--gdv-q1`). Don't recolor
  SVGs loaded via `<img>` with a CSS `filter:` hack — the multi-step sepia/hue-rotate
  approximation renders a different color on mobile browsers than on desktop. Set the
  SVG's own `fill`/`stroke` instead (or inline the `<svg>`).

---

## 3. Design system & visual rules

The "standard" design (index + all `models/` + `tools/`) is a **centered dark column**.
`networks/clione.html` is intentionally a **different, full-viewport design** — that is
allowed (see "New designs" below).

### Standard page tokens (copy this `:root` block into new standard pages)
```css
--bg:       #2b2b2b;   /* page background        */
--surface:  #333333;   /* cards / widgets        */
--border:   #444444;   /* hairline borders       */
--text:     #e0e0e0;   /* primary text           */
--text-dim: #888888;   /* secondary / labels (clione names it --muted) */
--accent:   #009ADE;   /* interactive accent (== GDV q3 blue) */
```

### GDV qualitative palette (data series on interactive pages)
Eight categorical colors, used for plotted curves, dots, legends:
```
--gdv-q1 #FF1F5B  --gdv-q2 #00CD6C  --gdv-q3 #009ADE  --gdv-q4 #AF58BA
--gdv-q5 #FFC61E  --gdv-q6 #F28522  --gdv-q7 #A0B1BA  --gdv-q8 #A6761D
```
Conventions observed: **q3 blue** = accent / primary trace (membrane V); **q5 yellow** =
operating point / live numeric readouts; **q1 red** = threshold lines. Reuse these
mappings for consistency. In JS they're mirrored as `const GDV = { q: [...] }`.

### Typography
- Standard pages: `'Segoe UI', system-ui, sans-serif`.
- Clione: `-apple-system, "SF Pro Display", "Helvetica Neue", sans-serif` + imports
  **DM Mono** (Google Fonts).
- Canvas axis labels: `monospace` (e.g. `'10px monospace'`).
- Math: **KaTeX** inline rendering, light text color.
- Headings: `h1` 2rem / 700 / `letter-spacing: 0.04em`. Section + widget labels are
  small, **UPPERCASE**, `letter-spacing` ~0.1em, dim or accent colored.

### Layout & spacing
- Content column: `max-width: 900px`, centered, `body { padding: 0 2rem 2rem }`. (The
  column width is duplicated across every standard page — header/main/widget/footer/
  equations all share the same `max-width`; change them together.)
- Rounded corners: cards `10px`, widgets `12px`, canvases/inner boxes `6px`.
- Card/widget grids: `repeat(auto-fill, minmax(…, 1fr))`, gaps ~0.75–1.2rem.
- **Mobile:** every standard page ends its `<style>` with a `@media (max-width: 600px)`
  block that (a) trims `body`/`.widget` padding and shrinks the `h1`; (b) **dissolves the
  canvas+legend wrapper** (`#fi-wrap` / `#phase-wrap` / `#gates-wrap` / `#liss-wrap` →
  `display: contents`) and assigns explicit `order:` to the widget's flex children so the
  layout becomes *plots → controls → legend last* (the explanatory legend follows the
  sliders so you can read what a control does while dragging it); (c) sets the detail
  canvas to `width:100%`; and (d) `.eq-row { overflow-x:auto }` so long KaTeX equations
  scroll instead of cropping. When you add a page, replicate this block (mind selector
  specificity — for HH's `#gates` keep `flex:0 0 auto` so it doesn't collapse in the
  column). Clione carries its own (different) breakpoints at 900/1100px. On phones it
  keeps the floating **overlay** trajectory bubble (the owner prefers it — stacking it
  made the canvas shrink when expanded), starts it collapsed, and instead offsets the
  simplex **projection** downward so the network clears the bubble without shrinking
  (`proj()`'s `view`: a `topReserve` on `W<=600` lowers `cy`/`side`). Its `draw()` loop
  also re-fits the canvas to its container each frame. On phones the page is also made
  **scrollable** (the rest of the site is a fixed full-viewport `overflow:hidden` grid):
  the shell's middle row is set to `68vh` so the network is tall, with the controls and
  the citation flowing below the fold; the canvas gets `touch-action:none` so drags
  rotate (scroll the page from the header/controls instead).
- **Canvas crispness (HiDPI):** every page defines `const DPR = Math.min(devicePixelRatio,
  2.5)` and a `fitCanvas(c, ctx)` helper that sets the backing store to `clientW*DPR ×
  clientH*DPR`, applies `ctx.setTransform(DPR,0,0,DPR,0,0)`, and caches the logical CSS-px
  size on the element as `c._lw` / `c._lh`. **All draw functions read `canvas._lw/_lh`
  (logical px), never `canvas.width/height` (now the DPR-scaled backing size).** A
  `resizeCanvases()` calls `fitCanvas` for each canvas and runs on `resize` + `load` +
  once at start. If you add a canvas or a draw routine, follow this pattern or it will be
  blurry (and using `.width` for coordinates would be wrong by a factor of DPR).

### Components (recurring)
- **Header:** `h1` title + a dim back-link `← Spiking Neuromorphics` to `../index.html`
  (index itself shows title + recolored SVG logo + tagline).
- **Card** (index): rounded surface box, hover lifts (`translateY(-3px)`), border turns
  accent, faint accent background, soft shadow.
- **Widget** (model/tool pages): bordered surface panel containing presets, canvas(es),
  controls.
- **Controls:** range `input[type=range]` — 6px rounded `--border` track, 17px borderless
  solid-accent circular thumb that grows on hover/drag with an accent glow (no dark ring
  or drop shadow — kept flat on purpose); styled for both WebKit
  (`::-webkit-slider-thumb`) and Firefox (`::-moz-range-track/-thumb`). Label row shows
  the name on the left and a tabular-nums value (yellow) on the right.
- **Preset buttons (`.preset-btn`):** rounded (8px) `--surface`-filled buttons, dim text;
  hover lifts 1px with a shadow and an accent border (echoes the index cards), press
  scales to 0.97, and the selected `.active` state gets an accent-tinted fill
  (`rgba(0,154,222,0.14)`) + accent text + 600 weight. Keep this style identical across
  pages. Clione uses its own `.case-btn` family instead.
- **Live parameter changes:** moving a control updates the simulation **in place** — it
  keeps running so the user can feel the change. Do **not** reset V / the trace history on
  slider input; only clear the spike-timing trackers (e.g. `lastSpikeStep`/`simISI`) so
  the rate readout refreshes. **Presets** do a full reset. This is consistent across all
  model pages (aLIF was the odd one out and was fixed to match — it used to call
  `resetSim()` on every slider move).
- **Equations block:** `.equations` → `.eq-box` with KaTeX rows.
- **Footer:** a `.footer-ref` citation block (uppercase `.ref-label` "Reference(s)" + the
  paper) on top of a `.footer-bottom` row: `© 2026 Adrien d'Hollande. All rights
  reserved.` + link to the MIT `LICENSE`. This footer style was deliberately unified
  across pages (commit `c56ff4d`) — keep it consistent.

### Rules / things NOT to change casually
- Don't alter the core token values (`--bg/--surface/--border/--text/--accent`) or the
  GDV palette — they define the brand. Changing one page means changing all standard pages.
- Don't change the 900px column width, the footer format, or the back-link pattern
  without doing it site-wide.
- Don't introduce heavy frameworks (React/Vue/bundlers) or CSS libraries — the site's
  value is being dependency-free and instantly loadable.
- Keep simulations on `<canvas>` + `requestAnimationFrame`; keep equations in KaTeX.
- **New designs are allowed.** Clione proves the site is not locked to one template. A new
  page may use its own layout/fonts *if it has reason to* — but keep the shared color
  tokens and the dark, minimalist, scientific feel unless the page genuinely needs
  otherwise. Default to the standard template for ordinary model/tool pages.

---

## 4. Writing style & tone

- **Tone:** Minimal, precise, understated. Scientific-first with a quiet aesthetic
  sensibility. No marketing language, no hype, no emoji.
- **Language:** English in the UI/content. (Owner is a French speaker; French is fine in
  commit messages / internal notes, but site-facing text stays English.)
- **Balance:** Strongly scientific, lightly personal. Let the demos and citations speak.
- **Titles & labels:** Short. Model name as `h1`; one-line descriptive subtitle/`card-sub`
  (e.g. *"Leaky integrate-and-fire neuron"*, *"Adaptive exponential integrate-and-fire"*).
- **Captions / readouts:** Terse, units always shown (ms, mV, Hz), symbols use proper
  notation (subscripts, Greek: τ_m, V_θ, V_rest).
- **For new copy:** match existing card subtitles and widget titles — a few words, no
  full sentences where a phrase will do.

---

## 5. Content rules

- **Each model/demo page must cite its source** in the `.footer-ref` block (author, title,
  journal, volume, pages, year, and DOI/link when available). Follow the existing
  formatting (italic journal via `<em>`, bold volume via `<strong>`). Examples already in
  the repo: Lapicque 1907 (LIF), Izhikevich 2003, Hodgkin–Huxley 1952, Brette & Gerstner
  2005 (AdEx), and Wu, d'Hollande, Du & Rozenberg, *Phys. Rev. Applied* **23**, 034030
  (2025) for aLIF — this last one is the owner's own published work; cite it accurately.
- **Distinguishing maturity of work:**
  - *Published* → backed by a real citation in the footer.
  - *Work in progress / exploratory* → present as a demo, do not imply peer-reviewed
    results; avoid claiming biological accuracy beyond what the model gives.
  - These are **didactic minimal-model simulations**, not fits to experimental data —
    don't overclaim. The framing question is "how far can minimal models go," so honest
    limitations are part of the point.
- **Scientific honesty:** Show equations, parameters, and units openly. If a model has a
  known caveat (e.g. f–I curve is analytical/idealized), keep that visible rather than
  hiding it.
- **Do not invent** publications, results, affiliations, or biographical claims about the
  owner. If you need such a fact, mark **"To confirm"**.

---

## 6. Technical rules

- **Build system:** None. Pure static HTML/CSS/JS. No npm, no bundler, no preprocessor.
- **Runtime dependencies (CDN):** KaTeX `0.16.11` (jsDelivr); Google Fonts (DM Mono) on
  clione. Everything else is hand-written vanilla JS + Canvas API.
- **Run locally (Windows / PowerShell):**
  ```powershell
  pwsh -ExecutionPolicy Bypass -File .claude/serve.ps1   # serves repo root on :3000
  # then open http://localhost:3000
  ```
  `PORT` env var overrides the port. `.claude/launch.json` runs the same via the debugger.
  Any static server works too (`python -m http.server`, etc.) — just serve the repo root.
- **Deployment:** GitHub Pages serves the repo root from **`main`** (confirmed — pushing
  to `main` publishes in ~1 min, no CI build). `main` is a **protected branch** (changes
  "must be made through a pull request"); the owner's account can bypass it, so direct
  pushes succeed with a `remote: Bypassed rule violations` notice — that warning is
  expected, not an error. Pages sends `Cache-Control: max-age=600`, so a **real phone can
  show a stale page for up to ~10 min** after a deploy; when the owner reports a mobile
  view as "still broken," suspect cache first — verify the live URL with `curl`, and have
  him append a `?v=N` query (or use a private tab) to bust it.
- **Fragile parts / gotchas:**
  - Styles are **duplicated per page** — a "global" design change is a multi-file edit;
    keep the `:root` block identical across standard pages.
  - Canvases are **HiDPI** (see §3): `fitCanvas()` sets the backing store to
    `clientSize × DPR` and draw code reads the cached **logical** size `canvas._lw/_lh` —
    never `canvas.width/height` (the DPR-scaled backing size). Preserve the
    `resizeCanvases`/`fitCanvas` handlers and the `_lw/_lh` reads when refactoring, or
    traces blur or mis-scale.
  - Relative paths matter: subpages link assets/LICENSE/index with `../`. Don't break them.
  - KaTeX renders on `window.load`; equation `String.raw` strings must stay valid LaTeX.
  - `sitemap.xml` is maintained by hand — keep it in sync when you add or remove pages
    (it currently lists all 8 pages).
- **Before modifying any file, check:** which design family the page belongs to
  (standard vs. clione), that the `:root` tokens still match, relative paths, and that the
  footer/citation block is intact.

---

## 7. Maintenance checklists

### Add a new standard page (model or tool)
1. Copy an existing same-category page (e.g. `models/lif.html`) as the template.
2. Keep the `:root` token block and footer structure unchanged.
3. Update `<title>`, `h1`, back-link, the simulation/controls, and the equation block.
4. Add a real `.footer-ref` citation.
5. Add a `<a class="card">` entry in the right section of `index.html`.
6. Add the URL to `sitemap.xml`.
7. Verify locally (serve.ps1) at desktop + narrow widths; check console for errors.

### Add a new project / demo with a NEW design
- Allowed (see Clione). Still: dark background, scientific tone, link back to index, keep
  the footer citation + copyright/MIT pattern. Document the deviation in a comment if it
  diverges a lot. Add to `index.html` and `sitemap.xml`.

### Add a publication / citation
- Put it in the page's `.footer-ref` block using the existing author/title/`<em>`journal
  `<strong>`volume, pages (year) + DOI link format. Use "References" (plural label) when
  more than one.

### Change the design
- Decide scope: a token change affects **every standard page** → edit each file's `:root`
  identically. Test all pages, not just one. Avoid touching clione unless intended.

### Before committing
- [ ] Page loads with no console errors; canvas animates; KaTeX renders.
- [ ] Links/`../` paths, footer, and copyright intact.
- [ ] `index.html` card + `sitemap.xml` updated if pages changed.
- [ ] Design tokens unchanged (or changed consistently site-wide).
- [ ] No secrets, no unpublished/sensitive data, no invented claims.
- [ ] Commit message in the repo's terse style (e.g. `page: short imperative summary`).

---

## 8. Open questions / to confirm

- Whether a custom domain is configured for Pages (source branch is `main`, confirmed).
- Origin/name of the **GDV** palette (used as `--gdv-q*`) — documented here only by its
  hex values; the acronym's meaning is unconfirmed.
- Intended scope/roadmap: more network demos? a publications/CV page? an about page?
- Preferred citation style if the owner wants a stricter standard than the current ad-hoc
  footer format.
- Whether any page should be excluded from indexing or kept "draft".

---

## 9. Recent evolution (mobile + UI pass, June 2026)

Context for future edits — a large "make it good on phones, then polish" session reshaped
the site. What changed and *why* (so you don't undo it):

- **Docs born here:** this file + `CLAUDE.md` were created, and `sitemap.xml` completed
  (it was missing `hodgkin-huxley`, `alif`, `adex`).
- **Mobile, from zero:** the standard pages had **no** responsive CSS. Added the
  `@media (max-width:600px)` blocks (overflow fixes, plots→controls→legend reorder via
  `display:contents`+`order`, equation scroll). See §3.
- **HiDPI everywhere:** canvases used to render at CSS-pixel resolution (blurry on zoom).
  Introduced `DPR`/`fitCanvas`/`_lw`-`_lh`. See §3 + §6.
- **UI polish:** `.preset-btn` made larger/more engaging; range thumbs made larger and
  flat solid-blue (the owner explicitly asked to drop the dark contour ring).
- **Spike color bug:** `AP_HH.svg` looked pink on desktop but wrong on the owner's phone —
  it was recolored via a CSS `filter` chain. Fixed by baking `stroke:#FF1F5B` into the
  SVG and deleting the filter. (General lesson in §2.)
- **aLIF behaviour:** now keeps running on parameter change like the other models
  (§3 "Live parameter changes"); its index subtitle was iterated to
  *"Analogue LIF with adaptation and self-excitation"*.
- **Wider desktop:** column `760px → 900px`.
- **Clione mobile:** the owner **prefers the floating overlay "bubble"** trajectory panel;
  an attempt to stack it (which shrank the network when expanded) was reverted. Final
  approach: keep the bubble (collapsed by default), push the simplex **projection** down
  to avoid overlap, and make the page **scrollable** with a `68vh` network (controls +
  citation below the fold). See §3 and the persistent feedback memory `[[feedback-clione-bubble]]`.

**Owner's workflow (important):** iterative and visual; he tests on a **real phone over
cellular** (no LAN control), so work is deployed to `main` and checked there. He gives
short, incremental UI directions and reacts to what he sees. Branches per feature; terse
commits. When a mobile report seems wrong, re-check against §6's cache note before
re-coding.

---

*Keep this file accurate. If you discover the codebase contradicts something here, update
this file in the same change.*
