# FLIK2 Website

Marketing website for FLIK2, a dating app that arranges real-world first dates instead of endless chatting. Structure and tone are inspired by breeze.social, restyled with a green brand palette.

Built with plain HTML, CSS, and vanilla JavaScript. No frameworks, no build step, no dependencies to install.

## File structure

```
Website/
  index.html    Home / landing page (hero, how it works, features, stats, FAQ, download CTA)
  partner.html  "Become a partner venue" page for cafes, bars, restaurants
  about.html    About page (mission, values, reach stats, contact)
  styles.css    All styling, shared by every page (design tokens at the top)
  script.js     Interactivity, shared by every page (mobile menu, scroll reveals, stat counters)
  README.md     This file
```

The header and footer are duplicated in each HTML file (there is no templating). If you change nav or footer links, update all three pages.

## How to run

Open `index.html` directly in any browser. That's it.

For a local server (optional, nicer for development):

```
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then visit http://localhost:8000.

## Contact details

The real business contact info appears in the footer of every page and on the partner/about contact cards:

- Phone: +91 73563 86752 (links use `tel:+917356386752`)
- Email: info.flik2@gmail.com (links use `mailto:info.flik2@gmail.com`)

To change them, search for `7356386752` and `info.flik2@gmail.com` across the three HTML files.

## How to make common changes

### Change the brand name
Search and replace `FLIK2` across the three HTML files. The logo is plain text (`.logo` element), not an image.

### Change colors, fonts, spacing
All design tokens live at the top of `styles.css` in the `:root` block:

- `--brand` / `--brand-dark` / `--brand-soft`: brand color (currently green #16a34a) and variants
- `--ink` / `--ink-soft`: text colors
- `--bg` / `--tint`: page and alternate section backgrounds
- `--radius`, `--shadow`, `--font`: shape, elevation, typography

Change a token once and it updates everywhere. Two places don't use tokens and need a manual edit if you change the brand color: the CTA banner gradient (`.cta` in `styles.css`) and the footer link hover color (`#4ade80`).

The font is Plus Jakarta Sans loaded from Google Fonts in each page's `<head>`; swap the `<link>` and the `--font` value to change it.

### Images
Photos are hotlinked from Unsplash (free to use under the Unsplash license, no attribution required). Each `<img>` uses a URL like:

```
https://images.unsplash.com/photo-<id>?auto=format&fit=crop&w=900&q=70
```

To replace one, swap the `src` (and update the `alt` text). For production, consider downloading the images into an `images/` folder and pointing `src` at local files so the site doesn't depend on Unsplash's CDN. Sizing and cropping are handled in CSS with `object-fit: cover` and `aspect-ratio`, so any reasonably sized replacement image will fit.

### Edit page copy
Everything is plain text in the HTML files. Sections are marked with `<!-- ===== Section name ===== -->` comments.

### Update the stats
Each animated number is a `data-count` attribute, e.g. `<span class="stat-num" data-count="12000">12,000+</span>`. The counter animation in `script.js` reads `data-count`; the element's text content is the no-JS fallback, so keep both in sync when editing. Stats appear on all three pages and are currently framed as waitlist/launch numbers to stay consistent with the "coming soon" state.

### "App is coming soon" state
The site currently advertises the app as not yet released: a `.coming-soon` badge (styled in `styles.css`) appears in the home hero, both download banners, and the store buttons say "coming soon". When the app launches, remove the `.coming-soon` elements, restore the store button labels, update the download banner copy, and revisit the "When can I use FLIK2?" FAQ item.

### Placeholder content to replace before launch
- Waitlist-size and venue-count stats are placeholders; confirm or update them with real numbers. Launch city is Delhi NCR. The co-founder messages (Rohit and Neeraj, home page) are real content.
- A stat can show text instead of an animated number: give `.stat-num` no `data-count` attribute (see the "Delhi NCR" stat).
- App Store / Google Play buttons link to `#`; point them at real store URLs.
- The QR code on the home page is a decorative CSS pattern (`.qr-box`); replace with a real QR `<img>`.
- Footer Legal links (Privacy, Terms, Safety) link to `#`.

## How the JavaScript works

`script.js` has three small, independent parts, each commented:

1. **Mobile nav toggle**: shows/hides `.nav-links` under 900px width via the `.open` class.
2. **Scroll reveal**: an `IntersectionObserver` adds `.visible` to any element with class `.reveal` when it scrolls into view (animation defined in `styles.css`). In-page anchor navigation reveals the target section instantly so users never land on a blank viewport, and anything already scrolled past is revealed on load.
3. **Stat counters**: an `IntersectionObserver` animates each `.stat-num` from 0 to its `data-count` value with easing, formatted with en-US digit grouping.

Accessibility/robustness: every page has a `<noscript>` fallback so content stays visible without JavaScript (stat numbers ship in the HTML as final values), and `prefers-reduced-motion` disables reveals, smooth scrolling, and counter animation.

## Browser support

Works in all modern browsers (Chrome, Edge, Firefox, Safari). Uses CSS grid, custom properties, `aspect-ratio`, `IntersectionObserver`, and `<details>`; no IE11 support.
