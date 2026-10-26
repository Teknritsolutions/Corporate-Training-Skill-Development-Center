const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch({headless:true,executablePath:path.join(process.env.LOCALAPPDATA,'ms-playwright/chromium-1248/chrome-win64/chrome.exe')});const p=await b.newPage();const failures=[];
for(const width of [390,768,1440]){await p.setViewportSize({width,height:1000});await p.goto('http://127.0.0.1:4173/pages/methodology.html');await p.evaluate(()=>document.fonts.ready);await p.locator('.delivery-guide').scrollIntoViewIfNeeded();await p.locator('.delivery-guide img').evaluateAll(async imgs=>{await Promise.all(imgs.map(i=>i.decode()));if(imgs.some(i=>!i.naturalWidth))throw new Error('Missing delivery guide photo');});
for(const dir of ['ltr','rtl']){await p.evaluate(d=>document.documentElement.dir=d,dir);if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))failures.push({width,dir});}
await p.evaluate(()=>document.documentElement.dir='ltr');
await p.locator('.progress-photo-card').first().scrollIntoViewIfNeeded();
await p.locator('.progress-photo').evaluateAll(async imgs=>{await Promise.all(imgs.map(i=>i.decode()));if(imgs.length!==3||imgs.some(i=>!i.naturalWidth))throw new Error('Missing progress photo');});
await p.locator('.grid:has(.progress-photo-card)').screenshot({path:'documentation/screenshots/learning-progress-'+width+'.png'});
await p.locator('.delivery-guide').screenshot({path:'documentation/screenshots/methodology-delivery-'+width+'.png'});}
console.log(JSON.stringify({checks:6,failures}));await b.close();if(failures.length)process.exitCode=1;})();
