// sw.js — Service Worker notifications push + badge
// IMPORTANT : pas de cache — toujours réseau pour éviter les bugs

// Ne jamais intercepter les requêtes — toujours aller sur le réseau
self.addEventListener(‘fetch’, event => {
event.respondWith(
fetch(event.request).catch(() => new Response(’’, { status: 503 }))
);
});

self.addEventListener(‘push’, event => {
let data = {};
try { data = event.data.json(); } catch(e) {
data = { title: ‘Nouveau message’, body: event.data ? event.data.text() : ‘’ };
}
const title = data.title || ‘Nouveau message’;
const options = {
body: data.body || ‘’,
icon: ‘icon-152.png’,
badge: ‘icon-96.png’,
tag: ‘msg-’ + Date.now(),
renotify: true,
vibrate: [200, 100, 200],
data: { url: data.url || ‘owner.html’ }
};
event.waitUntil(
Promise.all([
self.registration.showNotification(title, options),
navigator.setAppBadge ? navigator.setAppBadge(1).catch(()=>{}) : Promise.resolve()
])
);
});

self.addEventListener(‘notificationclick’, event => {
event.notification.close();
const url = (event.notification.data && event.notification.data.url) ? event.notification.data.url : ‘owner.html’;
event.waitUntil(
clients.matchAll({ type:‘window’, includeUncontrolled:true }).then(list => {
for (const c of list) { if (c.url.includes(url) && ‘focus’ in c) return c.focus(); }
if (clients.openWindow) return clients.openWindow(url);
})
);
});

self.addEventListener(‘message’, event => {
if (event.data === ‘CLEAR_BADGE’) {
if (navigator.clearAppBadge) navigator.clearAppBadge().catch(()=>{});
}
});

self.addEventListener(‘install’, () => self.skipWaiting());
self.addEventListener(‘activate’, event => {
event.waitUntil(
caches.keys()
.then(keys => Promise.all(keys.map(k => caches.delete(k))))
.then(() => clients.claim())
);
});
