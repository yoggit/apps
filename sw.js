// apps-hub service worker.
//
// WHY IT EXISTS AT ALL: Chrome on Android only mints a real installed app (a WebAPK, with its own
// icon and its own window) when the site has a manifest AND a service worker with a fetch handler.
// Without one you get a bookmark shortcut instead — a Chrome-badged icon that opens in a browser
// tab, which is exactly what this page did before.
//
// Everything here is a static marketing page, so there is nothing private to leak into the cache.
// (Dinachari and Chukta have workers too, added for the same reason, but theirs cache only an
// explicit allowlist because those apps hold somebody's data. This one has none to hold.)
//
// 🔴 BUMP CACHE ON EVERY DEPLOY THAT TOUCHES A PRECACHED FILE, or the change reaches nobody.
const CACHE = "hub-v2";

// Precache the whole shell rather than a subset: a file that is NOT precached falls back, on a
// failed fetch, to whatever copy happens to be lying in the cache — possibly from an older deploy.
// Precaching pins the fallback to this generation, so the page can only ever be a coherent snapshot.
const CORE = [
  "./", "./index.html", "./manifest.webmanifest",
  "./assets/icon-192.png", "./assets/icon-512.png",
  "./assets/favicon-onlight.png", "./assets/favicon-ondark.png",
  "./assets/fonts/fonts.css",
  "./assets/fonts/baloo2-latin.woff2", "./assets/fonts/baloo2-latin-ext.woff2",
  "./assets/fonts/inter-latin.woff2", "./assets/fonts/inter-latin-ext.woff2",
];

self.addEventListener("install", e => {
  // Cache entries individually. cache.addAll() is atomic, so one 404 rejects the whole batch and
  // takes the install with it — no worker, no install prompt, and no error anybody would notice.
  e.waitUntil(caches.open(CACHE)
    .then(c => Promise.allSettled(CORE.map(u => c.add(u))))
    .then(() => self.skipWaiting())
    .catch(() => {}));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return;          // never touch cross-origin traffic

  e.respondWith((async () => {
    // Network first, so a push to main is visible on the next visit rather than after a cache
    // eviction. The cache is the fallback for a flaky connection, not the source of truth.
    try {
      const fresh = await fetch(req);
      if (fresh && fresh.ok) (await caches.open(CACHE)).put(req, fresh.clone());
      return fresh;
    } catch {
      const hit = await caches.match(req);
      if (hit) return hit;
      // 🔴 Only a NAVIGATION may fall back to the shell. Answering a failed .css or .js with
      // index.html hands the parser HTML where it expects code, and the page breaks in a way that
      // looks nothing like "you are offline".
      if (req.mode === "navigate") return (await caches.match("./index.html")) || Response.error();
      return Response.error();
    }
  })());
});
