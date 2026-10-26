const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch({headless:true,executablePath:path.join(process.env.LOCALAPPDATA,'ms-playwright/chromium-1248/chrome-win64/chrome.exe')});const p=await b.newPage();const failures=[];
for(const width of [390,768,1440]){await p.setViewportSize({width,height:1000});await p.goto('http://127.0.0.1:4173/pages/customized-training.html');await p.evaluate(()=>document.fonts.ready);
for(const dir of ['ltr','rtl']){await p.evaluate(d=>document.documentElement.dir=d,dir);const r=await p.evaluate(()=>{const split=document.querySelector('.training-consultation');return{overflow:document.documentElement.scrollWidth>innerWidth+1,heightDifference:Math.abs(split.querySelector('img').getBoundingClientRect().height-split.querySelector(':scope > div').getBoundingClientRect().height),paragraphs:document.querySelectorAll('.training-hero-detail').length};});if(r.overflow||r.paragraphs!==2||(width===1440&&r.heightDifference>2))failures.push({width,dir,...r});}
await p.evaluate(()=>document.documentElement.dir='ltr');
const scrollResult=await p.locator('.training-form-body').evaluate(el=>{el.scrollTop=el.scrollHeight;return {scrolls:el.scrollTop>0,height:el.clientHeight};});
const panels=await p.locator('.training-form-layout').evaluate(el=>[...el.children].map(child=>child.getBoundingClientRect().height));if(width===1440&&Math.abs(panels[0]-panels[1])>2)failures.push({width,panelHeights:panels});
if(scrollResult.scrolls)failures.push({width,unexpectedFormScroll:scrollResult});
await p.locator('#training-inquiry button[type="submit"]').scrollIntoViewIfNeeded();
await p.locator('.training-faq-list summary').first().click();
if(await p.locator('.training-faq-list details').first().getAttribute('open')===null)failures.push({width,faq:true});
await p.locator('.training-form-body').evaluate(el=>el.scrollTop=0);
await p.evaluate(()=>scrollTo(0,0));
await p.screenshot({path:'documentation/screenshots/customized-refined-'+width+'.png',fullPage:true});}
await p.goto('http://127.0.0.1:4173/pages/clients.html');await p.locator('.quote-person').scrollIntoViewIfNeeded();await p.locator('.quote-person').evaluate(i=>i.decode());console.log(JSON.stringify({checks:7,failures}));await b.close();if(failures.length)process.exitCode=1;})();
