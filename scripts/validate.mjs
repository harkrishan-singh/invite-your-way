// Dependency-free source / asset / structure check. Run `npm run validate`.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(project, 'src')
const eventDir = join(source, 'events/amanpreet-weds-megha')
const publicPhotos = join(project, 'public/events/amanpreet-weds-megha/photos')
const failures = []
const files = []

function scan(folder) {
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const path = join(folder, entry.name)
    if (entry.isDirectory()) scan(path)
    else if (/\.(jsx|js|css)$/.test(entry.name)) files.push(path)
  }
}
scan(source)
for (const file of files) {
  const text = readFileSync(file, 'utf8')
  if (!/\.(js|jsx)$/.test(file)) continue
  const imports = text.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)
  for (const [, link] of imports) {
    const target = resolve(dirname(file), link)
    const candidates = extname(target) ? [target] : [target, `${target}.js`, `${target}.jsx`]
    if (!candidates.some(existsSync)) failures.push(`Missing import: ${file} -> ${link}`)
  }
}
// Validate local named imports against the exports in their target modules.
// A missing export prevents the browser from loading the entire React application.
for (const file of files) {
  if (!/\.(js|jsx)$/.test(file)) continue
  const contents = readFileSync(file, 'utf8')
  const namedImports = contents.matchAll(/\bimport\s*\{([^}]+)\}\s*from\s*['"](\.[^'"]+)['"]/g)
  for (const [, names, link] of namedImports) {
    const base = resolve(dirname(file), link)
    const target = [base, `${base}.js`, `${base}.jsx`].find(existsSync)
    if (!target) continue // Missing file is already reported above.
    const moduleSource = readFileSync(target, 'utf8')
    for (const specifier of names.split(',')) {
      const name = specifier.trim().split(/\s+as\s+/)[0]
      if (!name) continue
      const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const directExport = new RegExp(`\\bexport\\s+(?:async\\s+)?(?:const|let|var|function|class)\\s+${escapedName}\\b`)
      const groupedExport = new RegExp(`\\bexport\\s*\\{[^}]*\\b${escapedName}\\b`)
      if (!directExport.test(moduleSource) && !groupedExport.test(moduleSource)) {
        failures.push(`Missing named export: ${file} imports { ${name} } from ${link}`)
      }
    }
  }
}

const photoConfig = readFileSync(join(eventDir, 'data/photos.js'), 'utf8')
for (const [, name] of photoConfig.matchAll(/photoUrl\(["']([^"'\n]+)["']\)/g)) {
  if (!existsSync(join(publicPhotos, name))) failures.push(`Missing photograph: ${name}`)
}
if (existsSync(join(source, 'features'))) failures.push('Old two-folder feature structure still exists.')
const componentDir = join(eventDir, 'components')
for (const unused of ['Login.jsx', 'Splash.jsx', 'Nav.jsx', 'Details.jsx', 'Rsvp.jsx', 'RsvpModal.jsx', 'Notes.jsx']) {
  if (existsSync(join(componentDir, unused))) failures.push(`Unused sample component remains: ${unused}`)
}
const app = readFileSync(join(eventDir, 'AmanpreetMeghaSite.jsx'), 'utf8')
for (const required of ['<Envelope', '<InvitationHero', '<Letter', '<Weekend', '<Place', '<StoryHero', '<StoryIntro', '<Story', '<Join', '<ClosingNote', '<Finale']) {
  if (!app.includes(required)) failures.push(`Missing section from App: ${required}`)
}
if (/\b(?:Details|Splash|Login|Notes|RsvpModal)\b/.test(app)) failures.push('A removed section is still referenced in App.')

const header = readFileSync(
  join(componentDir, 'SiteHeader.jsx'),
  'utf8'
)

if (
  !header.includes('<WaxSeal') ||
  !header.includes('onClick={onTop}')
) {
  failures.push(
    'Header must contain a gold wax-seal back-to-top button.'
  )
}

if (/onRsvp|RsvpModal|header-rsvp/.test(app + header)) {
  failures.push(
    'The old RSVP action is still referenced.'
  )
}

if (
  !header.includes(
    'aria-label="Open navigation menu"'
  )
) {
  failures.push(
    'The shared header navigation button is missing.'
  )
}


const eventConfig = readFileSync(join(eventDir, 'data/wedding.js'), 'utf8')
const hero = readFileSync(join(componentDir, 'InvitationHero.jsx'), 'utf8')
const storyHero = readFileSync(join(componentDir, 'StoryHero.jsx'), 'utf8')
const weekend = readFileSync(join(componentDir, 'Weekend.jsx'), 'utf8')
const place = readFileSync(join(componentDir, 'Place.jsx'), 'utf8')
const footer = readFileSync(join(componentDir, 'WeddingFooter.jsx'), 'utf8')
const title = readFileSync(join(componentDir, 'CoupleTitle.jsx'), 'utf8')
const router = readFileSync(join(source, 'app/App.jsx'), 'utf8')
const registry = readFileSync(join(source, 'events/registry.js'), 'utf8')
const main = readFileSync(join(source, 'main.jsx'), 'utf8')
if (!main.includes("'./app/App.jsx'")) failures.push('Main entry must use InviteYourWay app router.')
if (!router.includes('eventRegistry') || !router.includes('<Home') || !router.includes('<NotFound')) {
  failures.push('InviteYourWay must route the homepage, registered events and unknown URLs.')
}
if (!registry.includes("'amanpreet-weds-megha'") || !registry.includes("['wedding', 'reception']")) {
  failures.push('Expected both /amanpreet-weds-megha/wedding and /amanpreet-weds-megha/reception.')
}
if (!app.includes('getInvitation(page)')) failures.push('Invitation must receive its page from the main router.')
if (app.includes('window.location.pathname')) failures.push('Invitation still contains top-level URL selection.')

