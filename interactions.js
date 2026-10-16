// Interaction layer (progressive enhancement over the plain vertical page):
//   1. Horizontal story: on capable desktop screens, ordinary vertical wheel/trackpad/keyboard scrolling moves the
//      chapters sideways. The page keeps native document scrolling; a sticky stage turns scroll distance into track
//      position (see interaction-math.js). Tall chapters scroll their own content in place, so nothing is cut,
//      hidden or trapped in a nested scroller.
//      (Retained but inactive: index.html sets data-scroll-layout="vertical", the owner's choice.)
//   2. Layered character: separate body and head layers of the eye-base render, the owner's iris pixels drawn in SVG
//      inside calibrated eyelid clips, and a pre-rendered upper-lid sprite for blinks. Saccadic, bounded eyes; head and
//      body on springs; timer-scheduled blinks and idle glances; one seamless figure.
// Without JavaScript, with reduced motion or Save-Data, or if a required layer fails to load, the original neutral
// character render stays static.
(() => {
  'use strict';
  const M = window.InteractionMath;
  if (!M) return;
  const html = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const dialog = document.getElementById('case-dialog');
  const onMediaChange = (query, fn) => (query.addEventListener ? query.addEventListener('change', fn) : query.addListener(fn));

  // ===================================================================== Horizontal story
  const story = (() => {
    // The owner chose native vertical page scrolling. Capability alone must never enable sideways travel.
    // Keep the independent eye rig below active, regardless of this optional story mode.
    if (html.dataset.scrollLayout !== 'horizontal') return null;
    const root = document.getElementById('story');
    const stage = root && root.querySelector('.story-stage');
    const track = document.getElementById('main');
    const nav = document.getElementById('chapter-nav');
    if (!root || !stage || !track || !nav || typeof ResizeObserver === 'undefined') return null;

    const chapters = Array.from(track.children).filter(el => el.classList.contains('chapter'));
    const names = chapters.map(el => el.dataset.chapter || el.id);
    const capable = matchMedia('(min-width: 960px) and (min-height: 600px) and (hover: hover) and (pointer: fine)');
    const SAFE_TOP = 96;     // fixed header + breathing room
    const SAFE_BOTTOM = 88;  // chapter bar
    const EDGE = 64;         // where a target lands inside a wide chapter
    const STORE_KEY = 'portfolio-story-anchor';

    let active = false;
    let layout = null;
    let state = null;
    let storyTop = 0;
    let frame = 0;
    let relayoutFrame = 0;
    let printing = false;
    let refused = null;            // viewport size at which a wide chapter did not fit
    let projectStops = [];         // story positions of each selected-work panel
    let programmaticFocus = null;
    let lastX = NaN;
    const lastOffsets = [];
    const listeners = new Set();
    const warmed = new Set();

    // ---- chapter bar
    const list = document.getElementById('chapter-list');
    const counter = document.getElementById('chapter-current');
    const prev = document.getElementById('chapter-prev');
    const next = document.getElementById('chapter-next');
    const railPrev = document.getElementById('rail-prev');
    const railNext = document.getElementById('rail-next');
    document.getElementById('chapter-total').textContent = String(chapters.length).padStart(2, '0');
    const links = chapters.map((chapter, index) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.className = 'chapter-link';
      link.href = '#' + chapter.id;
      const bar = document.createElement('span');
      bar.className = 'chapter-bar';
      bar.setAttribute('aria-hidden', 'true');
      const fill = document.createElement('span');
      fill.className = 'chapter-fill';
      bar.append(fill);
      const label = document.createElement('span');
      label.className = 'chapter-label';
      label.textContent = names[index];
      link.append(bar, label);
      item.append(link);
      list.append(item);
      return { link, fill, progress: -1 };
    });
    let shownActive = -1;

    function shouldRun() {
      if (printing || reduceMotion.matches || !capable.matches) return false;
      return !(refused && refused.w === innerWidth && refused.h === innerHeight);
    }

    // The (vertical-layout) chapter and offset currently at the top of the screen.
    function verticalPosition() {
      for (let i = chapters.length - 1; i >= 0; i--) {
        const rect = chapters[i].getBoundingClientRect();
        if (rect.top <= SAFE_TOP) return { element: chapters[i], y: Math.max(0, SAFE_TOP - rect.top) };
      }
      return { element: chapters[0], y: 0 };
    }

    function savedAnchor() {
      try {
        const type = performance.getEntriesByType('navigation')[0]?.type;
        const raw = sessionStorage.getItem(STORE_KEY);
        sessionStorage.removeItem(STORE_KEY);
        if (!raw || (type !== 'reload' && type !== 'back_forward')) return null;
        const anchor = JSON.parse(raw);
        return anchor && anchor.count === chapters.length ? anchor : null;
      } catch (_) { return null; }
    }

    function enable() {
      if (active) return;
      const hashTarget = elementForHash(location.hash);
      const start = hashTarget ? { element: hashTarget } : (scrollY > 0 ? verticalPosition() : null);
      const anchor = start ? null : savedAnchor();
      active = true;
      html.classList.add('is-horizontal');
      nav.hidden = false;
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      if (!relayout({ start, anchor })) return;
      emit();
      announceMode();
    }

    function disable() {
      if (!active) return;
      const keep = state ? { element: chapters[state.active], y: Math.max(0, -(state.offsets[state.active] || 0)) } : null;
      active = false;
      html.classList.remove('is-horizontal');
      nav.hidden = true;
      root.style.height = '';
      track.style.transform = '';
      track.style.removeProperty('--stage-w');
      track.style.removeProperty('--stage-h');
      chapters.forEach(chapter => { chapter.style.transform = ''; });
      lastOffsets.length = 0; lastX = NaN; layout = null; state = null; shownActive = -1;
      if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
      if (keep) {
        const top = keep.element.getBoundingClientRect().top + scrollY + keep.y - (keep.y ? SAFE_TOP : 0);
        html.style.scrollBehavior = 'auto';
        window.scrollTo(0, Math.max(0, top));
        html.style.scrollBehavior = '';
      }
      if (railPrev) { railPrev.disabled = false; railNext.disabled = false; }
      emit();
      announceMode();
    }

    function sync() {
      if (shouldRun()) { if (active) scheduleRelayout(); else enable(); }
      else disable();
    }

    // A wide chapter (selected work) must fit the stage height; otherwise the vertical page is the honest layout.
    function wideChaptersFit() {
      for (const panel of track.querySelectorAll('.chapter-wide .work-panel')) {
        if (panel.scrollHeight > panel.clientHeight + 2) return false;
      }
      return true;
    }

    function relayout(options = {}) {
      if (!active) return false;
      const anchor = options.anchor || (!options.start && layout && state ? M.captureAnchor(layout, state.s) : null);
      const vw = stage.clientWidth;
      const vh = stage.clientHeight;
      track.style.setProperty('--stage-w', vw + 'px');
      track.style.setProperty('--stage-h', vh + 'px');
      if (!wideChaptersFit()) {
        refused = { w: innerWidth, h: innerHeight };
        disable();
        return false;
      }
      refused = null;
      layout = M.layoutStory(chapters.map(el => ({ width: el.offsetWidth, height: el.offsetHeight })), { width: vw, height: vh });
      root.style.height = Math.ceil(layout.total + vh) + 'px';
      storyTop = root.getBoundingClientRect().top + scrollY;
      projectStops = Array.from(track.querySelectorAll('.chapter-wide .work-panel'), panel => scrollForElement(panel)).filter(s => s != null);
      let s;
      if (options.start) s = scrollForElement(options.start.element, options.start.y);
      else s = M.restoreAnchor(layout, anchor);
      s = M.clamp(s || 0, 0, layout.total);
      lastX = NaN; lastOffsets.length = 0;
      apply(s);
      html.style.scrollBehavior = 'auto';
      window.scrollTo(0, storyTop + s);
      html.style.scrollBehavior = '';
      return true;
    }

    function scheduleRelayout() {
      if (relayoutFrame) return;
      relayoutFrame = requestAnimationFrame(() => { relayoutFrame = 0; if (shouldRun()) { if (active) relayout(); else enable(); } else disable(); });
    }

    // Story position that brings `element` into view; `localY` overrides the measured offset inside a tall chapter.
    function scrollForElement(element, localY) {
      if (!layout || !element) return null;
      const chapter = element.closest('.chapter');
      const index = chapters.indexOf(chapter);
      if (index < 0) return null;
      if (element === chapter) return M.scrollFor(layout, index, { y: localY || 0 });
      const rect = element.getBoundingClientRect();
      const box = chapter.getBoundingClientRect();
      if (chapter.classList.contains('chapter-wide')) return M.scrollFor(layout, index, { x: rect.left - box.left - EDGE });
      return M.scrollFor(layout, index, { y: localY != null ? localY : rect.top - box.top - SAFE_TOP - 8 });
    }

    function apply(s) {
      state = M.storyState(layout, s);
      const x = Math.round(state.x);
      if (x !== lastX) { track.style.transform = `translate3d(${-x}px, 0, 0)`; lastX = x; }
      state.offsets.forEach((offset, i) => {
        const y = Math.round(offset);
        if (lastOffsets[i] !== y) { chapters[i].style.transform = y ? `translate3d(0, ${y}px, 0)` : ''; lastOffsets[i] = y; }
      });
      updateBar();
      warm(state.active);
      warm(state.active + 1);
      emit();
    }

    function updateBar() {
      links.forEach((entry, i) => {
        const p = Math.round(state.progress[i] * 1000) / 1000;
        if (p !== entry.progress) { entry.fill.style.transform = `scaleX(${p})`; entry.progress = p; }
      });
      if (state.active !== shownActive) {
        shownActive = state.active;
        links.forEach((entry, i) => { if (i === shownActive) entry.link.setAttribute('aria-current', 'step'); else entry.link.removeAttribute('aria-current'); });
        counter.textContent = String(shownActive + 1).padStart(2, '0');
        prev.setAttribute('aria-label', shownActive > 0 ? `Previous chapter: ${names[shownActive - 1]}` : 'Previous chapter');
        next.setAttribute('aria-label', shownActive < chapters.length - 1 ? `Next chapter: ${names[shownActive + 1]}` : 'Next chapter');
      }
      prev.disabled = state.atStart;
      next.disabled = shownActive >= chapters.length - 1;
      if (railPrev && projectStops.length) {
        railPrev.disabled = state.s <= projectStops[0] + 2;
        railNext.disabled = state.s >= projectStops[projectStops.length - 1] - 2;
      }
    }

    // Images outside the clipped stage never meet native lazy-loading's threshold; load the next chapter early.
    function warm(index) {
      if (index < 0 || index >= chapters.length || warmed.has(index)) return;
      warmed.add(index);
      chapters[index].querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager'; });
    }

    function emit() { listeners.forEach(fn => fn(active ? state : null, active ? layout : null)); }
    function announceMode() { document.dispatchEvent(new CustomEvent('storymodechange', { detail: { horizontal: active } })); }

    function scrollToStory(s, smooth) {
      window.scrollTo({ top: storyTop + M.clamp(s, 0, layout.total), behavior: smooth && !reduceMotion.matches ? 'smooth' : 'auto' });
    }

    function focusTarget(element) {
      const target = element === chapters[0] ? chapters[0] : element;
      if (!target.matches('a[href], button, input, select, textarea, [tabindex]')) target.setAttribute('tabindex', '-1');
      programmaticFocus = target;
      target.focus({ preventScroll: true });
    }

    function goTo(target, options = {}) {
      const element = typeof target === 'number' ? chapters[target] : typeof target === 'string' ? document.getElementById(target.replace(/^#/, '')) : target;
      if (!element) return false;
      const smooth = options.smooth !== false;
      if (!active) {
        element.scrollIntoView({ behavior: smooth && !reduceMotion.matches ? 'smooth' : 'auto', block: 'start' });
        return true;
      }
      const s = scrollForElement(element);
      if (s == null) return false;
      scrollToStory(s, smooth);
      if (options.focus) focusTarget(element);
      return true;
    }

    function stepChapter(direction) {
      if (!active || !state) return;
      goTo(M.clamp(state.active + direction, 0, chapters.length - 1));
    }

    function stepProject(direction) {
      if (!active || !state || !projectStops.length) return;
      const s = state.s;
      const stop = direction > 0 ? projectStops.find(p => p > s + 2) : [...projectStops].reverse().find(p => p < s - 2);
      if (stop != null) scrollToStory(stop, true);
    }

    // Arrow keys: the next stop to the right/left (chapter starts and, inside selected work, each project).
    function stepStops(direction) {
      if (!layout || !state) return;
      const stops = [...layout.chapters.map(c => c.arrive), ...projectStops].sort((a, b) => a - b);
      const s = state.s;
      const stop = direction > 0 ? stops.find(p => p > s + 2) : [...stops].reverse().find(p => p < s - 2);
      if (stop != null) scrollToStory(stop, true);
      else scrollToStory(direction > 0 ? layout.total : 0, true);
    }

    function elementForHash(hash) {
      const id = decodeURIComponent((hash || '').replace(/^#/, ''));
      if (!id) return null;
      if (id === 'top' || id === 'main') return chapters[0];
      const element = document.getElementById(id);
      return element && track.contains(element) ? element : null;
    }

    // ---- events
    let scrollQueued = false;
    window.addEventListener('scroll', () => {
      if (!active || scrollQueued) return;
      scrollQueued = true;
      frame = requestAnimationFrame(() => { scrollQueued = false; if (active && layout) apply(scrollY - storyTop); });
    }, { passive: true });

    const resizeObserver = new ResizeObserver(() => scheduleRelayout());
    resizeObserver.observe(stage);
    chapters.forEach(chapter => resizeObserver.observe(chapter));
    window.addEventListener('resize', () => { if (!active) scheduleRelayout(); });
    onMediaChange(capable, sync);
    onMediaChange(reduceMotion, sync);
    window.addEventListener('beforeprint', () => { printing = true; disable(); });
    window.addEventListener('afterprint', () => { printing = false; sync(); });
    window.addEventListener('pagehide', () => {
      if (!active || !layout || !state) return;
      try { sessionStorage.setItem(STORE_KEY, JSON.stringify({ ...M.captureAnchor(layout, state.s), count: chapters.length })); } catch (_) {}
    });

    // In-page links (header nav, hero actions, chapter bar, "Back to top") travel along the track.
    document.addEventListener('click', event => {
      if (!active || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute('href');
      if (hash === '#main') {
        // Skip link: move focus into the chapter on screen without moving the story.
        event.preventDefault();
        focusTarget(chapters[state ? state.active : 0]);
        return;
      }
      const element = elementForHash(hash);
      if (!element) return;
      event.preventDefault();
      goTo(element);
      if (location.hash !== hash) history.pushState(null, '', hash);
      focusTarget(element);
    });

    window.addEventListener('popstate', () => {
      if (!active) return;
      const element = elementForHash(location.hash);
      if (element) goTo(element, { smooth: false }); else scrollToStory(0, false);
    });

    prev.addEventListener('click', () => stepChapter(-1));
    next.addEventListener('click', () => stepChapter(1));

    document.addEventListener('keydown', event => {
      if (!active || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      if (dialog && dialog.open) return;
      if (event.target.closest('input, textarea, select, [contenteditable="true"], [contenteditable=""]')) return;
      event.preventDefault();
      stepStops(event.key === 'ArrowRight' ? 1 : -1);
    });

    // Keyboard focus that lands off screen brings its element into view (after the browser's own focus scroll).
    track.addEventListener('focusin', event => {
      if (!active || (dialog && dialog.open)) return;
      const element = event.target;
      if (element === programmaticFocus) { programmaticFocus = null; return; }
      requestAnimationFrame(() => {
        if (!active || !layout || !element.isConnected || element.classList.contains('chapter')) return;
        const rect = element.getBoundingClientRect();
        const { width, height } = layout.viewport;
        const inView = rect.left >= 0 && rect.right <= width && rect.top >= SAFE_TOP - 24 && rect.bottom <= height - SAFE_BOTTOM;
        if (inView) return;
        const s = scrollForElement(element);
        if (s != null) scrollToStory(s, false);
      });
    });

    // The stage clips but must never scroll itself (e.g. through focus or find-in-page in older browsers).
    stage.addEventListener('scroll', () => { if (stage.scrollLeft || stage.scrollTop) { stage.scrollLeft = 0; stage.scrollTop = 0; } });

    sync();

    return {
      isActive: () => active,
      goTo,
      stepChapter,
      stepProject,
      subscribe(fn) { listeners.add(fn); fn(active ? state : null, active ? layout : null); return () => listeners.delete(fn); },
    };
  })();

  window.portfolioStory = story || {
    isActive: () => false,
    goTo(target) {
      const element = typeof target === 'string' ? document.getElementById(target.replace(/^#/, '')) : target;
      if (element) element.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
      return !!element;
    },
    stepChapter() {},
    stepProject() {},
    subscribe() { return () => {}; },
  };

  // ===================================================================== Hero exit parallax
  // The character drifts a little slower than the page as the hero leaves (vertical drop or horizontal lag).
  const character = document.querySelector('.hero-character');
  const hero = document.querySelector('.hero');
  if (character && hero) {
    let exit = -1;
    const setExit = value => {
      const next = Math.round(M.clamp(value, 0, 1) * 1000) / 1000;
      if (next !== exit) { exit = next; character.style.setProperty('--exit', String(next)); }
    };
    let queued = false;
    window.addEventListener('scroll', () => {
      if (queued || reduceMotion.matches || window.portfolioStory.isActive()) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; setExit(scrollY / Math.max(1, hero.offsetHeight)); });
    }, { passive: true });
    window.portfolioStory.subscribe((state, layout) => {
      if (reduceMotion.matches) return setExit(0);
      if (state && layout) setExit(state.x / layout.viewport.width);
      else setExit(scrollY / Math.max(1, hero.offsetHeight));
    });
  }

  // ===================================================================== Layered character
  // An enhanced layered raster, not a rigged 3D mesh: separate body and head layers of the blank-eyed render, the
  // owner's iris pixels drawn in SVG inside calibrated eyelid clips, and an upper-lid sprite pre-rendered from a
  // closed-eye render of the same portrait. Eyes move in short saccades that settle on a spring and are always clamped
  // inside their openings; the head follows more slowly and the body shifts the other way. Blinks and idle glances are
  // scheduled with timers, so no frames run while the character is still. Everything rests and stops off screen, in a
  // hidden tab, with reduced motion, or with reduced motion; Save-Data and any failed layer keep the original render.
  const data = window.avatarRigData;
  const fallback = document.getElementById('hero-avatar');
  if (!data || !character || !fallback || !('IntersectionObserver' in window)) return;
  if (navigator.connection && navigator.connection.saveData) return;

  const SVG = 'http://www.w3.org/2000/svg';
  const HEAD = { yaw: 4, pitch: 2, shiftX: 3, shiftY: 1.5 }; // restrained whole-figure turn; eyes remain attached
  const SPRING = { eye: [62, 0.78], head: [10, 0.86], body: [6.5, 1] }; // natural frequency (rad/s), damping ratio
  const SACCADE = { min: 0.9, settle: 0.25, gap: 140, dwell: 420 };   // image px, ms
  const EYE_LIMIT = 0.99;                                             // stay 1% inside the travel ellipse after rounding
  const BASES = [{ src: 'assets/avatar-eye-base-720.webp', width: 720 }, { src: 'assets/avatar-eye-base.webp', width: 1122 }];
  const lids = data.lids || null;
  const rand = M.seededRandom(window.avatarMotionSeed || Date.now());
  const zero = () => ({ x: 0, v: 0 });

  const eyes = data.eyes.map(() => ({ x: zero(), y: zero(), fix: { x: 0, y: 0 } }));
  const body = { yaw: zero(), pitch: zero(), hx: zero(), hy: zero(), px: zero(), py: zero() };
  let goal = null;
  let rigEl = null, figureEl = null, parts = [], sheens = [], lidEls = [];
  let built = false, live = false, visible = false, fallbackReady = false, lidsReady = false;
  let frame = 0, last = 0, lastSaccade = -1e9, driftSince = null;
  let pointer = null, touching = false, releaseTimer = 0, rect = null, rectDirty = true;
  let blink = null, glance = null, blinkTimer = 0, glanceTimer = 0, glanceEndTimer = 0;

  const pct = (value, total) => (value / total * 100).toFixed(4) + '%';
  const svg = (tag, attrs = {}) => {
    const el = document.createElementNS(SVG, tag);
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, String(value));
    return el;
  };

  function buildEyes() {
    const box = data.overlay;
    const root = svg('svg', { class: 'rig-eyes', viewBox: `${box.x} ${box.y} ${box.width} ${box.height}`, preserveAspectRatio: 'none', 'aria-hidden': 'true', focusable: 'false' });
    Object.assign(root.style, { left: pct(box.x, data.width), top: pct(box.y, data.height), width: pct(box.width, data.width), height: pct(box.height, data.height) });
    const defs = svg('defs');
    const glint = svg('radialGradient', { id: 'rig-glint' });
    for (const [offset, opacity] of [[0, 0.96], [0.55, 0.85], [1, 0]]) glint.append(svg('stop', { offset, 'stop-color': '#fff', 'stop-opacity': opacity }));
    const sheen = svg('linearGradient', { id: 'rig-sheen', x1: 0, y1: 0, x2: 1, y2: 1 });
    for (const [offset, opacity] of [[0, 0], [0.4, 0], [0.5, 0.11], [0.6, 0], [1, 0]]) sheen.append(svg('stop', { offset, 'stop-color': '#fff', 'stop-opacity': opacity }));
    defs.append(glint, sheen);
    root.append(defs);

    for (const eye of data.eyes) {
      const id = `rig-${eye.name}`;
      // Eyelid opening from the eye-base render: the iris is only ever visible inside it.
      const lid = svg('clipPath', { id: `${id}-lid`, clipPathUnits: 'userSpaceOnUse' });
      lid.append(svg('polygon', { points: eye.polygon.map(point => point.join(',')).join(' ') }));
      // Iris disc (moves with the iris) limits the lid shading to the iris.
      const discClip = svg('clipPath', { id: `${id}-disc`, clipPathUnits: 'userSpaceOnUse' });
      const disc = svg('circle', { cx: eye.iris.cx, cy: eye.iris.cy, r: eye.iris.r });
      discClip.append(disc);
      // Lid shading measured from the blank sclera, fixed to the lids: black overlay = multiply by (1 - alpha).
      const y0 = eye.shade[0][0], y1 = eye.shade[eye.shade.length - 1][0];
      const shade = svg('linearGradient', { id: `${id}-shade`, gradientUnits: 'userSpaceOnUse', x1: 0, y1: y0, x2: 0, y2: y1 });
      for (const [y, alpha] of eye.shade) shade.append(svg('stop', { offset: ((y - y0) / (y1 - y0)).toFixed(4), 'stop-color': '#000', 'stop-opacity': alpha }));
      defs.append(lid, discClip, shade);

      const group = svg('g', { 'clip-path': `url(#${id}-lid)` });
      const iris = svg('image', { href: eye.texture.file, x: eye.texture.x, y: eye.texture.y, width: eye.texture.size, height: eye.texture.size, preserveAspectRatio: 'none' });
      const shadeRect = svg('rect', { x: eye.iris.cx - eye.iris.r - 20, y: y0, width: (eye.iris.r + 20) * 2, height: y1 - y0, fill: `url(#${id}-shade)`, 'clip-path': `url(#${id}-disc)` });
      const catchlight = svg('circle', { cx: eye.catchlight.cx, cy: eye.catchlight.cy, r: eye.catchlight.r + 0.6, fill: 'url(#rig-glint)' });
      group.append(iris, shadeRect, catchlight);
      root.append(group);
      parts.push({ iris, disc, catchlight });
    }

    // Upper lids above the irises (below the lens glass): one nested viewport per eye shows one sprite cell.
    if (lidsReady) {
      for (const box of lids.eyes) {
        const view = svg('svg', { class: 'rig-lid', x: box.x, y: box.y, width: box.width, height: box.height, viewBox: `${box.column * lids.cell.width} 0 ${box.width} ${box.height}`, preserveAspectRatio: 'none', overflow: 'hidden', display: 'none' });
        view.append(svg('image', { href: lids.file, x: 0, y: 0, width: lids.cell.width * lids.eyes.length, height: lids.cell.height * lids.frames.length, preserveAspectRatio: 'none' }));
        root.append(view);
        lidEls.push({ view, box, shown: -1 });
      }
    }

    // Glass: a faint reflection band inside each lens, drawn over the eyes so they sit behind the glasses.
    for (const eye of data.eyes) {
      const lens = eye.lens;
      const clip = svg('clipPath', { id: `rig-${eye.name}-lens`, clipPathUnits: 'userSpaceOnUse' });
      clip.append(svg('ellipse', { cx: lens.cx, cy: lens.cy, rx: (lens.rx * 0.9).toFixed(1), ry: (lens.ry * 0.9).toFixed(1), transform: `rotate(${lens.angle} ${lens.cx} ${lens.cy})` }));
      defs.append(clip);
      const group = svg('g', { 'clip-path': `url(#rig-${eye.name}-lens)` });
      const band = svg('rect', { x: lens.cx - lens.rx - 30, y: lens.cy - lens.ry - 30, width: lens.rx * 2 + 60, height: lens.ry * 2 + 60, fill: 'url(#rig-sheen)' });
      group.append(band);
      root.append(group);
      sheens.push(band);
    }
    return root;
  }

  function build(baseSrc) {
    const layerImage = () => {
      const img = document.createElement('img');
      img.src = baseSrc; img.alt = ''; img.decoding = 'async'; img.draggable = false;
      return img;
    };
    rigEl = document.createElement('div');
    rigEl.className = 'avatar-rig';
    rigEl.setAttribute('aria-hidden', 'true');
    // One full-frame image and its eye overlay share the same transform. There is no
    // independently clipped head/body boundary to reveal a horizontal band while moving.
    figureEl = document.createElement('div');
    figureEl.className = 'rig-layer rig-figure';
    figureEl.append(layerImage(), buildEyes());
    figureEl.style.transformOrigin = '50% 68%';
    rigEl.append(figureEl);
    return rigEl;
  }

  const preload = src => new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(() => resolve(img));
    img.onerror = () => reject(new Error('failed to load ' + src));
    img.src = src;
  });
  const sameFrame = img => img && img.naturalWidth > 0 && Math.abs(img.naturalWidth / img.naturalHeight - data.width / data.height) < 0.002;

  // Base layer: the smallest WebP that covers the displayed size, then the full WebP, then the calibrated PNG.
  async function loadBase() {
    const need = Math.max(1, character.getBoundingClientRect().width || 560) * (window.devicePixelRatio || 1);
    const first = BASES.find(base => base.width >= need) || BASES[BASES.length - 1];
    for (const src of [...new Set([first.src, BASES[BASES.length - 1].src, data.base])]) {
      try { const img = await preload(src); if (sameFrame(img)) return src; } catch (_) {}
    }
    throw new Error('no usable eye-base layer');
  }

  async function start() {
    if (built || reduceMotion.matches) return;
    built = true;
    try {
      const [baseSrc] = await Promise.all([loadBase(), ...data.eyes.map(eye => preload(eye.texture.file))]);
      // The blink sprite is optional: without it the character still looks around, it just does not blink.
      if (lids) lidsReady = await preload(lids.file).then(() => true, () => false);
      const element = build(baseSrc);
      character.append(element);
      await Promise.all(Array.from(element.querySelectorAll('img'), img => (img.decode ? img.decode().catch(() => {}) : null)));
      // Two frames so the SVG irises are painted before the cross-fade from the original render.
      requestAnimationFrame(() => requestAnimationFrame(() => setLive(!reduceMotion.matches)));
    } catch (error) {
      // Keep the original neutral render; never show the blank-eyed base on its own.
      if (rigEl) rigEl.remove();
      rigEl = null;
      character.classList.remove('rig-live');
    }
  }

  function restNow() {
    pointer = null; glance = null; blink = null;
    eyes.forEach(e => { e.x = zero(); e.y = zero(); e.fix = { x: 0, y: 0 }; });
    Object.keys(body).forEach(key => { body[key] = zero(); });
    render();
  }

  function setLive(on) {
    live = !!on && !!rigEl;
    character.classList.toggle('rig-live', live);
    if (!live) { clearTimers(); cancel(); restNow(); }
    else { schedule(); wake(); }
  }

  function cancel() { if (frame) cancelAnimationFrame(frame); frame = 0; last = 0; }
  function wake() { if (live && visible && !document.hidden && !frame) frame = requestAnimationFrame(tick); }
  const active = () => live && visible && !document.hidden;

  // ---- timers: blinks and idle glances (cleared whenever the character cannot be seen )
  function clearTimers() {
    clearTimeout(blinkTimer); clearTimeout(glanceTimer); clearTimeout(glanceEndTimer);
    blinkTimer = glanceTimer = glanceEndTimer = 0;
  }
  function schedule() {
    clearTimers();
    if (!active()) return;
    if (lidsReady) scheduleBlink();
    scheduleGlance();
  }
  function scheduleBlink() {
    const next = M.nextBlink(rand);
    blinkTimer = setTimeout(() => { blinkTimer = 0; startBlink(next.double); }, next.delay);
  }
  function startBlink(double) {
    if (!active() || !lidsReady) return;
    blink = { start: null, double };
    wake();
  }
  function scheduleGlance() {
    const plan = M.idleGlance(rand, data.travel);
    glanceTimer = setTimeout(() => {
      glanceTimer = 0;
      if (!active()) return;
      if (pointer) { scheduleGlance(); return; }
      glance = plan.offset;
      wake();
      glanceEndTimer = setTimeout(() => { glanceEndTimer = 0; glance = null; wake(); if (active()) scheduleGlance(); }, plan.hold);
    }, plan.wait);
  }

  // ---- goal pose: pointer (or touch glance), idle glance, or rest
  function computeGoal() {
    const rest = { eyes: data.eyes.map(() => ({ x: 0, y: 0 })), yaw: 0, pitch: 0, hx: 0, hy: 0, px: 0, py: 0 };
    if (!visible) return rest;
    if (!pointer) {
      if (!glance) return rest;
      // idle glance: eyes look, the head follows a little
      const nx = glance.x / (glance.x < 0 ? data.travel.left : data.travel.right) * 0.25;
      const ny = glance.y / (glance.y < 0 ? data.travel.up : data.travel.down) * 0.25;
      const head = M.headPose(nx, ny, HEAD);
      return { eyes: data.eyes.map(() => ({ ...glance })), yaw: head.yaw, pitch: head.pitch, hx: head.x, hy: head.y, px: nx * 0.5, py: ny * 0.5 };
    }
    if (rectDirty || !rect) { rect = rigEl.getBoundingClientRect(); rectDirty = false; }
    if (!rect.width) return rest;
    const scale = rect.width / data.width;
    const reach = Math.max(220, rect.width * 0.55);
    const eyeGoals = data.eyes.map(eye => M.gazeOffset(pointer, { x: rect.left + eye.iris.cx * scale, y: rect.top + eye.iris.cy * scale }, reach, data.travel));
    const nx = (pointer.x - (rect.left + rect.width / 2)) / Math.max(1, innerWidth / 2);
    const ny = (pointer.y - (rect.top + rect.height * 0.32)) / Math.max(1, innerHeight / 2);
    const head = M.headPose(nx, ny, HEAD);
    return { eyes: eyeGoals, yaw: head.yaw, pitch: head.pitch, hx: head.x, hy: head.y, px: M.clamp(nx, -1, 1) * 0.5, py: M.clamp(ny, -1, 1) * 0.5 };
  }

  function renderLids(closure) {
    const index = lidsReady ? M.lidFrame(closure, lids.frames) : -1;
    for (const lid of lidEls) {
      if (lid.shown === index) continue;
      lid.shown = index;
      if (index < 0) { lid.view.setAttribute('display', 'none'); continue; }
      lid.view.setAttribute('viewBox', `${lid.box.column * lids.cell.width} ${index * lids.cell.height} ${lid.box.width} ${lid.box.height}`);
      lid.view.setAttribute('display', 'inline');
    }
  }

  function render(closure = 0) {
    if (!rigEl) return;
    const follow = data.travel.catchlightFollow;
    parts.forEach((part, i) => {
      const x = eyes[i].x.x, y = eyes[i].y.x;
      const move = `translate(${x.toFixed(2)} ${y.toFixed(2)})`;
      part.iris.setAttribute('transform', move);
      part.disc.setAttribute('transform', move);
      part.catchlight.setAttribute('transform', `translate(${(x * follow).toFixed(2)} ${(y * follow).toFixed(2)})`);
    });
    const glare = `translate(${(-body.yaw.x * 2.4).toFixed(2)} ${(body.pitch.x * 1.6).toFixed(2)})`;
    sheens.forEach(band => band.setAttribute('transform', glare));
    figureEl.style.transform = `perspective(1600px) translate3d(${body.hx.x.toFixed(2)}px, ${body.hy.x.toFixed(2)}px, 0) rotateY(${body.yaw.x.toFixed(3)}deg) rotateX(${body.pitch.x.toFixed(3)}deg)`;
    character.style.setProperty('--px', body.px.x.toFixed(3));
    character.style.setProperty('--py', body.py.x.toFixed(3));
    renderLids(closure);
  }

  // one spring channel; returns true while it is still moving
  function step(channel, target, dt, [omega, zeta]) {
    const next = M.springStep(channel, target, dt, omega, zeta);
    if (Math.abs(next.x - target) < 0.005 && Math.abs(next.v) < 0.02) { channel.x = target; channel.v = 0; return false; }
    channel.x = next.x; channel.v = next.v;
    return true;
  }

  function tick(now) {
    frame = 0;
    try {
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      goal = computeGoal();
      let moving = false;

      // Saccades: the fixation point jumps when the target has moved far enough (or after a short dwell for a small
      // correction); the iris then springs to it with a slight, quickly settling overshoot.
      const far = Math.max(...goal.eyes.map((g, i) => Math.hypot(g.x - eyes[i].fix.x, g.y - eyes[i].fix.y)));
      // small offsets (pointer jitter) are only corrected once they have persisted for the dwell time
      if (far > 0 && driftSince === null) driftSince = now;
      if (far === 0) driftSince = null;
      const big = far > SACCADE.min && now - lastSaccade > SACCADE.gap;
      const held = far > 0 && now - driftSince > SACCADE.dwell;
      if (big || held || (far > SACCADE.settle && !pointer)) {
        eyes.forEach((e, i) => { e.fix = { ...goal.eyes[i] }; });
        lastSaccade = now; driftSince = null;
        // large gaze shifts are often accompanied by a blink
        if (!blink && lidsReady && far > data.travel.right * 0.9 && rand() < 0.2) blink = { start: null, double: false };
      }
      eyes.forEach(e => {
        if (step(e.x, e.fix.x, dt, SPRING.eye)) moving = true;
        if (step(e.y, e.fix.y, dt, SPRING.eye)) moving = true;
        const inside = M.clampToTravel({ x: e.x.x, y: e.y.x }, { left: data.travel.left * EYE_LIMIT, right: data.travel.right * EYE_LIMIT, up: data.travel.up * EYE_LIMIT, down: data.travel.down * EYE_LIMIT });
        if (inside.x !== e.x.x) { e.x.x = inside.x; e.x.v = 0; }
        if (inside.y !== e.y.x) { e.y.x = inside.y; e.y.v = 0; }
      });
      if (eyes.some((e, i) => e.fix.x !== goal.eyes[i].x || e.fix.y !== goal.eyes[i].y)) moving = true;
      for (const key of ['yaw', 'pitch', 'hx', 'hy']) if (step(body[key], goal[key], dt, SPRING.head)) moving = true;
      for (const key of ['px', 'py']) if (step(body[key], goal[key], dt, SPRING.body)) moving = true;

      let closure = 0;
      if (blink) {
        if (blink.start === null) blink.start = now;
        const value = M.blinkClosure(now - blink.start);
        if (value === null) {
          if (blink.double) blink = { start: now + 70, double: false };
          else { blink = null; if (active() && !blinkTimer) scheduleBlink(); }
        } else closure = value;
        if (blink) moving = true;
      }
      render(closure);
      if (moving) frame = requestAnimationFrame(tick); else last = 0;
    } catch (error) {
      // Any runtime failure returns to the original static render rather than leaving a broken face.
      if (rigEl) rigEl.remove();
      rigEl = null; built = true;
      setLive(false);
    }
  }

  // ---- input: pointer (mouse/pen hover), touch fallback (glance at the touch, then return), leave/blur reset
  window.addEventListener('pointermove', event => {
    if (!live || !visible) return;
    if (event.pointerType !== 'mouse' && !touching) return;
    pointer = { x: event.clientX, y: event.clientY };
    rectDirty = true;
    wake();
  }, { passive: true });
  window.addEventListener('pointerdown', event => {
    if (!live || !visible || event.pointerType === 'mouse') return;
    touching = true;
    clearTimeout(releaseTimer);
    pointer = { x: event.clientX, y: event.clientY };
    rectDirty = true;
    wake();
  }, { passive: true });
  const release = event => {
    if (event.pointerType === 'mouse') return;
    touching = false;
    clearTimeout(releaseTimer);
    releaseTimer = setTimeout(() => { pointer = null; wake(); }, 900);
  };
  window.addEventListener('pointerup', release, { passive: true });
  window.addEventListener('pointercancel', release, { passive: true });
  const leave = () => { pointer = null; wake(); };
  document.addEventListener('pointerout', event => { if (!event.relatedTarget && event.pointerType === 'mouse') leave(); });
  html.addEventListener('pointerleave', event => { if (event.pointerType === 'mouse') leave(); });
  window.addEventListener('blur', leave);
  window.addEventListener('scroll', () => { rectDirty = true; if (pointer) wake(); }, { passive: true });
  window.addEventListener('resize', () => { rectDirty = true; });
  window.portfolioStory.subscribe(() => { rectDirty = true; });

  // ---- in view: load optional layers only when the character enters the actual viewport; rest and stop
  // (no frames, no timers) while it is off screen or the tab is hidden
  const maybeStart = () => {
    if (built || !visible || !fallbackReady || reduceMotion.matches) return;
    const idle = window.requestIdleCallback || (fn => setTimeout(fn, 200));
    idle(() => start(), { timeout: 1500 });
  };
  new IntersectionObserver(entries => {
    visible = entries[entries.length - 1].isIntersecting;
    if (!visible) { clearTimers(); cancel(); restNow(); }
    else { rectDirty = true; maybeStart(); schedule(); wake(); }
  }, { rootMargin: '0px' }).observe(character);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { clearTimers(); cancel(); restNow(); }
    else { schedule(); wake(); }
  });
  onMediaChange(reduceMotion, () => {
    if (reduceMotion.matches) setLive(false);
    else if (rigEl) setLive(true);
    else maybeStart();
  });

  // The original render stays underneath as the fallback; build only on top of a successfully loaded original.
  const begin = () => { if (!fallback.naturalWidth) return; fallbackReady = true; maybeStart(); };
  if (fallback.complete) begin(); else fallback.addEventListener('load', begin, { once: true });

})();
