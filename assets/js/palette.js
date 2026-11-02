// Shared colour code for all neuron models (same meaning on every page).
// Matching CSS tokens for legends live in assets/css/site.css (--c-*).
//   V      membrane potential, f-I curve, phase trajectory   blue
//   NEG    negative feedback: recovery / adaptation (u, w),   red
//          its nullcline
//   POS    positive feedback (e.g. self-excitation)           green
//   IN     input current: curves set by I (V-nullcline, which  yellow
//          shifts with I), rheobase current on the f-I curve
//   THRESH voltage thresholds: V_theta, V_T                   yellow
//   RESET  voltage reset: c, V_r                              purple
//   IRESET current reset after a spike: u + d, w + b          orange
//   Gating variables (conductance-based models, e.g. HH) are probabilities,
//   not currents, so they get their own colours, grouped by ion channel:
//   Na+ gates warm (orange family), K+ gate violet.
//   GATE_M Na+ activation m                                   orange
//   GATE_H Na+ inactivation h                                 light peach
//   GATE_N K+ activation n                                    violet
//   REST   rest: V_rest, E_L                                  grey
//   OP     where the neuron is now: state dot in the phase    white
//          plane, operating point on the f-I curve
const COL = {
  V:      '#009ADE',
  NEG:    '#FF1F5B',
  POS:    '#00CD6C',
  IN:     '#FFC61E',
  THRESH: '#FFC61E',
  RESET:  '#AF58BA',
  IRESET: '#F28522',
  GATE_M: '#FF8C42',
  GATE_N: '#B07CE8',
  GATE_H: '#FFC09F',
  REST:   '#888888',
  OP:     '#FFFFFF',
  TRAJ:   '0,154,222'     // = V blue as an rgb triplet, used with a varying alpha
};

// Negative-feedback trace (u, w): drawn in its own scope under V (see
// scope.js), same look on every model. fbSteadyRange keeps its y range
// steady: rounded to `step`, grows at once, shrinks only when clearly too big.
const FB_TRACE = { width: 1.5, alpha: 0.85, alphaOld: 0.15 };
function fbSteadyRange(st, lo, hi, step) {
  const nHi = Math.ceil(hi / step) * step, nLo = Math.floor(lo / step) * step;
  if (st.hi === undefined || nHi > st.hi || nHi < st.hi - 3 * step) st.hi = nHi;
  if (st.lo === undefined || nLo < st.lo || nLo > st.lo + 3 * step) st.lo = nLo;
  if (st.hi - st.lo < step) st.hi = st.lo + step;
  return st;
}

// Input-current curves (V-nullcline set by I, rheobase line): one style for
// every model, so the curve the current slider moves always looks the same.
function styleInputCurve(ctx, dashed) {
  ctx.strokeStyle = COL.IN + 'dd';
  ctx.lineWidth = 1.6;
  ctx.setLineDash(dashed ? [4, 3] : []);
}

// "Where the neuron is now" dot, same on every model (phase-plane state,
// f-I operating point). Style is chosen once here:
//   'plain'    solid white dot
//   'glow'     small white dot with a soft halo
//   'ring'     hollow white ring
//   'knockout' white dot with a thin dark gap, so it separates from any line
COL.DOT_STYLE = 'glow';
function drawStateDot(ctx, x, y, r) {
  const st = COL.DOT_STYLE;
  ctx.save();
  if (st === 'glow') {
    // small, light halo (kept subtle on purpose)
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.4);
    g.addColorStop(0, 'rgba(255,255,255,0.28)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r * 2.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = COL.OP;
    ctx.beginPath(); ctx.arc(x, y, r * 0.75, 0, Math.PI * 2); ctx.fill();
  } else if (st === 'ring') {
    ctx.fillStyle = '#1e1e1e';
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 1.6; ctx.strokeStyle = COL.OP; ctx.stroke();
  } else if (st === 'knockout') {
    ctx.fillStyle = '#1e1e1e';
    ctx.beginPath(); ctx.arc(x, y, r + 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = COL.OP;
    ctx.beginPath(); ctx.arc(x, y, r * 0.85, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.fillStyle = COL.OP;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

// ── Equilibria (fixed points) in phase planes ─────────────────────────────
// Standard notation (Strogatz; Izhikevich, Dynamical Systems in Neuroscience):
//   stable    ●  filled dot       unstable    ○  empty dot
//   saddle    □  empty square     saddle-node ◐  half-filled (a stable point
//                                 and a saddle merging: the bifurcation)
const EQ_COL = '#dcdcdc';
function classifyEq(tr, det) {            // from the Jacobian at the point
  if (det < 0) return 'saddle';
  return tr < 0 ? 'stable' : 'unstable';
}
function drawEquilibrium(ctx, x, y, type) {
  const r = 4.5, bg = '#1e1e1e';
  ctx.save();
  ctx.lineWidth = 1.5; ctx.strokeStyle = EQ_COL; ctx.setLineDash([]);
  if (type === 'saddle') {
    ctx.fillStyle = bg;
    ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
    ctx.strokeRect(x - r, y - r, 2 * r, 2 * r);
  } else {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = type === 'stable' ? EQ_COL : bg;
    ctx.fill(); ctx.stroke();
    if (type === 'saddle-node') {          // left half filled
      ctx.beginPath(); ctx.arc(x, y, r, Math.PI / 2, Math.PI * 1.5); ctx.closePath();
      ctx.fillStyle = EQ_COL; ctx.fill();
    }
  }
  ctx.restore();
}
// pts: [{x, y, type}] in canvas px. Two points closer than 8 px are drawn as
// one saddle-node (they are about to merge and vanish).
function drawEquilibria(ctx, pts, W, H) {
  const inside = pts.filter(p => p.x >= 0 && p.x <= W && p.y >= 0 && p.y <= H);
  if (inside.length === 2 && Math.hypot(inside[0].x - inside[1].x, inside[0].y - inside[1].y) < 8) {
    drawEquilibrium(ctx, (inside[0].x + inside[1].x) / 2, (inside[0].y + inside[1].y) / 2, 'saddle-node');
    return;
  }
  inside.forEach(p => drawEquilibrium(ctx, p.x, p.y, p.type));
}
