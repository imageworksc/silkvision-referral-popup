# Silk Vision — Homepage referral popup (staging)

The EVO ICL referral popup, restyled on the Silk Vision design system used by
the entropion page (`imageworksc/silkvision-entropion`). The copy is
unchanged; only the styling moved onto the shared tokens and components.

Staging URL: https://imageworksc.github.io/silkvision-referral-popup/

## Structure

```
index.html
css/   fonts → tokens → base → components → sections → popup
js/main.js
fonts/  images/  favicons  .nojekyll
```

- `css/tokens.css` and `css/fonts.css` are copied verbatim from the entropion
  repo. `1rem = 10px`, as in the Drupal theme.
- `css/popup.css` is the real design. Everything in `css/sections.css` is a
  stand-in for the live homepage and the third-party widgets (Pay over time,
  chatbot) so the popup can be judged in place.

## Running inside Drupal

Same rules as the entropion page, so the popup measures the same on staging
and on silkvision.net:

- `1rem = 10px`. The theme sets `html { font-size: 62.5% }`, and `base.css`
  sets the same value. Media queries stay on the browser's 16px, so `48rem`
  in a query still means 768px.
- `index.html` wraps everything in `.field-html-code`, the Drupal field.
  Element-level rules are scoped with `:where(.field-html-code)` so they
  never reach the site's header and footer, and need no `!important`.
- The stand-in page wrapper is `#sv-main` (never `id="main"` or the class
  `section`: the theme caps both at 1000px), and it clears floats.
- Anything added to the field needs the `html-wrapper` class, or the theme
  recolours its links. `#sv-main`, `.veil` and `.pop` all carry it.
- What ships to the homepage is the popup only: the `.veil` and `.pop`
  markup, the icon sheet (`i-arrow`, `i-close`), `tokens.css`, `fonts.css`,
  `base.css`, the button rules from `components.css`, `popup.css` and
  `js/main.js`. Everything in `sections.css` is mockup.
- CSS and JS links carry `?v=N`; bump it on every change so the theme's
  cache serves the new files.

- Past 1920px the root size follows the viewport (`base.css`, same rule as
  entropion), so 4K and 5K screens at 1x see the 1920 layout scaled up
  rather than a small card in the middle. Keep popup sizes in rem/em.

Before handing off, test it inside a copy of the live homepage at 320, 390,
768, 1440, 1920, 2560, 3840 and 5120 wide, and with a phone on its side.

## The popup

- Navy art panel (`--fill-deep`) with the two gift cards, over a white body.
- Plum kicker, brand-blue heading, solid plum button with the sliding arrow,
  `--r-lg` corners, `--shadow-lg`. No gradients.
- Phones: the card sits near the bottom, above the existing widgets.

## Behaviour (live rules)

- Appears 1.5 s after load on desktop, 3 s on phones and tablets.
- Once per visit, never while the chatbot's card is open, and not again for
  about two weeks once closed or clicked through (not wired in the mockup, so
  it can be replayed).
- Closes with the X, a click on the veil, or Esc. Focus is trapped inside and
  returns afterwards. Respects `prefers-reduced-motion`.
