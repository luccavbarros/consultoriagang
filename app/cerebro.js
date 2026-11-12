/* Carrega o cérebro da GANG (respostas prontas e biblioteca de ações) só para consultores logados.
   É síncrono de propósito: os scripts do painel que vêm depois já encontram window.GangPresets pronto. */
(function () {
  try {
    let token = null;
    for (let i = 0; i < localStorage.length; i += 1) {
      const k = localStorage.key(i);
      if (/^sb-.+-auth-token$/.test(k)) { const s = JSON.parse(localStorage.getItem(k) || 'null'); token = s && (s.access_token || (s.currentSession && s.currentSession.access_token)); }
    }
    if (!token) return;
    const x = new XMLHttpRequest();
    x.open('GET', '/api/cerebro', false);
    x.setRequestHeader('Authorization', 'Bearer ' + token);
    x.send();
    if (x.status !== 200) return;
    const s = document.createElement('script');
    s.text = x.responseText;
    document.head.appendChild(s);
  } catch (e) { /* sem o cérebro, as listas ficam vazias e o resto do painel funciona */ }
})();
