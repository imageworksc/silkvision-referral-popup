/* ==========================================================================
   Silk Vision — homepage referral popup: behaviour
   ==========================================================================
   Live rules:
   - Opens on its own after the page loads: 1.5 s on desktop, 3 s on phones
     and tablets. No scrolling needed.
   - Once per visit (sessionStorage).
   - Not again for 14 days once closed or clicked through (localStorage).
   - Never while the chatbot's card is open: if it is, it waits and tries
     again, a few times, then gives up for this visit.
   - Closes with the X, a click on the veil, or Esc. Focus moves into the
     card, is trapped there, and returns where it was afterwards.

   Settings are data attributes on #sv-ref, so they change without
   touching this file:
     data-delay-desktop="1500"   ms after load, 960px and wider
     data-delay-mobile="3000"    ms after load, narrower screens
     data-snooze-days="14"       days hidden after a close or a click
     data-chatbot-open=""        CSS selector that matches only while the
                                 chatbot's card is open; empty = no check
     data-preview="true"         staging only: ignores the memory so the
                                 popup shows on every load

   QA on the live site: add ?svref-preview to the URL to force it, or run
   svReferralPopup.reset() in the console to clear the memory.

   ES2015+ (const/let, arrow functions). No dependencies.
   ========================================================================== */
(() => {
  const root = document.getElementById('sv-ref');
  if (!root) return;

  const card = root.querySelector('.sv-ref__card');
  const cfg = root.dataset;
  const KEY_SNOOZE = 'svRefPopup.snoozeUntil';
  const KEY_SEEN = 'svRefPopup.seenThisVisit';
  const DAY = 24 * 60 * 60 * 1000;
  const CLOSE_MS = 700;   // matches the longest fade in the stylesheet
  const RETRY_MS = 2000;  // while the chatbot is open
  const RETRIES = 10;

  const num = (value, fallback) => {
    const n = Number(value);
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  };
  const delayDesktop = num(cfg.delayDesktop, 1500);
  const delayMobile = num(cfg.delayMobile, 3000);
  const snoozeDays = num(cfg.snoozeDays, 14);
  const preview = cfg.preview === 'true' || new URLSearchParams(location.search).has('svref-preview');

  // Storage can be blocked (private mode, strict settings): never let that
  // break the page. Without storage the popup simply behaves as new.
  const read = (store, key) => { try { return window[store].getItem(key); } catch (err) { return null; } };
  const write = (store, key, value) => { try { window[store].setItem(key, value); } catch (err) { /* ignore */ } };
  const remove = (store, key) => { try { window[store].removeItem(key); } catch (err) { /* ignore */ } };

  const isSnoozed = () => !preview && num(read('localStorage', KEY_SNOOZE), 0) > Date.now();
  const seenThisVisit = () => !preview && read('sessionStorage', KEY_SEEN) === '1';
  const chatbotOpen = () => {
    const sel = (cfg.chatbotOpen || '').trim();
    if (!sel) return false;
    try { return Boolean(document.querySelector(sel)); } catch (err) { return false; }
  };

  // Lift the popup to <body>, so no transformed or clipped theme wrapper
  // can trap a position: fixed layer, wherever the block is placed.
  if (root.parentElement !== document.body) document.body.appendChild(root);

  let lastFocus = null;
  let hideTimer = 0;
  const isOpen = () => root.classList.contains('is-shown');

  const open = () => {
    clearTimeout(hideTimer);
    lastFocus = document.activeElement;
    root.hidden = false;
    void root.offsetWidth;          // commit the hidden state so it fades in
    root.classList.add('is-shown');
    card.focus({ preventScroll: true });
    write('sessionStorage', KEY_SEEN, '1');
  };

  const close = () => {
    if (!isOpen()) return;
    root.classList.remove('is-shown');
    write('localStorage', KEY_SNOOZE, String(Date.now() + snoozeDays * DAY));
    hideTimer = setTimeout(() => { if (!isOpen()) root.hidden = true; }, CLOSE_MS);
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus({ preventScroll: true });
  };

  const tryOpen = (attempt) => {
    if (isSnoozed() || seenThisVisit()) return;
    if (chatbotOpen()) {
      if (attempt < RETRIES) setTimeout(() => tryOpen(attempt + 1), RETRY_MS);
      return;
    }
    open();
  };

  const start = () => {
    if (isSnoozed() || seenThisVisit()) return;
    const delay = matchMedia('(min-width: 60em)').matches ? delayDesktop : delayMobile;
    setTimeout(() => tryOpen(0), delay);
  };

  // X and veil close it. Following the link counts as a close too, so the
  // two-week memory starts; the link itself is left to navigate.
  for (const el of root.querySelectorAll('[data-sv-ref-close]')) el.addEventListener('click', close);
  const link = root.querySelector('.sv-ref__btn');
  if (link) link.addEventListener('click', close);

  document.addEventListener('keydown', (e) => {
    if (!isOpen()) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    const focusable = [...card.querySelectorAll('a[href], button:not([disabled])')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === card)) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });

  // For QA from the console; harmless otherwise.
  window.svReferralPopup = {
    open,
    close,
    reset: () => { remove('localStorage', KEY_SNOOZE); remove('sessionStorage', KEY_SEEN); },
  };

  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
})();
