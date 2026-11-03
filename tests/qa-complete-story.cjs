const assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{for(const [width,height] of [[320,568],[375,812],[768,1024],[1024,768],[812,375]]){
  const page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true});
  const errors=[],missing=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()===404&&r.url().includes('/assets/'))missing.push(r.url());});
  await page.goto('http://127.0.0.1:8000/story-desktop.html');
  const chapters=await page.evaluate(()=>ColorClikStoryTimeline.stories.map(beats=>beats.map((beat,i)=>({id:beat.id,p:beat.at+((beats[i+1]?.at??1)-beat.at)*.5}))));
  let count=0;
  for(let i=0;i<chapters.length;i++){
   for(const beat of chapters[i]){
    await page.evaluate(({i,p})=>{const r=document.querySelectorAll('.story-runway')[i],m=r.querySelector('.story-moment');scrollTo(0,r.getBoundingClientRect().top+scrollY+(r.offsetHeight-m.offsetHeight)*p);},{i,p:beat.p});
    await page.waitForFunction(({i,id})=>document.querySelectorAll('.scene')[i].dataset.motionBeat===id,{i,id:beat.id},{timeout:8000});
    const bounds=await page.locator('#scene'+(i+1)+' .story-visual').evaluate(el=>{const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,viewport:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth};});
    assert(bounds.top>=-1&&bounds.bottom<=bounds.viewport+1,`${width} ${beat.id}: art outside viewport ${JSON.stringify(bounds)}`);
    assert.equal(bounds.overflow,false);count++;
    if(width===375&&['marketing-look-at-phone','marketing-present-laptop','red-door-welcome','banana-peel-falls','purple-lowers-aqua','project-1-presentation','team-final-hug'].includes(beat.id))await page.screenshot({path:`docs/complete-${beat.id}.png`});
   }
   const details=page.locator('#scene'+(i+1)+' .story-details');
   if(await details.count()){
    const rects=await page.locator('#scene'+(i+1)).evaluate(el=>({runway:el.querySelector('.story-runway').getBoundingClientRect().bottom,details:el.querySelector('.story-details').getBoundingClientRect().top}));
    assert(rects.details>=rects.runway-1,'Pricing must follow the complete animation');
   }
  }
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
  console.log(`${width}x${height}: ${count} visible narrative beats, 18 chapters, no missing assets PASS`);
  await page.close();
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
