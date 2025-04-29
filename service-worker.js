self.addEventListener('install', e => {console.log('Service worker installed')});
self.addEventListener('fetch', e => {e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)))});
