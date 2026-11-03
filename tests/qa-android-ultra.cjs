const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{for(const [width,height,largeText] of [[412,915,false],[384,854,false],[480,1067,false],[412,780,false],[412,915,true]]){
  const page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true,deviceScaleFactor:3,userAgent:'Mozilla/5.0 (Linux; Android 16; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8000/story-desktop.html');
  if(largeText)await page.addStyleTag({content:'.reading .description{font-size:21px!important;line-height:1.6!important}.reading .title{font-size:36px!important}'});
  await page.waitForTimeout(300);
  let normalBody,groupBody;
  for(const [i,progress] of [[0,.1],[1,.4],[3,.6],[4,.85],[6,.49],[8,.4],[10,.45],[12,.5],[17,.8]]){
   await page.evaluate(({i,progress})=>{const r=document.querySelectorAll('.story-runway')[i],m=r.firstElementChild;scrollTo(0,r.getBoundingClientRect().top+scrollY+(r.offsetHeight-m.offsetHeight)*progress);},{i,progress});
   const beat=await page.evaluate(({i,p})=>ColorClikStoryTimeline.sample(i,p).beat,{i,p:progress});
   await page.waitForFunction(({i,beat})=>document.querySelectorAll('.scene')[i].dataset.motionBeat===beat,{i,beat});
   await page.waitForFunction(i=>[...document.querySelectorAll('#scene'+(i+1)+' .motion-pose,#scene'+(i+1)+' .motion-layer')].filter(e=>!e.hidden).every(e=>e.complete&&e.naturalWidth>0),i);
   const state=await page.locator('#scene'+(i+1)).evaluate(scene=>{
    const f=scene.querySelector('.story-visual'),c=scene.querySelector('.copy'),r=f.getBoundingClientRect(),t=c.getBoundingClientRect();
    const unit=parseFloat(f.style.getPropertyValue('--actor-unit'));
    return {unit,top:r.top,bottom:r.bottom,height:innerHeight,overlap:t.bottom>r.top+1,overflow:document.documentElement.scrollWidth>innerWidth};
   });
   assert(!state.overflow&&!state.overlap,JSON.stringify({width,height,i,...state}));
   assert(state.top>=-1&&state.bottom<=state.height+1,JSON.stringify({width,height,i,...state}));
   if(i===12)groupBody=state.unit;else{normalBody??=state.unit;assert(Math.abs(normalBody-state.unit)<.1);}
   if(width===412&&height===915&&!largeText&&[3,6,12,17].includes(i))await page.screenshot({path:`docs/android-ultra-scene${i+1}.png`});
  }
  if(!largeText)assert(normalBody>width/2.28*1.35,'Phone close shot must be visibly larger than previous release');
  assert(groupBody<normalBody);assert.deepEqual(errors,[]);
  console.log(`${width}x${height}${largeText?' enlarged text':''}: close ${normalBody.toFixed(1)}px vs group ${groupBody.toFixed(1)}px; framing PASS`);
  await page.close();
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
