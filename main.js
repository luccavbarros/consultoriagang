/* GANG — Landing page interactions */
(() => {
  'use strict';

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xdeeeolk';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gsap.registerPlugin(ScrollTrigger);
  // phones show and hide the address bar while scrolling, which resizes the window: if every one of those resizes re-measured
  // the page, the pinned and sticky sections would jump (scrolling back up from the end of the page threw it to the bottom).
  // So on touch screens the page is only re-measured when the width changes (rotation); elsewhere on any resize
  ScrollTrigger.config({ autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load' });
  const touchScreen = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  let refreshW = window.innerWidth;
  window.addEventListener('resize', () => {
    if (touchScreen && window.innerWidth === refreshW) return;
    refreshW = window.innerWidth;
    ScrollTrigger.refresh();
  });

  /* ---------- Typography: no orphan words on any screen ---------- */
  // 1) connecting words ("o", "e", "de", "que", "sem", "para"...) never end a line: they stick to the next word
  // 2) the last word of every text block never sits alone on its line: it sticks to the word before it,
  //    as long as that pair is narrow enough for the block (measured, re-run when the width changes)
  (() => {
    const NBSP = '\u00a0';
    const WORDS = 'a|o|e|é|à|as|os|ao|aos|de|do|da|dos|das|em|no|na|nos|nas|um|uma|por|com|sem|que|se|ou|mas|nem|para|pela|pelo|como|entre|sobre';
    const WORDS_EN = 'a|an|the|and|or|but|of|to|in|on|at|by|for|with|as|is|it|we|you|your|its|our|no|not|than|that|what|who'; // English version (i18n.js)
    const shortWords = () => new RegExp(`(^|[\\s\\u00a0(])(${document.documentElement.lang === 'en-US' ? WORDS_EN : WORDS}) (?=\\S)`, 'gi');
    const blocks = [...document.querySelectorAll('.hero__title .line, h2, h3, p, li, label')];
    const ctx = document.createElement('canvas').getContext('2d');
    const original = new Map();
    const textNodes = (el) => {
      const out = [];
      const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      while (walk.nextNode()) out.push(walk.currentNode);
      return out;
    };
    // three passes (write text → read sizes → write text) so the browser lays the page out once, not once per block
    const fix = () => {
      const SHORT = shortWords();
      const all = blocks.map((el) => {
        const nodes = textNodes(el);
        nodes.forEach((n) => {
          if (!original.has(n)) original.set(n, n.data);
          let t = original.get(n), prev;
          do { prev = t; t = t.replace(SHORT, `$1$2${NBSP}`); } while (t !== prev);
          n.data = t;
        });
        return { el, nodes };
      });
      all.forEach((b) => {
        // hidden form steps report 0: use the nearest ancestor that has a width
        let box = b.el;
        while (box && !box.clientWidth) box = box.parentElement;
        b.width = box ? box.clientWidth : 0;
        if (b.width) {
          const cs = getComputedStyle(b.el);
          b.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        }
      });
      all.forEach(({ el, nodes, width, font }) => {
        // the form's intro reads better flowing freely: gluing its last words made a ragged break on phones
        if (!width || el.closest('.step__desc')) return;
        // words are split on plain spaces only; ones already joined by NBSP count as one chunk
        const last = nodes.reverse().find((n) => /[^ \n] +[^ \n]/.test(n.data.trimEnd()));
        if (!last) return;
        const m = last.data.trimEnd().match(/([^ \n]+) +([^ \n]+)$/);
        if (!m) return;
        ctx.font = font;
        if (ctx.measureText(m[1] + ' ' + m[2]).width <= width * 0.85) {
          last.data = last.data.replace(/ +([^ \n]+\s*)$/, NBSP + '$1');
        }
      });
    };
    fix();
    if (document.fonts) document.fonts.ready.then(fix);
    // the language changed (i18n.js): the texts are new, so start again from them
    document.addEventListener('gang:lang', () => { original.clear(); fix(); });
    let lastW = window.innerWidth;
    window.addEventListener('resize', () => {
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      fix();
    });
  })();

  /* ---------- Top blur: off while a section is pinned, so the pinned titles stay sharp ---------- */
  const topBlur = document.querySelector('.top-blur');
  const pinned = new Set();
  const setPinned = (key, on) => {
    if (on) pinned.add(key); else pinned.delete(key);
    if (topBlur) topBlur.classList.toggle('is-off', pinned.size > 0);
  };
  ScrollTrigger.create({
    trigger: '.work', start: 'bottom bottom', end: 'bottom top',
    onToggle: (self) => setPinned('work-out', self.isActive),
  });
  document.querySelectorAll('.s1, .s2, .s3').forEach((sec) => ScrollTrigger.create({
    trigger: sec, start: 'top top', end: 'bottom bottom',
    onToggle: (self) => setPinned(sec, self.isActive),
  }));

  /* ---------- Smooth scroll (Lenis), mouse and trackpad only ---------- */
  // touch screens keep the phone's own scrolling: Lenis doesn't smooth touch anyway, and its touch listeners
  // fought Safari at the end of the page (going back up from the footer gave a quick jump on iPhone)
  const lenis = touchScreen ? null : new Lenis({ lerp: reduceMotion ? 1 : 0.08, smoothWheel: true, wheelMultiplier: 1 });
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    window.lenis = lenis;
    gsap.ticker.add((time) => lenis.raf(time * 1000));
  }
  gsap.ticker.lagSmoothing(0);
  const scrollToY = (y, duration) => {
    if (lenis) lenis.scrollTo(y, { duration });
    else window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  document.querySelectorAll('a[href="#top"]').forEach((a) =>
    a.addEventListener('click', (e) => { e.preventDefault(); scrollToY(0, 1.6); })
  );

  // Shared blur-in / blur-out states
  const HIDDEN = { autoAlpha: 0, filter: 'blur(8px)', y: 24 };
  const SHOWN = { autoAlpha: 1, filter: 'blur(0px)', y: 0 };
  const GONE = { autoAlpha: 0, filter: 'blur(8px)', y: -24 };

  // Section titles rise line by line from behind their own edge (one way in for every big title, as in section 03):
  // their lines are wrapped here, before the sections set up their entrances, and they leave the generic fade
  const rise = (el, trigger, start) => {
    const lines = [[]];
    [...el.childNodes].forEach((n) => (n.nodeName === 'BR' ? lines.push([]) : lines[lines.length - 1].push(n)));
    el.textContent = '';
    el.classList.remove('reveal');
    el.classList.add('rise');
    const inner = lines.map((nodes) => {
      const line = document.createElement('span');
      const span = document.createElement('span');
      line.className = 'line';
      nodes.forEach((n) => span.append(n));
      line.append(span);
      el.append(line);
      return span;
    });
    if (reduceMotion) return;
    gsap.fromTo(inner, { yPercent: 110 }, {
      yPercent: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger, start, toggleActions: 'play none none reverse' },
    });
  };
  rise(document.querySelector('.s4 .title-xl'), '.s4', 'top 70%');
  rise(document.querySelector('.s5 .title-xl'), '.s5 .title-xl', 'top 88%');

  // where an element's centre sits inside a pinned (sticky) box: while the box is pinned at the top, these are screen coordinates
  const centerIn = (el, box) => {
    const r = el.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    return { x: r.left + r.width / 2 - b.left, y: r.top + r.height / 2 - b.top };
  };
  // the same from layout offsets, for elements whose animation moves them (their resting place, not where they are now)
  const offsetIn = (el, box) => {
    let x = 0;
    let y = 0;
    for (let n = el; n && n !== box; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
    return { x, y };
  };

  /* ---------- Cursor: a dot that follows the mouse with a slight lag (mouse and trackpad only) ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const dot = document.querySelector('.cursor');
    const lag = reduceMotion ? 0.01 : 0.35;
    gsap.set(dot, { xPercent: -50, yPercent: -50 });
    const toX = gsap.quickTo(dot, 'x', { duration: lag, ease: 'power3.out' });
    const toY = gsap.quickTo(dot, 'y', { duration: lag, ease: 'power3.out' });
    let shown = false;
    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      // first move after arriving (or coming back to the window): it appears right under the pointer, not sliding in from a corner
      if (!shown) { shown = true; gsap.set(dot, { x: e.clientX, y: e.clientY }); gsap.to(dot, { autoAlpha: 1, duration: 0.3 }); }
      toX(e.clientX);
      toY(e.clientY);
    });
    document.documentElement.addEventListener('pointerleave', () => { shown = false; gsap.to(dot, { autoAlpha: 0, duration: 0.3 }); });
    // over anything that can be clicked it grows, inverting what is under it
    const HOT = 'a, button, label, input, textarea, select';
    const grow = (on) => gsap.to(dot, { scale: on ? 2.4 : 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
    document.addEventListener('pointerover', (e) => { if (e.target.closest(HOT)) grow(true); });
    document.addEventListener('pointerout', (e) => {
      const to = e.relatedTarget;
      if (e.target.closest(HOT) && !(to && to.closest && to.closest(HOT))) grow(false);
    });
  }

  /* ---------- Progress line along the top ---------- */
  const progress = document.querySelector('.progress');
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (self) => gsap.set(progress, { scaleX: self.progress }) });

  /* ---------- Header: opens sideways from the logo on arrival ---------- */
  // the page starts with the "intro" class (set in <head>): a black bar just wide enough for the logo
  if (document.documentElement.classList.contains('intro')) {
    const bar = document.querySelector('.site-header__bar');
    const rest = bar.querySelectorAll('.site-header__tag, .site-header__actions');
    const done = () => { document.documentElement.classList.remove('intro'); gsap.set([bar, logo, ...rest], { clearProps: 'all' }); };
    const logo = bar.querySelector('.site-header__logo');
    const tl = gsap.timeline({ delay: 1.3, onComplete: done }); // the logo alone holds for a moment first
    if (window.matchMedia('(min-width: 861px)').matches) {
      // desktop: no bar to open, the header is already full width; the logo glides from the middle to its place
      // (moved, not resized, so it runs smoothly even while the page is still busy loading; the start is set in the CSS)
      // measured from its resting place, so it always starts exactly in the middle and only ever moves left
      gsap.set(logo, { x: 0 });
      const l = logo.getBoundingClientRect();
      const fromX = Math.max(0, window.innerWidth / 2 - (l.left + l.width / 2));
      tl.fromTo(logo, { x: fromX }, { x: 0, duration: 1.5, ease: 'power3.inOut', immediateRender: true }, 0)
        .fromTo(rest, { opacity: 0, filter: 'blur(8px)' }, { opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out', stagger: 0.08 }, 1.0);
    } else {
      const start = bar.offsetWidth;
      bar.style.width = 'min(846px, 100%)';
      const full = bar.offsetWidth;
      tl.fromTo(bar, { width: start }, { width: full, duration: 1.1, ease: 'power3.inOut' }, 0)
        .fromTo(rest, { opacity: 0, filter: 'blur(8px)' }, { opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out', stagger: 0.08 }, 0.75);
    }
  }

  /* ---------- Hero ---------- */
  const hero = document.querySelector('.hero');
  gsap.from('.hero__title .line, .hero__sub, .hero__cta, .hero__note', {
    ...HIDDEN, duration: 1.1, ease: 'power3.out', stagger: 0.12, delay: 0.15,
  });
  // the pictures arrive turning on a large ring around the title, like a wheel, each tilted with the turn; the ring closes in
  // as it turns (a spiral), so every picture keeps moving until it lands exactly on its place — no stop far away, then a jump.
  // The tilt only ever shrinks towards upright, so no picture flips over on the way
  const heroImgs = gsap.utils.toArray('.hero__img');
  if (reduceMotion) gsap.from(heroImgs, { autoAlpha: 0, duration: 0.6 });
  else {
    const hb = hero.getBoundingClientRect();
    const screenH = Math.min(hb.height, window.innerHeight);
    const cx = hb.width / 2;
    const cy = screenH / 2;
    // close enough to the middle that the pictures are seen going round the text (on phones, around the narrow screen's width)
    const R = hb.width < 861 ? hb.width * 0.62 : Math.hypot(hb.width, screenH) * 0.34;
    const SPIN = 2.4; // how far round each one travels, in radians
    const TILT = 0.4; // how much of the turn shows as tilt
    const orbits = heroImgs.map((el) => el.querySelector('.hero__orbit'));
    const parts = heroImgs.map((el, i) => {
      const r = el.getBoundingClientRect();
      const dx = r.left - hb.left + r.width / 2 - cx;
      const dy = r.top - hb.top + r.height / 2 - cy;
      return { el: orbits[i], a: Math.atan2(dy, dx), r: Math.hypot(dx, dy), t: 0 };
    });
    const draw = (p) => {
      const left = 1 - p.t;
      const a = p.a - SPIN * left;
      const r = p.r + (R - p.r) * left;
      gsap.set(p.el, {
        x: r * Math.cos(a) - p.r * Math.cos(p.a),
        y: r * Math.sin(a) - p.r * Math.sin(p.a),
        rotation: (-SPIN * left * 180 / Math.PI) * TILT,
      });
    };
    parts.forEach(draw);
    const intro = gsap.timeline({ delay: 0.2, onComplete: () => gsap.set(orbits, { clearProps: 'transform' }) })
      .fromTo(heroImgs, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, stagger: 0.06 }, 0);
    parts.forEach((p, i) => intro.to(p, { t: 1, duration: 2.8, ease: 'power3.out', onUpdate: () => draw(p) }, i * 0.06));
    // it plays in front of the visitor: on arrival, and again each time they come back up to the hero (once it is
    // well on screen). Leaving before it ends finishes it at once; a page opened further down starts with it done
    // when the hero is out of sight the pictures go back to the start of the ring, hidden, so on the way back up nothing
    // shows until the arrival plays
    if (window.scrollY > hb.height * 0.5) intro.pause(0);
    // replays only once the hero is almost whole again: earlier, the pictures turning low on the ring would pass behind
    // the next section and show cut off at its edge
    ScrollTrigger.create({ trigger: hero, start: 'top top', end: 'bottom 92%', onEnterBack: () => intro.restart() });
    ScrollTrigger.create({ trigger: hero, start: 'top top', end: 'bottom top', onLeave: () => intro.pause(0) });
  }

  // Idle floating, always on
  document.querySelectorAll('.hero__float').forEach((el, i) => {
    gsap.to(el, {
      x: gsap.utils.random(-10, 10), y: gsap.utils.random(-16, 16), rotation: gsap.utils.random(-3, 3),
      duration: gsap.utils.random(3.2, 5), ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.25,
    });
  });
  // Mouse parallax: images drift slightly away from the cursor, deeper ones a bit more
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const movers = [...document.querySelectorAll('.hero__img')].map((el) => {
      const img = el.querySelector('img');
      const depth = Math.abs(parseFloat(el.dataset.speed || '-0.3')) * 60;
      return {
        depth,
        x: gsap.quickTo(img, 'x', { duration: 1.2, ease: 'power3.out' }),
        y: gsap.quickTo(img, 'y', { duration: 1.2, ease: 'power3.out' }),
      };
    });
    hero.addEventListener('mousemove', (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      movers.forEach((m) => { m.x(-nx * m.depth); m.y(-ny * m.depth); });
    });
    hero.addEventListener('mouseleave', () => movers.forEach((m) => { m.x(0); m.y(0); }));
  }

  // Scroll parallax, different speed per image
  document.querySelectorAll('.hero__img').forEach((el) => {
    const speed = parseFloat(el.dataset.speed || '-0.3');
    gsap.to(el, {
      y: () => speed * window.innerHeight, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    });
  });
  gsap.to('.hero__content', {
    y: () => window.innerHeight * 0.12, autoAlpha: 0.2, ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
  });

  /* ---------- Section 01: one message at a time ---------- */
  (() => {
    const section = document.querySelector('.s1');
    const panels = gsap.utils.toArray('.s1__panel');
    const dots = gsap.utils.toArray('.s1__dot');
    const fill = document.querySelector('.s1__fill');
    // the texts of each message; the drawing is shared by all three (below), so it never leaves with them
    const parts = (p) => [p.querySelector('.title-xl'), ...p.querySelectorAll('li')];
    const art = section.querySelector('.s1__art');

    panels.forEach((p) => gsap.set(parts(p), HIDDEN));
    gsap.set(art, HIDDEN);
    gsap.set(dots, { backgroundColor: '#dadada' });

    /* --- One drawing, nine arrows: scattered ("Por que você está aqui"), all pointing up ("Encontre seu ponto ideal"),
       all pointing at one dot ("O que você quer"). The same arrows travel between the three with the scroll. --- */
    // each arrow is [tail x, tail y, tip x, tip y] in a 240 x 240 box; the first one is the black arrow.
    // Taken from the three original drawings, each moved to the middle of the box
    const shift = (list, dx, dy) => list.map(([a, b, c, d]) => [a + dx, b + dy, c + dx, d + dy]);
    const SCATTERED = shift([
      [126.14, 146.61, 126.14, 58.21],
      [228.26, 31.2, 140.47, 6.64], [64.96, 51.45, 136.17, 15.85], [57.59, 87.68, 0.5, 64.96], [11.55, 77.24, 41.02, 169.94],
      [51.08, 144.18, 102.65, 94.45], [147.84, 173.01, 48.39, 191.43], [149.07, 109.16, 229.49, 65.57], [153.98, 86.45, 220.89, 119.6],
    ], 5, 21.6);
    const UP = shift([
      [89, 108.07, 89, 1.91],
      [10.81, 108.07, 10.81, 1.91], [44.5, 108.07, 44.5, 1.91], [127.14, 108.07, 127.14, 1.91], [167.83, 108.07, 167.83, 1.91],
      [26.7, 172.91, 26.7, 66.11], [71.84, 172.91, 71.84, 66.11], [109.98, 172.91, 109.98, 66.11], [151.94, 172.91, 151.94, 66.11],
    ], 31, 33.5);
    const CORE = [120, 119.75];
    const CONVERGE = shift([
      [108, 112.5, 108, 112.5], // the black arrow shrinks into the dot where the others meet
      [107.76, 0, 107.76, 97.32], [107.76, 225.49, 107.76, 128.65], [0, 112.51, 86.4, 112.51], [216, 112.51, 129.13, 112.51],
      [38.45, 38.93, 88.3, 88.77], [177.55, 38.93, 127.7, 88.77], [38.45, 186.57, 88.3, 136.72], [177.55, 186.57, 127.7, 136.72],
    ], 12, 7.25);
    // the grey arrows are matched between drawings by where they sit around the middle, so they travel short ways and don't cross
    const byAngle = (list) => {
      const [key, ...rest] = list;
      const ang = ([a, b, c, d]) => Math.atan2((b + d) / 2 - 120, (a + c) / 2 - 120);
      return [key, ...rest.sort((m, n) => ang(m) - ang(n))];
    };
    const SHAPES = [byAngle(SCATTERED), byAngle(UP), byAngle(CONVERGE)];

    const NS = 'http://www.w3.org/2000/svg';
    const make = (tag, attrs) => { const el = document.createElementNS(NS, tag); Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v)); return el; };
    const arrows = SHAPES[0].map((_, i) => {
      const g = make('g', { stroke: i === 0 ? '#050505' : '#c9c9c9' });
      const shaft = make('path', { pathLength: 1 });
      const head = make('path', { pathLength: 1 });
      g.append(shaft, head);
      art.append(g);
      return { shaft, head, phase: Math.random() * Math.PI * 2, speed: 1.6 + Math.random() * 1.6 };
    });
    const core = make('circle', { class: 's1-core', cx: CORE[0], cy: CORE[1], r: 8, fill: '#050505', stroke: 'none' });
    art.append(core);

    const shape = { m: 0 }; // 0 scattered, 1 up, 2 converge (decimals = on the way)
    const travel = gsap.parseEase('sine.inOut'); // soft start, soft landing
    const n2 = (v) => Math.round(v * 100) / 100;
    const draw = (time) => {
      const k = Math.min(Math.floor(shape.m), 1);
      const t = gsap.utils.clamp(0, 1, shape.m - k);
      const near = shape.m > 1.5; // pulled towards the dot: they breathe in towards it instead of wandering
      arrows.forEach((ar, i) => {
        const A = SHAPES[k][i];
        const B = SHAPES[k + 1][i];
        // each arrow sets off a moment after the one before, so they turn one by one rather than all at once
        const e = travel(gsap.utils.clamp(0, 1, (t - i * 0.035) / 0.72));
        let [tx, ty, hx, hy] = A.map((v, j) => v + (B[j] - v) * e);
        const len = Math.hypot(hx - tx, hy - ty);
        const ux = len ? (hx - tx) / len : 0;
        const uy = len ? (hy - ty) / len : -1;
        // idle: each arrow drifts gently along its own direction, the black one a little more
        const wob = Math.sin(time * ar.speed + ar.phase) * (i === 0 ? 5 : 3.5) * (near ? 0.6 : 1);
        tx += ux * wob; ty += uy * wob; hx += ux * wob; hy += uy * wob;
        const h = Math.min(7.4, len * 0.35); // the head shrinks away with a vanishing arrow
        ar.shaft.setAttribute('d', `M${n2(tx)} ${n2(ty)}L${n2(hx)} ${n2(hy)}`);
        ar.head.setAttribute('d', `M${n2(hx - h * (ux + uy))} ${n2(hy - h * (uy - ux))}L${n2(hx)} ${n2(hy)}L${n2(hx - h * (ux - uy))} ${n2(hy - h * (uy + ux))}`);
      });
      // the dot appears as the black arrow shrinks into it, and pulses gently once there
      const c = gsap.utils.clamp(0, 1, (shape.m - 1.55) / 0.45);
      core.setAttribute('r', n2(8 * c * (1 + 0.12 * Math.max(0, Math.sin(time * 2.2)))));
    };
    const tick = () => draw(gsap.ticker.time);
    draw(0);
    ScrollTrigger.create({
      trigger: section, start: 'top bottom', end: 'bottom top',
      onToggle: (self) => (self.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)),
    });

    // desktop: the drawing fills the middle column (up to 70% of the height), square; inline SVGs don't size from their ratio on their own
    const wide = window.matchMedia('(min-width: 861px)');
    let artY = null; // phones: the drawing's offset and scale for each message
    let artS = null;
    const pose = { y: 0, s: 1 };
    let panelOn = 0;
    const sizeArts = () => {
      art.style.width = art.style.height = art.style.margin = art.style.translate = art.style.scale = '';
      art.style.position = art.style.left = art.style.top = '';
      artY = null;
      if (!wide.matches) {
        // phones: as big as the empty room between the title and the topics allows (measured against the longest of the
        // three lists, as the drawing stays on screen through all three), with the same air above and below it; for each
        // message it then sits centred between the title and that message's topics
        const panel = art.closest('.s1__panel');
        const title = panel.querySelector('.title-xl');
        const cs = getComputedStyle(panel);
        const gapL = parseFloat(getComputedStyle(art.parentNode).rowGap || 0);
        // each message's own title: they can wrap to different numbers of lines
        const titleBs = [...section.querySelectorAll('.s1__panel .title-xl')].map((t) => t.offsetTop + t.offsetHeight);
        const titleB = title.offsetTop + title.offsetHeight; // the drawing sits in the flow under the first one
        const listTops = [...section.querySelectorAll('.s1__list')].map((l) =>
          panel.clientHeight - parseFloat(cs.paddingBottom) - [...l.children].reduce((h, li) => h + li.offsetHeight, 0));
        // the arrows don't fill their 240 x 240 box, and each arrangement fills a different part of it: the size and the
        // centring go by the drawn arrows themselves (with a little room for the heads), not the box
        const reach = SHAPES.map((sh) => {
          const ys = sh.flatMap(([, ty, , hy]) => [ty, hy]);
          return [Math.min(...ys) - 2, Math.max(...ys) + 2];
        });
        const AIR = 32;
        // each message gets the biggest drawing its own room allows (it grows and shrinks between them): the box is set for
        // the biggest, and each message scales it down to fit its own room
        const fit = listTops.map((lt, i) => Math.min(((lt - titleBs[i] - AIR * 2) * 240) / (reach[i][1] - reach[i][0]), panel.clientWidth));
        const size = Math.max(72, ...fit);
        art.style.width = art.style.height = size + 'px';
        artS = fit.map((f) => Math.max(72, f) / size);
        // out of the flow, so the box (sized for the biggest room) never pushes the first message's topics down
        const top0 = titleB + gapL;
        Object.assign(art.style, { position: 'absolute', left: '0px', top: top0 + 'px' });
        // scaled from the box's centre: the drawn arrows' middle is then centre + (their middle - 120) x scale
        artY = listTops.map((lt, i) => (titleBs[i] + lt) / 2 - (size / 2 + ((reach[i][0] + reach[i][1]) / 2 - 120) * (size / 240) * artS[i]) - top0);
        pose.y = artY[panelOn]; pose.s = artS[panelOn];
        art.style.translate = `0 ${pose.y}px`;
        art.style.scale = pose.s;
        return;
      }
      const panel = art.closest('.s1__panel');
      const cs = getComputedStyle(panel);
      const inner = panel.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const col = parseFloat(cs.gridTemplateColumns.split(' ')[1]); // the middle column, as laid out
      const size = Math.min(inner * 0.7, col * 0.8); // leaves room on its left: it groups with the text
      art.style.width = art.style.height = size + 'px';
    };
    sizeArts();
    window.addEventListener('resize', sizeArts);
    if (document.fonts) document.fonts.ready.then(sizeArts);

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: {
        trigger: section,
        start: 'top 55%',
        // finishes right when section 02 starts sliding over it
        end: () => '+=' + (section.offsetHeight - window.innerHeight * 2 + window.innerHeight * 0.55),
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });

    const reveal = (p, at) => tl.to(parts(p), { ...SHOWN, duration: 0.6, stagger: 0.1 }, at);
    // desktop: the titles sit at different heights (each follows its dot), so a finished one stays on screen, faded,
    // while the next one comes in — the left column is never empty and reads as a path. Phones stack them, so they go
    const hide = (p, at) => {
      const [title, ...rest] = parts(p);
      if (!wide.matches) return tl.to(parts(p), { ...GONE, duration: 0.5, stagger: 0.04, ease: 'power2.in' }, at);
      tl.to(rest, { ...GONE, duration: 0.5, stagger: 0.04, ease: 'power2.in' }, at)
        .to(title, { opacity: 0.16, duration: 0.8, ease: 'power2.inOut' }, at + 0.3);
    };
    const redraw = () => draw(gsap.ticker.time);

    // each message holds well after the section has settled on the screen (it starts coming in while the section is still
    // rising, so the first one gets the longest hold), and the arrows change slowly in between
    tl.to(dots[0], { backgroundColor: '#050505', scale: 1.15, duration: 0.3 }, 0);
    reveal(panels[0], 0.1);
    // the drawing comes in once and draws itself; from then on only its arrows move
    tl.to(art, { ...SHOWN, duration: 0.6 }, 0.2)
      .fromTo(art.querySelectorAll('path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, stagger: 0.03, ease: 'power2.inOut' }, 0.3);
    hide(panels[0], 4.4);
    tl.to(shape, { m: 1, duration: 2.6, ease: 'none', onUpdate: redraw }, 4.0); // the arrows straighten up, slowly, over the change of message
    tl.to(fill, { scaleY: 0.5, duration: 1, ease: 'none' }, 4.5);
    tl.to(dots[1], { backgroundColor: '#050505', scale: 1.15, duration: 0.25 }, 5.45);
    reveal(panels[1], 5.4);
    hide(panels[1], 8.6);
    tl.to(shape, { m: 2, duration: 2.6, ease: 'none', onUpdate: redraw }, 8.2); // ...then turn, slowly, to point at one dot
    tl.to(fill, { scaleY: 1, duration: 1, ease: 'none' }, 8.7);
    tl.to(dots[2], { backgroundColor: '#050505', scale: 1.15, duration: 0.25 }, 9.65);
    reveal(panels[2], 9.6);
    tl.to({}, { duration: wide.matches ? 4.4 : 2.6 }); // hold the last message long enough to read it
    // phones: the drawing glides to the middle of the room each message leaves (their lists differ in length)
    tl.eventCallback('onUpdate', () => {
      const t = tl.time();
      const on = t < 5.4 ? 0 : t < 9.6 ? 1 : 2;
      if (on === panelOn) return;
      panelOn = on;
      if (!artY) return;
      // CSS translate and scale (not GSAP's transform, which the drawing's own fade in and out uses)
      gsap.to(pose, {
        y: artY[on], s: artS[on], duration: 0.8, ease: 'power2.inOut', overwrite: 'auto',
        onUpdate: () => { art.style.translate = `0 ${pose.y}px`; art.style.scale = pose.s; },
      });
    });

    // Section 02 rises over this one with the same background: fade our content out first so no edge is ever seen
    gsap.to('.s1__inner', {
      autoAlpha: 0, filter: 'blur(12px)', ease: 'none',
      scrollTrigger: { trigger: '.s2', start: 'top bottom', end: 'top 55%', scrub: true },
    });
  })();

  /* ---------- Section 02: sticky presentation ---------- */
  (() => {
    const section = document.querySelector('.s2');

    const desktop = window.matchMedia('(min-width: 861px)'); // the dots are sized in the CSS on both
    const head = section.querySelectorAll('.s2__head > *');
    const labels = gsap.utils.toArray('.s2__label');
    const descs = gsap.utils.toArray('.s2__desc');
    const dots = gsap.utils.toArray('.s2__dot', section);
    const steps = labels.length;
    // filled circles per step (row-major 3x3), taken from the four Figma icons
    const filled = [
      [0, 1, 2, 3, 4, 5, 6, 7, 8],
      [0, 2, 3, 5, 6, 7],
      [0, 5, 6, 7],
      [0, 7],
    ];

    gsap.set([...head, ...labels, ...descs], HIDDEN);
    // the dots are born out of one another, starting from the top-left one (the travelling dot lands there, below)
    gsap.set(dots, { autoAlpha: 0 });

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: { trigger: section, start: 'top 45%', end: 'bottom bottom', scrub: 0.8 },
    });

    tl.to(head, { ...SHOWN, duration: 0.8, stagger: 0.15 }, 0)
      .to(labels[0], { ...SHOWN, duration: 0.6 }, 1.2)
      .to(descs[0], { ...SHOWN, duration: 0.6 }, 2.4);

    // the top-left dot is the travelling dot itself (switched on by the dot's own animation, below, so the two never show at
    // once). The other eight are born out of it: each one comes out of the neighbour before it (on its left, or above it in the
    // first column) and stretches away until it comes loose — the "goo" filter keeps them joined while they touch —
    // in waves from the top-left corner to the opposite one
    const goo = section.querySelector('.s2__dots');
    const gooBlur = section.querySelector('.s2-goo-blur');
    const CX = [13.75, 63.4, 113.05];
    const CY = [14.25, 65.9, 117.55];
    tl.set(goo, { attr: { filter: 'url(#s2-goo)' } }, 1.6)
      .fromTo(gooBlur, { attr: { stdDeviation: 0 } }, { attr: { stdDeviation: 4 }, duration: 0.15, ease: 'none' }, 1.6);
    dots.forEach((d, k) => {
      if (!k) return;
      const r = Math.floor(k / 3);
      const c = k % 3;
      const [pr, pc] = c ? [r, c - 1] : [r - 1, c];
      const at = 1.6 + (r + c - 1) * 0.7; // one wave after another, slow enough to watch each dot peel away
      tl.set(d, { autoAlpha: 1, attr: { cx: CX[pc], cy: CY[pr] } }, at)
        .to(d, { attr: { cx: CX[c], cy: CY[r] }, duration: 1.2, ease: 'sine.inOut' }, at);
    });
    // once they are all apart the goo goes, so the outlines that come later stay crisp
    tl.to(gooBlur, { attr: { stdDeviation: 0 }, duration: 0.3, ease: 'none' }, 4.9)
      .set(goo, { attr: { filter: 'none' } }, 5.2);

    let t = 5.6; // the steps start once the grid is whole
    for (let i = 1; i < steps; i++) {
      tl.to([labels[i - 1], descs[i - 1]], { ...GONE, duration: 0.5, ease: 'power2.in' }, t)
        .to(dots.filter((_, d) => filled[i - 1].includes(d) && !filled[i].includes(d)),
          { fillOpacity: 0, duration: 1, stagger: 0.25, ease: 'power1.inOut' }, t + 0.4)
        .to(labels[i], { ...SHOWN, duration: 0.6 }, t + 1.4)
        .to(descs[i], { ...SHOWN, duration: 0.6 }, t + 1.9);
      t += 3.4;
    }
    // hold the last step long enough to read it; phones scroll on sooner (the section is shorter there, same pace per step)
    tl.to({}, { duration: desktop.matches ? 3.5 : 1.2 });
    if (reduceMotion) tl.set(dots[0], { autoAlpha: 1 }, 1.6);

    // travelling dot, first leg: the dot at the heart of "O que você quer" (where all its arrows meet) drops onto the top-left dot of this grid while section 01 fades,
    // landing as the grid starts (1.6 on the timeline above). Both run with the same scrub, so they stay in step
    if (!reduceMotion) {
      const trail = document.querySelector('.trail--a');
      const s1Sticky = document.querySelector('.s1__sticky');
      const s1Dot = document.querySelector('.s1-core');
      const sticky = section.querySelector('.s2__sticky');
      const grid = section.querySelector('.s2__grid');
      const LAND = 1.6;
      const st = tl.scrollTrigger;
      const from = () => centerIn(s1Dot, s1Sticky);
      const fromSize = () => 16 * (s1Dot.ownerSVGElement.getBoundingClientRect().width / 240); // r 8 in a drawing 240 wide
      const to = () => centerIn(dots[0], sticky);
      const size = () => 2 * parseFloat(getComputedStyle(dots[0]).r) * (grid.getBoundingClientRect().width / 127);
      const show = (p) => {
        const on = p > 0 && p < 1;
        gsap.set(trail, { autoAlpha: on ? 1 : 0 });
        gsap.set(s1Dot, { autoAlpha: p <= 0 ? 1 : 0 });
        gsap.set(dots[0], { autoAlpha: p >= 1 ? 1 : 0 });
      };
      gsap.set(trail, { xPercent: -50, yPercent: -50 });
      gsap.timeline({
        scrollTrigger: {
          trigger: section, start: 'top 85%',
          end: () => st.start + (st.end - st.start) * (LAND / tl.duration()),
          scrub: 0.8, invalidateOnRefresh: true,
          // the scrub runs a little behind the scroll; on a fast scroll out of this stretch the dot goes at once,
          // instead of lingering over the page while the animation catches up
          onLeaveBack: () => show(0),
          onLeave: () => show(1),
        },
        // which of the three dots shows follows the animation itself (not one-off switches, which a fast scroll back
        // and forth could leave out of step): section 01's dot before it leaves, the travelling one on the way, the grid's
        // top-left one once it has landed — never two at once
        onUpdate() {
          // the scrub catches up a moment after the scroll: once the page has left this stretch (a fast scroll), the
          // travelling dot stays hidden even while the animation is still winding back or forward
          const sc = this.scrollTrigger;
          show(sc && !sc.isActive ? (sc.progress >= 1 ? 1 : 0) : this.progress());
        },
      })
        // sideways steadily, downwards like a fall: together they make a curve
        .fromTo(trail, { x: () => from().x, width: fromSize, height: fromSize, backgroundColor: '#050505' },
          { x: () => to().x, width: size, height: size, backgroundColor: '#1b1b1b', ease: 'power1.inOut', duration: 1, immediateRender: false }, 0)
        .fromTo(trail, { y: () => from().y }, { y: () => to().y, ease: 'power2.in', duration: 1, immediateRender: false }, 0)
        .to({}, { duration: 0.001 }, 1);
    }
  })();

  /* ---------- Page background: white -> black (s3) -> white (s4) ---------- */
  // --page-bg follows the same fade, for backgrounds that must match the page (the pinned square's backing on phones)
  const bgTo = (trigger, start, end, from, to) => {
    const scrollTrigger = { trigger, start, end, scrub: true };
    gsap.fromTo(document.body, { backgroundColor: from }, { backgroundColor: to, ease: 'none', immediateRender: false, scrollTrigger });
    // set only on the two elements that use it: changing it on <html> made phones restyle the whole page on every scroll frame
    gsap.fromTo('.s4__pin, .s5__head', { '--page-bg': from }, { '--page-bg': to, ease: 'none', immediateRender: false, scrollTrigger: { ...scrollTrigger } });
  };
  // the page turns black for section 03 when the travelling dot grows over the whole screen (section 03 below);
  // without motion it simply fades
  if (reduceMotion) {
    bgTo('.s3', 'top 85%', 'top 15%', '#f3f3f3', '#050505');
    // section 02 has its own background (it covers section 01), so it fades with the page — no visible edge
    gsap.fromTo('.s2', { backgroundColor: '#f3f3f3' }, {
      backgroundColor: '#050505', ease: 'none', immediateRender: false,
      scrollTrigger: { trigger: '.s3', start: 'top 85%', end: 'top 15%', scrub: true },
    });
  }
  gsap.to('.s2__sticky', {
    autoAlpha: 0, filter: 'blur(10px)', ease: 'none',
    scrollTrigger: { trigger: '.s3', start: 'top 95%', end: 'top 40%', scrub: true },
  });
  // the page turns back to white for section 04: phones fade the page itself; on desktop the page stayed white and it is
  // section 03's own black that fades out, after its content has gone
  gsap.matchMedia()
    // phones: the page's colour comes straight from where the scroll is (white, black once the dot has covered the screen,
    // then fading back to white as section 04 comes in). Set from one place, so a fast scroll down or back up can never
    // leave a black patch behind (two animations catching up in the wrong order did)
    .add('(max-width: 860px)', () => {
      const mix = gsap.utils.interpolate('#050505', '#f3f3f3');
      const s3 = document.querySelector('.s3');
      const s4 = document.querySelector('.s4');
      const at = (el) => el.getBoundingClientRect().top + window.scrollY;
      let marks = null;
      const measure = () => {
        const vh = window.innerHeight;
        marks = { black: at(s3) - vh * 0.5, from: at(s4) - vh * 0.95, to: at(s4) - vh * 0.35 };
      };
      const paint = () => {
        if (!marks) measure();
        const y = window.scrollY;
        const c = y < marks.black ? '#f3f3f3' : y < marks.from ? '#050505' : y < marks.to ? mix((y - marks.from) / (marks.to - marks.from)) : '#f3f3f3';
        document.body.style.backgroundColor = c;
        document.querySelectorAll('.s4__pin, .s5__head').forEach((el) => el.style.setProperty('--page-bg', c));
      };
      const st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: paint, onRefresh: () => { measure(); paint(); } });
      return () => st.kill();
    })
    .add('(min-width: 861px)', () => {
      gsap.to('.s3__sticky', {
        autoAlpha: 0, filter: 'blur(10px)', ease: 'none',
        scrollTrigger: { trigger: '.s4', start: 'top bottom', end: 'top 55%', scrub: true },
      });
      // both sections fade together from the moment this one shows, so there is never an edge between them.
      // Only while this hand-over is under way: before it, section 03's black is the travelling dot's to give (it covers
      // the screen first), so nothing here may paint it black early
      const s3el = document.querySelector('.s3');
      const s4el = document.querySelector('.s4');
      const mix = gsap.utils.interpolate('#050505', '#f3f3f3');
      const paint = (k) => {
        if (k > 0) { s3el.style.backgroundColor = s4el.style.backgroundColor = mix(k); return; }
        s4el.style.backgroundColor = '';
        if (s3el.style.backgroundColor && s3el.style.backgroundColor !== 'rgb(5, 5, 5)') s3el.style.backgroundColor = '#050505';
      };
      const st = ScrollTrigger.create({
        trigger: '.s4', start: 'top bottom', end: 'top 35%',
        onUpdate: (self) => paint(self.progress),
        onLeaveBack: () => paint(0),
      });
      return () => st.kill();
    });
  // phones: section 03's content fades out while the page turns white, instead of lingering over the new background
  gsap.matchMedia().add('(max-width: 860px)', () => {
    gsap.to('.s3__sticky', {
      autoAlpha: 0, filter: 'blur(10px)', ease: 'none',
      scrollTrigger: { trigger: '.s4', start: 'top 95%', end: 'top 45%', scrub: true },
    });
  });

  /* ---------- Section 03: 1 + 2 = 3 ---------- */
  (() => {
    const section = document.querySelector('.s3');

    const wideS3 = window.matchMedia('(min-width: 861px)');
    const cta = section.querySelector('.s3__cta');
    const rows = gsap.utils.toArray('.s3__row', section);
    const titleLines = section.querySelectorAll('.s3__title .line > span');
    const sub = section.querySelector('.s3__sub');
    const part = (row, sel) => row.querySelector(sel);

    /* --- the field: about 260 dots (150 on phones) in a soft round cloud. One state number, driven by the scroll:
       0 → 1 the dots appear; at 1 only a narrow beam lights them (it follows the mouse; on phones it sweeps by itself);
       1 → 2 the beam opens to the whole field and the dots float loose; 2 → 3 they come to rest where they are and lines
       join each one to its nearest neighbours, spreading out from the middle, until the whole field is connected --- */
    const field = section.querySelector('.s3__field');
    const ctx = field.getContext('2d');
    const state = { m: 0 };
    let W = 0; let H = 0; let dpr = 1; let pts = []; let pairs = [];
    let beamX = 0; let mouseX = null; let mouseY = 0;
    const push = []; // each dot's current nudge away from the mouse, eased
    const rand = (() => { let a = 7; return () => ((a = (a * 16807) % 2147483647) / 2147483647); })(); // the same cloud every time
    const build = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = field.clientWidth; H = field.clientHeight;
      if (!W) { pts = []; pairs = []; return; } // phones: no field, only the words
      field.width = W * dpr; field.height = H * dpr;
      const wide = W > 860;
      // the field keeps clear of the words: it is fitted into the free room, measured from the texts themselves
      // (phones: between the subtitle and the words at the bottom; desktop: right of the title, above the words)
      const box = field.getBoundingClientRect();
      const head = section.querySelector('.s3__head').getBoundingClientRect();
      const sum = section.querySelector('.s3__sum').getBoundingClientRect();
      const subR = section.querySelector('.s3__sub').getBoundingClientRect().right - box.left;
      const headB = head.bottom - box.top;
      const sumT = sum.top - box.top;
      let cx; let cy; let R;
      if (wide) {
        cx = W * 0.66; cy = H * 0.48;
        R = Math.min(W * 0.3, H * 0.36, (cx - subR - 48));
        // where the field reaches over the words' column, it must end above them
        if (cx - R < sum.right - box.left) R = Math.min(R, (sumT - 24 - cy) / 0.9);
        R = Math.max(R, 80);
      } else {
        const room = section.querySelector('.s3__room').getBoundingClientRect();
        const top = room.top - box.top + 8;
        const bottom = room.bottom - box.top - 8;
        cy = (top + bottom) / 2; cx = W * 0.5;
        R = Math.max(50, Math.min(W * 0.42, (bottom - top) / 2 / 0.9));
      }
      const n = wide ? 260 : 150;
      pts = Array.from({ length: n }, () => {
        const a = rand() * Math.PI * 2;
        const r = R * Math.sqrt(rand());
        return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r * 0.9, ph: rand() * 6.28, sp: 0.4 + rand() * 0.7 };
      });
      // each dot's three nearest neighbours: the links of the connected field
      pairs = [];
      pts.forEach((p, i) => {
        pts.map((q, j) => [j, Math.hypot(p.x - q.x, p.y - q.y)]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]).slice(0, 3)
          .forEach(([j, d]) => { if (d < R * 0.3 && !pairs.some(([a, b]) => (a === j && b === i))) pairs.push([i, j]); });
      });
      // the links grow from the middle of the field outwards: each gets its moment by how far its middle is from the centre
      pairs.forEach((pr) => {
        const [i, j] = pr;
        pr.at = Math.hypot((pts[i].x + pts[j].x) / 2 - cx, (pts[i].y + pts[j].y) / 2 - cy) / R;
      });
      beamX = cx - R * 0.5;
    };
    const clamp01 = gsap.utils.clamp(0, 1);
    const inout = gsap.parseEase('sine.inOut');
    const pos = [];
    const draw = (time) => {
      if (!W) return; // phones: no field
      const m = state.m;
      const appear = clamp01(m);
      const widen = inout(clamp01(m - 1));
      const settle = clamp01(m - 2);
      const rest = inout(clamp01(settle / 0.4)); // the dots come to rest first...
      const join = clamp01((settle - 0.15) / 0.85); // ...while the links spread out from the middle
      const goal = mouseX !== null && W > 860 ? mouseX : W * (W > 860 ? 0.66 : 0.5) + Math.sin(time * 0.7) * Math.min(W, H) * (W > 860 ? 0.3 : 0.25);
      beamX += (goal - beamX) * 0.08;
      const beamW = Math.max(60, W * 0.07);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      // the mouse: dots close to it are pushed gently away and drift back once it moves on
      const reach = Math.min(W, H) * 0.12;
      pts.forEach((p, i) => {
        const loose = (0.2 + 0.8 * widen) * (1 - rest) * 12;
        const x = p.x + Math.sin(time * p.sp + p.ph) * loose;
        const y = p.y + Math.cos(time * p.sp * 0.8 + p.ph) * loose;
        let gx = 0; let gy = 0;
        if (mouseX !== null) {
          const dx = x - mouseX; const dy = y - mouseY; const d = Math.hypot(dx, dy) || 1;
          const f = Math.max(0, 1 - d / reach) ** 2 * reach * 0.35;
          gx = (dx / d) * f; gy = (dy / d) * f;
        }
        const n = push[i] || (push[i] = [0, 0]);
        n[0] += (gx - n[0]) * 0.12; n[1] += (gy - n[1]) * 0.12;
        pos[i] = [x + n[0], y + n[1]];
      });
      if (join > 0) {
        ctx.strokeStyle = `rgba(64,64,64,${appear})`; // the dark grey of the steps' line in the next section (#404040)
        ctx.lineWidth = 1;
        ctx.beginPath();
        pairs.forEach((pr) => {
          const k = clamp01((join * 1.25 - pr.at * 0.95) / 0.3); // how far this link has drawn itself
          if (k <= 0) return;
          const [ax, ay] = pos[pr[0]]; const [bx, by] = pos[pr[1]];
          ctx.moveTo(ax, ay); ctx.lineTo(ax + (bx - ax) * k, ay + (by - ay) * k);
        });
        ctx.stroke();
        // ...and the links around the mouse light up white, showing the connections in that spot
        if (mouseX !== null) {
          ctx.lineWidth = 1;
          pairs.forEach((pr) => {
            const k = clamp01((join * 1.25 - pr.at * 0.95) / 0.3);
            if (k <= 0) return;
            const [ax, ay] = pos[pr[0]]; const [bx, by] = pos[pr[1]];
            const near = Math.max(0, 1 - Math.hypot((ax + bx) / 2 - mouseX, (ay + by) / 2 - mouseY) / (reach * 1.6));
            if (near <= 0) return;
            ctx.strokeStyle = `rgba(243,243,243,${near * appear})`;
            ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + (bx - ax) * k, ay + (by - ay) * k); ctx.stroke();
          });
        }
      }
      pts.forEach((p, i) => {
        const [x, y] = pos[i];
        const lit = Math.exp(-(((x - beamX) / beamW) ** 2));
        const bright = lit + (1 - lit) * widen;
        const a = appear * (0.1 + 0.9 * bright);
        if (a < 0.01) return;
        ctx.fillStyle = `rgba(243,243,243,${a})`;
        ctx.beginPath(); ctx.arc(x, y, 1.1 + 1.4 * bright, 0, Math.PI * 2); ctx.fill();
      });
    };
    build();
    window.addEventListener('resize', build);
    section.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const r = field.getBoundingClientRect();
      mouseX = e.clientX - r.left; mouseY = e.clientY - r.top;
    });
    section.addEventListener('pointerleave', () => { mouseX = null; });
    const tick = () => draw(gsap.ticker.time);
    if (reduceMotion) { state.m = 3; draw(0); }
    else {
      ScrollTrigger.create({
        trigger: section, start: 'top bottom', end: 'bottom top',
        onToggle: (self) => (self.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)),
      });
    }

    gsap.set([sub, cta], HIDDEN);
    gsap.set(titleLines, { yPercent: 110 });
    rows.forEach((row) => {
      gsap.set(part(row, '.s3__who > span'), { yPercent: 110 });
      gsap.set([part(row, '.s3__op'), part(row, '.s3__what')], { autoAlpha: 0, filter: 'blur(6px)' });
    });

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      // phones start as section 02 fades out, so the screen is never left empty in between
      scrollTrigger: { trigger: section, start: wideS3.matches ? 'top 10%' : 'top 45%', end: 'bottom bottom', scrub: 0.8 },
    });
    // the title rises line by line from behind its edge, then the subtitle comes into focus
    tl.to(titleLines, { yPercent: 0, duration: 1.4, stagger: 0.4, ease: 'power3.out' }, 0)
      .to(sub, { ...SHOWN, duration: 1.4, ease: 'power1.out' }, 0.9)
      // the field: in, then each state over a long stretch of scroll
      .to(state, { m: 1, duration: 1.4, ease: 'none' }, 1.2)
      .to(state, { m: 2, duration: 2.2, ease: 'none' }, 4.0)
      .to(state, { m: 3, duration: 3.2, ease: 'none' }, 7.0);
    // the words in the corner: each line comes in with its state and is the white one while it lasts
    const AT = [2.4, 4.8, 7.6];
    rows.forEach((row, i) => {
      const at = AT[i];
      tl.to(part(row, '.s3__op'), { autoAlpha: 1, filter: 'blur(0px)', duration: 0.6 }, at)
        .to(part(row, '.s3__who > span'), { yPercent: 0, duration: 1, ease: 'power3.out' }, at + 0.1)
        .to(part(row, '.s3__what'), { autoAlpha: 1, filter: 'blur(0px)', duration: 0.8 }, at + 0.4)
        .call(() => rows.forEach((r, k) => r.classList.toggle('is-on', k === i)), null, at)
        .call(() => rows.forEach((r, k) => r.classList.toggle('is-on', k === i - 1)), null, at - 0.01);
    });
    // the call to action closes the reasoning, once the field is connected
    tl.to(cta, { ...SHOWN, duration: 0.6 }, 10.2)
      .to({}, { duration: 1.2 });

    // a light hold on each step: when the scroll comes to rest near one of them (a part, the whole, connected), the page
    // settles on it, so a quick scroll doesn't skip a step. Resting far from every step (on the way in or out) is left alone
    if (!reduceMotion) {
      const STEPS = [3.7, 6.6, 10.9]; // on the timeline: each step fully shown, its words in
      const st = tl.scrollTrigger;
      let timer = null;
      let settling = false;
      const settle = () => {
        if (settling || !st.isActive) return;
        const y = window.scrollY;
        const spots = STEPS.map((t) => st.start + (st.end - st.start) * (t / tl.duration()));
        const near = spots.reduce((a, b) => (Math.abs(b - y) < Math.abs(a - y) ? b : a));
        const dist = Math.abs(near - y);
        if (dist < 4 || dist > window.innerHeight * 0.45) return;
        settling = true;
        scrollToY(near, Math.min(0.9, 0.35 + dist / window.innerHeight));
        setTimeout(() => { settling = false; }, 1000);
      };
      const onScroll = () => { clearTimeout(timer); timer = setTimeout(settle, 160); };
      if (lenis) lenis.on('scroll', onScroll);
      else window.addEventListener('scroll', onScroll, { passive: true });
    }

    // travelling dot, second leg: at the end of section 02 its last two dots meet in the middle and become one; that dot then
    // grows until it covers the whole screen, and that is how the page turns black for this section (the page behind it
    // switches to black once it is covered, then the dot goes). Scrolling back, it shrinks back into the grid
    if (!reduceMotion) {
      const trail = document.querySelector('.trail--b');
      const s2 = document.querySelector('.s2');
      const s2Grid = s2.querySelector('.s2__grid');
      const s2Dots = gsap.utils.toArray('.s2__dot', s2);
      const MERGE = 0.15; // share of the leg spent on the two dots meeting, while section 02 is still pinned
      const BLACK = '#050505';
      const s2Size = () => 2 * parseFloat(getComputedStyle(s2Dots[4]).r) * (s2Grid.getBoundingClientRect().width / 127);
      // it is the grid's middle dot itself that grows: it stays on it while section 02 scrolls away, and every frame it is as big
      // as it needs to be to reach the farthest corner of the screen by the end
      const grow = { k: 0 };
      const swell = gsap.parseEase('power2.in');
      const follow = () => {
        const r = s2Dots[4].getBoundingClientRect();
        const x = r.left + r.width / 2;
        const y = r.top + r.height / 2;
        const far = 2 * Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) + 4;
        const e = swell(grow.k);
        const d = s2Size() + (far - s2Size()) * e;
        gsap.set(trail, { x, y, width: d, height: d, backgroundColor: gsap.utils.interpolate('#1b1b1b', BLACK, e) });
      };
      gsap.set(trail, { xPercent: -50, yPercent: -50 });
      gsap.timeline({
        scrollTrigger: {
          trigger: s2, start: 'bottom 115%',
          endTrigger: section, end: wideS3.matches ? 'top 15%' : 'top 50%', // covered just before this section's texts come in
          scrub: 0.8, invalidateOnRefresh: true,
          // scrolling back up fast: the big dot goes at once rather than staying over section 02 while the scrub catches up
          onLeaveBack: () => gsap.set(trail, { autoAlpha: 0 }),
        },
      })
        .to([s2Dots[0], s2Dots[7]], { attr: { cx: 63.4, cy: 65.9 }, duration: MERGE, ease: 'power2.inOut' }, 0)
        // only the one that merges in goes; the top-left dot (now in the middle) stays under the growing dot — its showing
        // is left to the first leg alone, so a fast scroll back can never bring it back early
        .set(s2Dots[7], { autoAlpha: 0 }, MERGE)
        .set(trail, { autoAlpha: 1 }, MERGE)
        .fromTo(grow, { k: 0 }, { k: 1, duration: 1 - MERGE, ease: 'none', onUpdate: follow, immediateRender: false }, MERGE)
        // covered: what is behind is black now, the dot can go. Desktop: sections 03 and 04 carry their own black, so the page
        // itself stays white (a black page showed as a band in the room section 05 leaves while it holds). Phones fade the page
        // section 03 turns black only once covered (phones: the page itself, set from the scroll position, below)
        .set(wideS3.matches ? [s2, section] : s2, { backgroundColor: BLACK }, 1)
        .set(trail, { autoAlpha: 0 }, 1);
    }
  })();

  /* ---------- Generic reveal (s5) ---------- */
  gsap.utils.toArray('.s5 .reveal').forEach((el) => {
    gsap.fromTo(el, HIDDEN, {
      ...SHOWN, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
    });
  });
  /* ---------- Selected work: one row that slides sideways with the scroll ---------- */
  // the project in the middle is big; each step away it gets smaller and fainter. The scroll position is a decimal index
  // (2.4 = between the third and fourth), so sizes and positions move continuously instead of jumping from one to the next
  (() => {
    const section = document.querySelector('.work');
    const items = [...section.querySelectorAll('.work__item')];
    const names = [...section.querySelectorAll('.work__names li')];
    const now = section.querySelector('.work__now');
    const caption = section.querySelector('.work__caption');
    const name = section.querySelector('.work__name');
    const row = section.querySelector('.work__list');
    const last = items.length - 1;
    let p = 0;
    let on = -1;
    const layout = () => {
      const W = row.clientWidth;
      const H = row.clientHeight;
      const phone = W < 861;
      // the middle one: as tall as the screen allows, leaving room for the title above and the names below
      const bigH = phone ? Math.min(H * 0.46, W * 0.7 * 1.25) : Math.min(H * 0.52, W * 0.3 * 1.25);
      const gap = phone ? 8 : Math.max(10, W * 0.008);
      const box = items.map((_, i) => {
        const d = Math.abs(i - p);
        const s = Math.pow(phone ? 0.6 : 0.56, d);
        return { d, h: bigH * s, w: bigH * 0.8 * Math.pow(s, 0.75) }; // width shrinks a bit less: the far ones read as slivers
      });
      const centers = [];
      let x = 0;
      box.forEach((b) => { centers.push(x + b.w / 2); x += b.w + gap; });
      const k = Math.min(Math.floor(p), last);
      const focus = centers[k] + ((centers[Math.min(k + 1, last)] - centers[k]) * (p - k));
      const shift = W / 2 - focus;
      // the caption sits under the middle slot, which never moves: the pictures slide through it
      const bigW = bigH * 0.8;
      caption.style.width = bigW + 'px';
      // placed with left/top: its transform belongs to the arrival animation
      caption.style.left = (W - bigW) / 2 + 'px';
      caption.style.top = (H + bigH) / 2 + 16 + 'px';
      box.forEach((b, i) => {
        const el = items[i];
        el.style.width = b.w + 'px';
        el.style.height = b.h + 'px';
        el.style.transform = `translate(${centers[i] - b.w / 2 + shift}px, ${(H - b.h) / 2}px)`;
        el.style.opacity = Math.max(0.12, 1 - 0.4 * b.d);
      });
      const i = Math.round(p);
      if (i !== on) {
        on = i;
        names.forEach((li, j) => li.classList.toggle('is-on', j === i));
        now.textContent = String(i + 1).padStart(2, '0');
        // the name changes with a quick blur, like the other texts on the page
        name.textContent = names[i].textContent;
        name.href = items[i].querySelector('a').href; // the caption opens the same case as the picture
        name.dataset.case = items[i].querySelector('a').dataset.case;
        gsap.fromTo(name, { autoAlpha: 0, filter: 'blur(6px)', y: 6 }, { autoAlpha: 1, filter: 'blur(0px)', y: 0, duration: 0.4, ease: 'power2.out', overwrite: true });
      }
    };
    const st = ScrollTrigger.create({
      trigger: section, start: 'top top', end: 'bottom bottom',
      onUpdate: (self) => { p = self.progress * last; layout(); },
      onRefresh: (self) => { p = self.progress * last; layout(); },
      onToggle: (self) => setPinned('work', self.isActive),
    });
    layout();
    window.addEventListener('resize', layout);
    // dragging the row sideways (mouse or finger) moves through the projects too: it scrolls the page by the same amount
    // the scroll would, and on release it settles on the nearest project. Up-and-down swipes stay the page's own scroll
    const span = () => st.end - st.start;
    const perPx = () => span() / last / (row.clientWidth * 0.3); // about a third of the width per project
    const jump = (y) => (lenis ? lenis.scrollTo(y, { immediate: true, force: true }) : window.scrollTo(0, y));
    let drag = null;
    row.addEventListener('pointerdown', (e) => {
      if (e.button || e.pointerType === 'touch') return; // fingers are handled below
      drag = { x: e.clientX, y: e.clientY, from: window.scrollY, moved: false, id: e.pointerId, trail: [] };
    });
    window.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved) {
        if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(e.clientY - drag.y)) return;
        drag.moved = true;
        row.classList.add('is-dragging');
      }
      e.preventDefault();
      // the last moments of the drag give its speed, for the throw on release
      drag.trail.push([e.clientX, performance.now()]);
      if (drag.trail.length > 6) drag.trail.shift();
      jump(gsap.utils.clamp(st.start, st.end, drag.from - dx * perPx()));
    }, { passive: false });
    const release = () => {
      if (!drag) return;
      if (drag.moved) {
        // a quick flick keeps going: its speed carries the row on past where the finger let go (a long throw can cross
        // several projects), then it settles on the nearest one, taking longer the further it travels
        const [a, b] = [drag.trail[0], drag.trail[drag.trail.length - 1]];
        const v = a && b && b[1] - a[1] > 0 && performance.now() - b[1] < 120 ? (b[0] - a[0]) / (b[1] - a[1]) : 0; // px per ms
        const thrown = p - (v * 420 * perPx()) / span() * last;
        const i = Math.round(gsap.utils.clamp(0, last, thrown));
        scrollToY(st.start + span() * (i / last), Math.min(1.8, 0.6 + Math.abs(i - p) * 0.18));
        // a drag is not a click: the picture under the pointer must not open
        const stop = (ev) => { ev.preventDefault(); ev.stopImmediatePropagation(); };
        window.addEventListener('click', stop, { capture: true, once: true });
        setTimeout(() => window.removeEventListener('click', stop, { capture: true }), 50);
      }
      row.classList.remove('is-dragging');
      drag = null;
    };
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    row.addEventListener('dragstart', (e) => e.preventDefault()); // no ghost image when dragging a picture

    // fingers: the first move decides — sideways, the row is ours (the page doesn't scroll meanwhile); up or down, it's the
    // page's own scroll as usual. Touch events, not pointer events: phones cancel a pointer as soon as they start panning
    let touch = null;
    row.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      touch = { x: t.clientX, y: t.clientY, from: window.scrollY, axis: null, at: Math.round(p) };
    }, { passive: true });
    row.addEventListener('touchmove', (e) => {
      if (!touch) return;
      const t = e.touches[0];
      const dx = t.clientX - touch.x;
      const dy = t.clientY - touch.y;
      if (!touch.axis) {
        if (Math.hypot(dx, dy) < 8) return;
        touch.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      }
      if (touch.axis !== 'x') return;
      if (e.cancelable) e.preventDefault();
      touch.dx = dx;
      // the row follows the finger, a project for every ~60% of the width, like a phone carousel
      jump(gsap.utils.clamp(st.start, st.end, touch.from - (dx * span()) / last / (row.clientWidth * 0.6)));
    }, { passive: false });
    row.addEventListener('touchend', (e) => {
      if (!touch) return;
      if (touch.axis === 'x') {
        // one swipe, one project (back or forward); only a very long drag goes further
        const dx = touch.dx || 0;
        const steps = Math.abs(dx) < 30 ? 0 : Math.max(1, Math.round(Math.abs(dx) / (row.clientWidth * 0.6)));
        const i = gsap.utils.clamp(0, last, touch.at + (dx < 0 ? steps : -steps));
        scrollToY(st.start + span() * (i / last), 0.6);
        if (e.cancelable) e.preventDefault(); // a swipe is not a tap: the picture under the finger must not open
      }
      touch = null;
    });
    row.addEventListener('touchcancel', () => { touch = null; });

    // a name takes the page to its project
    names.forEach((li, i) => li.querySelector('button').addEventListener('click', () => {
      scrollToY(st.start + (st.end - st.start) * (i / last), 1.2);
    }));
    // on arrival the row and the texts come in together
    gsap.fromTo([row, ...section.querySelectorAll('.reveal')], HIDDEN, {
      ...SHOWN, duration: 1, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none reverse' },
    });
  })();
  // section 04 reveals all its text at once, keyed to the section itself: its steps move as they open and close
  // (and the section pins on desktop), so per-item triggers could leave some of them hidden halfway through a scroll
  gsap.fromTo('.s4 .reveal', HIDDEN, {
    ...SHOWN, duration: 1, ease: 'power3.out', stagger: 0.08,
    scrollTrigger: { trigger: '.s4', start: 'top 70%', toggleActions: 'play none none reverse' },
  });

  /* ---------- Section 04 ---------- */
  // phones: the square fades in; desktop: it is masked in from the left (see the pin below)
  gsap.matchMedia().add('(max-width: 860px)', () => {
    gsap.fromTo('.s4__media', { autoAlpha: 0, scale: 0.94, filter: 'blur(12px)' }, {
      autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: '.s4', start: 'top 70%', toggleActions: 'play none none reverse' },
    });
  });
  // Steps: numbered, joined by a line that fills up to the open one; the drawing on the left follows the step
  (() => {
    const list = document.querySelector('.accordion');
    const accs = [...list.querySelectorAll('.acc')];
    const svg = document.querySelector('.s4__art');
    // the drawing is scaled to its box, which would thicken its lines: they are set so they always come out 1px
    const thin = () => { if (svg.clientWidth) svg.style.setProperty('--s4-sw', (400 / svg.clientWidth).toFixed(3)); };
    thin();
    window.addEventListener('resize', thin);
    const dots = [...svg.querySelectorAll('.s4-dot')];
    const lines = svg.querySelectorAll('.s4-lines path');
    const arrow = svg.querySelector('.s4-arrow');
    const ring = svg.querySelector('.s4-ring');
    const scan = svg.querySelector('.s4-scan');

    // dot positions for each step (viewBox 400x400)
    const grid = [130, 200, 270].flatMap((y) => [130, 200, 270].map((x) => [x, y]));
    const POS = [
      [[96, 112], [262, 88], [178, 176], [314, 196], [118, 286], [224, 300], [304, 318], [70, 200], [196, 74]], // Diagnóstico: scattered
      Array.from({ length: 9 }, (_, k) => [100 + k * 22, 300 - k * 22]),                                        // Estratégia: one direction
      grid,                                                                                                    // Narrativa: connected
      Array.from({ length: 9 }, () => [200, 200]),                                                             // Design: one mark
    ];

    // idle motion per step, only while the section is on screen
    const IDLE = [
      () => gsap.timeline({ repeat: -1, defaults: { duration: 1.3, ease: 'sine.inOut' } })
        .to(scan, { attr: { cx: 262, cy: 96 } })
        .to(scan, { attr: { cx: 300, cy: 300 } })
        .to(scan, { attr: { cx: 104, cy: 280 } })
        .to(scan, { attr: { cx: 96, cy: 112 } })
        .add(dots.map((d) => gsap.to(d, { x: gsap.utils.random(-7, 7), y: gsap.utils.random(-7, 7), duration: 1.3, yoyo: true, repeat: 3, ease: 'sine.inOut' })), 0),
      () => gsap.timeline({ repeat: -1 })
        .to(dots, { x: 7, y: -7, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: 1, stagger: 0.08 }),
      () => gsap.timeline({ repeat: -1, repeatDelay: 0.4 })
        .to(dots, { scale: 1.35, duration: 0.45, ease: 'sine.inOut', yoyo: true, repeat: 1, stagger: { each: 0.12, grid: [3, 3], from: 'start' } }),
      () => gsap.timeline({ repeat: -1, yoyo: true })
        .to(dots, { scale: 1.06, duration: 1.4, ease: 'sine.inOut' }, 0)
        .to(ring, { scale: 1.04, svgOrigin: '200 200', duration: 1.4, ease: 'sine.inOut' }, 0),
    ];

    let idle = null;
    let visible = false;
    const setStep = (i, instant) => {
      if (idle) idle.kill();
      gsap.killTweensOf([...dots, ...lines, arrow, ring, scan]);
      const d = instant ? 0 : 0.9;
      gsap.to(dots, { x: 0, y: 0, scale: 1, duration: d * 0.5 });
      dots.forEach((dot, k) => gsap.to(dot, {
        attr: { cx: POS[i][k][0], cy: POS[i][k][1], r: [12, 7, 12, 58][i] },
        duration: d, delay: instant ? 0 : k * 0.03, ease: 'power3.inOut',
      }));
      // strokes draw in when their step opens; hidden ones also go transparent (a round cap would leave a dot)
      const draw = (on) => (on ? { strokeDashoffset: 0, autoAlpha: 1 } : { strokeDashoffset: 1, autoAlpha: 0 });
      gsap.to(lines, { ...draw(i === 2), duration: d * 0.7, stagger: i === 2 ? 0.05 : 0, delay: i === 2 ? d * 0.6 : 0 });
      gsap.to(arrow, { ...draw(i === 1), duration: d, delay: i === 1 ? d * 0.5 : 0, ease: 'power2.inOut' });
      gsap.to(ring, { ...draw(i === 3), scale: 1, svgOrigin: '200 200', duration: d * 1.2, delay: i === 3 ? d * 0.6 : 0, ease: 'power2.inOut' });
      gsap.to(scan, { autoAlpha: i === 0 ? 1 : 0, duration: d * 0.5, delay: i === 0 ? d * 0.6 : 0 });
      idle = IDLE[i]().pause();
      gsap.delayedCall(instant ? 0 : d + 0.3, () => { if (visible) idle.play(); });
    };

    // desktop: the line works as a timer, filling from the open step towards the next one; when it gets there, that step opens
    const STEP_TIME = 10;
    const timer = { p: 0 };
    let timerTween = null;

    // the line runs from the first dot to the last, and fills up to the open step (plus the timer's progress towards the next)
    const placeRail = () => {
      // layout offsets (not screen rects), so the reveal animations on each item don't shift the line
      const topIn = (el) => { let y = 0; for (let n = el; n && n !== list; n = n.offsetParent) y += n.offsetTop; return y; };
      const centers = accs.map((a) => {
        const dot = a.querySelector('.acc__dot');
        return topIn(dot) + dot.offsetHeight / 2;
      });
      const open = accs.findIndex((a) => a.classList.contains('is-open'));
      list.style.setProperty('--rail-top', centers[0] + 'px');
      list.style.setProperty('--rail-h', centers[centers.length - 1] - centers[0] + 'px');
      const next = open >= 0 && open < centers.length - 1 ? (centers[open + 1] - centers[open]) * timer.p : 0;
      list.style.setProperty('--fill-h', (open < 0 ? 0 : centers[open] - centers[0] + next) + 'px');
      accs.forEach((a, k) => a.classList.toggle('is-done', open >= 0 && k < open));
    };
    const followRail = () => {
      const t0 = performance.now();
      const tick = () => { placeRail(); if (performance.now() - t0 < 700) requestAnimationFrame(tick); };
      tick();
    };

    let current = 0;
    const openOnly = (i) => {
      accs.forEach((a, k) => {
        a.classList.toggle('is-open', k === i);
        a.querySelector('.acc__btn').setAttribute('aria-expanded', String(k === i));
      });
      if (i >= 0 && i !== current) setStep(i);
      current = i;
      followRail();
    };

    // phones: the steps start closed; once "Diagnóstico" reaches the square they lock there and open one by one with the scroll
    const phone = window.matchMedia('(max-width: 860px)');
    const content = document.querySelector('.s4__content');
    const pin = document.querySelector('.s4__pin');
    const spacer = document.querySelector('.s4__spacer');
    let lock = { shift: [0, 0, 0, 0], h: 0, stick: 0 };
    let phoneStep = -1;
    let scrollStep = -1; // the step the scroll position points to
    const measure = () => {
      const next = document.querySelector('.s5');
      if (!phone.matches) {
        content.style.removeProperty('--s4-stick');
        content.style.height = content.style.transform = '';
        next.style.marginTop = '';
        return;
      }
      // computed from sizes, not live positions, since the panels may be mid-animation
      const btnH = accs[0].querySelector('.acc__btn').offsetHeight;
      const gap = parseFloat(getComputedStyle(list).rowGap) || 0;
      const panel = accs.map((a) => {
        const kids = [...a.querySelector('.acc__body').children];
        return 22 + kids.reduce((sum, el) => sum + el.offsetHeight, 0) + 10 * (kids.length - 1);
      });
      const listTop = list.getBoundingClientRect().top - content.getBoundingClientRect().top;
      const pos = (k, open) => listTop + k * (btnH + gap) + (open >= 0 && open < k ? panel[open] : 0);
      const line = 88 + pin.offsetHeight + 56; // just below the square and its fade
      lock.shift = [0, 1, 2, 3].map((k) => pos(0, -1) - pos(k, k));
      lock.h = listTop + 4 * btnH + 3 * gap + Math.max(...panel);
      lock.stick = line - pos(0, -1);
      content.style.height = lock.h + 'px';
      // the steps leave with "Design" pulled up to the square, which leaves that much room empty below them: the next section takes it
      next.style.marginTop = lock.shift[3] + 'px';
      content.style.setProperty('--s4-stick', lock.stick + 'px');
      content.style.transform = phoneStep > 0 ? `translateY(${lock.shift[phoneStep]}px)` : '';
    };
    const goPhoneStep = (k) => {
      if (k === phoneStep) return;
      phoneStep = k;
      openOnly(k);
      content.style.transform = k > 0 ? `translateY(${lock.shift[k]}px)` : '';
    };
    ScrollTrigger.addEventListener('refreshInit', measure);
    measure();
    // clip for the square and the fade around it (which reaches past it): `cut` px taken off from the bottom
    const mask = (cut) => `inset(-100px -40px ${cut - 80}px -40px)`;
    const STEP_SHARE = [1.6, 1.3, 1.3, 0.5];
    const total = STEP_SHARE.reduce((a, b) => a + b, 0);
    const STEP_FROM = STEP_SHARE.map((_, i) => STEP_SHARE.slice(0, i).reduce((a, b) => a + b, 0) / total);
    const stepAt = (p) => STEP_FROM.reduce((k, from, i) => (p >= from ? i : k), 0);
    const steps = ScrollTrigger.create({
      trigger: spacer,
      start: () => `top ${lock.stick + lock.h}px`,
      end: () => `bottom ${lock.stick + lock.h}px`,
      // how long each step holds, in shares of the scroll: "Diagnóstico" opens as the steps lock, so it gets the longest
      // stretch to be read before "Estratégia" takes over; "Design" gets a short one, then the square goes.
      // The scroll only takes over again when it reaches another stretch, so a tapped step stays open where it is
      onUpdate: (self) => {
        if (!phone.matches) return;
        const k = stepAt(self.progress);
        if (k !== scrollStep) { scrollStep = k; goPhoneStep(k); }
      },
      // when "Design" has had its moment, a mask closes over the square from the bottom up and the steps scroll on
      // by themselves (dragging the square up along with them stuttered on iPhone); scrolling back, the mask opens again
      onLeave: () => {
        if (!phone.matches) return;
        if (scrollStep !== 3) { scrollStep = 3; goPhoneStep(3); }
        gsap.fromTo(pin, { clipPath: mask(0) }, {
          clipPath: mask(pin.offsetHeight + 80), duration: 0.6, ease: 'power2.inOut', overwrite: true,
          onComplete: () => gsap.set(pin, { autoAlpha: 0 }),
        });
      },
      onEnterBack: () => {
        if (!phone.matches) return;
        gsap.set(pin, { autoAlpha: 1 });
        gsap.fromTo(pin, { clipPath: mask(pin.offsetHeight + 80) }, {
          clipPath: mask(0), duration: 0.6, ease: 'power2.inOut', overwrite: true,
          onComplete: () => { pin.style.clipPath = ''; },
        });
      },
      onLeaveBack: () => { if (phone.matches) { scrollStep = -1; goPhoneStep(-1); } },
    });


    accs.forEach((acc, i) => {
      acc.querySelector('.acc__btn').addEventListener('click', () => {
        if (phone.matches) {
          // on phones a tap opens that step right where the page is, without scrolling it away;
          // only before the steps have locked in place does it glide down to them
          if (window.scrollY < steps.start) {
            scrollToY(steps.start + STEP_FROM[i] * (steps.end - steps.start) + 4, 1);
          }
          else goPhoneStep(i);
          return;
        }
        openOnly(acc.classList.contains('is-open') ? -1 : i);
        startTimer();
        setTimeout(() => ScrollTrigger.refresh(), 650);
      });
    });

    setStep(0, true);
    if (phone.matches) openOnly(-1);
    placeRail();
    window.addEventListener('resize', placeRail);
    if (document.fonts) document.fonts.ready.then(placeRail);
    ScrollTrigger.create({
      trigger: '.s4', start: 'top bottom', end: 'bottom top',
      onToggle: (self) => { visible = self.isActive; if (idle) (visible ? idle.play() : idle.pause()); },
    });

    // the timer runs only on desktop (phones follow the scroll), only while the section is in view, and only with a step open;
    // after the last step it waits the same time and starts over from the first
    const fill = list.querySelector('.acc__fill');
    const startTimer = () => {
      if (timerTween) timerTween.kill();
      timer.p = 0;
      // desktop: no CSS easing on the line; it is placed every frame, so its tip stays on the dots even while the panels open and close
      fill.style.transition = phone.matches ? '' : 'none';
      if (phone.matches || current < 0) { placeRail(); return; }
      timerTween = gsap.to(timer, {
        p: 1, duration: STEP_TIME, ease: 'none', paused: !timerOn,
        onUpdate: placeRail,
        onComplete: () => { timer.p = 0; openOnly((current + 1) % accs.length); startTimer(); },
      });
    };
    let timerOn = false;
    ScrollTrigger.create({
      trigger: '.s4', start: 'top 60%', end: 'bottom 40%',
      onToggle: (self) => {
        timerOn = self.isActive;
        if (!timerTween) startTimer();
        if (timerTween) (timerOn ? timerTween.play() : timerTween.pause());
      },
    });

    // desktop: a short hold once the section fills the screen, then the page moves on
    gsap.matchMedia().add('(min-width: 861px)', () => {
      ScrollTrigger.create({
        trigger: '.s4', start: 'top top', end: '+=40%', pin: true,
        refreshPriority: 1, // laid out before the triggers further down the page
        onToggle: (self) => setPinned('s4', self.isActive),
      });
      // the screen is already black from section 03 and stays black: the block on the left is the same black, so only its
      // drawing and the texts come in. Section 05 brings its own white background
      // the framed block opens from the left as the section comes in, then the drawing fades in
      gsap.fromTo('.s4__media', { clipPath: 'inset(-1px 100% -1px -1px)' }, {
        clipPath: 'inset(-1px 0% -1px -1px)', ease: 'power2.inOut',
        scrollTrigger: { trigger: '.s4', start: 'top 85%', end: 'top 15%', scrub: true },
      });
      gsap.fromTo('.s4__art', { autoAlpha: 0, filter: 'blur(10px)' }, {
        autoAlpha: 1, filter: 'blur(0px)', ease: 'none',
        scrollTrigger: { trigger: '.s4', start: 'top 35%', end: 'top top', scrub: true },
      });
      // on the way to section 05 the block closes to the left, after the drawing and the text fade out
      // the framed block is cut by an edge sweeping right to left across the screen
      const media = document.querySelector('.s4__media');
      const sweep = { x: 1 }; // where the edge is, as a share of the screen width (1 = right edge, nothing cut)
      const cut = () => {
        const W = window.innerWidth;
        const edge = sweep.x * W;
        const m = media.getBoundingClientRect();
        const off = Math.min(m.width, Math.max(0, m.right - edge));
        media.style.clipPath = off <= 0 ? '' : `inset(-1px ${off}px -1px -1px)`;
      };
      gsap.timeline({ scrollTrigger: {
        trigger: '.s5', start: 'top bottom', end: 'top 30%', scrub: true,
        // the top blur would smear the straight black and white edges as they pass under the header
        onToggle: (self) => setPinned('s4-out', self.isActive),
      } })
        .fromTo(['.s4__art', '.s4__content'], { autoAlpha: 1, filter: 'blur(0px)' }, { autoAlpha: 0, filter: 'blur(10px)', ease: 'none', duration: 0.45, immediateRender: false }, 0)
        .fromTo(sweep, { x: 1 }, { x: 0, ease: 'power2.inOut', duration: 1, immediateRender: false, onUpdate: cut }, 0);
      return () => { setPinned('s4', false); setPinned('s4-out', false); };
    });
  })();

  /* ---------- Section 05: cards + animated symbols ---------- */
  (() => {
    const cards = gsap.utils.toArray('.card');
    const CARD_IN = { ...SHOWN, duration: 1, ease: 'power3.out' };
    gsap.matchMedia()
      // desktop: the three cards sit side by side and come in together
      .add('(min-width: 861px)', () => {
        gsap.fromTo(cards, HIDDEN, {
          ...CARD_IN, stagger: 0.15,
          scrollTrigger: { trigger: '.s5__cards', start: 'top 85%', toggleActions: 'play none none reverse' },
        });
      })
      // phones: they are stacked, so each one comes in when it reaches the screen
      .add('(max-width: 860px)', () => {
        cards.forEach((card) => gsap.fromTo(card, HIDDEN, {
          ...CARD_IN,
          scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
        }));
      });

    // One circle travels through the three cards, as one story: it comes into focus in Definição, glides to Clareza and
    // becomes its outline, fills there, then glides on — filled — to Síntese, where the seesaw is already waiting tipped
    // its way; it lands as the ball and rolls across, getting smaller. Then everything fades and it starts again
    const box = document.querySelector('.s5__cards');
    const traveller = document.createElement('i');
    traveller.className = 's5__traveller';
    box.append(traveller);
    const defBlur = document.querySelector('.def-blur-amount');
    const defSvg = document.querySelector('.art-definicao svg');
    const defCircle = document.querySelector('.def-circle');
    const claRing = document.querySelector('.cla-ring');
    const claFill = document.querySelector('.cla-fill');
    const ball = document.querySelector('.sin-ball');
    const O = '122 82.25'; // the pivot's tip
    // a circle's place and size inside the cards' box (its outline edge, as drawn)
    const spot = (el, stroke) => {
      const r = el.getBoundingClientRect();
      const b = box.getBoundingClientRect();
      const d = r.width - (stroke ? 1 : 0);
      return { x: r.left + r.width / 2 - b.left, y: r.top + r.height / 2 - b.top, d };
    };
    let A;
    let B;
    let C;
    const measure = () => {
      gsap.set('.sin-beam', { rotation: -12, svgOrigin: O });
      // smaller than Clareza's dot, so the circle shrinks all the way: along the glide, then on along the roll
      gsap.set(ball, { attr: { cx: 33, cy: 66.75, r: 15 } });
      A = spot(defCircle, true);
      B = spot(claRing, true);
      C = spot(ball);
    };
    // the ends of each glide are measured on every frame (the cards may still be settling in, or the page scrolling),
    // so the circle always runs in a straight line from one drawing's centre to the next one's
    // starts gently and lands still moving, at about the speed the ball then rolls off with (ends with slope 0.6)
    const landing = (t) => t * t * (t * (0.6 - 2) + (3 - 0.6));
    const legAB = { k: 0 };
    const legBC = { k: 0 };
    const glide = (k, from, to) => {
      const a = from === A ? spot(defCircle, true) : spot(claRing, true);
      const b = to === B ? spot(claRing, true) : C && spot(ball);
      gsap.set(traveller, { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, width: a.d + (b.d - a.d) * k, height: a.d + (b.d - a.d) * k });
    };
    gsap.set(traveller, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    gsap.set(claFill, { scale: 0, svgOrigin: '32.2308 32.2308' });
    gsap.set([claRing, '.sin-beam', '.sin-pivot', ball], { autoAlpha: 0 });

    const story = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.6, onRepeat: measure, defaults: { ease: 'sine.inOut' } })
      .call(measure)
      // a clean start on every loop (going back to the start puts the later steps' shapes back as they were)
      .set([traveller, claRing, claFill, ball, '.sin-beam', '.sin-pivot'], { autoAlpha: 0 }, 0)
      // Definição: a blurred circle comes into focus
      .set(defBlur, { attr: { stdDeviation: 5 } })
      .fromTo(defSvg, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.8, transformOrigin: '50% 50%' })
      .to(defBlur, { attr: { stdDeviation: 0 }, duration: 1.6 }, 0.4)
      .to(defCircle, { scale: 1.06, svgOrigin: '41.2308 41.2308', duration: 0.4, yoyo: true, repeat: 1 }, 2.0)
      // the seesaw sets itself up in Síntese, waiting
      .fromTo('.sin-pivot', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 2.2)
      .fromTo('.sin-beam', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 2.3)
      // ...the circle leaves Definição and glides to Clareza, where it becomes the outline
      .set(traveller, { autoAlpha: 1, backgroundColor: 'rgba(27,27,27,0)' }, 2.9)
      .set(defSvg, { autoAlpha: 0 }, 2.9)
      .fromTo(legAB, { k: 0 }, { k: 1, duration: 1.3, ease: 'power2.inOut', onUpdate: () => glide(legAB.k, A, B), immediateRender: false }, 2.9)
      .set(traveller, { autoAlpha: 0 }, 4.2)
      .set(claRing, { autoAlpha: 1 }, 4.2)
      // Clareza: it fills
      .set(claFill, { autoAlpha: 1, scale: 0, svgOrigin: '32.2308 32.2308' }, 4.3)
      .to(claFill, { scale: 1, svgOrigin: '32.2308 32.2308', duration: 0.9, ease: 'power3.out' }, 4.3)
      // ...and glides on, filled, onto the waiting seesaw
      .set(traveller, { autoAlpha: 1, backgroundColor: 'rgba(27,27,27,1)' }, 5.7)
      .set([claRing, claFill], { autoAlpha: 0 }, 5.7)
      // it arrives with speed and goes straight into the roll, so landing and rolling read as one movement, not a stop and a start
      .fromTo(legBC, { k: 0 }, { k: 1, duration: 1.3, ease: landing, onUpdate: () => glide(legBC.k, B, C), immediateRender: false }, 5.7)
      .set(traveller, { autoAlpha: 0 }, 7.0)
      .set(ball, { autoAlpha: 1 }, 7.0)
      // Síntese: it rolls across, shrinking, as the beam swings the other way
      // it gets smaller the whole way and is gone exactly as it reaches the end of the beam: the problem is solved
      // (its centre stays one radius above the beam, so it rolls on it all along)
      .to(ball, { attr: { cx: 233, cy: 81.75, r: 0 }, duration: 2.9, ease: 'power1.out' }, 7.0)
      .to('.sin-beam', { rotation: 12, svgOrigin: O, duration: 2.9, ease: 'power1.out' }, 7.0)
      .to({}, { duration: 1.2 })
      .to(['.sin-beam', '.sin-pivot'], { autoAlpha: 0, duration: 0.6, ease: 'power1.in' });

    gsap.matchMedia()
      // desktop: the cards sit side by side; the story loops while they are well on screen, from the start each time
      .add('(min-width: 861px)', () => {
        const st = ScrollTrigger.create({
          trigger: box, start: 'top 70%', end: 'bottom top',
          onEnter: () => story.restart(),
          onEnterBack: () => story.play(),
          onLeave: () => story.pause(),
          onLeaveBack: () => story.pause(0),
        });
        return () => st.kill();
      })
      // phones: the cards are stacked, so the circle only moves on to a card once that card is on screen (not while the
      // visitor is still reading the one before); it plays through once, from the start whenever the first card comes back
      .add('(max-width: 860px)', () => {
        story.repeat(0);
        const AT = [0, 2.85, 5.65]; // just before each glide to the next card starts on the story
        let reached = 0;
        const go = (i) => {
          reached = Math.max(reached, i);
          const until = reached < 2 ? AT[reached + 1] : story.duration();
          if (story.time() < until) story.tweenTo(until, { ease: 'none' });
        };
        const sts = cards.map((card, i) => ScrollTrigger.create({
          trigger: card.querySelector('.card__art'), start: 'center 70%',
          onEnter: () => { if (i === 0) { reached = 0; story.pause(0); } go(i); },
          onLeaveBack: () => { if (i === 0) { reached = 0; story.pause(0); } },
        }));
        return () => { sts.forEach((t) => t.kill()); story.repeat(-1); };
      });
    window.addEventListener('resize', measure);

    // desktop: the same short hold as section 04
    gsap.matchMedia().add('(min-width: 861px)', () => {
      ScrollTrigger.create({
        trigger: '.s5', start: 'top top', end: '+=40%', pin: true,
        refreshPriority: 1,
        onToggle: (self) => setPinned('s5', self.isActive),
      });
      return () => setPinned('s5', false);
    });
  })();

  /* ---------- Bento: light parallax, each column drifts at its own pace while the board scrolls by ---------- */
  if (!reduceMotion) {
    // desktop amounts shrink on narrower screens, where the columns (and their spare room below the edge) are smaller
    const drift = window.matchMedia('(min-width: 861px)').matches
      ? [50, 100, 30, 90, 60].map((d) => d * Math.min(1, window.innerWidth / 1440))
      : [16, 36];
    gsap.utils.toArray('.bento__col').forEach((col, i) => {
      const d = drift[i % drift.length];
      gsap.fromTo(col, { y: d }, {
        y: -d, ease: 'none',
        scrollTrigger: { trigger: '.bento', start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
  }

  /* ---------- Footer: "Vamos conversar?" shares its baseline with the first line of the text beside it (desktop) ---------- */
  (() => {
    const title = document.querySelector('.footer__title');
    const text = document.querySelector('.footer__text');
    const wideF = window.matchMedia('(min-width: 861px)');
    // a zero-size mark at the start of a line sits on that line's baseline
    const baseline = (el) => {
      const mark = document.createElement('span');
      mark.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
      el.prepend(mark);
      const y = mark.getBoundingClientRect().top;
      mark.remove();
      return y;
    };
    const alignBaselines = () => {
      text.style.marginTop = '';
      if (!wideF.matches) return;
      text.style.marginTop = baseline(title) - baseline(text.querySelector('p')) + 'px';
    };
    alignBaselines();
    window.addEventListener('resize', alignBaselines);
    if (document.fonts) document.fonts.ready.then(alignBaselines);
  })();

  /* ---------- Footer: revealed from behind ---------- */
  // on phones the footer is much taller, so a smaller offset keeps "Vamos conversar?" from hiding behind the section above
  gsap.fromTo('.footer__inner', { yPercent: () => (window.innerWidth > 860 ? -30 : -6) }, {
    yPercent: 0, ease: 'none',
    scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true },
  });
  gsap.fromTo('.bento', { boxShadow: '0 40px 80px rgba(0,0,0,0)' }, {
    boxShadow: '0 40px 80px rgba(0,0,0,.25)', ease: 'none',
    scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'top 50%', scrub: true },
  });
  // desktop: the footer text reaches the top of the screen at the very end of the page, so the top blur steps aside there
  gsap.matchMedia().add('(min-width: 861px)', () => {
    ScrollTrigger.create({
      trigger: '.footer', start: 'top 10%', end: 'bottom top', // never reached, so it stays on to the last pixel
      onToggle: (self) => setPinned('footer', self.isActive),
    });
    return () => setPinned('footer', false);
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());

  /* =====================================================
     Multi-step form
     ===================================================== */
  const modal = document.getElementById('form-modal');
  const card = modal.querySelector('.modal__card');
  const form = document.getElementById('lead-form');
  const steps = gsap.utils.toArray('.step', form);
  const nextBtn = form.querySelector('.form-next');
  const backBtn = form.querySelector('.form-back');
  const nav = form.querySelector('.form-nav');
  const errorEl = form.querySelector('.form-error');
  const LAST_QUESTION_STEP = steps.length - 1; // last step is the success screen
  let current = 0;
  let submitted = false;
  let switching = false;
  let lastFocus = null;

  // Funnel events for the Meta Pixel (fbq only exists if the visitor accepted cookies)
  const track = (name, params) => { if (window.fbq) window.fbq('trackCustom', name, params); };
  const reachedSteps = new Set();
  const formOrigin = (btn) =>
    btn.closest('.site-header') ? 'menu' : btn.closest('.hero') ? 'hero' : btn.closest('.footer') ? 'rodape' : 'secao-03';

  const openForm = (e) => {
    if (e && e.currentTarget) track('AbriuFormulario', { origem: formOrigin(e.currentTarget) });
    if (submitted) resetForm();
    lastFocus = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => { if (current === 0) form.querySelector('#f-nome').focus({ preventScroll: true }); }, 350);
  };
  const closeForm = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  };
  document.querySelectorAll('[data-open-form]').forEach((b) => b.addEventListener('click', openForm));
  modal.querySelectorAll('[data-close-form]').forEach((b) => b.addEventListener('click', closeForm));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeForm(); });

  // Page keeps scrolling with the wheel while the form is open (Lenis listens on window).
  // Only when the card itself has room to scroll in that direction do we let it scroll natively.
  card.addEventListener('wheel', (e) => {
    const canDown = card.scrollTop + card.clientHeight < card.scrollHeight - 1;
    const canUp = card.scrollTop > 0;
    if ((e.deltaY > 0 && canDown) || (e.deltaY < 0 && canUp)) e.stopPropagation();
  }, { passive: true });

  /* ----- Case popup: the project's own pictures, a gallery inside the site (the visitor never leaves it) ----- */
  // pictures live in assets/cases/<case>-01.webp, -02... (taken from the Instagram posts, their labels cropped off)
  const CASES = {
    camargo: ['Camargo', 'DIeVFSHgKTd', 10], ziviz: ['ZIVIZ', 'DIESx1EgwJ5', 5], tingo: ['Tingo', 'DGBIIfPgR4Q', 10],
    partfix: ['PartFix', 'DJMTtBju6YN', 8], 'moreno-ferraro': ['Moreno & Ferraro', 'DH3lqAKAPY2', 6], binalis: ['Binalis', 'DUjSP0IEckc', 8],
    vynor: ['Vynor', 'DQ4UmX6kS0H', 6], yunect: ['Yunect', 'C7hTYPRgIUp', 9], iblack: ['iBlack', 'CvKnHFBgrum', 3, 0.9],
    ducase: ['Ducase', 'CwVtlsKvEXD', 3], hello: ['Hello! Tech', 'DHGV692gcqD', 7], wepsy: ['Wepsy', 'DT_RPVZEZYj', 8],
  };
  const caseModal = document.getElementById('case-modal');
  const caseView = caseModal.querySelector('.case-view');
  const caseTrack = caseModal.querySelector('.case-track');
  const caseTitle = caseModal.querySelector('#case-title');
  const caseNow = caseModal.querySelector('.case-count span');
  const caseCount = caseModal.querySelector('.case-count');
  const caseIg = caseModal.querySelector('.case-ig');
  const [casePrev, caseNext] = caseModal.querySelectorAll('.case-arrow');
  let caseN = 0;
  let caseAt = 0;
  let caseFocus = null;
  const two = (n) => String(n).padStart(2, '0');
  const showSlide = (i) => {
    caseAt = gsap.utils.clamp(0, caseN - 1, i);
    caseTrack.style.transform = `translateX(${-caseAt * 100}%)`;
    caseNow.textContent = two(caseAt + 1);
    casePrev.disabled = caseAt === 0;
    caseNext.disabled = caseAt === caseN - 1;
  };
  const openCase = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // a new tab still opens the post
    const data = CASES[e.currentTarget.dataset.case];
    if (!data) return;
    e.preventDefault();
    const [name, id, n, ratio] = data;
    const slug = e.currentTarget.dataset.case;
    caseN = n;
    caseTitle.textContent = name;
    caseCount.lastChild.textContent = ` / ${two(n)}`;
    caseIg.href = `https://www.instagram.com/p/${id}/`;
    caseView.style.setProperty('--cr', ratio || 1.125);
    caseTrack.innerHTML = Array.from({ length: n }, (_, k) =>
      `<img src="assets/cases/${slug}-${two(k + 1)}.webp" alt="${window.gangT ? window.gangT(`Projeto de marca ${name}`) : `Projeto de marca ${name}`}" ${k > 1 ? 'loading="lazy"' : ''} decoding="async" draggable="false" />`).join('');
    caseTrack.style.transition = 'none';
    showSlide(0);
    caseTrack.offsetWidth; // settle at the first picture before the slide transition comes back
    caseTrack.style.transition = '';
    caseFocus = document.activeElement;
    caseModal.classList.add('is-open');
    caseModal.setAttribute('aria-hidden', 'false');
    // the X takes the focus (keyboards close from there), without drawing the focus ring after a tap or a click
    caseModal.querySelector('.modal__close').focus({ preventScroll: true, focusVisible: e.detail === 0 });
  };
  const closeCase = () => {
    caseModal.classList.remove('is-open');
    caseModal.setAttribute('aria-hidden', 'true');
    if (caseFocus) caseFocus.focus({ preventScroll: true });
  };
  document.querySelectorAll('[data-case]').forEach((a) => a.addEventListener('click', openCase));
  caseModal.querySelectorAll('[data-close-case]').forEach((b) => b.addEventListener('click', closeCase));
  casePrev.addEventListener('click', () => showSlide(caseAt - 1));
  caseNext.addEventListener('click', () => showSlide(caseAt + 1));
  document.addEventListener('keydown', (e) => {
    if (!caseModal.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeCase();
    if (e.key === 'ArrowLeft') showSlide(caseAt - 1);
    if (e.key === 'ArrowRight') showSlide(caseAt + 1);
  });
  // dragging (mouse) or swiping (finger) moves to the next or previous picture; the track follows along meanwhile
  let caseDrag = null;
  caseView.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.case-arrow')) return;
    caseDrag = { x: e.clientX, y: e.clientY, dx: 0, id: e.pointerId, axis: null };
  });
  window.addEventListener('pointermove', (e) => {
    if (!caseDrag || e.pointerId !== caseDrag.id) return;
    const dx = e.clientX - caseDrag.x;
    if (!caseDrag.axis) {
      if (Math.hypot(dx, e.clientY - caseDrag.y) < 6) return;
      caseDrag.axis = Math.abs(dx) > Math.abs(e.clientY - caseDrag.y) ? 'x' : 'y';
      if (caseDrag.axis === 'x') caseView.classList.add('is-dragging');
    }
    if (caseDrag.axis !== 'x') return;
    caseDrag.dx = dx;
    caseTrack.style.transform = `translateX(calc(${-caseAt * 100}% + ${dx}px))`;
  });
  const endCaseDrag = () => {
    if (!caseDrag) return;
    caseView.classList.remove('is-dragging');
    const { dx, axis } = caseDrag;
    caseDrag = null;
    if (axis !== 'x') return;
    showSlide(caseAt + (dx < -40 ? 1 : dx > 40 ? -1 : 0));
  };
  window.addEventListener('pointerup', endCaseDrag);
  window.addEventListener('pointercancel', endCaseDrag);

  /* ----- Privacy policy popup (same look as the form, can open on top of it) ----- */
  const privacy = document.getElementById('privacy-modal');
  const privacyCard = privacy.querySelector('.modal__card');
  let privacyFocus = null;
  const openPrivacy = () => {
    privacyFocus = document.activeElement;
    privacyCard.scrollTop = 0;
    // over the form the page is already blurred, so the policy adds no second blur
    privacy.classList.toggle('is-stacked', modal.classList.contains('is-open'));
    privacy.classList.add('is-open');
    privacy.setAttribute('aria-hidden', 'false');
  };
  const closePrivacy = () => {
    privacy.classList.remove('is-open');
    privacy.setAttribute('aria-hidden', 'true');
    if (privacyFocus) privacyFocus.focus({ preventScroll: true });
  };
  document.querySelectorAll('[data-open-privacy]').forEach((b) => b.addEventListener('click', openPrivacy));
  privacy.querySelectorAll('[data-close-privacy]').forEach((b) => b.addEventListener('click', closePrivacy));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !privacy.classList.contains('is-open')) return;
    e.stopImmediatePropagation(); // close only the policy, not the form under it
    closePrivacy();
  }, true);
  // the long text scrolls inside the card; the page only takes the wheel once the card hits its end
  privacyCard.addEventListener('wheel', (e) => {
    const canDown = privacyCard.scrollTop + privacyCard.clientHeight < privacyCard.scrollHeight - 1;
    const canUp = privacyCard.scrollTop > 0;
    if ((e.deltaY > 0 && canDown) || (e.deltaY < 0 && canUp)) e.stopPropagation();
  }, { passive: true });

  /* ----- Field helpers ----- */
  const phone = form.querySelector('[data-type="phone"]');
  phone.addEventListener('input', () => {
    const d = phone.value.replace(/\D/g, '').slice(0, 11);
    let out = d;
    if (d.length > 0) out = '(' + d.slice(0, 2);
    if (d.length >= 3) out += ') ' + (d.length === 11 ? d.slice(2, 3) + ' ' + d.slice(3, 7) + '-' + d.slice(7) : d.slice(2, 6) + (d.length > 6 ? '-' + d.slice(6) : ''));
    phone.value = out;
  });

  const isValidField = (input) => {
    const v = input.value.trim();
    if (!v) return false;
    if (input.dataset.type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    if (input.dataset.type === 'phone') return v.replace(/\D/g, '').length >= 10;
    return true;
  };

  const stepIsValid = (step) => {
    const texts = step.querySelectorAll('input.field[required]');
    for (const t of texts) if (!isValidField(t)) return false;
    // every radio group and checkbox group must have a selection; "Outro" text is optional
    const groups = new Set([...step.querySelectorAll('input[type="radio"], input[type="checkbox"]')].map((i) => i.name));
    for (const name of groups) if (!step.querySelector(`input[name="${name}"]:checked`)) return false;
    return true;
  };

  // Progress line: one quarter per step, filling in as each question in it is answered
  const progressBar = document.querySelector('.form-progress__bar');
  const stepFraction = (step) => {
    const texts = [...step.querySelectorAll('input.field[required]')];
    const groups = [...new Set([...step.querySelectorAll('input[type="radio"], input[type="checkbox"]')].map((i) => i.name))];
    const total = texts.length + groups.length;
    const done = texts.filter(isValidField).length
      + groups.filter((name) => step.querySelector(`input[name="${name}"]:checked`)).length;
    return total ? done / total : 0;
  };
  const updateProgress = () => {
    const p = current >= LAST_QUESTION_STEP ? 1 : (current + stepFraction(steps[current])) / LAST_QUESTION_STEP;
    progressBar.style.transform = `scaleX(${p})`;
  };

  const updateNext = () => {
    updateProgress();
    if (current >= LAST_QUESTION_STEP) return;
    nextBtn.disabled = !stepIsValid(steps[current]);
  };

  // Toggle optional "Outro" text inputs
  form.addEventListener('change', (e) => {
    const el = e.target;
    if (el.type === 'radio' || el.type === 'checkbox') {
      form.querySelectorAll(`input[name="${el.name}"][data-other]`).forEach((o) => {
        const other = form.querySelector(`input[name="${o.dataset.other}"]`);
        const show = o.checked;
        if (show && other.hidden) {
          other.hidden = false;
          gsap.fromTo(other, { autoAlpha: 0, y: -8 }, { autoAlpha: 1, y: 0, duration: 0.35 });
          setTimeout(() => other.focus({ preventScroll: true }), 50);
        } else if (!show) {
          other.hidden = true;
          other.value = '';
        }
      });
    }
    updateNext();
  });
  form.addEventListener('input', (e) => {
    if (e.target.classList.contains('field')) e.target.classList.remove('is-invalid');
    updateNext();
  });
  form.querySelectorAll('input.field[required]').forEach((i) =>
    i.addEventListener('blur', () => { if (i.value.trim() && !isValidField(i)) i.classList.add('is-invalid'); })
  );
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
      e.preventDefault();
      if (!nextBtn.disabled) nextBtn.click();
    }
  });
  form.addEventListener('submit', (e) => e.preventDefault());

  /* ----- Step transitions (same modal, questions swap in place) ----- */
  const showStep = (index) => {
    const from = steps[current];
    const to = steps[index];
    switching = true;
    errorEl.hidden = true;
    gsap.to(from, {
      autoAlpha: 0, filter: 'blur(8px)', y: -16, duration: 0.3, ease: 'power2.in',
      onComplete: () => {
        from.classList.remove('is-active');
        gsap.set(from, { clearProps: 'all' });
        to.classList.add('is-active');
        card.scrollTop = 0;
        current = index;
        switching = false;
        if (current > 0 && current < LAST_QUESTION_STEP && !reachedSteps.has(current)) {
          reachedSteps.add(current);
          track('EtapaFormulario', { etapa: current + 1 }); // step 1 is counted by AbriuFormulario
        }
        backBtn.hidden = current === 0 || current >= LAST_QUESTION_STEP;
        nav.hidden = current >= LAST_QUESTION_STEP;
        updateNext();
        gsap.fromTo(to.children, { autoAlpha: 0, filter: 'blur(8px)', y: 18 }, {
          autoAlpha: 1, filter: 'blur(0px)', y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out', clearProps: 'filter,transform',
        });
        const first = to.querySelector('input.field');
        if (first) setTimeout(() => first.focus({ preventScroll: true }), 300);
      },
    });
  };

  const collect = () => {
    const data = {};
    new FormData(form).forEach((value, key) => {
      if (value === '') return;
      data[key] = data[key] ? `${data[key]}, ${value}` : value;
    });
    return data;
  };

  const submit = async () => {
    nextBtn.classList.add('is-loading');
    nextBtn.disabled = true;
    errorEl.hidden = true;
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(collect()),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error((json.errors || []).map((er) => er.message).join(' ') || 'Falha no envio');
      }
      submitted = true;
      sendMetaEvent('Lead', { name: form.nome.value, email: form.email.value, phone: form.whatsapp.value });
      showStep(LAST_QUESTION_STEP);
    } catch (err) {
      errorEl.textContent = window.gangT ? window.gangT('Não foi possível enviar agora. Verifique sua conexão e tente novamente.') : 'Não foi possível enviar agora. Verifique sua conexão e tente novamente.';
      errorEl.hidden = false;
      updateNext();
    } finally {
      nextBtn.classList.remove('is-loading');
    }
  };

  nextBtn.addEventListener('click', () => {
    if (switching || !stepIsValid(steps[current])) return;
    if (current === LAST_QUESTION_STEP - 1) submit();
    else showStep(current + 1);
  });
  backBtn.addEventListener('click', () => { if (!switching && current > 0) showStep(current - 1); });

  const resetForm = () => {
    form.reset();
    form.querySelectorAll('.field--other').forEach((o) => { o.hidden = true; });
    steps.forEach((s, i) => { s.classList.toggle('is-active', i === 0); gsap.set([s, ...s.children], { clearProps: 'all' }); });
    current = 0;
    submitted = false;
    nav.hidden = false;
    backBtn.hidden = true;
    updateNext();
  };

  backBtn.hidden = true;
  updateNext();
})();

