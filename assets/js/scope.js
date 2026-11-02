// Oscilloscope layout for the neuron trace plots: one scope per signal,
// stacked, each with its own y axis (labels in the left margin) and the
// signal name + unit in its colour; all scopes share the time axis below.
const SCOPE = { ML: 46, GAP: 12 };

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

// Frame of one scope: y axis line, ticks + labels in the margin, faint
// horizontal grid, and the signal label (e.g. "v (mV)") in its colour.
function drawScope(ctx, r, lo, hi, label, color, ticks) {
  const y = scopeY(r, lo, hi);
  const tk = ticks || niceTicks(lo, hi, Math.max(2, Math.floor(r.h / 34)));
  ctx.save();
  ctx.lineWidth = 1; ctx.setLineDash([]);
  ctx.strokeStyle = '#444';
  ctx.beginPath(); ctx.moveTo(r.x + 0.5, r.y); ctx.lineTo(r.x + 0.5, r.y + r.h); ctx.stroke();
  ctx.font = '10px monospace'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
  tk.forEach(t => {
    const yy = Math.round(y(t)) + 0.5;
    if (yy < r.y - 0.5 || yy > r.y + r.h + 0.5) return;
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath(); ctx.moveTo(r.x, yy); ctx.lineTo(r.x + r.w, yy); ctx.stroke();
    ctx.strokeStyle = '#555';
    ctx.beginPath(); ctx.moveTo(r.x - 4, yy); ctx.lineTo(r.x, yy); ctx.stroke();
    ctx.fillStyle = '#777';
    // keep edge labels fully visible (nudged inside the scope)
    ctx.fillText(String(t), r.x - 6, Math.min(Math.max(yy, r.y + 6), r.y + r.h - 6));
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
    ctx.setLineDash([]); ctx.font = '10px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
    ctx.fillStyle = labelColor || color; ctx.fillText(label, r.x + 4, yy - 2);
  }
  ctx.restore();
}
