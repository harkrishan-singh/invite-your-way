# InviteYourWay — conservative optimization audit

**Baseline:** the user-supplied `inviteyourway.zip` (30 October 2026).  
**Scope:** no changes to invitation layout, design, displayed copy, event routing, timer calculations, opening gestures, animation timing, responsive rules that match live components, or any active image content.

## Exact improvements

| Area | Original | Optimized | Difference |
| --- | ---: | ---: | ---: |
| Photographs under the event folder | 65 files | 16 files | 49 unused files removed |
| Event photo bytes (uncompressed) | 29,172,470 | 9,069,389 | 20,103,081 bytes saved (19.17 MiB) |
| Event CSS across three stylesheets | 51,031 bytes | 46,262 bytes | 4,769 bytes removed (9.34%) |
| Obsolete CSS | — | — | 36 orphan rules / 51 unused selector branches removed |
| `photos.js` mappings | 22 entries | 15 entries | 7 unreferenced mappings removed |
| Unused React code | Unused `Villa.jsx` and `UserIcon` | Removed | No active component imports either one |
| Unused JavaScript computation | Local `footerDate` variable (unused) | Removed | Returned `footerDate` unchanged |

Removed assets were found by checking all JS/JSX, direct `events/.../photos/` URLs, every `photos.js` reference (no computed `photos[...]` references), CSS URLs, and the venue's `photo`/`photo_2` references. All 16 active image files are **byte-for-byte identical** to the baseline. They were also verified as decodable images.

## Source files changed

- `src/events/amanpreet-weds-megha/data/photos.js` — removed the seven unused keys `venue`, `parties`, `travel`, `registry`, `dress`, `dining`, and `music`.
- `src/events/amanpreet-weds-megha/data/wedding.js` — removed only an unused local footer date calculation; returned venue/date values and route logic are unchanged.
- `src/events/amanpreet-weds-megha/components/Icons.jsx` — removed the unused `UserIcon` export. `Chevron` and `Flourish` are preserved.
- `src/events/amanpreet-weds-megha/styles/invitation.css` — removed styles requiring classes no live component produces (e.g. old login/RSVP/unused SVG styles).
- `src/events/amanpreet-weds-megha/styles/story.css` — removed old form/modal styling, preserving all lightbox selectors and other active styles.
- `src/events/amanpreet-weds-megha/styles/unified.css` — removed unreachable legacy selectors while retaining the actual current hero/venue/footer/animation rules.
- `scripts/validate.mjs` — photo checks now validate the actual referenced hero/venue filenames, instead of enforcing obsolete sample venue images.
- `README.md` — updated the project inventory and added optimization notes.
- `OPTIMIZATION-REPORT.md` — this report.

**Deleted source component:** `src/events/amanpreet-weds-megha/components/Villa.jsx` (the hero already uses `Hero1.jpeg` rather than the SVG component).  
**Deleted assets:** 49 unreferenced image files under `public/events/amanpreet-weds-megha/photos/` (listed at the end of this report).

The following were **not modified**: `package.json`, `package-lock.json`, `vite.config.js`, `index.html`, `public/favicon.svg`, `vercel.json`, `public/_redirects`, the central event router/registry, active invitation components such as `AmanpreetMeghaSite.jsx`, `Envelope.jsx`, `Join.jsx`, `Story.jsx`, `StoryHero.jsx`, and all active image binaries.

## Checks performed

**Passed**

- `node scripts/validate.mjs` — source imports, event structure, five-day itinerary parity, active image references and both URLs.
- TypeScript source parser — 28 `.js`/`.jsx`/`.mjs` files with no syntax errors.
- PostCSS parser — all 5 CSS files with no syntax errors.
- Image integrity — all 16 active files are present, decode successfully, and have exactly the same bytes as the uploaded originals.
- Real Chromium offline component rendering — main homepage, valid wedding and reception URLs, and unknown-event fallback. No JavaScript page errors.
- Responsive DOM and computed-style parity — 10 original-vs-optimized comparisons across wedding/reception at 320, 390, 820 and 1440 px plus homepage/404; **all matched exactly**.
- Controlled screenshot regression — wedding and reception at 390 and 1440 px; all four screenshots pixel-identical. This preview uses cached React dependencies and consistent small test copies of the original photos. This is a controlled comparison, **not a live production-site capture**.
- Interactions with reduced-motion settings — envelope opening, 5 closed itinerary cards and open/close, single vs dual main venues, wedding-only two-venue slider, menu open/escape close, photo lightbox open/escape close, gold badge return-to-top.
- Normal-motion browser checks — mouse-wheel envelope opening on wedding, swipe envelope opening on reception, floating hero photos, animated story and scroll activity; passed on both original and optimized versions.
- Deployment routing and main favicon files retained without modification.

**Environment-blocked / not claimed as passed**

- Full Vite production bundle: `vite build` cannot load the Linux Rolldown native binary because the uploaded dependencies contain Windows-native bindings, and this environment cannot resolve `registry.npmjs.org` to reinstall the correct binaries.
- Native `oxlint` executable: the supplied binary is Windows-specific, so `npm run lint` cannot be run here; syntax and import checks passed independently.
- Performance timing measurements in a deployed environment (Lighthouse/LCP/CLS) were not obtainable. Removing unused assets reduces repository/deployment size, **not necessarily the number of requests made by visitors**, since the removed files were never rendered.

After extracting the ZIP on your Windows development machine, run:

```bash
npm ci
npm run validate
npm run lint
npm run build
npm run preview
```

Check `/`, `/amanpreet-weds-megha/wedding` and `/amanpreet-weds-megha/reception` directly, including deep-link refresh and the mobile opening gestures.

## Optimizations intentionally avoided

- Changing route loading to lazy imports, splitting the event bundle, upgrading/removing installed dependencies or replacing Framer Motion: may change first-render timing or interactions.
- Lossy compression, resizing, changing formats or adding `srcset` to any live photograph: could change cropping, sharpness or responsive appearance.
- Rewriting scroll handlers, countdown updates, transition settings, CSS media-query override chains or component memoization: no measured benefit significant enough to justify a behavioral risk.
- Altering Google font loading, visible text, accessibility labels or business/event data.

The optimized ZIP intentionally excludes `node_modules`, which is machine-specific, and keeps the exact original dependency manifest and lockfile. Reinstall locally with `npm ci`.

## Removed image filenames

`Hero10.jpeg`, `Recent4.jpeg`, `Recent5.jpeg`, `Recent6.jpeg`, `Reception1.avif`, `Reception2.avif`, `Reception3.jpg`, `Reception4.jpg`, `Wedding2.jpg`, `city.jpg`, `cliff2.jpg`, `coast.jpg`, `coffee.jpg`, `couple.jpg`, `dining.webp`, `dinner.jpg`, `dress.webp`, `engage3.webp`, `footer.webp`, `gallery2.webp`, `group.jpg`, `hero.jpg`, `hero.webp`, `hike.jpg`, `music.webp`, `parties.webp`, `peaks.jpg`, `portugal.jpg`, `portugal.webp`, `quote.jpg`, `reception-venue.webp`, `registry.webp`, `shoes.jpg`, `shoes.webp`, `story11.webp`, `story12.webp`, `story13.webp`, `story21.webp`, `story22.webp`, `story31.webp`, `story32.webp`, `students.jpg`, `thunderbay.jpg`, `thunderbay.webp`, `toronto3.webp`, `travel.jpg`, `travel.webp`, `venue.webp`, `walk.jpg`
