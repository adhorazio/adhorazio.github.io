// Small shared UI helpers (loaded with defer on the widget pages).
(function () {
  const widget = document.querySelector('.widget');
  if (!widget) return;
  const phone = window.matchMedia('(max-width: 600px)').matches;
  const load = (key, dflt) => { try { const v = localStorage.getItem(key + location.pathname); return v === null ? dflt : v === '1'; } catch (e) { return dflt; } };
  const save = (key, on) => { try { localStorage.setItem(key + location.pathname, on ? '1' : '0'); } catch (e) {} };

  // Phase plane (or f–I) panel: a plain button, highlighted while the panel is
  // shown (shown by default). Hidden, the oscilloscope takes the full width.
  // Computer: end of the row above the plots. Phone: end of the presets.
  const plots = widget.querySelector('.plots');
  const panel = plots && plots.querySelector(':scope > #phase, :scope > #fi, :scope > .phase-wrap');
  if (panel) {
    panel.classList.add('pp-panel');
    let row = plots.previousElementSibling;
    const presets = widget.querySelector('.presets-row, .presets');
    if (phone && presets) row = presets;
    if (!row || !row.matches('.win-row, .presets-row, .presets')) {
      row = document.createElement('div'); row.className = 'win-row';
      plots.parentNode.insertBefore(row, plots);
    }
    const box = document.createElement('div');
    box.className = 'fb-btns view-btns';
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'win-btn view-btn';
    b.textContent = panel.id === 'fi' ? 'f–I curve' : 'Phase plane';
    box.appendChild(b); row.appendChild(box);
    let open = load('panel-open:', true);
    const set = o => {
      plots.classList.toggle('pp-collapsed', !o);
      b.classList.toggle('active', o); b.setAttribute('aria-pressed', String(o));
      window.dispatchEvent(new Event('resize'));        // canvases refit to the new width
    };
    set(open);
    b.addEventListener('click', () => { open = !open; set(open); save('panel-open:', open); });
  }

  // Legend: an arrow bar where the legend starts shows / hides it. Open by
  // default on computers, closed on phones; remembered per page.
  const legend = widget.querySelector('.legend');
  if (legend) {
    const t = document.createElement('button');
    t.type = 'button'; t.className = 'legend-toggle';
    t.innerHTML = '<span class="chev" aria-hidden="true">▸</span><span>Legend</span>';
    legend.parentNode.insertBefore(t, legend);
    let open = load('legend-open:', !phone);
    const set = o => { legend.hidden = !o; t.classList.toggle('open', o); t.setAttribute('aria-expanded', String(o)); };
    set(open);
    t.addEventListener('click', () => { open = !open; set(open); save('legend-open:', open); });
  }
})();
