const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
 const exe = path.join(process.env.LOCALAPPDATA, 'ms-playwright/chromium-1248/chrome-win64/chrome.exe');
 const browser = await chromium.launch({headless:true, executablePath:fs.existsSync(exe)?exe:undefined});
 const page = await browser.newPage();
 const failures=[];
 for(const name of fs.readdirSync('pages/dashboard').filter(n=>n.endsWith('.html'))) {
  for(const width of [390,768,1440]) {
   await page.setViewportSize({width,height:1000});
   await page.goto('http://127.0.0.1:4173/pages/dashboard/'+name);
   await page.evaluate(()=>document.fonts.ready);
   for(const dir of ['ltr','rtl']) {
    await page.evaluate(d=>document.documentElement.dir=d,dir);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
    if(overflow) failures.push({name,width,dir});
   }
   if(name==='programs.html' && width!==768) {
    await page.evaluate(()=>document.documentElement.dir='ltr');
    await page.screenshot({path:`documentation/screenshots/dashboard-refined-${width}.png`,fullPage:true});
   }
  }
 }
 console.log(JSON.stringify({checks:84,failures}));
 await browser.close();
 if(failures.length) process.exitCode=1;
})();
