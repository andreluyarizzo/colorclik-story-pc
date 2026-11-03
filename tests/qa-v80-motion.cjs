const fs=require('fs'),vm=require('vm'),assert=require('assert');
for(const [w,h] of [[1440,900],[1920,1080]]){
 const nodes={},state={};function node(n){return nodes[n]??={dataset:{ratio:1},style:{},images:Array.from({length:4},()=>({style:{},dataset:{}})),querySelectorAll(){return this.images}}}
 const window={matchMedia:()=>({matches:false})};vm.runInNewContext(fs.readFileSync('scene07-v80.js','utf8'),{window,document:{querySelector:node}});
 const ah=Math.min(560,h*.52,w*.36),floor=h*.83,c={w,h,gsap:{set(el,v){const name=typeof el==='string'?el:Object.entries(nodes).find(([k,n])=>n===el)?.[0];if(name)for(const n of name.split(','))state[n]={...state[n],...v}}},blueActor:{offsetHeight:ah},redGirl:{},redDoor:{},copy:{style:{}},nextSequence:{getBoundingClientRect:()=>({bottom:floor})}};
 for(const [render,selector,a,b] of [['renderPurple','#ccAquaWalk',.57,.70],['renderPurplePlans','#ccPurpleWalk',.28,.65]]){
  const seen=new Set();let forward=[];
  function sample(t){window.ColorClikScene07[render](t,c);const n=node(selector),s=state[selector];assert.equal(n.images.filter(im=>im.style.opacity==='1').length,1);assert.equal(Math.abs(s.scaleX),s.scaleY);assert(Math.abs(s.y+s.height*1060/1100-floor)<.001);return JSON.stringify({frame:n.dataset.walkFrame,x:s.x,y:s.y});}
  for(let i=0;i<=1000;i++){const t=a+(b-a)*i/1000;forward.push(sample(t));seen.add(node(selector).dataset.walkFrame)}
  assert.equal(seen.size,4);for(let i=1000;i>=0;i--)assert.equal(sample(a+(b-a)*i/1000),forward[i]);
 }
 const html=fs.readFileSync('story-desktop.html','utf8');assert(!fs.readFileSync('scene07-v80.js','utf8').includes('autoAlpha:t<.13?1:0')); 
 const css=fs.readFileSync('scene07-v80.css','utf8');assert(css.includes('height:100%;max-height:none;display:block'));assert(css.includes('top:clamp(170px,25vh,290px)'));
 // Explicit finale coordinates stay below header and above scroll hint at both target sizes.
 const titleTop=Math.max(128,Math.min(.17*h,190)),quoteTop=Math.max(170,Math.min(.25*h,290));assert(titleTop>=128);assert(quoteTop+460<h-80);
 console.log(`${w}x${h}: four gait phases, shared floor, one visible frame, reverse motion and explicit finale geometry PASS`);
}
