const CACHE_NAME = 'p2-cache-v2'; // Aggiornato a v2 per forzare il download dei nuovi file
const BASE_PATH = '/PRINCE2-Exam-Simulator/';

const urlsToCache = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'manifest.json',
  BASE_PATH + 'icon-512.png',
  BASE_PATH + 'questions.json',    // <-- Aggiunto file domande standard
  BASE_PATH + 'ai_questions.json'  // <-- Aggiunto file domande AI
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
});

// Fetch — FIX 404
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request)
          .then(res => res || caches.match(BASE_PATH + 'index.html'));
      })
  );
});
