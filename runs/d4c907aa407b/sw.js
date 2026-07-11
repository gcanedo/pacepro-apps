// pp-race-app d4c907aa407b vd67d47a287a0
const CACHE='pp-race-app-d4c907aa407b-d67d47a287a0';
const TILES='pp-race-app-d4c907aa407b-tiles';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.add('./').catch(()=>null)));});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{
  // purge stale versioned caches for this run, keep the tiles bucket
  const prefix='pp-race-app-d4c907aa407b';
  const names=await caches.keys();
  await Promise.all(names.filter(n=>n.startsWith(prefix)&&n!==CACHE&&n!==TILES).map(n=>caches.delete(n)));
  await self.clients.claim();
})());});
self.addEventListener('fetch',e=>{
  const url=e.request.url;
  if(url.includes('/tiles/')||url.includes('/voice/')){
    e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{const cl=r.clone();caches.open(TILES).then(c=>c.put(e.request,cl));return r;})));
    return;
  }
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(r=>{const cl=r.clone();caches.open(CACHE).then(c=>c.put('./',cl));return r;}).catch(()=>caches.match('./')));
  }
});
