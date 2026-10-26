const {chromium}=require('playwright');const path=require('path');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:path.join(process.env.LOCALAPPDATA,'ms-playwright/chromium-1248/chrome-win64/chrome.exe')});const page=await browser.newPage();const failures=[];
for(const slug of ['communication-skills','leadership-development','sales-excellence','technical-upskilling']){
for(const width of [390,768,1440]){
await page.setViewportSize({width,height:1000});await page.goto('http://127.0.0.1:4173/pages/'+slug+'.html');await page.evaluate(()=>document.fonts.ready);
const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,title:document.querySelector('h1').innerText,breadcrumb:document.querySelector('.vh-copy .breadcrumb').innerText,modules:document.querySelectorAll('.program-module').length,intro:!!document.querySelector('.program-intro'),image:document.querySelector('.vh-photo').getAttribute('src'),active:document.querySelectorAll('#program-menu a[aria-current="page"]').length}));
if(result.overflow||result.modules!==4||!result.intro||result.active!==1||!result.breadcrumb.includes(result.title))failures.push({slug,width,...result});
await page.locator('.program-module summary').first().click();if(!(await page.locator('.program-module').first().getAttribute('open')!==null))failures.push({slug,width,accordion:true});
await page.locator('.vh-photo').evaluate(img=>img.decode());
if(width!==768)await page.screenshot({path:'documentation/screenshots/'+slug+'-'+width+'.png',fullPage:true});
await page.evaluate(()=>document.documentElement.dir='rtl');if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))failures.push({slug,width,rtl:true});
}}
console.log(JSON.stringify({checks:24,failures}));await browser.close();if(failures.length)process.exitCode=1;})();
