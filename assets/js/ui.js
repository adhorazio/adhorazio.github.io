// Small shared UI helpers (loaded with defer on the widget pages).
//
// Show / hide switches for the legend and for the phase plane (or f–I) panel.
// They are two small chips added at the right end of the button row just above
// the plots, so they take no line of their own. Open by default on computers,
// closed on phones; each choice is remembered per page in this browser.
// With the panel hidden, the oscilloscope takes the full width.
(function () {
  const widget = document.querySelector('.widget');
  if (!widget) return;
  const plots = widget.querySelector('.plots');
  const legend = widget.querySelector('.legend');
  const panel = plots && plots.querySelector(':scope > #phase, :scope > #fi, :scope > .phase-wrap');
  if (!legend && !panel) return;
  const phone = window.matchMedia('(max-width: 600px)').matches;

  // where the chips go: the row right above the plots (feedback / window /
  // presets row); if there is none, a compact row of their own
  // On phones they go at the end of the presets (the use cases), where the last
  // line of preset buttons usually leaves room.
  let row = plots && plots.previousElementSibling;
  const presets = widget.querySelector('.presets-row, .presets');
  if (phone && presets) row = presets;
  if (!row || !row.matches('.win-row, .presets-row, .presets')) {
    row = document.createElement('div'); row.className = 'win-row';
    (plots || legend).parentNode.insertBefore(row, plots || legend);
  }
  const box = document.createElement('div');
  box.className = 'fb-btns view-btns';
  row.appendChild(box);

  function chip(label, key, apply) {
    let open = !phone;
    try { const v = localStorage.getItem(key + location.pathname); if (v !== null) open = v === '1'; } catch (e) {}
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'win-btn view-btn';
    b.innerHTML = `<span class="chev" aria-hidden="true">▸</span>${label}`;
    box.appendChild(b);
    const set = o => { apply(o); b.classList.toggle('open', o); b.setAttribute('aria-expanded', String(o)); };
    set(open);
    b.addEventListener('click', () => {
      open = !open; set(open);
      try { localStorage.setItem(key + location.pathname, open ? '1' : '0'); } catch (e) {}
    });
  }
  if (panel) {
    panel.classList.add('pp-panel');
    chip(panel.id === 'fi' ? 'f–I curve' : 'Phase plane', 'panel-open:', o => {
      plots.classList.toggle('pp-collapsed', !o);
      window.dispatchEvent(new Event('resize'));        // canvases refit to the new width
    });
  }
  if (legend) chip('Legend', 'legend-open:', o => { legend.hidden = !o; });
})();
