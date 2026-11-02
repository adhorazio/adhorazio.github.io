// Shared time axis for the neuron trace plots (oscilloscope style).
// The scopes are drawn in the top part of the canvas (height H); this draws a
// strip of height TIME_AXIS_H underneath with ticks + labels, and faint
// vertical grid lines through every scope. Sweep display: t = 0 at x0 (the
// left edge of the scopes, after the y-axis margin), spanMs at W.
// The last label carries the unit.
const TIME_AXIS_H = 20;

function drawTimeAxis(ctx, W, H, spanMs, x0 = 0) {
  const steps = [5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000];
  const step = steps.find(s => spanMs / s <= 6) || 5000;
  const useSeconds = spanMs >= 1000;
  const lastT = Math.floor(spanMs / step + 1e-6) * step;
  const pw = W - x0;

  ctx.save();
  ctx.font = '10px monospace';
  ctx.textBaseline = 'top';
  ctx.lineWidth = 1;

  ctx.strokeStyle = '#444';                       // axis line
  ctx.beginPath(); ctx.moveTo(x0, H + 0.5); ctx.lineTo(W, H + 0.5); ctx.stroke();

  const labels = [];
  for (let t = 0; t <= lastT + 1e-6; t += step) {
    const x = Math.min(Math.round(x0 + (t / spanMs) * pw) + 0.5, W - 0.5);
    ctx.strokeStyle = 'rgba(255,255,255,0.045)';  // faint grid through the scopes
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    ctx.strokeStyle = '#555';                     // tick
    ctx.beginPath(); ctx.moveTo(x, H); ctx.lineTo(x, H + 4); ctx.stroke();

    let text = useSeconds ? String(+(t / 1000).toFixed(2)) : String(t);
    if (Math.abs(t - lastT) < 1e-6) text += useSeconds ? ' s' : ' ms';
    const w = ctx.measureText(text).width;
    let left;
    if (t === 0)         left = x + 3;            // first: left-aligned
    else if (x > W - 40) left = W - 3 - w;        // near the edge: right-aligned
    else                 left = x - w / 2;        // centred under the tick
    labels.push({ text, left, right: left + w });
  }
  // Keep the last label (it has the unit); drop any label that would overlap
  // its neighbour on the right (narrow screens).
  ctx.fillStyle = '#777'; ctx.textAlign = 'left';
  let limit = Infinity;
  for (let k = labels.length - 1; k >= 0; k--) {
    const L = labels[k];
    if (L.right + 12 > limit) continue;
    ctx.fillText(L.text, L.left, H + 6);
    limit = L.left;
  }
  ctx.restore();
}
