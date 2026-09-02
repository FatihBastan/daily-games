# Daily Games

Static, installable PWA that lists daily puzzle games and opens each one in the
real browser. No build step, no dependencies, no backend.

```
index.html      games array + UI + service worker registration
manifest.json   web app manifest
sw.js           app-shell service worker
icons/          192 / 512 / 512-maskable / apple-touch PNGs
```

## Adding or removing games

Edit the `GAMES` array near the top of `index.html`:

```js
const GAMES = [
  { name: "NYT Mini", url: "https://www.nytimes.com/crosswords/game/mini" },
  ...
];
```

The favicon is derived automatically from the URL's hostname. If it fails to
load, the tile falls back to the game's first letter.

## Deploy to GitHub Pages

```bash
cd daily-games
git init -b main
git add .
git commit -m "Daily games hub"
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

Then: **repo → Settings → Pages → Build and deployment → Source: Deploy from a
branch → Branch: `main` / `/ (root)` → Save.**

The site appears at `https://<user>.github.io/<repo>/` after a minute or two.

## Installing on the phone

Open that URL in Samsung Internet or Chrome for Android, then use the menu →
*Add page to* / *Install app*. HTTPS plus the manifest and service worker mean
Android installs it as a WebAPK, so it gets a proper name in the app drawer and
inside folders.

If you deploy a change and the phone still shows the old version, open the
installed app, pull to refresh, or clear the site data once — the service
worker serves the cached shell first.
