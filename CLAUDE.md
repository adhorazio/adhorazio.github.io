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
- `assets/js/palette.js` — shared colour code `COL` for the neuron models.
- `assets/js/scope.js` — stacked scopes: scopeRects, drawScope (inline grid labels), inScope, scopeRefLine.
- `assets/js/time-axis.js` — shared `drawTimeAxis()` for neuron traces (strip under the plot, t in ms/s).
- `networks/clione.html` + `clione.js` — Clione network; own full-screen design.
- `networks/eqif-meanfield.html` — eQIF mean field (paper Eq. 24, infinite-reset limit, no I* correction): r, V̄, I_w (green), g_syn (teal #089099); phase plane (V̄, r); r and V̄ axes come from the equilibria, population spikes are clipped and labelled.
  `clione.js` holds the 18 trajectory cases, quantised to 1e-3 and delta-encoded.
- `tools/lissajous.html` — Lissajous tool.
- `models/hodgkin-huxley.html` — HH (from main, new design: V/m/h/n scopes, (V, n) phase plane, 4-D equilibrium stability).
- `models/lif.html` — LIF neuron (brought back from main, light layout).
- `models/izhikevich.html` — Izhikevich neuron (brought back from main, light layout).
- `models/adex.html` — AdEx neuron (brought back from main, light layout).
- `models/qif.html` — QIF with two optional slow currents: adaptation w- (aQIF) and self-excitation w+ (eQIF, the paper's I_w); parameters from Depannemaecker, d'Hollande et al. 2026.

Older pages (neuron models, hysteresis pages, the long AI_PROJECT_MEMORY.md)
are not lost: see `main` and the local branch `archive/hysteresis-work`.
Bring a page back only when asked.

## Widget layout (all simulation pages, incl. neuron models)
Presets -> big plots -> controls (sliders) right under the plots ->
"what is what" legend as a quiet row below the controls -> equations ->
reference. Keep explanations out of the space between plots and controls.
Plots large; legend sections in the same order as the plots they describe.
Lissajous: figure centred, full-width waveforms (full 4 s span) below it.

## Colour code (all neuron models)
Use `COL` (assets/js/palette.js) in canvas code and `--c-*` (site.css) in legends,
never raw GDV colours: blue = V / f-I / phase trajectory; yellow = input
current (V-nullcline, which shifts with I; rheobase on the f-I curve); red = negative feedback
(recovery/adaptation u, w, their nullcline); green = positive
feedback; yellow = voltage thresholds (V_theta, V_T); orange = current reset after a spike (u+d, w+b); gating variables (HH):
by ion channel: Na+ m sky/ice (predominant), Na+ h same colour lighter, K+ n bordeaux; purple = voltage reset
(c, V_r); grey = rest (V_rest, E_L) and V_peak;
white dot = where the neuron is now (phase-plane state, f-I operating point).
Extended palette: `PALETTE_EXT` in palette.js lists every colour in use or kept for reference: GDV 6a,
extra tones picked from the GDV ramps, the full GDV ramps, and legacy sets (old Clione Open Color, old HH gates).
Use it when many series need colours and telling them apart matters less; meaning still comes from COL / 6a.
Feedback currents (neuron models): naming w- (adaptation, red, negative feedback) and w+ (self-excitation,
green, positive feedback; the paper's I_w). Each has a toggle button in the Feedback row and an .adapt-section
box (main-site aLIF design, styles in site.css: pill + name + sparkline with mean mu, sliders a, b, tau inside);
button and box header are the same switch. tau+- dw+-/dt = a+-(V - E_L) - w+-, dV/dt gets -w- +w+, w+- += b+- at
spike. Pages whose model has adaptation built in (Izhikevich u, AdEx w) keep it always on (.fixed box) and only
get the w+ switch. With w+ on: Excite/Inhibit pulses (+-100 pA, 50 ms; yellow buttons flashing green/red,
green/red blocks under V). Phase views offered by what is on: (V, dV/dt) phase line, (V, w-), (V, w+),
slow plane (w-, w+) with the 45-degree spiking line I + w+ - w- = I_SN; equilibria from the full Jacobian.
Done on qif.html (w- and w+ switches), lif.html (w-, w+; f-I dot at I_eff - w- + w+, slow plane), izhikevich.html (u fixed, w+ in the paper's SI form a+(b+ v - w+), +d+), adex.html (w fixed, w+). HH is not touched. Each page has a checked 'Working memory' preset.
Phase planes: recovery nullcline thin and faint, trajectory bright; the input-current
curve (V-nullcline, rheobase) always uses styleInputCurve() and is clipped, never flattened.
Spike plots are stacked scopes (assets/js/scope.js): one scope per signal (V on top,
the red negative-feedback u / w below), minimal y design (faint grid lines labelled
inside, e.g. "-40 mV"; no axis line), all sharing the time axis.
Equilibria (nullcline crossings) use the textbook symbols via drawEquilibria():
filled = stable, empty = unstable, square = saddle, half-filled = saddle-node. Slider values stay yellow text (UI, not data).

## Before committing
Page loads without console errors, links work, `sitemap.xml` and the home
cards match the pages that exist.
