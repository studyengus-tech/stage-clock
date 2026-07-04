const CACHE='stage-clock-v13';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k!=='fonts').map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.hostname.indexOf('fonts.googleapis.com')>-1||url.hostname.indexOf('fonts.gstatic.com')>-1){
    e.respondWith(caches.open('fonts').then(c=>c.match(req).then(r=>r||fetch(req).then(res=>{c.put(req,res.clone());return res;}).catch(()=>r))));
    return;
  }
  e.respondWith(caches.match(req).then(r=>r||fetch(req).catch(()=>caches.match('./index.html'))));
});
