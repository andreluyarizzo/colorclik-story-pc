const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{for(const [width,height] of [[320,568],[375,812],[768,1024],[1024,768],[812,375]]){
  const page=await browser.newPage({viewport:{width,height}});
  await page.goto('http://127.0.0.1:8000/story-desktop.html');
  const points=await page.evaluate(()=>ColorClikStoryTimeline.stories.map(beats=>beats.map((b,i)=>({id:b.id,p:b.at+((beats[i+1]?.at??1)-b.at)*.5}))));
  const references={};
  for(let i=0;i<points.length;i++)for(const point of points[i]){
   await page.evaluate(({i,p})=>{const r=document.querySelectorAll('.story-runway')[i],m=r.firstElementChild;scrollTo(0,r.getBoundingClientRect().top+scrollY+(r.offsetHeight-m.offsetHeight)*p);},{i,p:point.p});
   await page.waitForFunction(({i,id})=>document.querySelectorAll('.scene')[i].dataset.motionBeat===id,{i,id:point.id});
   const boxes=await page.locator('#scene'+(i+1)).evaluate(scene=>[...scene.querySelectorAll('.motion-pose,.motion-layer')].filter(el=>!el.hidden).map(el=>{
    const m=ColorClikActorMetrics[el.dataset.frame],s=parseFloat(el.style.height)/m.h;
    return {body:m.body*s,ratio:parseFloat(el.style.width)/parseFloat(el.style.height),nativeRatio:m.w/m.h,floor:parseFloat(el.style.bottom)+(m.h-m.floor)*s};
   }));
   boxes.forEach(box=>{const camera=i>=12&&i<=16?'wide':'close';references[camera]??=box.body;assert(Math.abs(box.body-references[camera])<.01,`${width} body size changed within camera`);assert(Math.abs(box.ratio-box.nativeRatio)<.00001);assert(Math.abs(box.floor-12)<.001);});
  }
  console.log(`${width}x${height}: close ${references.close.toFixed(2)}px, group ${references.wide.toFixed(2)}px; proportions and floor PASS`);
  await page.close();
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
