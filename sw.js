"use strict";
// Offline support: cache the app shell, serve it cache-first, refresh in background.
const CACHE = "fikra-time-v1";
const SHELL = [
    "./", "./index.html", "./style.css", "./script.js",
    "./manifest.webmanifest", "./icons/icon.svg",
    "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png"
];

self.addEventListener("install", event => {
    event.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    const { request } = event;
    if (request.method !== "GET") return;

    event.respondWith(
        caches.match(request).then(cached => {
            const network = fetch(request).then(response => {
                if (response && (response.ok || response.type === "opaque")) {
                    const copy = response.clone();
                    caches.open(CACHE).then(c => c.put(request, copy));
                }
                return response;
            }).catch(() => cached);
            return cached || network;
        })
    );
});
