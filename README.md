# Silk Vision — Homepage referral popup

The EVO ICL referral popup (offered and administered by STAAR Surgical),
built from the original mockup's design and ready to drop into the
silkvision.net Drupal theme.

Staging (popup only, shows on every load):
https://imageworksc.github.io/silkvision-referral-popup/

## Files

```
snippet.html                  ← what goes into Drupal (markup + 3 asset tags)
css/sv-referral-popup.css     ← the popup's styles, self-contained
js/sv-referral-popup.js       ← the popup's behaviour, no dependencies
css/fonts.css + fonts/        ← Poppins (embedded) and Inter, optional
index.html, css/staging.css   ← staging page only, never shipped
```

## Implementing it on silkvision.net

1. **Host the assets.** Copy `css/sv-referral-popup.css`,
   `js/sv-referral-popup.js` and, if needed, `css/fonts.css` + `fonts/`
   into the theme (or the CDN), and point the three URLs in
   `snippet.html` at them. Until then the snippet loads them from this
   GitHub Pages site, which works but should not stay in production.
2. **Fonts.** Keep the `fonts.css` link only if the theme does not already
   load Poppins (400/600/700) and Inter.
3. **Place the snippet** in a Full HTML block shown on the homepage only.
   The markup can sit anywhere: on load the script moves the popup to the
   end of `<body>`, so no theme wrapper (transforms, overflow, z-index)
   can trap it.
4. **Chatbot.** Set `data-chatbot-open` on `#sv-ref` to a CSS selector
   that matches only while the chatbot's card is open (for example the
   widget's open-state class). While it matches, the popup waits and
   retries every 2 s, up to 10 times. Empty means no check.
5. **Cache.** Bump `?v=` on the CSS and JS links on every change.
6. **Test** in a copy of the live homepage at 320, 390, 768, 1440, 1920,
   2560, 3840 and 5120 wide, and with a phone on its side.

## Behaviour

- Opens 1.5 s after load on desktop (960px+), 3 s on phones and tablets.
- Once per visit (sessionStorage).
- Not again for 14 days once closed or clicked through (localStorage).
- Closes with the X, a click on the veil, or Esc. Focus moves into the
  card, is trapped there and returns afterwards.
- If storage is blocked (private mode), it simply behaves as new.
- Respects `prefers-reduced-motion`: a plain fade, the cards already fanned.

Settings are data attributes on `#sv-ref` (see the header of the JS):
`data-delay-desktop`, `data-delay-mobile`, `data-snooze-days`,
`data-chatbot-open`, and `data-preview` (staging only).

QA on the live site: add `?svref-preview` to the URL to force the popup,
or run `svReferralPopup.reset()` in the console to clear its memory.
`svReferralPopup.open()` and `.close()` are there too.

## How it stays out of the theme's way

- Every class is prefixed `.sv-ref`; every token is scoped to `.sv-ref`;
  nothing touches `:root` or `html`.
- Rules are two classes deep, so they outrank the theme's element rules
  (`h2`, `p`, `a`, `button`) without `!important`, and a scoped reset
  undoes margins, borders, fonts and pseudo-element decorations the theme
  may add.
- The root carries `html-wrapper`, so the theme leaves its links alone.
- `1rem = 10px`, the theme's root size. Every size reads off one unit,
  `--sv-u`; past 1920px it follows the screen, so 4K and 5K at 1x show
  the 1920 popup scaled up, without changing the site's root size.
- No inline styles, no gradients; JS is ES2015+ (`const`/`let`).

## Responsive

Checked at 320×568, 360×740, 375×667, 390×844, 414×896, 430×932,
768×1024, 1024×768, 1366×768, 1440×900, 1920×1080, 2560×1440, 3840×2160
and 5120×2880, and phones on their side (667×375, 844×390, 932×430): the
whole card fits with no inner scroll and no sideways scroll at every size.
Phones place the card low, within thumb reach; phones on their side set
the art beside the copy.
