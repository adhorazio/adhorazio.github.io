// Stacked scopes for the neuron trace plots: one scope per signal, sharing
// the time axis below. Minimal y design: no axis line, just a few faint grid
// lines labelled inside the plot ("-40 mV"), and the signal name in its
// colour at the top right. A faint line separates the scopes.
const SCOPE = { ML: 0, GAP: 12 };

// Split the plot height H into stacked scope rectangles (weights sum to 1).
function scopeRects(W, H, weights) {
  const avail = H - SCOPE.GAP * (weights.length - 1);
  let y = 0;
  return weights.map(wt => {
    const r = { x: SCOPE.ML, y, w: W - SCOPE.ML, h: avail * wt };
    y += r.h + SCOPE.GAP;
    return r;
  });
}
const scopeY = (r, lo, hi) => v => r.y + r.h * (1 - (v - lo) / (hi - lo));
const scopeX = (r, n) => i => r.x + (i / (n - 1)) * r.w;

// "Nice" round tick values between lo and hi (at most maxN ticks).
function niceTicks(lo, hi, maxN) {
  const span = hi - lo;
  if (!(span > 0)) return [lo];
  const mag = Math.pow(10, Math.floor(Math.log10(span / maxN)));
  const step = [1, 2, 2.5, 5, 10, 20].map(m => m * mag).find(s => span / s <= maxN) || span;
  const out = [];
  for (let t = Math.ceil(lo / step - 1e-9) * step; t <= hi + 1e-9; t += step) out.push(Math.abs(t) < 1e-9 ? 0 : +t.toFixed(6));
  return out;
}

// Frame of one scope: faint grid lines with inline labels (unit taken from
// the signal label, e.g. "v (mV)" -> "-40 mV"), the signal label in its
// colour, and a faint separator above the scope (except the top one).
function drawScope(ctx, r, lo, hi, label, color, ticks) {
  const y = scopeY(r, lo, hi);
  const m = /\(([^)]+)\)/.exec(label);
  const unit = m ? ' ' + m[1] : '';
  const tk = ticks || niceTicks(lo, hi, Math.max(3, Math.floor(r.h / 45)));
  ctx.save();
  ctx.lineWidth = 1; ctx.setLineDash([]);
  if (r.y > 0) {                                   // separator between scopes
    const sy = Math.round(r.y - SCOPE.GAP / 2) + 0.5;
    ctx.strokeStyle = '#2e2e2e';
    ctx.beginPath(); ctx.moveTo(r.x, sy); ctx.lineTo(r.x + r.w, sy); ctx.stroke();
  }
  ctx.font = '10px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
  tk.forEach(t => {
    const yy = Math.round(y(t)) + 0.5;
    if (yy < r.y + 12 || yy > r.y + r.h - 1) return; // keep labels inside the scope
    ctx.strokeStyle = '#333';
    ctx.beginPath(); ctx.moveTo(r.x, yy); ctx.lineTo(r.x + r.w, yy); ctx.stroke();
    ctx.fillStyle = '#555';
    ctx.fillText(t + unit, r.x + 4, yy - 3);
  });
  ctx.textAlign = 'right'; ctx.textBaseline = 'top';
  ctx.fillStyle = color;
  ctx.fillText(label, r.x + r.w - 6, r.y + 4);
  ctx.restore();
}

// Run fn with drawing clipped to scope r (traces never spill into neighbours).
function inScope(ctx, r, fn) {
  ctx.save();
  ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip();
  fn();
  ctx.restore();
}

// Horizontal reference line inside a scope, with a small label at its left.
function scopeRefLine(ctx, r, yv, color, dash, label, labelColor) {
  const yy = Math.round(yv) + 0.5;
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(r.x, yy); ctx.lineTo(r.x + r.w, yy); ctx.stroke();
  if (label) {
    ctx.setLineDash([]); ctx.font = '10px monospace'; ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
    ctx.fillStyle = labelColor || color; ctx.fillText(label, r.x + r.w - 6, yy - 2);
  }
  ctx.restore();
}
