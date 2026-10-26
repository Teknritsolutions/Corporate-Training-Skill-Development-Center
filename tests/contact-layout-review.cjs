const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch({headless:true,executablePath:path.join(process.env.LOCALAPPDATA,'ms-playwright/chromium-1248/chrome-win64/chrome.exe')});const p=await b.newPage();const failures=[];let mapStatus=null;p.on('response',r=>{if(r.url().includes('openstreetmap.org/export/embed.html'))mapStatus=r.status();});
for(const width of [390,768,1440]){await p.setViewportSize({width,height:1000});await p.goto('http://127.0.0.1:4173/pages/contact.html');await p.evaluate(()=>document.fonts.ready);
for(const dir of ['ltr','rtl']){await p.evaluate(d=>document.documentElement.dir=d,dir);const r=await p.evaluate(()=>{const left=document.querySelector('.contact-inquiry-intro');const right=document.querySelector('.contact-form-card');return{overflow:document.documentElement.scrollWidth>innerWidth+1,heightDifference:Math.abs(left.getBoundingClientRect().height-right.getBoundingClientRect().height),context:document.querySelectorAll('.contact-context-detail').length};});if(r.overflow||r.context!==2||(width===1440&&r.heightDifference>2))failures.push({width,dir,...r});}
await p.evaluate(()=>document.documentElement.dir='ltr');await p.locator('.contact-faq-grid summary').first().click();if(await p.locator('.contact-faq-grid details').first().getAttribute('open')===null)failures.push({width,faq:true});
await p.locator('.contact-map-layout iframe').scrollIntoViewIfNeeded();
const map=p.locator('.contact-map-frame iframe');const initial=await map.getAttribute('src');
await p.locator('.contact-map-frame').hover();await p.mouse.wheel(0,300);await p.waitForTimeout(150);
if(await map.getAttribute('src')!==initial)failures.push({width,wheelChangedMap:true});
await p.locator('[data-map-zoom="out"]').click();const zoomedOut=await map.getAttribute('src');
await p.locator('[data-map-zoom="in"]').click();const zoomedIn=await map.getAttribute('src');
if(zoomedOut===initial||zoomedOut===zoomedIn)failures.push({width,zoomButtons:true});
await p.frameLocator('.contact-map-layout iframe').locator('canvas').first().waitFor({timeout:20000});await p.locator('.contact-map-layout').screenshot({path:'documentation/screenshots/contact-map-'+width+'.png'});await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:'documentation/screenshots/contact-refined-'+width+'.png',fullPage:true});}
console.log(JSON.stringify({checks:6,mapStatus,failures}));await b.close();if(failures.length)process.exitCode=1;})();
