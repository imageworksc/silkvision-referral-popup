# Tutorial — Putting the referral popup on silkvision.net

A step-by-step guide for adding the EVO ICL referral popup to the
silkvision.net homepage. It assumes admin access to the site's Drupal 10
back office. No custom module is needed: the popup is a content block,
like the chatbot and the Cherry button already on the homepage.

Time: about 30 minutes, including testing.

What it looks like:
https://imageworksc.github.io/silkvision-referral-popup/

---

## 0. What you are installing

| File | What it is |
|---|---|
| `snippet.html` | The block's content: the popup's HTML and the three tags that load its files |
| `css/sv-referral-popup.css` | The popup's styles |
| `css/sv-referral-popup-fonts.css` | The Inter font (the body text) |
| `fonts/inter-latin.woff2` | The font file that stylesheet points to |
| `js/sv-referral-popup.js` | The behaviour: when it opens, closes, and stays away |

The other files in this repo (`index.html`, `css/staging.css`, favicons)
belong to the staging page only. Don't upload them.

How it behaves once live:

- It opens on its own 1.5 s after the homepage loads on desktop, 3 s on
  phones and tablets.
- It shows once per visit. After someone closes it or clicks
  **Learn More**, it stays away for 14 days on that browser.
- It never opens while the chatbot (Typeform) is open, and if the chatbot
  opens on top of it, the popup closes.

---

## 1. Upload the files to the site

The files have to live on silkvision.net itself. They load from GitHub
Pages today, which is fine for a test but should not stay in production.

Upload them **keeping the folder structure**: the font stylesheet looks
for the font one folder up, in `../fonts/`.

**Option A — in the theme (preferred).** With access to the server or the
theme's repository, copy them into the `imageworks` theme:

```
/themes/imageworks/sv-referral-popup/css/sv-referral-popup.css
/themes/imageworks/sv-referral-popup/css/sv-referral-popup-fonts.css
/themes/imageworks/sv-referral-popup/fonts/inter-latin.woff2
/themes/imageworks/sv-referral-popup/fonts/INTER-OFL.txt
/themes/imageworks/sv-referral-popup/js/sv-referral-popup.js
```

**Option B — through public files.** Without server access, upload the
same structure to `/sites/default/files/sv-referral-popup/` (by FTP/SFTP or
a file manager module).

Check each one by opening its URL in the browser, for example
`https://www.silkvision.net/themes/imageworks/sv-referral-popup/js/sv-referral-popup.js`.
Each should show the file, not a "Page not found".

---

## 2. Point the snippet at those files

Open `snippet.html` and change the three URLs that start with
`https://imageworksc.github.io/silkvision-referral-popup/` to wherever the
files now live. With Option A:

```html
<link rel="stylesheet" href="/themes/imageworks/sv-referral-popup/css/sv-referral-popup-fonts.css?v=2">
<link rel="stylesheet" href="/themes/imageworks/sv-referral-popup/css/sv-referral-popup.css?v=2">
...
<script src="/themes/imageworks/sv-referral-popup/js/sv-referral-popup.js?v=2" data-cfasync="false" defer></script>
```

Leave everything else as it is, including:

- `data-cfasync="false"` on the script. The site runs Cloudflare Rocket
  Loader, which delays and rewrites scripts; this keeps it away from ours.
- `data-chatbot-open=".tf-v1-popover-wrapper"` on `#sv-ref`. That is how
  the popup knows the Typeform chatbot is open.
- The `?v=2` at the end of each URL (see step 7).

---

## 3. Create the block

1. Go to **Structure → Block layout → Custom block library** and click
   **Add content block**. On some Drupal 10 sites this is
   **Content → Blocks → Add content block**.
2. **Block description:** `Referral popup — EVO ICL`.
3. In **Body**, set the text format to **Full HTML**, the same format the
   chatbot and Cherry blocks use.
4. Switch the editor to **Source** (the `Source` button in the editor's
   toolbar) **before** pasting. Pasting into the visual editor strips the
   `<script>`, the `<svg>` icons and the `data-…` attributes.
5. Paste the whole of `snippet.html`, as edited in step 2.
6. Save.

Re-open the block, view it in **Source** again and check that the
`<script>`, both `<link>` tags and the two `<svg>` elements are still
there. If the editor removed any of them, the Full HTML format is
filtering tags: ask whoever manages text formats to allow them, or use
whichever format the chatbot block uses.

---

## 4. Place the block on the homepage only

1. **Structure → Block layout**, theme **imageworks**.
2. In the **Footer** region (where the chatbot and Cherry blocks are),
   click **Place block** and choose `Referral popup — EVO ICL`.
3. Untick **Display title**.
4. Under **Visibility → Pages**, enter `<front>` and select **Show for the
   listed pages**.
5. **Language:** the site has a Spanish homepage (`/es`) and `<front>`
   covers it too, but the popup's copy is in English. If the
   **Visibility → Language** tab is there, tick **English** only.
