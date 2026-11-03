// Small shared UI helpers (loaded with defer on the widget pages).
//
// Collapsible legend: an arrow button above each "what is what" legend shows or
// hides it. Open by default on computers, closed on phones (saves scrolling);
// the choice is remembered per page in this browser.
(function () {
  const phone = window.matchMedia('(max-width: 600px)').matches;
  document.querySelectorAll('.widget .legend').forEach(lg => {
    const key = 'legend-open:' + location.pathname;
    let open = !phone;
    try { const v = localStorage.getItem(key); if (v !== null) open = v === '1'; } catch (e) {}
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'legend-toggle';
    btn.innerHTML = '<span class="chev" aria-hidden="true">▸</span><span>Legend</span>';
    lg.parentNode.insertBefore(btn, lg);
    const set = o => { lg.hidden = !o; btn.classList.toggle('open', o); btn.setAttribute('aria-expanded', String(o)); };
    set(open);
    btn.addEventListener('click', () => {
      open = !open; set(open);
      try { localStorage.setItem(key, open ? '1' : '0'); } catch (e) {}
    });
  });
})();

// Collapsible phase plane / f–I panel: an arrow button shows or hides the right
// panel of the plots. Hidden, the oscilloscope takes the full width. Open by
// default on computers, closed on phones; remembered per page.
(function () {
  const phone = window.matchMedia('(max-width: 600px)').matches;
  document.querySelectorAll('.widget .plots').forEach(plots => {
    const panel = plots.querySelector(':scope > #phase, :scope > #fi, :scope > .phase-wrap');
    if (!panel) return;                     // Lissajous, CPG: no side panel
    panel.classList.add('pp-panel');
    const name = panel.id === 'fi' ? 'f–I curve' : 'Phase plane';
    const key = 'panel-open:' + location.pathname;
    let open = !phone;
    try { const v = localStorage.getItem(key); if (v !== null) open = v === '1'; } catch (e) {}
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'legend-toggle pp-toggle';
    btn.innerHTML = `<span class="chev" aria-hidden="true">▸</span><span>${name}</span>`;
    plots.appendChild(btn);
    const set = o => {
      plots.classList.toggle('pp-collapsed', !o); btn.classList.toggle('open', o);
      btn.setAttribute('aria-expanded', String(o));
      window.dispatchEvent(new Event('resize'));   // canvases refit to the new width
    };
    set(open);
    btn.addEventListener('click', () => {
      open = !open; set(open);
      try { localStorage.setItem(key, open ? '1' : '0'); } catch (e) {}
    });
  });
})();
