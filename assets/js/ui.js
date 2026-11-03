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
