// Firing rate for the oscilloscopes: Gaussian-kernel estimate (line) and
// instantaneous rate 1/ISI at each spike (dots), as in the eQIF paper's figures.
//   r(t) = Σ_k exp(−(t − t_k)² / 2σ²) / (σ √2π)      (Hz, t in ms)
// The trace buffers are sweeps (left to right, then wrap), so spike times are
// taken in chronological order: oldest sample = just right of the sweep head.
// At both ends of the recorded window the kernel is cut, so the sum is divided by
// the part of the kernel that lies inside the window (no dip at the sweep head).
const RATE_SIGMA = 25;   // ms
// erf (Abramowitz & Stegun 7.1.26, |error| < 1.5e-7)
function rateErf(x) {
  const s = Math.sign(x); x = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * x);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return s * y;
}

function drawRateScope(ctx, r, spk, N, head, full, msPerSample, state, color) {
  const n = full ? N : head;
  const chron = j => (full ? (j - head + N) % N : j);          // 0 = oldest sample
  const times = [];
  for (let j = 0; j < n; j++) if (spk[j]) times.push(chron(j) * msPerSample);
  times.sort((a, b) => a - b);

  const sg = RATE_SIGMA, k = 1000 / (sg * Math.sqrt(2 * Math.PI)), s2 = 2 * sg * sg, cut = 4 * sg;
  const cols = Math.max(2, Math.floor(r.w));
  const vals = new Float32Array(cols), tcol = new Float32Array(cols);
  let mx = 0;
  for (let c = 0; c < cols; c++) {
    const i = Math.round(c / (cols - 1) * (N - 1));
    if (!full && i >= head) { vals[c] = NaN; continue; }
    const t = chron(i) * msPerSample; tcol[c] = t;
    let sum = 0;
    for (let q = 0; q < times.length; q++) {
      const d = t - times[q];
      if (d > cut) continue;
      if (d < -cut) break;
      sum += Math.exp(-d * d / s2);
    }
    const tEnd = (n - 1) * msPerSample;                          // newest sample
    const inside = 0.5 * (rateErf((tEnd - t) / (sg * Math.SQRT2)) - rateErf((0 - t) / (sg * Math.SQRT2)));
    vals[c] = sum * k / Math.max(inside, 0.3); if (vals[c] > mx) mx = vals[c];
  }
  const dots = [];
  for (let q = 1; q < times.length; q++) {
    const f = 1000 / (times[q] - times[q - 1]);
    dots.push([times[q], f]); if (f > mx) mx = f;
  }
  fbSteadyRange(state, 0, Math.max(10, mx * 1.1), 10);
  drawScope(ctx, r, state.lo, state.hi, 'rate (Hz)', color);
  const y = scopeY(r, state.lo, state.hi);
  const xOfT = t => {                                            // chronological time -> x
    const i = Math.round(t / msPerSample);
    const j = full ? (i + head) % N : i;
    return r.x + (j / (N - 1)) * r.w;
  };
  inScope(ctx, r, () => {
    // 1/ISI dots (faint white)
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    dots.forEach(([t, f]) => { ctx.beginPath(); ctx.arc(xOfT(t), y(f), 1.6, 0, 2 * Math.PI); ctx.fill(); });
    // smoothed rate; broken where the sweep wraps (time jumps)
    ctx.strokeStyle = color; ctx.lineWidth = 1.6; ctx.globalAlpha = 0.95;
    ctx.beginPath();
    let pen = false;
    for (let c = 0; c < cols; c++) {
      if (isNaN(vals[c])) { pen = false; continue; }
      if (pen && tcol[c] < tcol[c - 1]) pen = false;
      const x = r.x + c / (cols - 1) * r.w;
      pen ? ctx.lineTo(x, y(vals[c])) : ctx.moveTo(x, y(vals[c]));
      pen = true;
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  });
}
