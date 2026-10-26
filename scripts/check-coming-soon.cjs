const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:path.join(process.env.LOCALAPPDATA,'ms-playwright/chromium-1248/chrome-win64/chrome.exe')});
 const page=await browser.newPage();
 for(const width of [320,390,768,1024,1440]){
  await page.setViewportSize({width,height:950});
  await page.goto('http://127.0.0.1:4173/pages/coming-soon.html');
  const result=await page.evaluate(()=>{
   const r=s=>document.querySelector(s).getBoundingClientRect();
   const input=r('form input'),button=r('form .btn'),form=r('form'),back=r('.utility > p:last-child');
   return {overflow:document.documentElement.scrollWidth>innerWidth,gap:button.top-input.bottom,returnGap:back.top-form.bottom,alignment:Math.abs(input.left-button.left)};
  });
  if(result.overflow||result.gap<16||result.returnGap<20||result.alignment>1) throw Error(width+JSON.stringify(result));
  console.log(width+'px alignment passed');
 }
 await page.locator('input[name=email]').fill('layout@example.com');
 await page.locator('form button').click();
 if(!await page.locator('.form-status').textContent())throw Error('No form feedback');
 await page.screenshot({path:'documentation/screenshots/coming-soon-aligned.png',fullPage:true});
 console.log('Subscription flow passed');
 await browser.close();
})();
