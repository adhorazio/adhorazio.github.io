// Firing rate for the oscilloscopes:
//  - dots: instantaneous rate 1/ISI at each spike;
//  - line: adaptive Gaussian-kernel rate  r(t) = Σ_k exp(−(t − t_k)² / 2σ_k²) / (σ_k √2π)
//    (Hz, t in ms). Each spike gets its own width σ_k = α × its local ISI
//    (mean of the ISIs on both sides), kept between 3 and 60 ms: narrow kernels
//    where the neuron fires fast (bursts stay visible), wide ones where it fires
//    slowly (no ripple between spikes). With σ ≈ ISI the ripple is negligible.
// Spike times are kept in their own list (RATE_REC), so spikes that already
// left the screen still count. The line is drawn only where its kernel is
// complete: 2.5 σ of the newest spike behind the newest sample (short when the
// neuron fires fast).
const RATE_ALPHA = 0.8, RATE_SMIN = 3, RATE_SMAX = 60;   // σ_k = α·ISI_local, ms

const RATE_REC = {
  times: [], tNow: 0, t0: 0,
  sample(spiked, ms) {                    // call once per recorded sample
    this.tNow += ms;
    if (spiked) { this.times.push(this.tNow); if (this.times.length > 4000) this.times.splice(0, 1000); }
  },
  reset() { this.times = []; this.t0 = this.tNow; },
};

function drawRateScope(ctx, r, rec, N, head, full, ms, state, color) {
  const n = full ? N : head;
  const times = rec.times, tNow = rec.tNow, tOld = tNow - (n - 1) * ms;
  const lower = t => { let lo = 0, hi = times.length; while (lo < hi) { const m = (lo + hi) >> 1; if (times[m] < t) lo = m + 1; else hi = m; } return lo; };
  const idxOfT = t => { const a = Math.round((tNow - t) / ms); const i = head - 1 - a; return full ? (i + N) % N : i; };

  // kernel width of each spike that can reach the screen
  const cut = 4 * RATE_SMAX, q0 = lower(Math.max(rec.t0, tOld - cut)), Q = times.length;
  const sig = new Float32Array(Math.max(0, Q - q0));
  for (let q = q0; q < Q; q++) {
    const L = q > 0 && times[q - 1] >= rec.t0 ? times[q] - times[q - 1] : NaN;
    const R = q + 1 < Q ? times[q + 1] - times[q] : NaN;
    const isi = isNaN(L) ? (isNaN(R) ? RATE_SMAX / RATE_ALPHA : R) : (isNaN(R) ? L : 0.5 * (L + R));
    sig[q - q0] = Math.min(RATE_SMAX, Math.max(RATE_SMIN, RATE_ALPHA * isi));
  }
  const tMax = Q > q0 ? Math.min(tNow, Math.max(times[Q - 1] + 2.5 * sig[Q - 1 - q0], tNow - 2.5 * RATE_SMAX)) : tNow;
  const tMin = rec.t0;

  const cols = Math.max(2, Math.floor(r.w));
  const vals = new Float32Array(cols), tcol = new Float32Array(cols);
  let mx = 0;
  for (let c = 0; c < cols; c++) {
    const i = Math.round(c / (cols - 1) * (N - 1));
    if (!full && i >= head) { vals[c] = NaN; continue; }
    const age = full ? (head - 1 - i + N) % N : head - 1 - i;
    const t = tNow - age * ms; tcol[c] = t;
    if (t > tMax || t < tMin) { vals[c] = NaN; continue; }
    let sum = 0;
    for (let q = Math.max(q0, lower(t - cut)); q < Q && times[q] <= t + cut; q++) {
      const sg = sig[q - q0], d = t - times[q];
      if (Math.abs(d) > 4 * sg) continue;
      sum += Math.exp(-d * d / (2 * sg * sg)) / sg;
    }
    vals[c] = sum * 1000 / Math.sqrt(2 * Math.PI); if (vals[c] > mx) mx = vals[c];
  }
  const dots = [];
  for (let q = Math.max(1, lower(tOld)); q < Q; q++) {
    if (times[q - 1] < rec.t0) continue;
    const f = 1000 / (times[q] - times[q - 1]);
    dots.push([times[q], f]); if (f > mx) mx = f;
  }
  fbSteadyRange(state, 0, Math.max(10, mx * 1.1), 10);
  drawScope(ctx, r, state.lo, state.hi, 'rate (Hz)', color);
  const y = scopeY(r, state.lo, state.hi);
  inScope(ctx, r, () => {
    ctx.fillStyle = 'rgba(255,255,255,0.55)';                 // 1/ISI dots
    dots.forEach(([t, f]) => {
      const i = idxOfT(t); if (i < 0) return;
      ctx.beginPath(); ctx.arc(r.x + (i / (N - 1)) * r.w, y(f), 1.6, 0, 2 * Math.PI); ctx.fill();
    });
    ctx.strokeStyle = color; ctx.lineWidth = 1.6; ctx.globalAlpha = 0.95;   // kernel rate
    ctx.beginPath();
    let pen = false;
    for (let c = 0; c < cols; c++) {
      if (isNaN(vals[c])) { pen = false; continue; }
      if (pen && tcol[c] < tcol[c - 1]) pen = false;          // sweep wrap: time jumps
      const x = r.x + c / (cols - 1) * r.w;
      pen ? ctx.lineTo(x, y(vals[c])) : ctx.moveTo(x, y(vals[c]));
      pen = true;
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  });
}