6. Save the block, then **Save blocks** at the bottom of the layout page.

Region doesn't matter for how it looks: on load the script moves the popup
to the end of the page, so no wrapper of the theme can clip it or put it
behind something.

---

## 5. Clear the caches

1. **Configuration → Development → Performance → Clear all caches.**
2. In Cloudflare, purge the cache for the homepage (or everything), so
   visitors aren't served the page from before the block.

---

## 6. Test it

**First look.** Open the homepage in a private window (no history, so the
14-day memory is empty). The popup should appear about 1.5 s after the page
loads.

**Force it, whenever you need to.** Add `?svref-preview` to the URL:

```
https://www.silkvision.net/?svref-preview
```

It then shows on every load, ignoring the memory.

**Reset the memory** (to test as a new visitor without a private window):
open the browser console (F12 → Console) and run

```js
svReferralPopup.reset()
```

then reload. `svReferralPopup.open()` and `svReferralPopup.close()` are
there too.

**Checklist**

- [ ] Desktop: opens after ~1.5 s, centred, over a light veil.
- [ ] Phone: opens after ~3 s, low on the screen, the chat bubble dimmed
      behind it and not covering the card.
- [ ] Phone on its side: the gift cards sit beside the text and the whole
      card is visible.
- [ ] The X, a click outside the card, and the Esc key all close it.
- [ ] **Learn More** goes to https://www.silkvision.net/special-offers.
- [ ] Reload after closing: it does not come back.
- [ ] With the chatbot open, it does not appear; opening the chatbot while
      the popup is up closes the popup.
- [ ] The Spanish homepage (`/es`) does not show it (if you limited it to
      English in step 4).
- [ ] The rest of the homepage looks exactly as before.

---

## 7. Making changes later

**Settings without touching code.** They are attributes on the
`<div id="sv-ref" …>` line of the block:

| Attribute | Default | What it does |
|---|---|---|
| `data-delay-desktop` | `1500` | ms after load before it opens, 960px and wider |
| `data-delay-mobile` | `3000` | the same, on narrower screens |
| `data-snooze-days` | `14` | days it stays away after a close or a click |
| `data-chatbot-open` | `.tf-v1-popover-wrapper` | selector that means "the chatbot is open" |
| `data-preview` | *(absent)* | staging only; **never** add it on the live site, it makes the popup show on every load |

**Copy or link.** Edit the text inside the block (title, line, button
link, fine print) in **Source** view and save.

**Files.** If `sv-referral-popup.css` or `.js` changes, upload the new
file and raise the number in its URL (`?v=2` → `?v=3`) in the block, so
browsers and Cloudflare fetch the new one.

---

## 8. Turning it off

**Structure → Block layout**, find `Referral popup — EVO ICL` and choose
**Disable** (or **Remove**). Clear the caches as in step 5. Nothing else
on the site depends on it.

---

## Troubleshooting

| What you see | Likely cause | Fix |
|---|---|---|
| The popup never appears | You already closed it in this browser (14-day memory) | Private window, `?svref-preview`, or `svReferralPopup.reset()` |
| | The block isn't on the homepage | Check step 4: region, `<front>`, block saved |
| | The editor stripped the `<script>` | Step 3: paste in **Source**, Full HTML |
| | The JS URL is wrong | Open the script's URL; it must show the file |
| | Old page cached | Step 5: clear Drupal and Cloudflare caches |
| The text shows at the bottom of the page, unstyled | The CSS URL is wrong or the `<link>` was stripped | Open the CSS URL; check the block in **Source** |
| Body text in a different font | Inter didn't load | Check `sv-referral-popup-fonts.css` and that `fonts/` sits beside `css/` |
| It shows on every visit | `data-preview="true"` was left in the block | Remove that attribute |
| It appears with the chatbot open | `data-chatbot-open` was changed or removed | Restore `data-chatbot-open=".tf-v1-popover-wrapper"` |
| Another popup appears at the same time | A `simple_popup_blocks` popup is also active on the homepage | Run one at a time |

---

## Notes for the developer

- Every class is prefixed `.sv-ref` and every CSS variable is scoped to
  `.sv-ref`: nothing reaches the theme, and the popup doesn't depend on
  the theme's own CSS beyond `html { font-size: 62.5% }`, which the theme
  already sets.
- Layers measured on the live homepage: Cherry 9999, Typeform 10001,
  popup 10002.
- 4K and 5K screens: past 1920px wide the popup scales with the screen,
  without changing the site's root size.
- Memory: `localStorage` key `svRefPopup.snoozeUntil` (14 days) and
  `sessionStorage` key `svRefPopup.seenThisVisit` (this visit). If the
  browser blocks storage, the popup simply behaves as new.
- More detail, and what was measured on the live site:
  [README.md](README.md).
