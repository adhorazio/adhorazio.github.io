// Firing rate for the oscilloscopes:
//  - dots: instantaneous rate 1/ISI at each spike;
//  - line: Gaussian-kernel rate  r(t) = Σ_k exp(−(t − t_k)² / 2σ²) / (σ √2π)  (Hz, t in ms).
// Spike times are kept in their own list (RATE_REC), so spikes that already
// left the screen still count for the kernel. The line is drawn only where its
// kernel is complete: RATE_DELAY behind the newest sample (it waits for the
// spikes that are still to come) and RATE_DELAY after a reset. With σ = 40 ms
// the line no longer ripples with each spike at the usual rates (> ~8 Hz).
const RATE_SIGMA = 40;                    // ms
const RATE_DELAY = 2.5 * RATE_SIGMA;      // ms (100 ms)

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
  const sg = RATE_SIGMA, k = 1000 / (sg * Math.sqrt(2 * Math.PI)), s2 = 2 * sg * sg, cut = 4 * sg;
  const tMax = tNow - RATE_DELAY, tMin = rec.t0 + RATE_DELAY;
  const lower = t => { let lo = 0, hi = times.length; while (lo < hi) { const m = (lo + hi) >> 1; if (times[m] < t) lo = m + 1; else hi = m; } return lo; };
  const idxOfT = t => { const a = Math.round((tNow - t) / ms); const i = head - 1 - a; return full ? (i + N) % N : i; };

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
    for (let q = lower(t - cut); q < times.length && times[q] <= t + cut; q++) {
      const d = t - times[q]; sum += Math.exp(-d * d / s2);
    }
    vals[c] = sum * k; if (vals[c] > mx) mx = vals[c];
  }
  const dots = [];
  for (let q = Math.max(1, lower(tOld)); q < times.length; q++) {
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
