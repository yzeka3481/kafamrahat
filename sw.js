// Basit cache + push iskeleti
const CACHE_NAME = "kafam-rahat-v1";
const ASSETS = [
  "/kafamrahat/",
  "/kafamrahat/index.html",
  "/kafamrahat/manifest.webmanifest"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});

// Push geldiğinde bildirim göster (sunucu tarafı push gerektirir)
self.addEventListener("push", event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Kafam Rahat";
  const options = {
    body: data.body || "Yeni bir hatırlatman var.",
    icon: "/kafamrahat/icon-192.png",
    badge: "/kafamrahat/icon-192.png"
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Bildirime tıklama (örnek)
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes("/kafamrahat/") && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/kafamrahat/");
      }
    })
  );
});
