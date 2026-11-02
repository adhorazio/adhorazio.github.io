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
  REST:   '#888888',
  OP:     '#FFFFFF',
  TRAJ:   '0,154,222'     // = V blue as an rgb triplet, used with a varying alpha
};

// "Where the neuron is now" dot, same on every model (phase-plane state,
// f-I operating point). DOT_RING = null for a plain dot.
COL.DOT_FILL = COL.OP;
COL.DOT_RING = null;
function drawStateDot(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = COL.DOT_FILL;
  ctx.fill();
  if (COL.DOT_RING) { ctx.lineWidth = 1.6; ctx.strokeStyle = COL.DOT_RING; ctx.stroke(); }
}
