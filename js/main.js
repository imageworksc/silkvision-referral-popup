/* Referral popup behaviour.
   Live rules: appears on its own shortly after the homepage loads (no
   scrolling needed): 1.5 s on desktop, 3 s on phones and tablets. Once per
   visit, never while the chatbot's card is open, and not again for about two
   weeks once closed or clicked through. Closes with the X, a click on the
   veil, or Esc; focus moves into it and returns afterwards. The two-week
   memory is left out of this mockup so the popup can be replayed. */
(() => {
  const root = document.documentElement;
  const pop = document.getElementById('pop');
  const veil = document.querySelector('.veil');
  const card = pop.querySelector('.pop__card');
  const bot = document.getElementById('botCard');
  let timer, lastFocus;

  const close = () => {
    root.classList.remove('is-shown');
    setTimeout(() => {
      if (!root.classList.contains('is-shown')) { pop.hidden = true; veil.hidden = true; }
    }, 700);
    if (lastFocus) lastFocus.focus();
  };

  const open = () => {
    if (!bot.hidden) return;
    lastFocus = document.activeElement;
    pop.hidden = false; veil.hidden = false;
    void pop.offsetWidth;
    root.classList.add('is-shown');
    card.focus({ preventScroll: true });
  };

  const replay = () => {
    clearTimeout(timer);
    root.classList.remove('is-shown');
    pop.hidden = true; veil.hidden = true;
    const delay = matchMedia('(min-width: 60rem)').matches ? 1500 : 3000;
    timer = setTimeout(open, delay);
  };

  for (const el of document.querySelectorAll('[data-close]')) el.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (!root.classList.contains('is-shown')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      const f = [...card.querySelectorAll('a, button')];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === card)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Mockup only: option A (drawn cards) or B (photo). The choice rides in
  // the URL (?opt=photo) so a link opens on the option it was sent with.
  const opts = [...document.querySelectorAll('[data-opt]')];
  const choose = (opt) => {
    const name = opts.some((b) => b.dataset.opt === opt) ? opt : 'cards';
    for (const b of opts) b.setAttribute('aria-pressed', String(b.dataset.opt === name));
    pop.classList.toggle('pop--photo', name === 'photo');
    const url = new URL(location.href);
    if (name === 'cards') url.searchParams.delete('opt'); else url.searchParams.set('opt', name);
    history.replaceState(null, '', url);
  };
  for (const b of opts) b.addEventListener('click', () => { choose(b.dataset.opt); replay(); });
  choose(new URLSearchParams(location.search).get('opt'));

  document.querySelector('[data-replay]').addEventListener('click', replay);
  document.getElementById('botLaunch').addEventListener('click', () => { bot.hidden = !bot.hidden; });

  replay();
})();
