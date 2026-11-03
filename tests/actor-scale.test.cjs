const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const window={};for(const name of ['actor-metrics.js','actor-layout.js','story-timeline.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..',name),'utf8'),{window});
const {layout,unit}=window.ColorClikActorScale;
test('all story layers use a shared body unit, preserve aspect and register the floor',()=>{
 for(const [width,height] of [[282,568],[337,812],[620,1024],[620,768],[380,375]]){
  const geometry={width,height:350,unit:unit(width,height),floor:12};
  window.ColorClikStoryTimeline.stories.forEach((beats,i)=>beats.forEach((beat,j)=>{
   const p=beat.at+((beats[j+1]?.at??1)-beat.at)*.5,state=window.ColorClikStoryTimeline.sample(i,p);
   for(const role of ['base','lead','support'])if(state[role]){
    const values=state[role],m=window.ColorClikActorMetrics[values.frame],b=layout(values.frame,values,geometry,role);
    assert(Math.abs(b.width/b.height-m.w/m.h)<1e-10,values.frame+' is stretched');
    assert(Math.abs(m.body*b.height/m.h-geometry.unit)<1e-6,values.frame+' changes body scale');
    assert(Math.abs(b.bottom+(m.h-m.floor)*b.sourceScale-geometry.floor)<1e-6,values.frame+' changes floor');
   }
  }));
 }
 const geo={width:337,height:260,unit:143,floor:12};
 const standing=layout('yellow/1',{x:0,y:0,width:100,flip:1},geo,'base');
 const crouch=layout('yellow/4',{x:0,y:0,width:100,flip:1},geo,'base');
 assert(crouch.visible.height<standing.visible.height*.8,'Crouching must not be enlarged to standing height');
});

test('portrait-phone close camera is larger than the five-person wide shot',()=>{
 for(const [w,h] of [[384,854],[412,915],[480,1067]])assert(unit(w,h,true)>unit(w,h,true,true)*1.4);
 assert.equal(unit(620,1024,false),unit(620,1024,false,true));
});
