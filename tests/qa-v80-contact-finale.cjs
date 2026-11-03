const fs=require('fs'),vm=require('vm'),assert=require('assert');
for(const [w,h] of [[1440,900],[1920,1080]]){
 const nodes={},state={};let reduced=false;
 function node(n){return nodes[n]??={dataset:{},style:{setProperty(){}},setAttribute(){},images:[],querySelectorAll(){return this.images}}}
 const purple=node('#ccPurpleAction');purple.images=['contact','midcatch','lowering','caught','greeting','farewell','closing'].map(pose=>({dataset:{pose},style:{}}));
 node('#ccFinalHug').images=Array.from({length:3},()=>({style:{}}));node('#ccPortfolioTeam').images=Array.from({length:2},()=>({style:{}}));
 for(const n of ['#ccAquaWalk','#ccPurpleWalk'])node(n).images=Array.from({length:4},()=>({style:{}}));
 node('#ccPortfolioPreview').images=['freshclean','manton','naturalmentores','indeedinsurance','colorclik'].map(client=>({dataset:{client},style:{}}));
 const window={matchMedia:()=>({matches:reduced})};vm.runInNewContext(fs.readFileSync('scene07-v80.js','utf8'),{window,matchMedia:window.matchMedia,document:{querySelector:node}});
 const ah=Math.min(560,h*.52,w*.36),c={w,h,gsap:{set(el,v){const name=typeof el==='string'?el:Object.entries(nodes).find(([k,n])=>n===el)?.[0];if(name)for(const n of name.split(','))state[n]={...state[n],...v}}},redGirl:{},redDoor:{},blueActor:{offsetHeight:ah},copy:{style:{}},nextSequence:{getBoundingClientRect:()=>({bottom:h*.83})}};
 function sample(method,t){window.ColorClikScene07[method](t,c);return JSON.stringify({state,poses:purple.images.map(im=>im.style.opacity),final:node('#ccFinalHug').images.map(im=>im.style.opacity),team:node('#ccPortfolioTeam').images.map(im=>im.style.opacity)})}
 for(const [t,pose] of [[.03,'contact'],[.14,'lowering'],[.25,'caught']]){sample('renderPurple',t);assert.equal(state['#ccAquaFall'].autoAlpha,0);assert.equal(purple.images.find(im=>im.style.opacity==='1').dataset.pose,pose)}
 const frames=[];for(let i=0;i<=1000;i++)frames.push(sample('renderFinale',i/1000));for(let i=1000;i>=0;i--)assert.equal(sample('renderFinale',i/1000),frames[i]);
 for(const [t,index] of [[.15,0],[.4,1],[.8,2]]){sample('renderFinale',t);assert.equal(node('#ccFinalHug').images.filter(im=>im.style.opacity==='1').length,1);assert.equal(node('#ccFinalHug').images[index].style.opacity,'1');assert.equal(state['.cc-final-actor'].autoAlpha,0);assert.equal(state['#ccFinalHug'].scaleX,1);assert.equal(state['#ccFinalHug'].scaleY,1)}
 const seen=new Set();for(let i=0;i<100;i++){sample('renderPortfolio',i/100);seen.add(node('#ccPortfolioTeam').dataset.walkFrame);assert.equal(node('#ccPortfolioTeam').images.filter(im=>im.style.opacity==='1').length,1)}assert.equal(seen.size,2);
 reduced=true;sample('renderFinale',0);assert.equal(node('#ccFinalHug').dataset.beat,'hug');assert.equal(state['#ccFinalHug'].autoAlpha,1);
 console.log(`${w}x${h}: integrated contact/lowering/catch, two team steps, three ordered whole-group poses, reverse and reduced motion PASS`);
}
