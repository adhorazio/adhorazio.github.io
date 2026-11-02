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
// f-I operating point). Style is chosen once here:
//   'plain'    solid white dot
//   'glow'     small white dot with a soft halo
//   'ring'     hollow white ring
//   'knockout' white dot with a thin dark gap, so it separates from any line
COL.DOT_STYLE = 'plain';
function drawStateDot(ctx, x, y, r) {
  const st = COL.DOT_STYLE;
  ctx.save();
  if (st === 'glow') {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.2);
    g.addColorStop(0, 'rgba(255,255,255,0.35)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r * 3.2, 0, Math.PI * 2); ctx.fill();
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
