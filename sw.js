/* Daily Games — app-shell service worker.
   Caches ONLY the shell. Never intercepts or caches any game URL. */

const CACHE = "daily-games-v2";

const SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only ever touch same-origin GETs. Anything else (game sites, the Google
  // favicon service, POSTs) is left entirely to the browser: no respondWith,
  // no cache entry, no interception.
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Stay inside the app's own directory.
  const scope = new URL("./", self.location.href).pathname;
  if (!url.pathname.startsWith(scope)) return;

  // Cache-first for the shell, with a network fallback that also refreshes it.
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res && res.ok && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