if (!eventConfig.includes('wedding: {') || !eventConfig.includes('reception: {')) {
  failures.push('Expected independent wedding and reception data sections.')
}
if (!app.includes("useState('')")) failures.push('Day cards must begin closed.')
if (!weekend.includes('event.schedule')) failures.push('The itinerary is not sourced from the event configuration.')
if (!app.includes("event.variant === 'wedding' ? event.venues : [event.venue]")) failures.push('Venue display must preserve wedding / reception route behavior.')
if (!place.includes('venues.map') || !place.includes('venue.photo')) failures.push('Both venue pictures must be rendered.')
if (!hero.includes('hero-location') || !hero.includes('event.venue.name')) failures.push('The hero is missing the selected venue location.')
if (!footer.includes('footerLabel') || !footer.includes('footerLocation')) failures.push('The footer must remain shared on both links.')

// Execute only the dependency-free event configuration to catch content regressions.
// This specifically prevents /reception from losing the full five-day itinerary.
const configForValidation = eventConfig.replaceAll('import.meta.env.BASE_URL', JSON.stringify('/'))
try {
  const { getInvitation } = await import(`data:text/javascript;base64,${Buffer.from(configForValidation).toString('base64')}`)
  const full = getInvitation('wedding')
  const reception = getInvitation('reception')
  if (full.schedule.length !== 5 || JSON.stringify(full.schedule) !== JSON.stringify(reception.schedule)) {
    failures.push('Both routes must show the same complete five-day itinerary.')
  }
  if (full.scheduleTitle !== reception.scheduleTitle) {
    failures.push('Both routes must have the same itinerary heading.')
  }
  if (full.venues.length !== 2 || JSON.stringify(full.venues) !== JSON.stringify(reception.venues)) {
    failures.push('Both routes must show the same two venue blocks.')
  }
  if (full.venues[0]?.id !== 'wedding' || full.venues[1]?.id !== 'reception') {
    failures.push('Venue blocks must show wedding first and reception second.')
  }
  if (full.dateISO === reception.dateISO || full.venue.id === reception.venue.id) {
    failures.push('The hero and countdown must select different event details for each URL.')
  }
  if (full.footerDate === reception.footerDate || full.footerLabel === reception.footerLabel) {
    failures.push('Keep the current route-specific footer details.')
  }
} catch (error) {
  failures.push(`Cannot evaluate both event configurations: ${error.message}`)
}
if (!hero.includes('<CoupleTitle') || !footer.includes('<CoupleTitle') || !title.includes('couple-title-weds')) {
  failures.push('Shared title must render in both the hero and the footer.')
}
if (hero.includes('stayLabel') || hero.includes('couple.stay')) {
  failures.push('Recommended-stay copy remains in the hero.')
}
if (!place.includes('place-photo') || !place.includes('venue.photo')) {
  failures.push('The venue photograph is missing from the main venue section.')
}
if (storyHero.includes('hero-title') || storyHero.includes('<h1>')) {
  failures.push('Animated photo hero still overlays a large title.')
}
if (!existsSync(join(project, 'vercel.json')) || !existsSync(join(project, 'public/_redirects'))) {
  failures.push('Deep-link rewrite configurations are missing.')
}
const hostingRewrites = readFileSync(join(project, 'vercel.json'), 'utf8')
const netlifyRedirects = readFileSync(join(project, 'public/_redirects'), 'utf8')
if (!hostingRewrites.includes('index.html') || !netlifyRedirects.includes('/*')) {
  failures.push('Hosting configuration must support nested event links.')
}
// Validate all directly referenced event image files (hero and both venue
// images, including the wedding-only second slide). The old hard-coded sample
// filenames are intentionally not required if the actual venue uses new photos.
const allDirectPhotoReferences = files
  .filter((file) => /\.(jsx|js|css)$/.test(file))
  .flatMap((file) => Array.from(
    readFileSync(file, 'utf8').matchAll(
      /events\/amanpreet-weds-megha\/photos\/([\w.-]+\.(?:jpe?g|png|webp|avif|svg))/gi,
    ),
    ([, filename]) => filename,
  ))
for (const filename of new Set(allDirectPhotoReferences)) {
  if (!existsSync(join(publicPhotos, filename))) failures.push(`Missing directly referenced photo: ${filename}`)
}
if (!eventConfig.includes('events/amanpreet-weds-megha/photos/')) {
  failures.push('Wedding venue photo URLs must point to the event-specific asset folder.')
}
if (!photoConfig.includes('events/amanpreet-weds-megha/photos/')) {
  failures.push('Story photo URLs must point to the event-specific asset folder.')
}


if (failures.length) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Validated ${files.length} source/style files, InviteYourWay routing, both invitation variants, components, and photographs.`)
}
