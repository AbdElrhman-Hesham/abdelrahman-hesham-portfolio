// Pure interaction math shared by the page (window.InteractionMath) and the Node tests (require).
// No DOM access here: the story mapping and the gaze model are plain functions of numbers.
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.InteractionMath = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  // ---------- Horizontal story ----------
  // Chapters sit side by side on one track. Native vertical scroll distance `s` drives the story:
  //   * a horizontal run slides the track until the chapter's right edge meets the viewport's right edge
  //     (for a chapter wider than the viewport, that run also travels through it);
  //   * then a vertical run scrolls that chapter's own content up if it is taller than the viewport,
  //     so long chapters are read top to bottom instead of being cut or trapped in a nested scroller.
  // One pixel of scroll is one pixel of movement in every run.
  function layoutStory(sizes, viewport) {
    const vw = Math.max(1, viewport.width);
    const vh = Math.max(1, viewport.height);
    let left = 0;
    let s = 0;
    let previousEnd = 0;
    const chapters = sizes.map((size, index) => {
      const width = Math.max(vw, Math.round(size.width));
      const height = Math.max(vh, Math.round(size.height));
      const endView = left + width - vw;
      const from = index === 0 ? 0 : previousEnd;
      const hStart = s;
      const hLength = endView - from;
      s += hLength;
      const vStart = s;
      const vLength = height - vh;
      s += vLength;
      const chapter = { index, left, width, height, from, endView, hStart, hLength, vStart, vLength, arrive: hStart + (left - from) };
      previousEnd = endView;
      left += width;
      return chapter;
    });
    return { viewport: { width: vw, height: vh }, chapters, total: s, trackWidth: left };
  }

  function chapterAt(layout, s) {
    const list = layout.chapters;
    let found = list[0];
    for (const chapter of list) if (chapter.hStart <= s) found = chapter; else break;
    return found;
  }

  // Track offset x, each chapter's vertical offset, the active chapter and per-chapter progress for position s.
  function storyState(layout, rawS) {
    const s = clamp(rawS, 0, layout.total);
    const current = chapterAt(layout, s);
    const inVertical = s >= current.vStart && current.vLength > 0;
    const x = inVertical ? current.endView : current.from + (s - current.hStart);
    const offsets = layout.chapters.map(chapter => {
      if (chapter.index < current.index) return -chapter.vLength;
      if (chapter.index > current.index) return 0;
      return inVertical ? -(s - chapter.vStart) : 0;
    });
    const centre = x + layout.viewport.width / 2;
    let active = 0;
    for (const chapter of layout.chapters) if (chapter.left <= centre) active = chapter.index;
    const progress = layout.chapters.map((chapter, i) => {
      const next = layout.chapters[i + 1];
      const end = next ? next.arrive : layout.total;
      if (end <= chapter.arrive) return s >= chapter.arrive ? 1 : 0;
      return clamp((s - chapter.arrive) / (end - chapter.arrive), 0, 1);
    });
    return { s, x, offsets, active, progress, current: current.index, phase: inVertical ? 'v' : 'h', atStart: s <= 0, atEnd: s >= layout.total };
  }

  // Scroll position that shows chapter `index` with a local offset: x inside a wide chapter, y inside a tall one.
  function scrollFor(layout, index, local) {
    const chapter = layout.chapters[clamp(index, 0, layout.chapters.length - 1)];
    const lx = clamp((local && local.x) || 0, 0, chapter.endView - chapter.left);
    const ly = clamp((local && local.y) || 0, 0, chapter.vLength);
    if (ly > 0) return chapter.vStart + ly;
    return chapter.arrive + lx;
  }

  // Logical position that survives a relayout (resize, fonts, an expanded archive): vertical runs keep their
  // absolute pixel offset (the reader stays on the same line), horizontal runs keep their fraction.
  function captureAnchor(layout, rawS) {
    const s = clamp(rawS, 0, layout.total);
    const chapter = chapterAt(layout, s);
    if (s >= chapter.vStart && chapter.vLength > 0) return { index: chapter.index, phase: 'v', offset: s - chapter.vStart };
    return { index: chapter.index, phase: 'h', fraction: chapter.hLength > 0 ? (s - chapter.hStart) / chapter.hLength : 1 };
  }

  function restoreAnchor(layout, anchor) {
    if (!anchor) return 0;
    const chapter = layout.chapters[clamp(anchor.index, 0, layout.chapters.length - 1)];
    if (anchor.phase === 'v') return chapter.vStart + clamp(anchor.offset, 0, chapter.vLength);
    return chapter.hStart + clamp(anchor.fraction, 0, 1) * chapter.hLength;
  }

  // ---------- Eye rig ----------
  // Offset of the iris (image pixels) when looking from the eye centre towards a pointer (screen pixels).
  // Direction follows the pointer; the magnitude saturates smoothly with distance (tanh), and each half-axis has its
  // own calibrated limit, so the result always lies inside the travel ellipse.
  function gazeOffset(pointer, eye, reach, travel) {
    const dx = pointer.x - eye.x;
    const dy = pointer.y - eye.y;
    const distance = Math.hypot(dx, dy);
    if (!(distance > 1e-6) || !(reach > 0)) return { x: 0, y: 0 };
    const amount = Math.tanh(distance / reach);
    const ux = dx / distance;
    const uy = dy / distance;
    return {
      x: ux * amount * (ux < 0 ? travel.left : travel.right),
      y: uy * amount * (uy < 0 ? travel.up : travel.down),
    };
  }

  // Head pose from the pointer position relative to the face, both normalised to [-1, 1].
  function headPose(nx, ny, limits) {
    const x = clamp(nx, -1, 1);
    const y = clamp(ny, -1, 1);
    return { yaw: x * limits.yaw, pitch: -y * limits.pitch, x: x * limits.shiftX, y: y * limits.shiftY };
  }

  // Frame-rate independent exponential approach (time constant tau, ms).
  function approach(current, target, dt, tau) {
    if (!(tau > 0)) return target;
    return target + (current - target) * Math.exp(-Math.max(0, dt) / tau);
  }

  // ---------- Character motion ----------
  // Damped spring (semi-implicit Euler, fixed 1/240 s sub-steps). `omega` is the natural frequency (rad/s), `zeta` the
  // damping ratio (<1 allows a small, quickly settling overshoot). Long frames are capped, so a tab that wakes up after
  // seconds never produces an explosive or non-finite pose.
  function springStep(state, target, dt, omega, zeta) {
    let x = Number.isFinite(state.x) ? state.x : target;
    let v = Number.isFinite(state.v) ? state.v : 0;
    let remaining = clamp(Number.isFinite(dt) ? dt : 0, 0, 64) / 1000;
    const h = 1 / 240;
    while (remaining > 1e-9) {
      const step = Math.min(h, remaining);
      v += (omega * omega * (target - x) - 2 * zeta * omega * v) * step;
      x += v * step;
      remaining -= step;
    }
    return { x, v };
  }

  // Keeps an iris offset inside its asymmetric travel ellipse (left/right/up/down half-axes, image pixels).
  // Applied after every spring step, so overshoot can never push the iris or pupil out of the eyelid opening.
  function clampToTravel(offset, travel) {
    const ax = offset.x < 0 ? travel.left : travel.right;
    const ay = offset.y < 0 ? travel.up : travel.down;
    const r = Math.hypot(offset.x / ax, offset.y / ay);
    return r > 1 ? { x: offset.x / r, y: offset.y / r } : { x: offset.x, y: offset.y };
  }

  // Eyelid closure 0 (open) … 1 (closed) at `elapsed` ms into a blink: a quick smooth close, a short hold, then a
  // slower opening that decelerates. Returns null once the blink is over.
  const BLINK = { close: 80, hold: 45, open: 150 };
  function blinkClosure(elapsed, timing = BLINK) {
    if (!(elapsed >= 0)) return 0;
    const { close, hold, open } = timing;
    if (elapsed < close) { const p = elapsed / close; return p * p * (3 - 2 * p); }
    if (elapsed < close + hold) return 1;
    if (elapsed < close + hold + open) { const p = (elapsed - close - hold) / open; return (1 - p) * (1 - p); }
    return null;
  }
  const blinkDuration = (timing = BLINK) => timing.close + timing.hold + timing.open;

  // Next blink: every 2.2–6.5 s (about 9–27 a minute, mean ≈ 14), sometimes a quick double blink.
  function nextBlink(rand) {
    return { delay: 2200 + rand() * 4300, double: rand() < 0.12 };
  }

  // Which pre-rendered lid frame to show for a closure value (frames = ascending closures); -1 = eyes fully open.
  function lidFrame(closure, frames) {
    if (!(closure >= frames[0] * 0.5)) return -1;
    let best = 0;
    for (let i = 1; i < frames.length; i++) if (Math.abs(frames[i] - closure) < Math.abs(frames[best] - closure)) best = i;
    return best;
  }

  // Idle glance while nobody points at the character: a small look somewhere inside 45% of the travel, held briefly.
  function idleGlance(rand, travel) {
    const angle = rand() * Math.PI * 2;
    const amount = 0.2 + rand() * 0.25;
    const ux = Math.cos(angle), uy = Math.sin(angle);
    return {
      offset: { x: ux * amount * (ux < 0 ? travel.left : travel.right), y: uy * amount * (uy < 0 ? travel.up : travel.down) },
      hold: 700 + rand() * 900,
      wait: 3500 + rand() * 4500,
    };
  }

  // Small deterministic PRNG for scheduling (tests pass a fixed seed; the page seeds from the clock).
  function seededRandom(seed) {
    let s = (Math.floor(Math.abs(seed)) % 2147483646) + 1;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
  }

  return { clamp, layoutStory, storyState, scrollFor, captureAnchor, restoreAnchor, gazeOffset, headPose, approach,
    springStep, clampToTravel, blinkClosure, blinkDuration, BLINK, nextBlink, lidFrame, idleGlance, seededRandom };
});
