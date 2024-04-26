self.importScripts('car-deals/data/car-deals.js');

var cacheName = 'car-deals-v1';
var appShellFiles = [
    './',
    'car-deals/data/car-deals.js',
    'index.html',
    'app.js',
    'style.css',
    'favicon.ico',
    'img/car-deals.png',
    'img/bg.png',
    'car-deals/resources/material-design-lite/material.min.js.map',
    'car-deals/resources/material-design-lite/material.red-indigo.min.css',
];

var carsImages = [];
for (var i = 0; i < cars.length; i++) {
    carsImages.push('car-deals/data/img/' + cars[i].slug + '.jpg');
}
var contentToCache = appShellFiles.concat(carsImages);


self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(contentToCache);
        })
    );
});


self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (r) {
            console.log('[Service Worker] Fetching resource: ' + e.request.url);
            return r || fetch(e.request).then(function (response) {
                return caches.open(cacheName).then(function (cache) {
                    console.log('[Service Worker] Caching new resource: ' + e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (cacheName.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }));
        })
    );
});