const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
(async()=>{
 const exe=path.join(process.env.LOCALAPPDATA,'ms-playwright/chromium-1248/chrome-win64/chrome.exe');
 const browser=await chromium.launch({headless:true,...(fs.existsSync(exe)?{executablePath:exe}:{})});
 const page=await browser.newPage();
 for(const width of [390,768,1024]){
  await page.setViewportSize({width,height:850});
  await page.goto('http://127.0.0.1:4173/pages/home-2.html');
  await page.locator('.menu-toggle').click();
  const state=await page.locator('.primary-nav').evaluate(n=>({right:n.getBoundingClientRect().right,top:n.getBoundingClientRect().top,height:n.getBoundingClientRect().height,scroll:n.scrollHeight,client:n.clientHeight}));
  if(state.right!==width||state.top!==0||state.height!==850) throw Error(JSON.stringify(state));
  await page.locator('[aria-controls="home-menu"]').click();
  if(!await page.locator('#home-menu').isVisible()) throw Error('Submenu hidden');
  await page.locator('.nav-close').click();
  if(await page.locator('.primary-nav').isVisible()) throw Error('Drawer did not close');
  console.log(width+'px: drawer position, submenu, and close passed');
 }
 await page.setViewportSize({width:1440,height:900});
 await page.reload();
 if(!await page.locator('.primary-nav').isVisible()||await page.locator('.nav-close').isVisible()) throw Error('Desktop changed');
 console.log('Desktop navigation passed');
 await browser.close();
})();
