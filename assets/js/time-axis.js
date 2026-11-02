// Shared time axis for the neuron trace plots.
// The trace is drawn in the top part of the canvas (height H); this draws a
// strip of height TIME_AXIS_H underneath with ticks + labels, and faint
// vertical grid lines through the plot. Sweep display: t = 0 at the left
// edge, spanMs at the right edge. The last label carries the unit.
const TIME_AXIS_H = 20;

function drawTimeAxis(ctx, W, H, spanMs) {
  const steps = [5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000];
  const step = steps.find(s => spanMs / s <= 6) || 5000;
  const useSeconds = spanMs >= 1000;
  const lastT = Math.floor(spanMs / step + 1e-6) * step;

  ctx.save();
  ctx.font = '10px monospace';
  ctx.textBaseline = 'top';
  ctx.lineWidth = 1;

  ctx.strokeStyle = '#444';                       // axis line
  ctx.beginPath(); ctx.moveTo(0, H + 0.5); ctx.lineTo(W, H + 0.5); ctx.stroke();

  for (let t = 0; t <= lastT + 1e-6; t += step) {
    const x = Math.min(Math.round((t / spanMs) * W) + 0.5, W - 0.5);
    ctx.strokeStyle = 'rgba(255,255,255,0.045)';  // faint grid through the plot
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    ctx.strokeStyle = '#555';                     // tick
    ctx.beginPath(); ctx.moveTo(x, H); ctx.lineTo(x, H + 4); ctx.stroke();

    let label = useSeconds ? String(+(t / 1000).toFixed(2)) : String(t);
    if (Math.abs(t - lastT) < 1e-6) label += useSeconds ? ' s' : ' ms';
    ctx.fillStyle = '#777';
    if (t === 0)            { ctx.textAlign = 'left';  ctx.fillText(label, x + 3, H + 6); }
    else if (x > W - 40)    { ctx.textAlign = 'right'; ctx.fillText(label, W - 3, H + 6); }
    else                    { ctx.textAlign = 'center'; ctx.fillText(label, x, H + 6); }
  }
  ctx.restore();
}
