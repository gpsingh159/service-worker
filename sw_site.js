const cacheName = "v12";

// install event is called of server worker
self.addEventListener("install", (event) => {
  console.log("service worker is installed ");
});

// after install then activate event is called of  serve worker

self.addEventListener("activate", (e) => {
  console.log("service worker is activated ");

  // remove unwanted cache
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log("service worker : clear old cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// fetch event
self.addEventListener('fetch', evt => {
  // check if request is made by chrome extensions or web page
  // if request is made for web page url must contains http.
  if (!(evt.request.url.indexOf('http') === 0)) return; // skip the request. if request is not made with http protocol

  evt.respondWith(
    caches
      .match(evt.request)
      .then(
        cacheRes =>
          cacheRes ||
          fetch(evt.request).then(fetchRes =>
            caches.open(cacheName).then(cache => {
              cache.put(evt.request.url, fetchRes.clone());
              // check cached items size
             //limitCacheSize(cacheName, 75);
              return fetchRes;
            })
          )
      )
      .catch(() => caches.match('/fallback'))
  );
});

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};