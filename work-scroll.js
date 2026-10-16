// Native vertical page scrolling moves only the selected-project rail sideways.
// No wheel interception: before/after this section the document scrolls normally.
(() => {
  'use strict';
  const section = document.getElementById('work');
  const stage = section?.querySelector('.work-scroll-stage');
  const rail = document.getElementById('work-rail');
  if (!section || !stage || !rail || typeof ResizeObserver === 'undefined') return;
  const panels = Array.from(rail.querySelectorAll('.work-panel'));
  const previous = document.getElementById('rail-prev');
  const next = document.getElementById('rail-next');
  const dialog = document.getElementById('case-dialog');
  const capable = matchMedia('(min-width: 960px) and (min-height: 650px) and (hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
  let active = false, printing = false, start = 0, distance = 0, x = 0;
  let frame = 0, measureFrame = 0, refused = '', stops = [];
  let panelPositions = [], viewportWidth = 0;
  const warmed = new Set();
  const viewportKey = () => `${innerWidth}x${innerHeight}`;
  const allowed = () => capable.matches && !reduced.matches && !printing && document.documentElement.dataset.scrollLayout === 'vertical';

  function place(top, smooth = false) {
    if (Math.abs(scrollY - top) < 1) return;
    // Override the page's default smooth behavior for resize/anchor preservation.
    const html = document.documentElement;
    const old = html.style.scrollBehavior;
    if (!smooth) html.style.scrollBehavior = 'auto';
    window.scrollTo({ top: Math.max(0, top), behavior: smooth ? 'smooth' : 'auto' });
    html.style.scrollBehavior = old;
  }

  function anchor() {
    const top = section.getBoundingClientRect().top + scrollY;
    const height = section.offsetHeight;
    if (scrollY < top) return null;
    if (scrollY >= top + height) return { below: scrollY - top - height };
    return { fraction: active && distance > 0 ? clamp((scrollY - start) / distance, 0, 1) : clamp((scrollY - top) / Math.max(1, height - innerHeight), 0, 1) };
  }

  function restore(keep) {
    if (!keep) return;
    const top = section.getBoundingClientRect().top + scrollY;
    if (keep.below != null) place(top + section.offsetHeight + keep.below);
    else place(top + keep.fraction * (active ? distance : Math.max(0, section.offsetHeight - innerHeight)));
  }

  function notify() { document.dispatchEvent(new CustomEvent('workscrollmodechange')); }

  function disable(keep, fallback = false) {
    const wasActive = active;
    active = false;
    section.classList.remove('is-work-scroll');
    section.classList.toggle('work-scroll-fallback', fallback);
    section.style.height = '';
    section.style.removeProperty('--work-stage-height');
    rail.style.transform = '';
    rail.scrollLeft = 0;
    distance = 0; x = 0;
    restore(keep);
    if (wasActive || fallback) notify();
  }

  function update() {
    if (!active || dialog?.open) return;
    x = clamp(scrollY - start, 0, distance);
    rail.style.transform = `translate3d(${-Math.round(x)}px, 0, 0)`;
    if (previous) previous.disabled = x <= 2;
    if (next) next.disabled = x >= distance - 2;
    if (scrollY >= start - innerHeight && scrollY <= start + distance + innerHeight) {
      panelPositions.forEach((left, index) => {
        if (left > x + viewportWidth * 1.5 || left + viewportWidth < x || warmed.has(index)) return;
        warmed.add(index);
        panels[index].querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager'; });
      });
    }
  }

  function measure() {
    const keep = anchor();
    if (!allowed()) { if (active || section.classList.contains('work-scroll-fallback')) disable(keep); return; }
    if (refused === viewportKey()) return;
    const wasActive = active;
    section.classList.remove('work-scroll-fallback');
    section.classList.add('is-work-scroll');
    section.style.setProperty('--work-stage-height', `${innerHeight}px`);
    active = true;
    const width = stage.clientWidth;
    const fits = width > 0 && rail.clientHeight > 0 && panels.every(panel => panel.scrollHeight <= panel.clientHeight + 2);
    if (!fits) {
      refused = viewportKey();
      disable(keep, true); // Read every line in a static grid when a short stage cannot fit the real cards.
      return;
    }
    distance = Math.max(0, rail.scrollWidth - width);
    if (!distance) { disable(keep); return; }
    section.style.height = `${innerHeight + distance}px`;
    start = section.getBoundingClientRect().top + scrollY;
    const box = rail.getBoundingClientRect();
    const inset = parseFloat(getComputedStyle(rail).paddingLeft) || 0;
    viewportWidth = width;
    panelPositions = panels.map(panel => panel.getBoundingClientRect().left - box.left - inset);
    stops = [...new Set([0, ...panelPositions.map(left => clamp(left, 0, distance)), distance])].sort((a, b) => a - b);
    rail.scrollLeft = 0;
    restore(keep);
    update();
    if (!wasActive) notify();
  }

  function scheduleMeasure() {
    if (measureFrame) return;
    measureFrame = requestAnimationFrame(() => {
      measureFrame = 0;
      try { measure(); }
      catch (_) { refused = viewportKey(); disable(anchor(), true); }
    });
  }

  function goTo(offset, smooth = true) {
    if (!active || dialog?.open) return;
    place(start + clamp(offset, 0, distance), smooth && !reduced.matches);
  }

  function step(direction) {
    const current = clamp(scrollY - start, 0, distance);
    const target = direction > 0 ? stops.find(n => n > current + 2) : [...stops].reverse().find(n => n < current - 2);
    if (target != null) goTo(target);
  }

  window.portfolioWork = { isActive: () => active, step };
  window.addEventListener('scroll', () => {
    if (!active || frame) return;
    frame = requestAnimationFrame(() => { frame = 0; update(); });
  }, { passive: true });
  window.addEventListener('resize', scheduleMeasure);
  const changed = () => { refused = ''; scheduleMeasure(); };
  for (const query of [capable, reduced]) {
    if (query.addEventListener) query.addEventListener('change', changed);
    else query.addListener(changed);
  }
  window.addEventListener('beforeprint', () => { printing = true; if (active) disable(anchor()); });
  window.addEventListener('afterprint', () => { printing = false; scheduleMeasure(); });

  rail.addEventListener('keydown', event => {
    if (!active || event.defaultPrevented || dialog?.open || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target.closest('input, textarea, select, [contenteditable]')) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      step(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  rail.addEventListener('focusin', event => {
    if (!active || dialog?.open) return;
    const target = event.target;
    requestAnimationFrame(() => {
      if (!active || dialog?.open || !target.isConnected) return;
      // Native focus must not scroll the clipped stage or this unrolled rail independently.
      stage.scrollLeft = 0; rail.scrollLeft = 0;
      const rect = target.getBoundingClientRect();
      if (rect.left >= 16 && rect.right <= stage.clientWidth - 16) return;
      const panel = target.closest('.work-panel');
      if (panel) goTo(panel.getBoundingClientRect().left - rail.getBoundingClientRect().left - 24, false);
    });
  });
  const observer = new ResizeObserver(scheduleMeasure);
  observer.observe(stage);
  const heading = section.querySelector('.work-head');
  if (heading) observer.observe(heading);
  panels.forEach(panel => { const body = panel.querySelector('.panel-body'); if (body) observer.observe(body); });
  if (document.fonts?.ready) document.fonts.ready.then(changed);
  scheduleMeasure();
})();
