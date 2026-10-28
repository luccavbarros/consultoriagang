/* GANG — English version of the site (button "EN-US" in the header, desktop)
   The page is written in Portuguese; this swaps each piece of text for its English version and back.
   Each line below is one piece of text exactly as it is in the HTML (pieces split by a line break or a link are separate lines).
   When a Portuguese text changes in index.html, change it here too, or that piece stays in Portuguese in the English version.
   \n in an English text is a line break. */
(() => {
  'use strict';

  const EN = {
    // header
    'Consultoria': 'Brand',
    'de Marca': 'Consulting',
    'Login': 'Login',
    'Estou Interessado': 'I\'m Interested',

    // hero
    'Venda mais.': 'Sell more.',
    'Para mais pessoas.': 'To more people.',
    'Com mais valor.': 'For more value.',
    'Estratégia e construção de marca com clareza, consistência': 'Brand strategy and building with clarity, consistency',
    'e profissionalismo para tornar seu negócio mais lucrativo.': 'and professionalism to make your business more profitable.',
    'Sem compromisso · Resposta em até 1 dia útil': 'No commitment · Reply within 1 business day',

    // section 01
    'Por que você está aqui': 'Why you\'re here',
    'Sua marca não é compreendida.': 'Your brand isn\'t understood.',
    'E o motivo é simples:': 'And the reason is simple:',
    'ninguém faz exatamente o que você faz.': 'no one does exactly what you do.',
    'Você está construindo algo melhor.': 'You\'re building something better.',
    'Sua marca deveria vender mais.': 'Your brand should be selling more.',
    'Mas não está.': 'But it isn\'t.',
    'Ainda.': 'Yet.',
    'Encontre seu ponto ideal': 'Find your\nsweet spot',
    'Fazemos sua marca': 'We make your brand',
    'ser compreendida com clareza.': 'clearly understood.',
    'Uma estratégia clara e consistente.': 'A clear, consistent strategy.',
    'Campanhas que contam sua história.': 'Campaigns that tell your story.',
    'Valorizando seus pontos fortes,': 'Highlighting your strengths,',
    'transformando percepções negativas.': 'turning negative perceptions around.',
    'Simples assim.': 'Simple as that.',
    'O que': 'What',
    'você quer': 'you want',
    'Uma reputação que seus concorrentes admiram.': 'A reputation your competitors admire.',
    'Clientes que reconhecem o seu valor.': 'Customers who recognize your value.',
    'Que escolhem sua marca em vez das outras.': 'Who choose your brand over the others.',
    'E que pagam mais pelo que você oferece,': 'And who pay more for what you offer,',
    'sem hesitar.': 'without hesitation.',
    'É isso que você quer.': 'That\'s what you want.',

    // section 02
    'Por que você': 'Why you',
    'precisa de ajuda': 'need help',
    'Porque sua marca não está comunicando': 'Because your brand isn\'t communicating',
    'o que realmente tem a oferecer.': 'what it really has to offer.',
    'O que você': 'What you',
    'enxerga': 'see',
    'comunica': 'say',
    'O que as': 'What',
    'pessoas': 'people',
    'ouvem': 'hear',
    'O que elas': 'What they',
    'entendem': 'get',
    'Tudo,': 'Everything,',
    'com absoluta clareza.': 'with absolute clarity.',
    'Quase tudo, mas': 'Almost everything, but',
    'sem a mesma clareza.': 'not as clearly.',
    'Apenas uma parte,': 'Only part of it,',
    'de forma confusa.': 'in a confusing way.',
    'Muito menos': 'Much less',
    'do que você gostaria.': 'than you\'d like.',

    // section 03
    'De quem': 'Who',
    'você precisa': 'you need',
    'De quem conecte todas as peças e faça com que': 'Someone who connects all the pieces and makes',
    'as outras pessoas enxerguem o mesmo que você.': 'other people see what you see.',
    'Coordenador': 'Coordinator',
    'Enxerga sua parte do cenário.': 'Sees their part of the picture.',
    'Consultor': 'Consultant',
    'Enxerga': 'Sees',
    'o cenário completo.': 'the whole picture.',
    'Consultor de marca': 'Brand consultant',
    'Compreende': 'Understands',

    // section 04
    'O que fazemos': 'What we do',
    'Aplicamos estratégia de marca ao seu marketing para que as pessoas compreendam o valor do que sua empresa oferece.': 'We apply brand strategy to your marketing so people understand the value of what your company offers.',
    'Diagnóstico': 'Diagnosis',
    'Entenda seu mercado': 'Understand your market',
    'Uma análise para entender como as pessoas percebem sua marca, como ela se posiciona diante dos concorrentes e onde estão as oportunidades de crescimento.': 'An analysis of how people perceive your brand, how it stands against competitors and where the growth opportunities are.',
    'Estratégia': 'Strategy',
    'Um plano claro para crescer': 'A clear plan to grow',
    'Objetivos estratégicos bem definidos, com resultados mensuráveis. Você sabe aonde sua marca precisa chegar e quais caminhos seguir.': 'Well-defined strategic goals with measurable results. You know where your brand needs to go and which paths to take.',
    'Narrativa': 'Narrative',
    'Uma mensagem que conecta': 'A message that connects',
    'Definimos como sua marca se comunica, o que precisa dizer e o tom de voz adequado para transmitir seu valor e criar conexões com as pessoas.': 'We define how your brand communicates, what it needs to say and the right tone of voice to convey its value and connect with people.',
    'Design': 'Design',
    'Uma identidade para ser lembrada': 'An identity to remember',
    'Transformamos a estratégia em uma identidade visual distintiva, com elementos que tornam sua marca fácil de identificar e consistente em suas aplicações.': 'We turn the strategy into a distinctive visual identity, with elements that make your brand easy to recognize and consistent wherever it appears.',

    // section 05
    'você recebe': 'you get',
    'Um plano de marca que mostra exatamente': 'A brand plan that shows exactly',
    'o que fazer para alcançar seus objetivos.': 'what to do to reach your goals.',
    'Sem complicações, sem excessos.': 'No complications, no excess.',
    'Definição': 'Definition',
    'Identifique o problema': 'Identify the problem',
    'Elimine as dúvidas e incertezas que dificultam suas decisões de marketing.': 'Remove the doubts and uncertainty that make your marketing decisions harder.',
    'Clareza': 'Clarity',
    'Entenda o problema': 'Understand the problem',
    'Saiba exatamente o que é importante para sua marca e o que não é.': 'Know exactly what matters for your brand\nand what doesn\'t.', // two lines, like the other cards
    'Síntese': 'Synthesis',
    'Resolva o problema': 'Solve the problem',
    'Tudo para orientar o crescimento da sua marca com clareza e objetividade.': 'Everything to guide your brand\'s growth with clarity and focus.',

    // footer
    'Vamos': 'Let\'s',
    'conversar?': 'talk?',
    'Prefere Agora?': 'Prefer now?',
    'Chame no WhatsApp': 'Message us on WhatsApp',
    'A GANG é uma consultoria de marca que une estratégia e design para ajudar empresas a vender mais, para mais pessoas e com mais valor.': 'GANG is a brand consultancy that combines strategy and design to help companies sell more, to more people and for more value.',
    'Desenvolvemos marcas claras, reconhecíveis e competitivas.': 'We build clear, recognizable and competitive brands.',
    'Nosso método parte do entendimento do negócio, do mercado e das pessoas para definir um posicionamento, construir uma narrativa e desenvolver uma identidade visual consistente.': 'Our method starts from understanding the business, the market and the people to define a positioning, build a narrative and develop a consistent visual identity.',
    'Somos especializados em pequenas e médias empresas que querem conquistar mais espaço no mercado e transformar o valor de suas marcas em resultados para o negócio.': 'We specialize in small and mid-sized companies that want to win more market share and turn the value of their brands into business results.',
    'Consultoria de Marca': 'Brand Consulting',
    'Todos os direitos reservados. © 2026': 'All rights reserved. © 2026',
    'Política de Privacidade': 'Privacy Policy',
    'Copiado': 'Copied',

    // form
    'Este formulário é para profissionais e empresários que estão prontos para agir, investir no crescimento e acelerar os resultados.': 'This form is for professionals and business owners who are ready to act, invest in growth and speed up results.',
    'Não é para quem ainda não está pronto para o próximo passo.': 'It isn\'t for those who aren\'t ready for the next step yet.',
    'Nome': 'Name',
    'E-mail': 'Email',
    'Ao continuar, você concorda com a nossa': 'By continuing, you agree to our',
    'Obrigado!': 'Thank you!',
    'Agora precisamos de algumas informações básicas sobre a empresa.': 'Now we need some basic information about the company.',
    'Qual o nome da empresa?': 'What\'s the company name?',
    'Quantos funcionários a empresa tem?': 'How many employees does the company have?',
    'Menos de 10': 'Fewer than 10',
    'Excelente!': 'Excellent!',
    'Agora precisamos entender melhor o seu desafio.': 'Now we need to better understand your challenge.',
    'Quais problemas você está procurando resolver com a GANG?': 'What problems are you looking to solve with GANG?',
    'Selecione uma ou mais opções.': 'Select one or more options.',
    'Perdendo clientes para concorrentes': 'Losing customers to competitors',
    'Marca não acompanha o crescimento': 'Brand isn\'t keeping up with growth',
    'Precisamos explicar muito o que fazemos': 'We have to explain a lot about what we do',
    'Outro': 'Other',
    'Qual o seu cargo na empresa?': 'What\'s your role in the company?',
    'Sócio(a) / Fundador(a)': 'Partner / Founder',
    'Diretor(a) / C-Level': 'Director / C-Level',
    'Gerente / Head': 'Manager / Head',
    'Para finalizar...': 'To wrap up...',
    'Agora precisamos alinhar investimento e prazo.': 'Now we need to align budget and timing.',
    'Em que nível de investimento você se encaixa?': 'Which investment range fits you?',
    'Quando você pretende começar?': 'When do you plan to start?',
    'Agora': 'Now',
    'Próximos 30 dias': 'Next 30 days',
    'Próximos 3 meses': 'Next 3 months',
    'Obrigado por compartilhar as informações!': 'Thanks for sharing your information!',
    'Valorizamos sua contribuição. Um membro da equipe GANG entrará em contato em breve para discutir como podemos ajudar sua empresa.': 'We appreciate it. A member of the GANG team will reach out soon to discuss how we can help your company.',
    'Não foi possível enviar agora. Verifique sua conexão e tente novamente.': 'We couldn\'t send it right now. Check your connection and try again.',

    // privacy policy
    'Política de': 'Privacy',
    'Privacidade': 'Policy',
    'Atualizada em 26 de outubro de 2026.': 'Updated October 26, 2026.',
    'Esta política explica quais dados pessoais a GANG coleta neste site, por que coleta e como você pode exercer seus direitos, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).': 'This policy explains which personal data GANG collects on this site, why, and how you can exercise your rights under Brazil\'s General Data Protection Law (Law No. 13,709/2018 — LGPD).',
    '1. Quem somos': '1. Who we are',
    'A GANG Consultoria de Marca, com endereço na Av. Cerro Azul, 184 - Sl 05, Maringá-PR, é a responsável pelos dados pessoais coletados neste site. Contato:': 'GANG Consultoria de Marca, located at Av. Cerro Azul, 184 - Sl 05, Maringá-PR, Brazil, is responsible for the personal data collected on this site. Contact:',
    '2. Quais dados coletamos': '2. What data we collect',
    'Dados que você informa no formulário:': 'Data you provide in the form:',
    'nome, WhatsApp, e-mail, nome da empresa, número de funcionários, desafios da marca, cargo, faixa de investimento e prazo.': 'name, WhatsApp, email, company name, number of employees, brand challenges, role, investment range and timing.',
    'Dados de navegação:': 'Browsing data:',
    'somente se você aceitar os cookies, coletamos informações como páginas visitadas, tipo de dispositivo e interações no site, por meio do Pixel da Meta.': 'only if you accept cookies, we collect information such as pages visited, device type and interactions on the site, through the Meta Pixel.',
    '3. Para que usamos seus dados': '3. How we use your data',
    'Entrar em contato com você sobre o seu interesse nos nossos serviços;': 'To contact you about your interest in our services;',
    'Entender o momento da sua empresa e preparar a conversa;': 'To understand where your company is and prepare the conversation;',
    'Medir e melhorar nossos anúncios, apenas com o seu consentimento.': 'To measure and improve our ads, only with your consent.',
    '4. Com quem compartilhamos': '4. Who we share it with',
    'Não vendemos nem alugamos seus dados. Eles são tratados apenas por fornecedores necessários para o funcionamento do site: o Formspree, que recebe as respostas do formulário, e a Meta, que fornece o Pixel, quando você aceita os cookies. Esses fornecedores podem armazenar dados em servidores fora do Brasil, seguindo as garantias previstas na LGPD.': 'We don\'t sell or rent your data. It is handled only by providers the site needs to work: Formspree, which receives the form answers, and Meta, which provides the Pixel when you accept cookies. These providers may store data on servers outside Brazil, under the safeguards set out in the LGPD.',
    '5. Cookies': '5. Cookies',
    'Usamos cookies de medição e publicidade apenas se você clicar em “Aceitar” no aviso de cookies. Se recusar, eles não são ativados e o site funciona normalmente. Para mudar sua escolha, apague os dados de navegação deste site no seu navegador e o aviso aparecerá novamente.': 'We use measurement and advertising cookies only if you click “Accept” on the cookie notice. If you decline, they are not turned on and the site works normally. To change your choice, clear this site\'s browsing data in your browser and the notice will appear again.',
    '6. Por quanto tempo guardamos': '6. How long we keep it',
    'Mantemos seus dados pelo tempo necessário para o atendimento e a relação comercial, ou pelo prazo exigido por lei. Depois disso, eles são excluídos.': 'We keep your data for as long as needed to serve you and for the business relationship, or for the period required by law. After that, it is deleted.',
    '7. Seus direitos': '7. Your rights',
    'Você pode, a qualquer momento, pedir para confirmar se tratamos seus dados, acessá-los, corrigi-los, excluí-los ou revogar o seu consentimento. Basta enviar um e-mail para': 'At any time, you can ask us to confirm whether we process your data, access it, correct it, delete it or withdraw your consent. Just send an email to',
    ', falar com a gente pelo Instagram,': ', reach us on Instagram,',
    ', ou escrever para o endereço acima.': ', or write to the address above.',
    '8. Segurança': '8. Security',
    'Adotamos medidas técnicas e administrativas para proteger seus dados contra acessos não autorizados, perda ou uso indevido.': 'We take technical and administrative measures to protect your data against unauthorized access, loss or misuse.',
    '9. Alterações': '9. Changes',
    'Esta política pode ser atualizada. A versão vigente estará sempre disponível neste site, com a data da última atualização.': 'This policy may be updated. The current version will always be available on this site, with the date of the last update.',

    // cookie notice
    'Usamos cookies para melhorar sua experiência e nossos anúncios.': 'We use cookies to improve your experience and our ads.',
    'Saiba mais': 'Learn more',
    'Recusar': 'Decline',
    'Aceitar': 'Accept',

    // labels read by screen readers, image descriptions and field hints
    'GANG — início': 'GANG — home',
    'Instagram da GANG': 'GANG on Instagram',
    'LinkedIn da GANG': 'GANG on LinkedIn',
    'Projetos': 'Projects',
    'Projeto de marca da GANG': 'A GANG brand project',
    'Brandbook de um projeto de marca da GANG': 'Brandbook from a GANG brand project',
    'GANG — voltar ao topo': 'GANG — back to top',
    'Copiar e-mail contato@gangconsultoria.com.br': 'Copy email contato@gangconsultoria.com.br',
    'Fechar formulário': 'Close form',
    'Seu nome completo': 'Your full name',
    'Seu melhor e-mail': 'Your best email',
    'Nome da empresa': 'Company name',
    'Conte qual (opcional)': 'Tell us which (optional)',
    'Qual o seu cargo? (opcional)': 'What\'s your role? (optional)',
    'Voltar': 'Back',
    'Próxima etapa': 'Next step',
    'Fechar Política de Privacidade': 'Close Privacy Policy',
    'Aviso de cookies': 'Cookie notice',

    // tab title and search description
    'GANG — Consultoria de Marca': 'GANG — Brand Consulting',
  };
  // "Projeto de marca ZIVIZ" and the like: only the start changes
  const pattern = [[/^Projeto de marca (.+)$/, 'Brand project for $1'], [/^Brand project for (.+)$/, 'Projeto de marca $1', true]];

  const PT = Object.fromEntries(Object.entries(EN).map(([pt, en]) => [en, pt]));
  const KEY = 'gang-lang';
  const root = document.documentElement;
  const ATTRS = ['aria-label', 'alt', 'placeholder', 'title'];
  const description = document.querySelector('meta[name="description"]');
  const descriptionPT = description ? description.content : '';
  const DESCRIPTION_EN = 'Brand strategy and building with clarity, consistency and professionalism to make your business more profitable.';

  let lang = 'pt';
  try { if (localStorage.getItem(KEY) === 'en') lang = 'en'; } catch (e) { /* private mode: stays in Portuguese */ }

  // one piece of text in the language asked for; the spaces around it and anything unknown stay as they are
  // (the typography script glues short words with non-breaking spaces, so those count as plain spaces here)
  const swap = (value, to) => {
    const m = value.match(/^(\s*)([\s\S]*?)(\s*)$/);
    const core = m[2].replace(/ /g, ' ').replace(/\s+/g, ' ');
    if (!core) return value;
    let out = to === 'en' ? EN[core] : PT[core];
    if (out === undefined) {
      const rule = pattern.find(([re, , back]) => !!back === (to === 'pt') && re.test(core));
      if (!rule) return value;
      out = core.replace(rule[0], rule[1]);
    }
    return m[1] + out + m[3];
  };

  const original = new WeakMap(); // text node → its Portuguese text
  const originalAttr = new WeakMap(); // element → its Portuguese labels
  const apply = (to) => {
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement.closest('script, style, svg, [data-no-i18n]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    const nodes = [];
    while (walk.nextNode()) nodes.push(walk.currentNode);
    // going back to Portuguese uses what each piece said before (two Portuguese texts can share one English text);
    // pieces the page added while in English (the buttons' rolling labels) are looked up the other way round
    nodes.forEach((n) => {
      if (to === 'en' && !original.has(n)) original.set(n, n.data);
      let next = to === 'en' ? swap(original.get(n), 'en') : original.has(n) ? original.get(n) : swap(n.data, 'pt');
      // a line break in the translation shows as one (only on the element that has it; the spaces around it are dropped)
      const breaks = to === 'en' && next.trim().includes('\n');
      if (breaks) next = next.trim();
      if (next !== n.data) n.data = next;
      if (breaks) { n.parentElement.style.whiteSpace = 'pre-line'; n.parentElement.dataset.i18nBreak = ''; }
      else if (n.parentElement.hasAttribute('data-i18n-break')) { n.parentElement.style.whiteSpace = ''; delete n.parentElement.dataset.i18nBreak; }
    });
    document.querySelectorAll(ATTRS.map((a) => `[${a}]`).join(',')).forEach((el) => {
      if (el.closest('[data-no-i18n]')) return;
      if (!originalAttr.has(el)) originalAttr.set(el, {});
      const saved = originalAttr.get(el);
      ATTRS.forEach((a) => {
        if (!el.hasAttribute(a)) return;
        if (to === 'en' && !(a in saved)) saved[a] = el.getAttribute(a);
        el.setAttribute(a, to === 'en' ? swap(saved[a], 'en') : a in saved ? saved[a] : swap(el.getAttribute(a), 'pt'));
      });
    });
    document.title = swap(document.title, to);
    if (description) description.content = to === 'en' ? DESCRIPTION_EN : descriptionPT;
    root.lang = to === 'en' ? 'en-US' : 'pt-BR';
    document.querySelectorAll('.site-header__lang').forEach((b) => {
      b.textContent = to === 'en' ? 'PT-BR' : 'EN-US';
      b.setAttribute('aria-label', to === 'en' ? 'Ver o site em português' : 'View the site in English');
    });
  };

  // for messages the page writes later (main.js)
  window.gangT = (text) => (lang === 'en' ? swap(text, 'en') : text);

  if (lang === 'en') apply('en'); // runs before main.js, so everything it measures is already in English

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.site-header__lang');
    if (!btn) return;
    lang = lang === 'en' ? 'pt' : 'en';
    try { localStorage.setItem(KEY, lang); } catch (err) { /* not remembered, still switches */ }
    apply(lang);
    // the texts changed size: line breaks, aligned blocks and scroll positions are measured again
    document.dispatchEvent(new Event('gang:lang'));
    window.dispatchEvent(new Event('resize'));
  });
})();
