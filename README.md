# fikra Luxury Time

Luxury analog watch face with a digital readout, timer, stopwatch, multiple alarms and a world clock.
English + Arabic (RTL), three themes, installable as an app (PWA) and works offline.

Made by **Fikra Digital**.

## Run it

Just open `index.html`, or serve the folder to get the installable/offline version:

```bash
npm start            # serves on http://localhost:5173
```

> The service worker (offline + "Install app") only works over `http://localhost` or `https://`, not `file://`.

## Features

- Analog watch that scales to any screen; Classic / Minimal / Sport faces, Roman / 12 / none numerals, Gold / Steel / Black bezel, custom hand colour
- Real time, manual time, or sped-up / slowed-down time
- 24h / 12h, English / Arabic (auto-detected from the browser), Midnight / Emerald / Ivory themes
- Timer with presets, progress ring, and recovery after a page reload
- Stopwatch with lap + total times and best / worst highlighting
- Multiple alarms (labels, repeat days, three sounds, edit, snooze, one-off alarms)
- World clock with 24 cities
- App and watch-face background images (auto-resized so they actually fit in storage)
- Settings save automatically

## Tests

```bash
npm install
npx playwright install chromium
npm test
```

Runs 14 browser smoke tests: loading, navigation, timer, stopwatch, alarms (including ringing + snooze using a fake clock),
world clock, settings persistence, Arabic/RTL, mobile layout and PWA files.

## Project layout

```
index.html              markup, meta tags, icon sprite
style.css               design tokens (themes) + components
script.js               all behaviour (i18n, clock, timer, stopwatch, alarms, world clock, settings)
sw.js                   service worker (offline cache)
manifest.webmanifest    PWA manifest
icons/                  app icons (SVG + PNG)
tests/smoke.test.js     Playwright smoke tests
```

## Notes

- Alarms and timers ring only while the page or installed app is open (a browser limitation without a push server).
- Fonts (Inter, Cairo, Playfair Display) load from Google Fonts without blocking rendering; system fonts are used if offline for the first visit.
