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
//   Na+ gates in sky / ice blue, K+ gate in bordeaux (GeoDataViz values:
//   #99D7F0 from bivariate b1/b3, #B10026 = darkest step of sequential m3).
//   GATE_M Na+ activation m (predominant)                     sky / ice
//   GATE_H Na+ inactivation h: same colour as m, lighter       sky 60%
//   GATE_N K+ activation n                                    bordeaux
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
  GATE_M: '#99D7F0',
  GATE_N: '#B10026',
  GATE_H: '#99D7F099',
  REST:   '#888888',
  OP:     '#FFFFFF',
  TRAJ:   '0,154,222'     // = V blue as an rgb triplet, used with a varying alpha
};

// Extended palette: for pages where many series need colours but telling
// them apart matters less than in the colour code above (e.g. Clione's 18
// cases). Rule: anything that carries meaning uses COL / GDV 6a; extra
// colours come from the GeoDataViz ramps below. Source: OrdnanceSurvey
// GeoDataViz-Toolkit, Colours/GDV-colour-palettes.json. Legacy sets are
// kept for reference so earlier looks can be restored.
const PALETTE_EXT = {
  // GeoDataViz qualitative (max 6) = the site colour code
  q6a: ['#FF1F5B', '#00CD6C', '#009ADE', '#AF58BA', '#FFC61E', '#F28522'],

  // Extra tones picked from the GDV ramps (mid steps, readable on dark)
  extra: {
    teal:     '#089099',  // m1
    pink:     '#ED85B0',  // s3
    olive:    '#B7C370',  // d4
    indigo:   '#685BA7',  // d3
    lavender: '#A599CA',  // d3
    sky:      '#99D7F0',  // b1 / b3
    sage:     '#9CCB86',  // d1
    coral:    '#F0746E',  // d2
    sand:     '#FCDE9C',  // d2
    rose:     '#E95694',  // s3
    plum:     '#AB1866',  // m2
    bordeaux: '#B10026',  // m3 darkest
    wine:     '#8F003B'   // s3 darkest
  },

  // Full GDV ramps (light -> dark, or one end -> other for diverging)
  gdv: {
    s1: ['#E4F1F7', '#C5E1EF', '#9EC9E2', '#6CB0D6', '#3C93C2', '#226E9C', '#0D4A70'], // blues
    s2: ['#E1F2E3', '#CDE5D2', '#9CCEA7', '#6CBA7D', '#40AD5A', '#228B3B', '#06592A'], // greens
    s3: ['#F9D8E6', '#F2ACCA', '#ED85B0', '#E95694', '#E32977', '#C40F5B', '#8F003B'], // pinks
    m1: ['#B7E6A5', '#7CCBA2', '#46AEA0', '#089099', '#00718B', '#045275', '#003147'], // green -> navy
    m2: ['#FCE1A4', '#FABF7B', '#F08F6E', '#E05C5C', '#D12959', '#AB1866', '#6E005F'], // sunset
    m3: ['#FFF3B2', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#B10026'], // yellow -> red
    d1: ['#009392', '#39B185', '#9CCB86', '#E9E29C', '#EEB479', '#E88471', '#CF597E'],
    d2: ['#045275', '#089099', '#7CCBA2', '#FCDE9C', '#F0746E', '#DC3977', '#7C1D6F'],
    d3: ['#443F90', '#685BA7', '#A599CA', '#F5DDEB', '#F492A5', '#EA6E8A', '#D21C5E'],
    d4: ['#008042', '#6FA253', '#B7C370', '#FCE498', '#D78287', '#BF5688', '#7C1D6F'],
    b1: ['#EDBA50', '#9EA14B', '#498646', '#E9DBAC', '#9BBEA2', '#479E97', '#E6F9FF', '#99D7F0', '#46B4E0'],
    b2: ['#9580D4', '#6B7898', '#3B6F52', '#C3B5E9', '#8CAAA7', '#4E9C5A', '#F1EBFF', '#AEDDB7', '#60CC63'],
    b3: ['#F2467E', '#A13D77', '#4A336F', '#EBADC8', '#9D96BC', '#487DB0', '#E6F9FF', '#99D7F0', '#46B4E0'],
    rag:    ['#E9002D', '#FFAA00', '#00B000'],
    ragCvd: ['#C40F5B', '#FD8D3C', '#089099']
  },

  // Legacy (not GDV), kept for reference
  legacy: {
    // Clione before Nov 2026: Open Color + two hand-picked (#c9a800, #7c6cfc)
    clioneNeurons: ['#ff6b6b', '#ffa94d', '#c9a800', '#69db7c', '#4dabf7', '#cc5de8'],
    clioneCases: ['#7c6cfc', '#ff6b6b', '#ffa94d', '#c9a800', '#69db7c', '#4dabf7',
                  '#cc5de8', '#20c997', '#f06595', '#845ef7', '#15aabf', '#fab005',
                  '#ff922b', '#51cf66', '#339af0', '#e64980', '#9775fa', '#12b886'],
    // HH gates before the GDV trial
    hhGates: { m: '#9AD1F5', n: '#B0283C' }
  }
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
