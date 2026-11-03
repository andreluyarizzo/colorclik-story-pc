const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const window={};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../story-timeline.js'),'utf8'),{window});
const {stories,sample}=window.ColorClikStoryTimeline;
test('complete V80 touch story: all beats reversible, every asset exists and every action is reachable',()=>{
 assert.equal(stories.length,18);
 const observed=new Set(),frames=new Set();
 stories.forEach((beats,chapter)=>{
  assert.equal(beats[0].at,0);
  beats.forEach((beat,i)=>{
   assert(i===0||beat.at>beats[i-1].at);assert(beat.at<1);
   const end=beats[i+1]?.at??1;
   for(let step=0;step<12;step++){
    const p=beat.at+(end-beat.at)*(step+.5)/12;
    const a=JSON.stringify(sample(chapter,p));sample(chapter,.99);sample(chapter,.01);
    assert.equal(JSON.stringify(sample(chapter,p)),a,'state must not depend on scroll history');
    const state=sample(chapter,p);assert.equal(state.beat,beat.id);observed.add(state.beat);
    for(const key of ['base','lead','support'])if(state[key]){
     const layer=state[key];frames.add(layer.frame);
     assert(fs.existsSync(path.join(__dirname,'../assets/optimized',layer.frame+'.webp')),layer.frame+' missing');
     for(const k of ['x','y','width','height','flip'])assert(Number.isFinite(layer[k]));
    }
   }
  });
 });
 for(const id of ['marketing-find-phone','marketing-take-phone','marketing-look-at-phone','marketing-laptop-appears','marketing-laptop-closed','marketing-laptop-open','marketing-present-laptop','marketing-papers','blue-door-knock-first','blue-door-knock-second','blue-door-welcome','yellow-goodbye','blue-walks-to-red-door','red-door-knock-first','red-door-knock-second','red-door-farewell','red-jump-to-aqua','aqua-catches-red','red-lands','red-walks-away','aqua-closes-door','aqua-eats-banana','banana-peel-falls','aqua-slips','aqua-falls-to-purple','purple-high-contact','purple-mid-catch','purple-lowers-aqua','purple-and-aqua-greeting','aqua-leaves-purple','purple-closes-door','purple-wave','purple-walks-to-team','team-gathers','team-embraces','team-final-hug'])assert(observed.has(id),id+' omitted');
 for(let n=18;n<=41;n++)if(n!==26)assert(frames.has('yellow/'+n),'yellow '+n+' omitted');
 assert.equal(sample(17,1).beat,'team-final-hug');
 console.log(`${observed.size} beats, ${frames.size} image assets, 18 complete chapters`);
});

test('blue faces right while arriving, knocking and leaving the red door',()=>{
 for(const [a,b] of [[.02,.18],[.55,.69]]){
  const start=sample(6,a).lead,end=sample(6,b).lead;
  assert(end.x>start.x,'Blue must advance to the right');
  assert.equal(start.flip,1,'Source walk poses 43/45 face right');
  assert.equal(end.flip,1);
 }
 for(const p of [.22,.29,.32,.36,.41,.46,.51])assert.equal(sample(6,p).lead.flip,1,'Keep facing the door while waiting and knocking');
});
