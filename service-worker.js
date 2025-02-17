const CACHE_NAME = "todo-pwa-cache-v2";
const urlsToCache = ["/", "/index.html", "/add.html", "/style.css", "/app.js", "/db.js"];

// Install dan Cache Assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Caching assets...");
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting(); // Agar SW baru langsung aktif
});

// Hapus Cache Lama Saat SW Baru Aktif
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== "todo-pwa-cache-v2") {  // ✅ Pakai string
                        console.log("Deleting old cache:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim(); // SW langsung mengontrol halaman tanpa reload
});

// Fetch Data dari Cache atau Network
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => caches.match("/index.html")); // Fallback ke index.html jika offline
        })
    );
});

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("app-cache").then((cache) => {
            return cache.addAll(["/", "/index.html", "/add.html", "/style.css", "/app.js", "/db.js"]);
        })
    );
    console.log("Service Worker Installed!");
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request, { redirect: "follow" }) // Izinkan redirect
        .catch(() => caches.match(event.request))
    );
});

if (!Array.isArray(cacheNames)) {
    console.error("cacheNames is not an array:", cacheNames);
    return;
}