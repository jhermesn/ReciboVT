const CACHE_NAME='recibo-vale-transporte-v1'
const ASSETS_TO_CACHE=['/','/index.html','/css/styles.css','/js/main.js','/assets/favicon.ico']
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS_TO_CACHE)))})
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>{if(k!==CACHE_NAME){return caches.delete(k)}}))))})
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))})
