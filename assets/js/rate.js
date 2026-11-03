// Firing rate for the oscilloscopes: the instantaneous rate 1/ISI, one dot at
// each spike (from the second spike after a reset). Spike times are kept in
// their own list (RATE_REC), so the first spike of a sweep still has its ISI.
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
  const idxOfT = t => { const a = Math.round((tNow - t) / ms); const i = head - 1 - a; return full ? (i + N) % N : i; };
  let q = times.length; while (q > 0 && times[q - 1] >= tOld) q--;
  const dots = [];
  let mx = 0;
  for (q = Math.max(1, q); q < times.length; q++) {
    if (times[q - 1] < rec.t0) continue;
    const f = 1000 / (times[q] - times[q - 1]);
    dots.push([times[q], f]); if (f > mx) mx = f;
  }
  fbSteadyRange(state, 0, Math.max(10, mx * 1.15), 10);
  drawScope(ctx, r, state.lo, state.hi, '1/ISI (Hz)', color);
  const y = scopeY(r, state.lo, state.hi);
  inScope(ctx, r, () => {
    ctx.fillStyle = color;
    dots.forEach(([t, f]) => {
      const i = idxOfT(t); if (i < 0) return;
      ctx.beginPath(); ctx.arc(r.x + (i / (N - 1)) * r.w, y(f), 2.2, 0, 2 * Math.PI); ctx.fill();
    });
  });
}
