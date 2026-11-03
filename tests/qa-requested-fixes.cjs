const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox'],proxy:process.env.HTTPS_PROXY?{server:process.env.HTTPS_PROXY,bypass:'localhost,127.0.0.1'}:undefined});
 try{for(const width of [384,412]){
  const page=await browser.newPage({viewport:{width,height:915},isMobile:true,hasTouch:true});
  await page.goto('http://127.0.0.1:8000/story-desktop.html');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(100);
  const units=await page.locator('.story-visual').evaluateAll(elements=>elements.map(e=>parseFloat(e.style.getPropertyValue('--actor-unit'))));
  units.slice(0,12).forEach(value=>assert(Math.abs(value-units[0])<.001,'Main scenes must share one scale'));
  assert(units[12]<units[0],'Keep all five team members visible');
  async function sample(i,p){
   const beat=await page.evaluate(({i,p})=>ColorClikStoryTimeline.sample(i,p).beat,{i,p});
   await page.evaluate(({i,p})=>{const r=document.querySelectorAll('.story-runway')[i],m=r.firstElementChild;scrollTo(0,r.getBoundingClientRect().top+scrollY+(r.offsetHeight-m.offsetHeight)*p);},{i,p});
   await page.waitForFunction(({i,beat})=>document.querySelectorAll('.scene')[i].dataset.motionBeat===beat,{i,beat});
   await page.waitForFunction(({i,p})=>Math.abs(Number(document.querySelectorAll('.scene')[i].dataset.motionProgress)-p)<.005,{i,p});
   await page.waitForTimeout(150);
   await page.waitForFunction(i=>[...document.querySelectorAll('#scene'+(i+1)+' .motion-pose,#scene'+(i+1)+' .motion-layer')].filter(e=>!e.hidden).every(e=>e.complete&&e.naturalWidth>0),i);
  }
  const positions=[];
  for(const p of [.06,.16,.29,.36,.56,.67,.29]){
   await sample(6,p);
   const state=await page.locator('#scene7 .motion-layer').first().evaluate(e=>({x:e.getBoundingClientRect().x,transform:e.style.transform}));
   assert(state.transform.includes(p<.54?'scaleX(-1)':'scaleX(1)'));
   positions.push(state.x);
   if(width===412&&p===.29)await page.screenshot({path:'docs/corrected-blue-right-arrival.png'});
  }
  assert(positions[1]<positions[0],'Arrive from right');assert(positions[5]>positions[4],'Leave to right');
  await sample(9,.02);
  assert((await page.locator('#scene10 .motion-pose').getAttribute('src')).includes('tired-transparent.webp'));
  if(width===412)await page.screenshot({path:'docs/corrected-aqua-transparent.png'});
  console.log(`${width}: one main-story scale, blue enters from right, transparent aqua asset PASS`);
  await page.close();
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
