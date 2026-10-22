/* ManjiLearn : service worker. Change VER avec la même valeur que dans index.html à chaque publication. */
const VER="2026.10.22.2",V="manjilearn-"+VER,F=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(F)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request,u=new URL(r.url);if(r.method!="GET"||u.origin!=location.origin)return;
e.respondWith(fetch(r.mode=="navigate"?new Request(r.url,{cache:"no-cache"}):r).then(x=>{if(x.ok&&!u.search){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))))});
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(l=>l[0]?l[0].focus():clients.openWindow("./")))});
