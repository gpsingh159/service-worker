const cacheName = "v1";

const cacheAssets = ["index.html", "about.html", "main.js"];
// install event is called of server worker
self.addEventListener("install", (event) => {
  console.log("service worker is installed ");
  // adding all file in the cache
  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log("service worker caching all files");
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  )
});

// after install then activate event is called of  serve worker

self.addEventListener("activate", e => {
  console.log("service worker is activated " );

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
      )
    }) 
  )
});

self.addEventListener('fetch' , e => {
    console.log("Service worker: Fetching");
    e.respondWith(
        fetch(e.request).catch(()=> caches.match(e.request))
        )
});
