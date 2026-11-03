const fs=require('fs'),vm=require('vm'),assert=require('assert');
for(const [w,h] of [[1440,900],[1920,1080]]){
 const nodes={},state={};let reduced=false;
 function node(name){return nodes[name]??=( {dataset:{},style:{setProperty(){}},setAttribute(k,v){this[k]=v},querySelectorAll(){return []}});}
 const pictures=['freshclean','manton','naturalmentores','indeedinsurance','colorclik'].map(client=>({dataset:{client},style:{}}));node('#ccPortfolioPreview').querySelectorAll=()=>pictures;
 const window={};vm.runInNewContext(fs.readFileSync('scene07-v78.js','utf8'),{window,document:{querySelector:node},matchMedia:()=>({matches:reduced})});
 const c={w,h,gsap:{set(el,v){const name=typeof el==='string'?el:Object.entries(nodes).find(([k,n])=>n===el)?.[0];if(name)for(const n of name.split(','))state[n]={...(state[n]||{}),...v};}},blueActor:{offsetHeight:Math.min(560,h*.52,w*.36)},redGirl:{},redDoor:{},copy:{}};
 function sample(p){for(const k of Object.keys(state))delete state[k];window.ColorClikScene07.renderPortfolio(p,c);return JSON.parse(JSON.stringify({...state,client:node('#ccPortfolioCard').dataset.client,href:node('#ccPortfolioLink').href}));}
 for(let client=0;client<5;client++){
  const forward=Array.from({length:1001},(_,i)=>sample(client+i/1000));for(let i=1000;i>=0;i--)assert.deepStrictEqual(sample(client+i/1000),forward[i]);
  const mid=sample(client+.5),card=mid['#ccPortfolioCard'],team=mid['#ccPortfolioTeam'];
  assert(card.y>h*.22 && card.y+card.height<h-32);assert(team.x+team.width<w);assert.equal(Math.abs(team.scaleX),team.scaleY);assert.equal(team.scaleX,client%2?-1:1);assert(mid.href.startsWith('http'));
  assert(client%2?sample(client+.6)['#ccPortfolioTeam'].x<sample(client+.3)['#ccPortfolioTeam'].x:sample(client+.6)['#ccPortfolioTeam'].x>sample(client+.3)['#ccPortfolioTeam'].x);
 }
 assert.equal(sample(5)['#ccPortfolioCard'].autoAlpha,1);assert.equal(sample(5).client,'colorclik');
 reduced=true;assert.equal(sample(.1)['#ccPortfolioTeam'].x,sample(.9)['#ccPortfolioTeam'].x);
 console.log(`${w}x${h} portfolio: five clients, reverse states, card bounds, shared pull motion, reduced-motion PASS`);
}
