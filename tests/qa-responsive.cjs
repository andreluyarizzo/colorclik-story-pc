const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{for(const width of [320,375,768,1024,1440,1920]){
  const page=await browser.newPage({viewport:{width,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8000/story-desktop.html');
  const state=await page.evaluate(()=>({reading:ColorClikReading,scenes:[...document.querySelectorAll('.scene')].filter(e=>e.offsetHeight&&getComputedStyle(e).visibility==='visible').length,overflow:document.documentElement.scrollWidth>innerWidth}));
  if(state.reading)assert.equal(state.scenes,18);
  assert.equal(state.overflow,false);
  const quote=page.locator('[data-quote]').first();await quote.click();assert.equal(await page.locator('dialog[open]').count(),1);
  await page.keyboard.press('Escape');assert.equal(await page.locator('dialog[open]').count(),0);assert.equal(await quote.evaluate(e=>document.activeElement===e),true);
  if(state.reading){const plan=page.locator('#scene6 [data-quote]').first();await plan.scrollIntoViewIfNeeded();await plan.click();assert.equal(await page.locator('.cc-contact [name=service]').inputValue(),'Desarrollo Web');assert.equal(await page.locator('.cc-contact [name=plan]').inputValue(),'Landing');await page.keyboard.press('Escape');}
  if([375,768,1024,1440].includes(width)){await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`docs/responsive-${width}.png`});}
  assert.deepEqual(errors,[]);console.log(`${width}: no overflow, dialog, keyboard, plan selection PASS; reading=${state.reading}`);await page.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});await page.goto('http://127.0.0.1:8000/story-desktop.html');assert.equal(await page.evaluate(()=>ColorClikReading),true);await page.setViewportSize({width:375,height:812});assert.equal(await page.locator('.scene').count(),18);await page.close();
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
