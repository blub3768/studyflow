'use strict';
// Display notifications requested by the active page. No background timer or push server.
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  event.waitUntil((async()=>{
    const appURL=new URL('./index.html',self.registration.scope).href;
    const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    const app=windows.find(client=>client.url.startsWith(self.registration.scope));
    if(app)return app.focus();
    return self.clients.openWindow(appURL);
  })());
});
