/* NutriPlan service worker.

   The previous version was cache-first for everything, including the page
   itself: `caches.match(req) || fetch(req)`. Once index.html was in the cache
   it was served forever, so a phone that had opened the app once kept showing
   that build no matter what was deployed. That is why an old version survived
   several releases.

   Now the split is by what the request is for:
     - navigations and index.html  -> network first, cache only as a fallback,
                                      so an update is picked up as soon as the
                                      device is online
     - everything else (icons)     -> cache first, since those are static
   The app still opens with no network; it just stops pinning itself to a
   stale page. */
const VERSION = 'v40';
const CACHE = 'nutriplan-' + VERSION;
const ASSETS = [
  './', './index.html', './manifest.json',
  './icons/icon-192.png', './icons/icon-512.png',
  './icons/apple-touch-icon.png', './icons/favicon-32.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(ASSETS.map(a => c.add(a))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Lets the page ask a waiting worker to take over immediately. */
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

function isPage(req) {
  return req.mode === 'navigate' ||
         (req.destination === 'document') ||
         /\/(index\.html)?$/.test(new URL(req.url).pathname);
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== location.origin) return;

  if (isPage(req)) {
    e.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put('./index.html', copy));
          }
          return res;
        })
        .catch(() => caches.match('./index.html').then(hit => hit || caches.match('./')))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }))
  );
});
