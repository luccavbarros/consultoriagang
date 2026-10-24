/* GANG — Landing page interactions */
(() => {
  'use strict';

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mdeekqkp';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gsap.registerPlugin(ScrollTrigger);

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
    const fix = () => {
      blocks.forEach((el) => {
        const nodes = textNodes(el);
        nodes.forEach((n) => {
          if (!original.has(n)) original.set(n, n.data);
          let t = original.get(n), prev;
          do { prev = t; t = t.replace(SHORT, `$1$2${NBSP}`); } while (t !== prev);
          n.data = t;
        });
        // hidden form steps report 0: use the nearest ancestor that has a width
        let box = el;
        while (box && !box.clientWidth) box = box.parentElement;
        const width = box ? box.clientWidth : 0;
        if (!width) return;
        // words are split on plain spaces only; ones already joined by NBSP count as one chunk
        const last = nodes.reverse().find((n) => /[^ \n] +[^ \n]/.test(n.data.trimEnd()));
        if (!last) return;
        const m = last.data.trimEnd().match(/([^ \n]+) +([^ \n]+)$/);
        if (!m) return;
        const cs = getComputedStyle(el);
        ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
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

  /* ---------- Smooth scroll (Lenis) ---------- */
  const lenis = new Lenis({ lerp: reduceMotion ? 1 : 0.08, smoothWheel: true, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  window.lenis = lenis;
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href="#top"]').forEach((a) =>
    a.addEventListener('click', (e) => { e.preventDefault(); lenis.scrollTo(0, { duration: 1.6 }); })
  );

  // Shared blur-in / blur-out states
  const HIDDEN = { autoAlpha: 0, filter: 'blur(14px)', y: 28 };
  const SHOWN = { autoAlpha: 1, filter: 'blur(0px)', y: 0 };
  const GONE = { autoAlpha: 0, filter: 'blur(14px)', y: -28 };

  /* ---------- Hero ---------- */
  const hero = document.querySelector('.hero');
  gsap.from('.hero__title .line, .hero__sub, .hero__cta', {
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
      if (!desktop.matches) return sticky.style.removeProperty('--s2-lift');
      const vh = window.innerHeight;
      const headBottom = headEl.offsetTop + headEl.offsetHeight;
      // screen center, but never closer than 96px between the subtitle and the 208px box
      const centerY = Math.max(vh / 2, headBottom + 96 + 104);
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
  const bgTo = (trigger, start, end, from, to) =>
    gsap.fromTo(document.body, { backgroundColor: from }, {
      backgroundColor: to, ease: 'none', immediateRender: false,
      scrollTrigger: { trigger, start, end, scrub: true },
    });
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
    const seq = section.querySelectorAll('.s3__equation > *');
    const lines = section.querySelector('.s3__lines');
    const eq = section.querySelector('.s3__op--eq');
    const glow = section.querySelector('.s3__glow');
    const result = seq[seq.length - 1];

    gsap.set([...head, ...seq], HIDDEN);
    gsap.set(lines, { autoAlpha: 0, scale: 0.6 });
    gsap.set(glow, { autoAlpha: 0, scale: 0.5 });

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: { trigger: section, start: 'top 10%', end: 'bottom bottom', scrub: 0.8 },
    });
    tl.to(head, { ...SHOWN, duration: 0.8, stagger: 0.2 }, 0);
    seq.forEach((el, i) => tl.to(el, { ...SHOWN, x: 0, duration: 0.6 }, 1.6 + i * 0.7));
    const end = 1.6 + seq.length * 0.7;
    tl.to(lines, { autoAlpha: 1, scale: 1, duration: 0.6 }, end)
      // the result gets the weight: "=" turns white with a small pulse, then a glow opens behind the icon
      .to(eq, { color: '#f3f3f3', duration: 0.5 }, end + 0.2)
      .to(eq, { scale: 1.15, duration: 0.25, yoyo: true, repeat: 1, ease: 'power1.inOut' }, end + 0.2)
      // everything before the "=" fades back so only the result stands out
      .to([...seq].slice(0, -2), { opacity: 0.3, duration: 0.6, ease: 'power1.inOut' }, end + 0.2)
      .to(glow, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, end + 0.4)
      .to(result, { scale: 1.04, duration: 0.6, ease: 'power2.out' }, end + 0.4)
      .to({}, { duration: 0.8 });
  })();

  /* ---------- Generic reveal (s4, s5) ---------- */
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.fromTo(el, HIDDEN, {
      ...SHOWN, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
    });
  });

  /* ---------- Section 04 ---------- */
  gsap.fromTo('.s4__media', { autoAlpha: 0, scale: 0.94, filter: 'blur(12px)' }, {
    autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out',
    scrollTrigger: { trigger: '.s4', start: 'top 70%', toggleActions: 'play none none reverse' },
  });
  gsap.fromTo('.s4__media img', { yPercent: -12 }, {
    yPercent: 0, ease: 'none',
    scrollTrigger: { trigger: '.s4__media', start: 'top bottom', end: 'bottom top', scrub: true },
  });

  const accs = document.querySelectorAll('.acc');
  accs.forEach((acc) => {
    acc.querySelector('.acc__btn').addEventListener('click', () => {
      const willOpen = !acc.classList.contains('is-open');
      accs.forEach((a) => {
        a.classList.remove('is-open');
        a.querySelector('.acc__btn').setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        acc.classList.add('is-open');
        acc.querySelector('.acc__btn').setAttribute('aria-expanded', 'true');
      }
      setTimeout(() => ScrollTrigger.refresh(), 650);
    });
  });

  /* ---------- Section 05: cards + animated symbols ---------- */
  (() => {
    const cards = gsap.utils.toArray('.card');
    gsap.fromTo(cards, { autoAlpha: 0, y: 60, filter: 'blur(10px)' }, {
      autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out', stagger: 0.15,
      scrollTrigger: { trigger: '.s5__cards', start: 'top 85%', toggleActions: 'play none none reverse' },
    });

    // Definição: the blurry circle comes into focus, then drifts out again
    const defBlur = document.querySelector('.def-blur-amount');
    const def = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.6, defaults: { ease: 'sine.inOut' } })
      .fromTo('.art-definicao svg', { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.8, transformOrigin: '50% 50%' })
      .to(defBlur, { attr: { stdDeviation: 0 }, duration: 1.6 }, 0.4)
      .to('.def-blur', { x: 16, duration: 1.6 }, 0.4)
      .to('.def-sharp', { scale: 1.06, svgOrigin: '135.7 41.2', duration: 0.5, yoyo: true, repeat: 1 }, 1.7)
      .to(defBlur, { attr: { stdDeviation: 5 }, duration: 1.4 }, 3)
      .to('.def-blur', { x: 0, duration: 1.4 }, 3)
      .to('.art-definicao svg', { autoAlpha: 1, duration: 0.6 });

    // Clareza: outline draws itself, filled circle grows in
    const ring = document.querySelector('.cla-ring');
    const ringLen = ring.getTotalLength();
    gsap.set(ring, { strokeDasharray: ringLen });
    const cla = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.4, defaults: { ease: 'power2.inOut' } })
      .fromTo(ring, { strokeDashoffset: ringLen }, { strokeDashoffset: 0, duration: 1.4 })
      .fromTo('.cla-fill', { scale: 0, svgOrigin: '125.7 31.2' }, { scale: 1, svgOrigin: '125.7 31.2', duration: 0.9, ease: 'back.out(1.7)' }, 0.9)
      .to({}, { duration: 1.6 })
      .to(ring, { strokeDashoffset: -ringLen, duration: 1 })
      .to('.cla-fill', { scale: 0, duration: 0.6, ease: 'power2.in' }, '<0.2');

    // Síntese: the seesaw finds its balance
    const sin = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.8, defaults: { ease: 'power2.inOut' } })
      .fromTo('.sin-pivot', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5 })
      .fromTo('.sin-beam', { rotation: 4, svgOrigin: '122 82.25', autoAlpha: 0 }, { rotation: 0, svgOrigin: '122 82.25', autoAlpha: 1, duration: 0.7 }, 0.2)
      .to('.sin-beam', { rotation: -12.1, svgOrigin: '122 82.25', duration: 1.6, ease: 'elastic.out(1, 0.55)' }, '+=0.6')
      .to('.sin-beam', { rotation: 0, svgOrigin: '122 82.25', duration: 1.2 }, '+=1.6')
      .to('.sin-pivot', { autoAlpha: 1, duration: 0.01 });

    [def, cla, sin].forEach((tl, i) => {
      ScrollTrigger.create({
        trigger: cards[i],
        start: 'top 85%',
        end: 'bottom top',
        onEnter: () => tl.play(0),
        onEnterBack: () => tl.play(),
        onLeave: () => tl.pause(),
        onLeaveBack: () => tl.pause(0),
      });
    });
  })();

  /* ---------- Footer: revealed from behind ---------- */
  gsap.fromTo('.footer__inner', { yPercent: -30 }, {
    yPercent: 0, ease: 'none',
    scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true },
  });
  gsap.fromTo('.s5', { boxShadow: '0 40px 80px rgba(0,0,0,0)' }, {
    boxShadow: '0 40px 80px rgba(0,0,0,.25)', ease: 'none',
    scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'top 50%', scrub: true },
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

  const openForm = () => {
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
