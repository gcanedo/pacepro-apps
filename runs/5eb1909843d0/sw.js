// pp-race-app 5eb1909843d0 v6ef33d8530ee
const CACHE='pp-race-app-5eb1909843d0-6ef33d8530ee';
const TILES='pp-race-app-5eb1909843d0-tiles';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.add('./').catch(()=>null)));});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{
  // purge stale versioned caches for this run, keep the tiles bucket
  const prefix='pp-race-app-5eb1909843d0';
  const names=await caches.keys();
  await Promise.all(names.filter(n=>n.startsWith(prefix)&&n!==CACHE&&n!==TILES).map(n=>caches.delete(n)));
  await self.clients.claim();
})());});
self.addEventListener('fetch',e=>{
  const url=e.request.url;
  if(url.includes('/tiles/')){
    e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{const cl=r.clone();caches.open(TILES).then(c=>c.put(e.request,cl));return r;})));
    return;
  }
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(r=>{const cl=r.clone();caches.open(CACHE).then(c=>c.put('./',cl));return r;}).catch(()=>caches.match('./')));
  }
});
