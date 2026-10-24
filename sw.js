/* ManjiLearn : service worker. Change VER avec la même valeur que dans index.html à chaque publication. */
const VER="2026.10.24.2",V="manjilearn-"+VER,F=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-maskable-512.png"];
const notify=(t,o)=>self.registration.showNotification(t,Object.assign({icon:"icon-192.png",badge:"icon-192.png"},o));
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(F.map(f=>c.add(f).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
/* Hors ligne : réseau d'abord, cache ensuite, page principale en dernier recours */
self.addEventListener("fetch",e=>{const r=e.request,u=new URL(r.url);if(r.method!="GET"||u.origin!=location.origin)return;
e.respondWith(fetch(r.mode=="navigate"?new Request(r.url,{cache:"no-cache"}):r).then(x=>{if(x.ok&&!u.search){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html")||caches.match("./"))))});
/* Notifications push (si un serveur push est ajouté plus tard) */
self.addEventListener("push",e=>{let d={};try{d=e.data.json()}catch(x){d={body:e.data?e.data.text():""}}e.waitUntil(notify(d.title||"ManjiLearn",{body:d.body||"",tag:d.tag||"manji"}))});
/* Vérification périodique en arrière-plan : prévient quand une nouvelle version est publiée */
self.addEventListener("periodicsync",e=>{if(e.tag=="manji-update")e.waitUntil(fetch("index.html?v="+Date.now(),{cache:"no-store"}).then(r=>r.text()).then(t=>{const m=t.match(/const VER="([^"]+)"/);if(m&&m[1]!=VER)return notify("ManjiLearn",{body:"Nouvelle version "+m[1]+" disponible. Ouvre l’app pour la mettre à jour.",tag:"manji-update"})}).catch(()=>{}))});
/* Synchronisation en arrière-plan (réservé pour plus tard) */
self.addEventListener("sync",e=>{if(e.tag=="manji-sync")e.waitUntil(Promise.resolve())});
self.addEventListener("message",e=>{if(e.data=="skipWaiting")self.skipWaiting()});
self.addEventListener("notificationclick",e=>{e.notification.close();e.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(l=>l[0]?l[0].focus():clients.openWindow("./")))});
