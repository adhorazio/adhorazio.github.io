// Small shared UI helpers (loaded with defer on the widget pages).
(function () {
  const widget = document.querySelector('.widget');
  if (!widget) return;
  const phone = window.matchMedia('(max-width: 600px)').matches;
  const load = (key, dflt) => { try { const v = localStorage.getItem(key + location.pathname); return v === null ? dflt : v === '1'; } catch (e) { return dflt; } };
  const save = (key, on) => { try { localStorage.setItem(key + location.pathname, on ? '1' : '0'); } catch (e) {} };

  // Plain view buttons, highlighted while their part is shown:
  //  - Phase plane (or f–I) panel, always shown when the page opens. Hidden, the oscilloscope
  //    takes the full width.
  //  - Firing rate (pages that define window.setRateView): an extra scope with
  //    the instantaneous rate 1/ISI, always off when the page opens.
  // Computer: end of the row above the plots. Phone: end of the presets.
  const plots = widget.querySelector('.plots');
  const panel = plots && plots.querySelector(':scope > #phase, :scope > #fi, :scope > .phase-wrap');
  const hasRate = typeof window.setRateView === 'function';
  if (panel || hasRate) {
    let row = plots && plots.previousElementSibling;
    const presets = widget.querySelector('.presets-row, .presets');
    if (phone && presets) row = presets;
    if (!row || !row.matches('.win-row, .presets-row, .presets')) {
      row = document.createElement('div'); row.className = 'win-row';
      plots.parentNode.insertBefore(row, plots);
    }
    const box = document.createElement('div');
    box.className = 'fb-btns view-btns';
    row.appendChild(box);
    const viewBtn = (label, key, dflt, apply) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'win-btn view-btn'; b.textContent = label;
      box.appendChild(b);
      let on = dflt;                       // always start from the default (not remembered)
      const set = o => { apply(o); b.classList.toggle('active', o); b.setAttribute('aria-pressed', String(o)); };
      set(on);
      b.addEventListener('click', () => { on = !on; set(on); });
    };
    if (hasRate) viewBtn('Firing rate', 'rate-on:', false, o => window.setRateView(o));
    if (panel) {
      panel.classList.add('pp-panel');
      viewBtn(panel.id === 'fi' ? 'f–I curve' : 'Phase plane', 'panel-open2:', true, o => {
        plots.classList.toggle('pp-collapsed', !o);
        window.dispatchEvent(new Event('resize'));      // canvases refit to the new width
      });
    }
  }

  // Legend: an arrow bar where the legend starts shows / hides it. Open by
  // default (computers and phones); remembered per page.
  const legend = widget.querySelector('.legend');
  if (legend) {
    const t = document.createElement('button');
    t.type = 'button'; t.className = 'legend-toggle';
    t.innerHTML = '<span class="chev" aria-hidden="true">▸</span><span>Legend</span>';
    legend.parentNode.insertBefore(t, legend);
    let open = load('legend-open2:', true);
    const set = o => { legend.hidden = !o; t.classList.toggle('open', o); t.setAttribute('aria-expanded', String(o)); };
    set(open);
    t.addEventListener('click', () => { open = !open; set(open); save('legend-open2:', open); });
  }
})();
