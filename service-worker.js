const NOME_CACHE = 'recibo-vale-transporte-v2'
const ARQUIVOS_CACHE = [
    './',
    './index.html',
    './css/estilos.css',
    './js/principal.js',
    './assets/favicon.ico'
]

self.addEventListener('install', evento => {
    evento.waitUntil(
        caches.open(NOME_CACHE).then(cache => cache.addAll(ARQUIVOS_CACHE))
    )
})

self.addEventListener('activate', evento => {
    evento.waitUntil(
        caches.keys().then(chaves =>
            Promise.all(
                chaves.map(chave => {
                    if (chave !== NOME_CACHE) {
                        return caches.delete(chave)
                    }
                })
            )
        )
    )
})

self.addEventListener('fetch', evento => {
    evento.respondWith(
        caches.match(evento.request).then(resposta => resposta || fetch(evento.request))
    )
})
