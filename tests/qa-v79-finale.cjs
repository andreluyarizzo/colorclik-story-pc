const fs=require('fs'),vm=require('vm'),assert=require('assert');
for(const [w,h] of [[1440,900],[1920,1080]]){
 const nodes={},state={};let reduced=false;
 const node=n=>nodes[n]??={dataset:{ratio:.7},style:{},querySelectorAll:()=>Array.from({length:4},()=>({style:{}}))};
 const window={matchMedia:()=>({matches:reduced})};vm.runInNewContext(fs.readFileSync('scene07-v79.js','utf8'),{window,document:{querySelector:node}});
 const c={w,h,gsap:{set(el,v){for(const n of (typeof el==='string'?el:(Object.entries(nodes).find(([k,v])=>v===el)?.[0]||'red')).split(','))state[n]={...state[n],...v}}},redGirl:{},redDoor:{},blueActor:{},copy:{style:{},querySelectorAll:()=>Array.from({length:4},()=>({style:{}}))}};
 function sample(t){for(const k of Object.keys(state))delete state[k];window.ColorClikScene07.renderFinale(t,c);return JSON.parse(JSON.stringify(state));}
 const f=Array.from({length:1001},(_,i)=>sample(i/1000));for(let i=1000;i>=0;i--)assert.deepStrictEqual(sample(i/1000),f[i]);
 assert.equal(f[100]['#ccFinal-purple'].autoAlpha,1);assert.equal(f[100]['#ccFinal-red'].autoAlpha,0);
 for(const t of [650,800,1000]){assert.equal(f[t]['#ccFinalHug'].autoAlpha,1);for(const n of ['purple','aqua','yellow','blue','red'])assert.equal(f[t]['#ccFinal-'+n].autoAlpha,0)}
 const g=f[1000]['#ccFinalHug'];assert(g.left>=0&&g.left+g.width<w*.59);assert(g.top>h*.29);assert(g.top+g.height<h*.9);
 for(const s of f)for(const n of ['purple','aqua','yellow','blue','red']){const a=s['#ccFinal-'+n];assert.equal(Math.abs(a.scaleX),a.scaleY);assert(Number.isFinite(a.x)&&Number.isFinite(a.y));}
 reduced=true;assert.equal(sample(0)['#ccFinalHug'].autoAlpha,1);
 console.log(`${w}x${h}: finale stagger, group bounds, uniform scale, 1001 reverse states, reduced-motion PASS`);
}
