const assert = require('node:assert/strict');
const {chromium} = require('playwright');
(async () => {
  const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox']});
  try {
    for (const [width,height] of [[375,812],[768,1024],[1024,768],[812,375]]) {
      const page = await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true});
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto('http://127.0.0.1:8000/story-desktop.html');
      await page.waitForFunction(()=>document.documentElement.classList.contains('touch-motion'));
      async function sample(id,p) {
        await page.evaluate(({id,p})=>{
          const scene=document.getElementById(id),runway=scene.querySelector('.story-runway'),moment=scene.querySelector('.story-moment');
          scrollTo(0,runway.getBoundingClientRect().top+scrollY+(runway.offsetHeight-moment.offsetHeight)*p);
        },{id,p});
        await page.waitForTimeout(250);
        await page.waitForFunction(id=>document.querySelector('#'+id+' .motion-pose').dataset.frame, id);
        return page.locator('#'+id+' .motion-pose').evaluate(im=>({frame:im.dataset.frame,transform:im.style.transform,left:im.style.left}));
      }
      for (const id of ['scene1','scene2','scene5','scene7','scene9','scene11','scene13']) {
        const a=await sample(id,.25), b=await sample(id,.65), again=await sample(id,.25);
        assert.notDeepEqual(a,b,`${width} ${id} must move with scroll`);
        assert.deepEqual(a,again,`${width} ${id} must reverse deterministically`);
        const geometry=await page.locator('#'+id).evaluate(scene=>{
          const copy=scene.querySelector('.copy').getBoundingClientRect(),art=scene.querySelector('.story-visual').getBoundingClientRect();
          return {overlap:copy.bottom>art.top+1&&copy.top<art.bottom-1&&copy.right>art.left+1&&copy.left<art.right-1,overflow:document.documentElement.scrollWidth>innerWidth};
        });
        assert.equal(geometry.overlap,false,`${id} artwork overlaps text`);
        assert.equal(geometry.overflow,false);
        if(width===375 && ['scene1','scene7','scene11','scene13'].includes(id)) await page.screenshot({path:`docs/motion-mobile-${id}.png`});
      }
      await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));
      await page.waitForFunction(()=>document.querySelector('#scene18 .motion-pose').dataset.frame==='coherent-v80/hug');
      assert.deepEqual(errors,[]);
      console.log(`${width}x${height}: 7 animated chapters, scroll reversal, text bounds PASS`);
      await page.close();
    }
    const page=await browser.newPage({viewport:{width:375,height:812},reducedMotion:'reduce'});
    await page.goto('http://127.0.0.1:8000/story-desktop.html');
    assert.equal(await page.evaluate(()=>document.documentElement.classList.contains('touch-motion')),false);
    assert.equal(await page.locator('.story-moment').count(),18);
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.waitForFunction(()=>document.documentElement.classList.contains('touch-motion'));
    await page.waitForTimeout(200);
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.waitForFunction(()=>!document.documentElement.classList.contains('touch-motion'));
    console.log('Reduced motion and live preference changes PASS');
    await page.close();
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
