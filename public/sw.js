// Service Worker for VPlaza PWA

const CACHE_NAME = "vplaza-cache-v1"
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/globals.css",
  "/signup",
  "/signin",
  "/perfume-image.jpg",
  "/gadget-image.jpg",
  "/food-image.jpg",
  "/diverse-group.png",
  "/diverse-food-spread.png",
  "/diverse-clothing-rack.png",
  "/assorted-living-room-furniture.png",
  "/placeholder-gxduq.png",
]

// Install event - cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache")
      return cache.addAll(urlsToCache)
    }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// Fetch event - serve from cache, fall back to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response
      }
      return fetch(event.request).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response
        }

        // Clone the response
        const responseToCache = response.clone()

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
    }),
  )
})

// Handle push notifications
self.addEventListener("push", (event) => {
  const title = "VPlaza"
  const options = {
    body: event.data.text(),
    icon: "/icons/android-chrome-192x192.png",
    badge: "/icons/favicon-32x32.png",
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow("/"))
})
