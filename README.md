# InviteYourWay — Multi-event React project

This is one Vite + React application that can host multiple independent invitations. The **Amanpreet weds Megha** invitation was migrated from the supplied `aman-weds-megha(3).zip` without changing its invitation design, event data, component logic or animation timings.

## URLs

| URL | Page |
| --- | --- |
| `/` | InviteYourWay homepage (minimal starting point) |
| `/amanpreet-weds-megha/wedding` | Amanpreet & Megha: wedding invitation |
| `/amanpreet-weds-megha/reception` | Amanpreet & Megha: reception invitation |
| any unknown URL | Page not found |

`/wedding` and `/reception` at the **root** are no longer event URLs; their fully qualified replacements are the two paths above. They both continue to render the same original invitation component tree, with their existing route-specific details.

## Run locally

Use Node.js 20.19+ or 22.12+ (as required by the supplied Vite version).

```bash
npm ci
npm run validate
npm run lint
npm run dev
```

Then visit:

- `http://localhost:5173/`
- `http://localhost:5173/amanpreet-weds-megha/wedding`
- `http://localhost:5173/amanpreet-weds-megha/reception`

For a production build, run `npm run build` and `npm run preview`.

## Folder structure

```text
inviteyourway/
├── public/
│   ├── events/
│   │   └── amanpreet-weds-megha/
│   │       └── photos/                  # The 16 photographs referenced by the live invitation
│   ├── favicon.svg                      # Original project favicon (unchanged)
│   └── _redirects                       # Netlify SPA fallback
├── src/
│   ├── app/
│   │   ├── App.jsx                      # Selects event slug + event page
│   │   ├── Home.jsx                     # Platform homepage
│   │   ├── NotFound.jsx                 # Invalid event/page fallback
│   │   └── pages.css                    # Scoped to platform pages only
│   ├── events/
│   │   ├── registry.js                  # Event registry
│   │   └── amanpreet-weds-megha/
│   │       ├── AmanpreetMeghaSite.jsx   # Original invitation App, moved
│   │       ├── components/              # 20 active invitation JSX components
│   │       ├── data/
│   │       │   ├── wedding.js            # Original event configurations
│   │       │   └── photos.js             # Original photo mappings
│   │       └── styles/                  # Three original style sheets
│   ├── index.css                        # Unchanged global base styles
│   └── main.jsx                         # Loads the platform router
├── scripts/validate.mjs                # Updated source/route checks
├── vercel.json                         # Vercel SPA fallback
├── vite.config.js                      # Unchanged Vite configuration
├── package-lock.json
└── package.json
```

## Adding another event

1. Create `src/events/my-new-event/` with its own `EventSite.jsx`, components, data and styles (or reuse existing components where appropriate).
2. Place its public images in `public/events/my-new-event/photos/`.
3. Add the slug to `src/events/registry.js` and define the allowed page names. Example:

   ```jsx
   import MyNewEventSite from './my-new-event/EventSite.jsx'

   // Add to eventRegistry:
   'my-new-event': {
     Component: MyNewEventSite,
     pages: ['ceremony', 'reception'],
   },
   ```

4. New URLs become `/my-new-event/ceremony` and `/my-new-event/reception`. No duplicate app or deployment is needed.

The homepage intentionally does **not** list event invitations publicly; guests use their provided links. This is a basic structural migration, not a database or invitation management service.

## What was deliberately preserved

- The 20 actively used invitation components retain their behavior. The unused original `Villa.jsx` component and `UserIcon` export were removed; three existing stylesheets were retained with orphaned selectors pruned.
- The wedding/reception dates, text, schedules, footer, venue slider, opening gestures, countdown, navigation, animations and photo story are unchanged.
- `getInvitation()` still chooses the wedding or reception version using the same logic; it now receives the page name from the platform router rather than reading the browser path itself.
- The original `src/index.css`, `vite.config.js`, package dependencies and `src/main.jsx` scroll-reset behavior are preserved.
- All **16 referenced image files** have unchanged bytes. The 49 unreferenced legacy photos were removed to reduce the deployable asset set. No displayed photo paths were changed.

The main app is now responsible for URL matching. The former root `/` → `/wedding` redirect inside the invitation was removed so `/` can serve the InviteYourWay homepage. The default static `index.html` title/description now identify InviteYourWay; the existing event-specific title/description effect remains in the invitation component.

## Deployment

`vercel.json` and `public/_redirects` contain history fallbacks so directly opening or refreshing `/amanpreet-weds-megha/wedding` or `/amanpreet-weds-megha/reception` can load the React app instead of returning 404. Use the file appropriate to your host. Other hosting providers need an equivalent fallback to `index.html`. Vite is deployed at the **domain root** (`base: '/'`); event names are URL paths, not separate Vite applications.

The website does not provide privacy/access control for invitation pages. Do not put passwords or private guest data in public event configurations.

## What to edit later

- Invitation text/dates: `src/events/amanpreet-weds-megha/data/wedding.js`.
- Story photo mappings: `src/events/amanpreet-weds-megha/data/photos.js`.
- Existing photos: `public/events/amanpreet-weds-megha/photos/`.
- Invitation components/styles: `src/events/amanpreet-weds-megha/components/` and `/styles/`.
- Which event URL opens which component: `src/events/registry.js`.

The source project contains some placeholder/sample images and content; these were intentionally **not** modified in this migration.

## Safe optimization audit (30 October 2026)

- The original invitation's text, dates, animations, components' active behavior, routes, and event-specific content have not been altered.
- Removed 49 unreferenced image files, 7 unused exported photo mappings, an obsolete SVG illustration, the unused `UserIcon`, and one unused local date calculation.
- Removed CSS selectors tied exclusively to deleted login, RSVP, and illustration elements, including unused portions of combined lightbox/modal rules. Active selector values and declaration order are unchanged.
- Updated source validation to verify the image filenames **actually used** in the hero and venue objects, rather than enforcing the deleted sample photo filenames.
- Dependencies, lockfile, favicon, active image binaries, all animation timings, routing, and all interaction handlers are unchanged.
- `node_modules` is intentionally excluded from the distributable ZIP. Reinstall using `npm ci` on your machine before running `npm run build`.

See `OPTIMIZATION-REPORT.md` for the audit totals and verification limitations.
