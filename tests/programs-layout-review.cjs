const { chromium } = require('playwright');
const fs=require('fs');const path=require('path');
(async()=>{
const exe=path.join(process.env.LOCALAPPDATA,'ms-playwright/chromium-1248/chrome-win64/chrome.exe');
const b=await chromium.launch({headless:true,executablePath:exe});const p=await b.newPage();const failures=[];
for(const width of [390,768,1440]){
await p.setViewportSize({width,height:1000});await p.goto('http://127.0.0.1:4173/pages/programs.html');await p.evaluate(()=>document.fonts.ready);
for(const dir of ['ltr','rtl']){await p.evaluate(d=>document.documentElement.dir=d,dir);if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))failures.push({width,dir});}
await p.evaluate(()=>document.documentElement.dir='ltr');
const photos=p.locator('.learning-format-photo');
await photos.first().scrollIntoViewIfNeeded();
await photos.evaluateAll(async images=>{await Promise.all(images.map(image=>image.decode()));if(images.length!==3||images.some(image=>!image.naturalWidth))throw new Error('Learning photos failed to load');});
await p.locator('.grid:has(.learning-format)').screenshot({path:'documentation/screenshots/learning-photos-'+width+'.png'});
await p.screenshot({path:`documentation/screenshots/programs-refined-${width}.png`,fullPage:true});
}
await p.locator('[data-category-input]').selectOption({label:'Leadership'});console.log('Visible filtered programs:',await p.locator('#program-list article:visible').count());
console.log(JSON.stringify({failures,customSelect:await p.evaluate(()=>CSS.supports('appearance','base-select'))}));
await b.close();if(failures.length)process.exitCode=1;
})();
