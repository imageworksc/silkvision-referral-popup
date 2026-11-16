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
