/* Entrada na plataforma depois do login.
   No login: a tela escurece, a frase de boas-vindas surge letra por letra (subindo, como na referência), sai e a página troca.
   Na área do cliente ou do consultor: começa preta e o preto some em fade-out quando a tela já está montada. */
(function () {
  const FRASE = 'Seja bem-vindo à sua plataforma de marca.';
  const CHAVE = 'gang-entrada';
  const calmo = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = `
  .gx{position:fixed;inset:0;z-index:2147483000;background:#000;visibility:visible;display:grid;place-items:center;padding:24px;opacity:0;transition:opacity .6s ease;pointer-events:all}
  .gx.is-on{opacity:1}
  .gx.is-saindo{opacity:0;transition:opacity .9s ease}
  .gx__f{margin:0;max-width:min(92vw,720px);text-align:center;font:500 clamp(18px,2.1vw,24px)/1.35 "Inter",-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;letter-spacing:-.01em;color:#f3f3f3}
  .gx__p{display:inline-block;white-space:nowrap}
  .gx__l{display:inline-block;opacity:0;transform:translateY(.5em);filter:blur(3px);transition:opacity .5s cubic-bezier(.2,.7,.2,1),transform .5s cubic-bezier(.2,.7,.2,1),filter .5s ease}
  .gx__l.is-in{opacity:1;transform:none;filter:none}
  .gx__l.is-out{opacity:0;transform:translateY(-.5em);filter:blur(3px);transition-duration:.4s}`;
  const estilo = () => { if (document.getElementById('gx-css')) return; const s = document.createElement('style'); s.id = 'gx-css'; s.textContent = css; (document.head || document.documentElement).appendChild(s); };
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));

  // no login: toca a animação inteira e só depois resolve (aí a página troca)
  const tocar = async () => {
    estilo();
    const ov = document.createElement('div'); ov.className = 'gx'; ov.setAttribute('role', 'status'); ov.setAttribute('aria-live', 'polite');
    const f = document.createElement('p'); f.className = 'gx__f'; f.setAttribute('aria-label', FRASE);
    const letras = [];
    FRASE.split(' ').forEach((pal, i, arr) => {
      const w = document.createElement('span'); w.className = 'gx__p'; w.setAttribute('aria-hidden', 'true');
      [...pal].forEach((c) => { const l = document.createElement('span'); l.className = 'gx__l'; l.textContent = c; w.appendChild(l); letras.push(l); });
      f.appendChild(w); if (i < arr.length - 1) f.appendChild(document.createTextNode(' '));
    });
    ov.appendChild(f); document.body.appendChild(ov);
    void ov.offsetWidth; ov.classList.add('is-on');
    await espera(650);
    if (calmo) { letras.forEach((l) => l.classList.add('is-in')); await espera(1200); }
    else {
      letras.forEach((l, i) => setTimeout(() => l.classList.add('is-in'), i * 24));
      await espera(letras.length * 24 + 500 + 900);
      letras.forEach((l, i) => setTimeout(() => l.classList.add('is-out'), i * 10));
      await espera(letras.length * 10 + 420);
    }
    try { sessionStorage.setItem(CHAVE, '1'); } catch (e) { /* sem sessionStorage, a próxima tela só não começa preta */ }
  };

  // na área logada: se veio do login, começa preta e clareia quando a tela estiver pronta
  const revelar = () => {
    let veio = false;
    try { veio = sessionStorage.getItem(CHAVE) === '1'; sessionStorage.removeItem(CHAVE); } catch (e) { veio = false; }
    if (!veio) return;
    estilo();
    const ov = document.createElement('div'); ov.className = 'gx is-on'; ov.style.transition = 'none';
    document.documentElement.appendChild(ov);
    const pronta = () => document.documentElement.classList.contains('is-ready')
      && document.querySelector('.screen, #pane-title:not(:empty), .admin-main .app-section:not([hidden]), .portal-empty');
    const inicio = Date.now();
    const tenta = () => {
      if (!(pronta() || Date.now() - inicio > 5000)) return setTimeout(tenta, 80);
      setTimeout(() => {
        ov.style.transition = '';
        ov.classList.add('is-saindo');
        setTimeout(() => { ov.remove(); limpa(); }, 1000);
      }, 150);
    };
    // fica fora do <body>: enquanto a página confere o login, o body fica escondido, e o preto não pode sumir junto (era a piscada cinza)
    document.documentElement.style.backgroundColor = '#000';
    const limpa = () => { document.documentElement.style.backgroundColor = ''; };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tenta);
    else tenta();
  };

  window.GangEntrada = { tocar };
  if (!/login(\.html)?$/.test(location.pathname)) revelar();
})();
