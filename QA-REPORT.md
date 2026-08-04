# QA Report: FLIK2 Website

## RE-TEST 2026-08-05: all fixes verified, PASS

Every issue below was fixed by the builder and re-tested live:

1. **Apple glyph** FIXED. Store buttons now use inline SVG icons (`fill: currentColor`), no private-use characters remain.
2. **Blank screen on anchor navigation** FIXED. Verified live: clicking a nav anchor link reveals the target section instantly (tested `#how` via click and `#faq` via hashchange; all `.reveal` children flip to `.visible` synchronously). Elements above the viewport also auto-reveal on load with a hash URL.
3. **Content contradiction** FIXED. Stats reframed as waitlist/launch numbers (100+ waitlist, 36 venues, Delhi NCR), fake testimonial replaced with real founder quotes, new "When can I use FLIK2?" FAQ.
4. **Sticky header overlap** FIXED. `scroll-margin-top: 80px` confirmed in computed styles.
5. **Reduced motion** FIXED. CSS media query present; JS sets final counter values without animation when reduced motion is on.
6. **Legal links** still `#` as agreed (deferred).
7. **Nits** FIXED. `toLocaleString('en-US')` verified ("100+", "92", "58,000+", "120,000+"; no "+" mid-animation). No-JS fallback text now ships final values in HTML. Open Graph tags added on all three pages.

Also checked: new `.grid-2` founders grid stacks at the 900px breakpoint; text-only stat "Delhi NCR" correctly skipped by the counter script; "0 monthly fees, ever" stat is intentional; zero console errors on reload; `data-plus` attribute works.

Not visually re-confirmed (Chrome window was minimized during re-test, which blocks screenshots): the rendered look of the new SVG icons and counter animation on screen. Logic verified; bring the Chrome window to the foreground for a final eyeball pass if desired.

---

# Original report (all items below now resolved except Legal links)

Reviewed by a separate QA session on 2026-08-05. Tested live in Chrome (desktop 1536px and mobile 414px) plus a static code review of `index.html`, `about.html`, `partner.html`, `styles.css`, `script.js`.

**Overall verdict: ship-ready for a pre-launch marketing site.** No console errors, no broken links or images, no horizontal overflow on mobile. The items below are ranked by priority; fixes 1 and 2 are the ones worth doing before showing this to anyone.

## What passed (no action needed)

- All pages load clean: every request 200, zero console errors, correct titles and meta descriptions
- FAQ accordion, stat counters, scroll reveals, and hamburger menu (with correct `aria-expanded`, closes on link tap) all work
- Mobile 414px: no horizontal overflow on any page, correct single-column stacking, breakpoint fires at 900px as designed
- Link audit: every anchor target exists, all cross-page links resolve, all images load and have alt text, one h1 per page
- Active nav states on subpages, mailto with prefilled partner-enquiry body, emoji favicon

## Issues to fix

### 1. Apple logo character renders wrong on Windows and Android (MEDIUM)
`index.html:196` and `about.html:141` use `&#63743;` (U+F8FF) for the App Store button. That codepoint is Apple private-use; it only renders as the Apple logo on Apple devices. On Windows it visibly renders as a "triple bar" substitute glyph (confirmed in testing). Most visitors will see a wrong character.

**Fix:** replace with a small inline SVG of the Apple logo, or drop the glyph and use plain text "App Store".

### 2. Blank white screen after clicking anchor nav links (MEDIUM)
Clicking "How it works" (or any in-page nav link) smooth-scrolls into sections whose `.reveal` elements have not received `.visible` yet, so the user sees an empty viewport for 1 to 2 seconds before content fades in. Confirmed on desktop and mobile; on mobile every menu tap is an anchor jump so it is worse there.

**Fix options (either works):**
- Give `revealObserver` a `rootMargin` such as `"0px 0px -10% 0px"` AND reveal any element whose bounding rect is above the viewport at observe time
- Or add a failsafe in `script.js`: on `hashchange` / initial hash load, add `.visible` to every `.reveal` after ~800ms

### 3. Content contradiction: "coming soon" vs live-sounding stats (MEDIUM, copy only)
The hero badge says "App is coming soon" but the same page claims "120,000+ first dates arranged", "4,300 couples still together", and testimonials dated 2025 ("partner since 2025", "matched in March"). Careful visitors will read the numbers as fake.

**Fix:** reframe stats as goals or waitlist numbers until launch, or remove the stats/testimonial sections while the coming-soon state is active.

### 4. Anchor targets can tuck under the sticky header (LOW)
No `scroll-margin-top` anywhere in `styles.css`. Section padding mostly hides the problem today, but it is one rule to fix:

```css
section[id] { scroll-margin-top: 80px; }
```

### 5. `prefers-reduced-motion` is ignored (LOW, accessibility)
Reveals, smooth scrolling, and counters animate for everyone. Add:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

and in `script.js` skip `animateCount` (set final value directly) when `matchMedia('(prefers-reduced-motion: reduce)').matches`.

### 6. Legal links are dead (LOW, fine pre-launch)
Privacy, Terms, Safety are `href="#"` on all three pages. Privacy should exist before collecting real user emails.

### 7. Nits
- `script.js:43`: `value.toLocaleString()` formats by visitor locale, so en-IN users see "1,20,000+". Use `toLocaleString('en-US')` for consistent grouping.
- No-JS visitors see "0" in every stat. Put the real number as the fallback text in the HTML and have JS reset it to 0 before animating.
- No Open Graph / Twitter meta tags, so shared links get no preview card.

## Testing environment note

During testing, Chrome pauses `requestAnimationFrame` and IntersectionObserver whenever its window is minimized or fully covered. If counters or reveals ever look "stuck" while demoing, make sure the Chrome window is actually visible; it is not a site bug.
