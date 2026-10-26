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
    const SHORT = new RegExp(`(^|[\\s\\u00a0(])(${WORDS}) (?=\\S)`, 'gi');
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
  const HIDDEN = { autoAlpha: 0, filter: 'blur(14px)', y: 28 };
  const SHOWN = { autoAlpha: 1, filter: 'blur(0px)', y: 0 };
  const GONE = { autoAlpha: 0, filter: 'blur(14px)', y: -28 };

  /* ---------- Hero ---------- */
  const hero = document.querySelector('.hero');
  gsap.from('.hero__title .line, .hero__sub, .hero__cta, .hero__note', {
    ...HIDDEN, duration: 1.1, ease: 'power3.out', stagger: 0.12, delay: 0.15,
  });
  gsap.from('.hero__img', { autoAlpha: 0, scale: 0.85, duration: 1.2, ease: 'power3.out', stagger: 0.08, delay: 0.4 });

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
    const parts = (p) => [p.querySelector('.title-xl'), p.querySelector('.s1__art'), ...p.querySelectorAll('li')];

    panels.forEach((p) => gsap.set(parts(p), HIDDEN));
    gsap.set(dots, { backgroundColor: '#dadada' });

    // desktop: each drawing fills the space above the text in the right column and keeps its proportions;
    // inline SVGs don't size from their ratio on their own
    const wide = window.matchMedia('(min-width: 861px)');
    const sizeArts = () => section.querySelectorAll('.s1__art').forEach((svg) => {
      svg.style.width = '';
      svg.style.height = '';
      if (!wide.matches) return svg.removeAttribute('preserveAspectRatio');
      const vb = svg.viewBox.baseVal;
      const panel = svg.closest('.s1__panel');
      const list = panel.querySelector('.s1__list');
      const cs = getComputedStyle(panel);
      const h = panel.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - parseFloat(cs.rowGap) - list.offsetHeight;
      const w = Math.min(h * (vb.width / vb.height), list.offsetWidth);
      svg.style.width = w + 'px';
      svg.style.height = w * (vb.height / vb.width) + 'px';
    });
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

    const reveal = (p, at) => {
      tl.to(parts(p), { ...SHOWN, duration: 0.6, stagger: 0.1 }, at);
      // the arrows draw themselves in as the panel appears
      tl.fromTo(p.querySelectorAll('.s1__art path'), { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.9, stagger: 0.03, ease: 'power2.inOut' }, at + 0.1);
    };
    const hide = (p, at) => tl.to(parts(p), { ...GONE, duration: 0.5, stagger: 0.04, ease: 'power2.in' }, at);

    tl.to(dots[0], { backgroundColor: '#050505', scale: 1.15, duration: 0.3 }, 0);
    reveal(panels[0], 0.1);
    hide(panels[0], 2.6);
    tl.to(fill, { scaleY: 0.5, duration: 1, ease: 'none' }, 2.7);
    tl.to(dots[1], { backgroundColor: '#050505', scale: 1.15, duration: 0.25 }, 3.65);
    reveal(panels[1], 3.6);
    hide(panels[1], 6.0);
    tl.to(fill, { scaleY: 1, duration: 1, ease: 'none' }, 6.1);
    tl.to(dots[2], { backgroundColor: '#050505', scale: 1.15, duration: 0.25 }, 7.05);
    reveal(panels[2], 7.0);
    tl.to({}, { duration: 4.4 }); // hold the last message long enough to read it

    // Idle motion for the arrows, only while the section is on screen
    const arrows = (sel) => gsap.utils.toArray(sel + ' .s1-arrow');
    const along = (g, d) => ({ x: +g.dataset.dx * d, y: +g.dataset.dy * d });
    const loops = [];

    // Por que você está aqui: every arrow pulls its own way, only the black one rises steadily
    arrows('.s1__art--scattered').forEach((g) => {
      const key = g.classList.contains('s1-arrow--key');
      loops.push(gsap.to(g, {
        ...along(g, key ? 8 : gsap.utils.random(5, 9)),
        duration: key ? 1.6 : gsap.utils.random(0.9, 1.6),
        delay: key ? 0 : gsap.utils.random(0, 1),
        ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true,
      }));
    });

    // Encontre seu ponto ideal: the arrows rise together in a wave, the black one goes highest
    const up = arrows('.s1__art--up');
    loops.push(gsap.timeline({ repeat: -1, paused: true, defaults: { ease: 'sine.inOut' } })
      .to(up, { y: (i, g) => (g.classList.contains('s1-arrow--key') ? -16 : -8), duration: 0.9, stagger: 0.08 })
      .to(up, { y: 0, duration: 0.9, stagger: 0.08 }, '>-0.3'));

    // O que você quer: everything converges on the dot, which pulses on arrival
    const conv = arrows('.s1__art--converge');
    loops.push(gsap.timeline({ repeat: -1, repeatDelay: 0.4, paused: true })
      .to(conv, { x: (i, g) => +g.dataset.dx * 8, y: (i, g) => +g.dataset.dy * 8, duration: 0.9, ease: 'power2.in' })
      .to('.s1-core', { scale: 1.35, svgOrigin: '108 112.5', duration: 0.25, ease: 'power2.out' })
      .to(conv, { x: 0, y: 0, duration: 1.1, ease: 'power2.out' }, '<')
      .to('.s1-core', { scale: 1, svgOrigin: '108 112.5', duration: 0.6, ease: 'power2.inOut' }, '<0.15'));

    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => loops.forEach((l) => (self.isActive ? l.play() : l.pause())),
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

    // Title stays at the top; the stage below it is centered on the screen (desktop only)
    const sticky = section.querySelector('.s2__sticky');
    const headEl = section.querySelector('.s2__head');
    const desktop = window.matchMedia('(min-width: 861px)');
    const centerStage = () => {
      if (!desktop.matches) return sticky.style.removeProperty('--s2-lift'); // mobile: plain stacked layout
      const vh = window.innerHeight;
      const headBottom = headEl.offsetTop + headEl.offsetHeight;
      // screen center, but never closer than 64px between the subtitle and the 400px box
      const centerY = Math.max(vh / 2, headBottom + 64 + 200);
      sticky.style.setProperty('--s2-lift', Math.max(0, headBottom + vh - 40 - 2 * centerY) + 'px');
    };
    centerStage();
    window.addEventListener('resize', centerStage);

    const head = section.querySelectorAll('.s2__head > *');
    const labels = gsap.utils.toArray('.s2__label');
    const descs = gsap.utils.toArray('.s2__desc');
    const box = section.querySelector('.s2__box');
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
    gsap.set(box, { autoAlpha: 0, scale: 0.85, filter: 'blur(10px)' });

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: { trigger: section, start: 'top 45%', end: 'bottom bottom', scrub: 0.8 },
    });

    tl.to(head, { ...SHOWN, duration: 0.8, stagger: 0.15 }, 0)
      .to(labels[0], { ...SHOWN, duration: 0.6 }, 1.2)
      .to(box, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.6 }, 1.8)
      .to(descs[0], { ...SHOWN, duration: 0.6 }, 2.4);

    let t = 3.6;
    for (let i = 1; i < steps; i++) {
      tl.to([labels[i - 1], descs[i - 1]], { ...GONE, duration: 0.5, ease: 'power2.in' }, t)
        .to(dots.filter((_, d) => filled[i - 1].includes(d) && !filled[i].includes(d)),
          { fillOpacity: 0, duration: 1, stagger: 0.25, ease: 'power1.inOut' }, t + 0.4)
        .to(labels[i], { ...SHOWN, duration: 0.6 }, t + 1.4)
        .to(descs[i], { ...SHOWN, duration: 0.6 }, t + 1.9);
      t += 3.4;
    }
    tl.to({}, { duration: 3.5 }); // hold the last step long enough to read it
  })();

  /* ---------- Page background: white -> black (s3) -> white (s4) ---------- */
  // --page-bg follows the same fade, for backgrounds that must match the page (the pinned square's backing on phones)
  const bgTo = (trigger, start, end, from, to) => {
    const scrollTrigger = { trigger, start, end, scrub: true };
    gsap.fromTo(document.body, { backgroundColor: from }, { backgroundColor: to, ease: 'none', immediateRender: false, scrollTrigger });
    gsap.fromTo(document.documentElement, { '--page-bg': from }, { '--page-bg': to, ease: 'none', immediateRender: false, scrollTrigger: { ...scrollTrigger } });
  };
  bgTo('.s3', 'top 85%', 'top 15%', '#f3f3f3', '#050505');
  // section 02 has its own background (it covers section 01), so it fades with the page — no visible edge
  gsap.fromTo('.s2', { backgroundColor: '#f3f3f3' }, {
    backgroundColor: '#050505', ease: 'none', immediateRender: false,
    scrollTrigger: { trigger: '.s3', start: 'top 85%', end: 'top 15%', scrub: true },
  });
  gsap.to('.s2__sticky', {
    autoAlpha: 0, filter: 'blur(10px)', ease: 'none',
    scrollTrigger: { trigger: '.s3', start: 'top 95%', end: 'top 40%', scrub: true },
  });
  bgTo('.s4', 'top 95%', 'top 35%', '#050505', '#f3f3f3');

  /* ---------- Section 03: 1 + 2 = 3 ---------- */
  (() => {
    const section = document.querySelector('.s3');
    const head = section.querySelectorAll('.s3__head > *');
    const cta = section.querySelector('.s3__cta');
    const seq = section.querySelectorAll('.s3__equation > *');
    const lines = section.querySelector('.s3__lines');
    const eq = section.querySelector('.s3__op--eq');
    const glow = section.querySelector('.s3__glow');
    const result = seq[seq.length - 1];

    gsap.set([...head, ...seq, cta], HIDDEN);
    gsap.set(lines, { autoAlpha: 0, scale: 0.6, svgOrigin: '64 64' }); // grows from the middle dot
    gsap.set(glow, { autoAlpha: 0, scale: 0.5 });

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: { trigger: section, start: 'top 10%', end: 'bottom bottom', scrub: 0.8 },
    });
    tl.to(head, { ...SHOWN, duration: 0.8, stagger: 0.2 }, 0);
    seq.forEach((el, i) => tl.to(el, { ...SHOWN, x: 0, duration: 0.6 }, 1.6 + i * 0.7));
    const end = 1.6 + seq.length * 0.7;
    tl.to(lines, { autoAlpha: 1, scale: 1, svgOrigin: '64 64', duration: 0.6 }, end)
      // the result gets the weight: "=" turns white with a small pulse, then a glow opens behind the icon
      .to(eq, { color: '#f3f3f3', duration: 0.5 }, end + 0.2)
      .to(eq, { scale: 1.15, duration: 0.25, yoyo: true, repeat: 1, ease: 'power1.inOut' }, end + 0.2)
      // everything before the "=" fades back so only the result stands out
      .to([...seq].slice(0, -2), { opacity: 0.3, duration: 0.6, ease: 'power1.inOut' }, end + 0.2)
      .to(glow, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, end + 0.4)
      .to(result, { scale: 1.04, duration: 0.6, ease: 'power2.out' }, end + 0.4)
      // the call to action closes the reasoning, right after the result
      .to(cta, { ...SHOWN, duration: 0.6 }, end + 1.1)
      .to({}, { duration: 0.8 });
  })();

  /* ---------- Generic reveal (s5) ---------- */
  gsap.utils.toArray('.s5 .reveal').forEach((el) => {
    gsap.fromTo(el, HIDDEN, {
      ...SHOWN, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
    });
  });
  // section 04 reveals all its text at once, keyed to the section itself: its steps move as they open and close
  // (and the section pins on desktop), so per-item triggers could leave some of them hidden halfway through a scroll
  gsap.fromTo('.s4 .reveal', HIDDEN, {
    ...SHOWN, duration: 1, ease: 'power3.out', stagger: 0.08,
    scrollTrigger: { trigger: '.s4', start: 'top 70%', toggleActions: 'play none none reverse' },
  });

  /* ---------- Section 04 ---------- */
  gsap.fromTo('.s4__media', { autoAlpha: 0, scale: 0.94, filter: 'blur(12px)' }, {
    autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out',
    scrollTrigger: { trigger: '.s4', start: 'top 70%', toggleActions: 'play none none reverse' },
  });
  // Steps: numbered, joined by a line that fills up to the open one; the drawing on the left follows the step
  (() => {
    const list = document.querySelector('.accordion');
    const accs = [...list.querySelectorAll('.acc')];
    const svg = document.querySelector('.s4__art');
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
    const STEP_SHARE = [1.6, 1, 1, 0.5];
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
          if (window.scrollY < steps.start) scrollToY(steps.start + STEP_FROM[i] * (steps.end - steps.start) + 4, 1);
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
        trigger: '.s4', start: 'top top', end: '+=60%', pin: true,
        refreshPriority: 1, // laid out before the triggers further down the page
        onToggle: (self) => setPinned('s4', self.isActive),
      });
      return () => setPinned('s4', false);
    });
  })();

  /* ---------- Section 05: cards + animated symbols ---------- */
  (() => {
    const cards = gsap.utils.toArray('.card');
    const CARD_IN = { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' };
    gsap.matchMedia()
      // desktop: the three cards sit side by side and come in together
      .add('(min-width: 861px)', () => {
        gsap.fromTo(cards, { autoAlpha: 0, y: 60, filter: 'blur(10px)' }, {
          ...CARD_IN, stagger: 0.15,
          scrollTrigger: { trigger: '.s5__cards', start: 'top 85%', toggleActions: 'play none none reverse' },
        });
      })
      // phones: they are stacked, so each one comes in when it reaches the screen
      .add('(max-width: 860px)', () => {
        cards.forEach((card) => gsap.fromTo(card, { autoAlpha: 0, y: 60, filter: 'blur(10px)' }, {
          ...CARD_IN,
          scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
        }));
      });

    // Definição: one blurry circle comes into focus (the problem gets defined), holds, then blurs again
    const defBlur = document.querySelector('.def-blur-amount');
    const def = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.6, defaults: { ease: 'sine.inOut' } })
      .fromTo('.art-definicao svg', { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.8, transformOrigin: '50% 50%' })
      .fromTo(defBlur, { attr: { stdDeviation: 5 } }, { attr: { stdDeviation: 0 }, duration: 1.8 }, 0.5)
      .to('.def-circle', { scale: 1.06, svgOrigin: '41.2308 41.2308', duration: 0.5, yoyo: true, repeat: 1 }, 2.3)
      .to({}, { duration: 1.4 })
      .to(defBlur, { attr: { stdDeviation: 5 }, duration: 1.4 })
      .to('.art-definicao svg', { autoAlpha: 0, duration: 0.5 }, '-=0.4');

    // Clareza: picks up where Definição ends, so the outlined circle is always there; only the fill comes and goes
    gsap.set('.cla-fill', { scale: 0, svgOrigin: '32.2308 32.2308' }); // empty until its turn, not full
    const cla = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.2, defaults: { ease: 'power2.inOut' } })
      .set('.cla-fill', { autoAlpha: 1, scale: 0, svgOrigin: '32.2308 32.2308' })
      .to('.cla-fill', { scale: 1, svgOrigin: '32.2308 32.2308', duration: 0.9, ease: 'power3.out' }, 0.6)
      .to({}, { duration: 1.6 })
      .to('.cla-fill', { autoAlpha: 0, duration: 0.6, ease: 'power1.in' });

    // Síntese: one ball starts big on the left with the beam tipped its way; it shrinks and rolls right
    // while the beam swings, and ends small with the beam tipped to the right (the ball always rests on the beam)
    const O = '122 82.25'; // the pivot's tip
    const sin = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.8, defaults: { ease: 'power2.inOut' } })
      .set('.sin-beam', { rotation: -12, svgOrigin: O })
      .set('.sin-ball', { attr: { cx: 33, cy: 50.75, r: 31 } })
      .fromTo('.sin-pivot', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35 })
      .fromTo('.sin-beam', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 }, 0.05)
      .to('.sin-ball', { attr: { cx: 233, cy: 73.75, r: 8 }, duration: 2.6, ease: 'power1.inOut' }, 0.45) // rolls almost at once
      .to('.sin-beam', { rotation: 12, svgOrigin: O, duration: 2.6 }, '<')
      .to({}, { duration: 1.6 })
      .to(['.sin-beam', '.sin-pivot'], { autoAlpha: 0, duration: 0.6, ease: 'power1.in' });

    // each drawing starts from the beginning only once it is well inside the screen (on phones the cards are stacked,
    // so keying this to the card's top made the animation run ahead, out of sight)
    [def, cla, sin].forEach((tl, i) => {
      ScrollTrigger.create({
        trigger: cards[i].querySelector('.card__art'),
        start: 'center 75%',
        end: 'bottom top',
        onEnter: () => tl.play(0),
        onEnterBack: () => tl.play(),
        onLeave: () => tl.pause(),
        onLeaveBack: () => tl.pause(0),
      });
    });

    // desktop: the same short hold as section 04
    gsap.matchMedia().add('(min-width: 861px)', () => {
      ScrollTrigger.create({
        trigger: '.s5', start: 'top top', end: '+=60%', pin: true,
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
      errorEl.textContent = 'Não foi possível enviar agora. Verifique sua conexão e tente novamente.';
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
      label.textContent = 'Copiado';
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