/* ---------- Meta Pixel, only after cookie consent (LGPD) ---------- */
(() => {
  const PIXEL_ID = '398840463638938';
  const KEY = 'gang-consent';
  const banner = document.querySelector('.consent');
  const read = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const save = (v) => { try { localStorage.setItem(KEY, v); } catch (e) { /* private mode: ask again next visit */ } };

  const loadPixel = () => {
    if (window.fbq) return;
    /* Meta's base code */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  };

  const choice = read();
  if (choice === 'yes') return loadPixel();
  if (choice === 'no' || !banner) return;

  // shown a moment after load, so the hero gets its first impression alone
  setTimeout(() => {
    banner.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => banner.classList.add('is-in')));
  }, 2500);
  banner.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-consent]');
    if (!btn) return;
    const yes = btn.dataset.consent === 'yes';
    save(yes ? 'yes' : 'no');
    if (yes) loadPixel();
    banner.classList.remove('is-in');
    setTimeout(() => { banner.hidden = true; }, 500);
  });
})();

/* ---------- Conversions: Pixel in the browser + Conversions API on the server ----------
   Both carry the same event ID, so Meta counts each conversion once.
   Only after cookie consent (fbq exists only then). */
function sendMetaEvent(name, user) {
  if (!window.fbq) return;
  const id = `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  window.fbq('track', name, {}, { eventID: id });
  const cookie = (k) => (document.cookie.match(new RegExp('(?:^|; )' + k + '=([^;]*)')) || [])[1];
  const fbclid = new URLSearchParams(location.search).get('fbclid');
  fetch('/api/meta-event', {
    method: 'POST',
    keepalive: true, // still sent if the page is left right away (WhatsApp link)
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_name: name,
      event_id: id,
      event_source_url: location.href,
      fbp: cookie('_fbp'),
      fbc: cookie('_fbc') || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined),
      user: user || {},
    }),
  }).catch(() => {});
}

/* ---------- WhatsApp link: counted as a contact ---------- */
document.querySelectorAll('a[href*="wa.me"]').forEach((a) => a.addEventListener('click', () => sendMetaEvent('Contact')));

/* ---------- Footer e-mail: copies the address and shows "Copiado" for a moment ---------- */
document.querySelectorAll('[data-copy-email]').forEach((btn) => {
  const tip = btn.querySelector('.copy-tip');
  const label = tip.querySelector('.copy-tip__text');
  let timer;
  // older browsers (or a refused clipboard): copy through a hidden field
  const copyByField = (text) => {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(field);
    field.select();
    const ok = document.execCommand('copy');
    field.remove();
    return ok ? Promise.resolve() : Promise.reject();
  };
  const copy = (text) => (navigator.clipboard && window.isSecureContext
    ? navigator.clipboard.writeText(text).catch(() => copyByField(text))
    : copyByField(text));
  btn.addEventListener('click', () => {
    copy(btn.dataset.copyEmail).then(() => {
      label.textContent = window.gangT ? window.gangT('Copiado') : 'Copiado';
      tip.classList.add('is-in');
      clearTimeout(timer);
      timer = setTimeout(() => tip.classList.remove('is-in'), 1400);
      sendMetaEvent('Contact');
    }).catch(() => { window.location.href = 'mailto:' + btn.dataset.copyEmail; });
  });
});

/* ---------- Buttons: on hover the label rolls up and comes back from below ---------- */
document.querySelectorAll('.btn, .consent__actions button').forEach((btn) => {
  const text = btn.textContent.trim();
  btn.innerHTML = `<span class="roll"><span class="roll__label">${text}</span><span class="roll__label" aria-hidden="true">${text}</span></span>`;
});
