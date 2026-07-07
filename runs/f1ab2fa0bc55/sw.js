const CACHE='pp-race-app-f1ab2fa0bc55';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.add('./').catch(()=>null)));});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',e=>{
  const url=e.request.url;
  if(url.includes('/tiles/')){
    e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{const cl=r.clone();caches.open(CACHE+'-tiles').then(c=>c.put(e.request,cl));return r;})));
    return;
  }
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(r=>{const cl=r.clone();caches.open(CACHE).then(c=>c.put('./',cl));return r;}).catch(()=>caches.match('./')));
  }
});
