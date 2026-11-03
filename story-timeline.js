/* Complete V80 narrative, sampled deterministically for native touch scrolling. */
(() => {
  const clamp = n => Math.max(0, Math.min(1, n));
  const phase = (t, a, b) => clamp((t-a)/(b-a));
  const ease = n => n*n*(3-2*n);
  const lerp = (a,b,t) => a+(b-a)*ease(t);
  const yellow = n => `yellow/${n}`;
  const walk = (t, color='yellow') => color==='yellow' ? yellow(Math.floor(t*12)%2?10:11) : `motion-v79/${color}-${(color==='red'?['a','pass','walk-b','pass']:['a','pass','walk-b','pass-b'])[Math.floor(t*12)%4]}`;
  const blueWalk = t => yellow(Math.floor(t*12)%2?43:45);
  const layer = (frame, values={}) => ({frame,x:0,y:0,width:100,height:100,flip:1,...values});
  const actor = (frame, values={}) => layer(frame,{x:30,width:40,height:92,...values});
  const part = (at,id,draw) => ({at,id,draw});
  const single = frame => () => ({base:layer(frame)});
  const stories = [
    [part(0,'yellow-front-walk',q=>({base:layer(yellow(Math.floor(q*10)%2?2:3))})),
     part(.5,'yellow-turn-and-walk',q=>({base:layer(walk(q),{x:lerp(0,18,q)})})),
     part(.70,'yellow-crouch',single(yellow(4))),
     part(.76,'yellow-jump',q=>({base:layer(yellow(5),{x:18,y:lerp(0,-110,q)})}))],
    [part(0,'yellow-landing',q=>({base:layer(yellow(q<.47?5:6),{x:18,y:lerp(-110,0,q)})})),
     part(.16,'yellow-stands',q=>({base:layer(yellow(q<.5?17:1),{x:18})})),
     part(.33,'yellow-greeting',()=>({base:layer(yellow(7),{x:18})})),
     part(.5,'yellow-exit',q=>({base:layer(walk(q),{x:lerp(18,110,q)})}))],
    [part(0,'yellow-reentry',q=>({base:layer(walk(q),{x:lerp(110,0,q),flip:-1})})),
     part(.65,'yellow-prepares-jump',single(yellow(4))),
     part(.78,'yellow-jump-to-marketing',q=>({base:layer(yellow(5),{y:lerp(0,-110,q)})}))],
    [part(0,'marketing-landing',q=>({base:layer(yellow(6),{y:lerp(-110,0,q)})})),
     part(.08,'marketing-stands',single(yellow(17))),part(.15,'marketing-ready',single(yellow(1))),
     ...['find-phone','take-phone','look-at-phone','laptop-appears','laptop-closed','laptop-open','present-laptop','papers'].map((name,i)=>part(.22+i*.71/8,`marketing-${name}`,single(yellow(18+i))))],
    [part(0,'web-papers',single(yellow(25))),part(.02,'web-phone',single(yellow(27))),
     part(.065,'web-idea',single(yellow(28))),part(.13,'web-show-idea',single(yellow(29))),part(.20,'web-finish-idea',single(yellow(30))),
     part(.27,'web-walk-out',q=>({base:layer(walk(q),{x:lerp(0,110,q)})})),
     part(.35,'web-walk-to-blue-door',q=>({base:layer(walk(q),{x:lerp(110,15,q),flip:-1})})),
     part(.51,'blue-door-approach',single(yellow(31))),
     ...['arrive','knock-first','knock-second','wait','ajar','welcome','together'].map((name,i)=>part([.56,.63,.70,.77,.83,.89,.94][i],`blue-door-${name}`,()=>({base:layer(yellow(32+i),{flip:-1})})))],
    [part(0,'web-together',()=>({base:layer(yellow(38),{flip:-1})})),
     part(.04,'yellow-goodbye',()=>({base:layer(yellow(39),{flip:-1})})),
     part(.10,'yellow-departs',()=>({base:layer(yellow(40),{flip:-1})})),
     part(.20,'yellow-walks-away',q=>({base:layer(yellow(41),{flip:-1}),lead:actor(walk(q),{x:lerp(55,110,q)})})),
     part(.34,'blue-waits',()=>({base:layer(yellow(41),{flip:-1})})),
     part(.80,'blue-leaves-door',()=>({lead:actor(yellow(46),{x:20})})),
     part(.84,'blue-walks-to-red-door',q=>({lead:actor(blueWalk(q),{x:lerp(20,110,q)})}))],
    [part(0,'red-door-blue-arrival',q=>({base:layer('red/v68/00'),lead:actor(blueWalk(q),{x:lerp(110,47,q),flip:-1})})),
     part(.20,'red-door-blue-waits',()=>({base:layer('red/v68/00'),lead:actor(yellow(46),{x:47,flip:-1})})),
     part(.27,'red-door-knock-first',()=>({base:layer('red/v68/00'),lead:actor(yellow(47),{x:47,flip:-1})})),
     part(.31,'red-door-knock-pause',()=>({base:layer('red/v68/00'),lead:actor(yellow(48),{x:47,flip:-1})})),
     part(.34,'red-door-knock-second',()=>({base:layer('red/v68/00'),lead:actor(yellow(47),{x:47,flip:-1})})),
     part(.39,'red-door-opens',()=>({base:layer('red/v68/01'),lead:actor(yellow(48),{x:47,flip:-1})})),
     part(.435,'red-door-welcome',()=>({base:layer('red/v68/02'),lead:actor(yellow(46),{x:47,flip:-1})})),
     part(.48,'red-door-greeting',()=>({base:layer('red/v68/03'),lead:actor(yellow(46),{x:47,flip:-1})})),
     part(.54,'blue-departure',q=>({base:layer('red/v68/03'),lead:actor(blueWalk(q),{x:lerp(47,110,q)})})),
     ...['step-out','turn','close','closed','wave'].map((name,i)=>part([.70,.75,.80,.845,.89][i],`red-door-${name}`,single(`red/v68/0${4+i}`))),
     part(.96,'red-door-farewell',single('red/v68/09'))],
    [part(0,'branding-red-standing',()=>({base:layer('red/v70/closed'),lead:actor('red/50',{x:45})})),
     part(.20,'branding-red-presentation',()=>({base:layer('red/v70/closed'),lead:actor('red/51',{x:45})})),
     part(.48,'red-jump-to-aqua',q=>({base:layer('red/v70/closed'),lead:actor('aqua/red-flight',{x:45,y:100*q*q-12*Math.sin(q*Math.PI)})}))],
    [part(0,'aqua-receives-red',q=>({base:layer('aqua/catch',{y:lerp(-12,0,q)})})),
     part(.18,'aqua-catches-red',single('story-v72/caught')),
     part(.37,'red-lands',()=>({base:layer('story-v72/farewell'),lead:actor('story-v72/landing',{x:3,height:78})})),
     part(.45,'red-regains-balance',q=>({base:layer('story-v72/farewell'),lead:actor('red/50',{x:3,rotation:Math.sin(q*Math.PI*2)*2})})),
     part(.53,'red-walks-away',q=>({base:layer('story-v72/farewell'),lead:actor(walk(q,'red'),{x:lerp(3,110,q),width:60,flip:-1})})),
     part(.71,'aqua-farewell',single('story-v72/farewell')),part(.82,'aqua-closes-door',single('story-v72/closing')),
     part(.90,'aqua-door-closed',single('story-v72/closed')),part(.96,'aqua-tired',single('story-v72/tired-transparent'))],
    [part(0,'aqua-rests',single('story-v72/tired-transparent')),part(.08,'aqua-eats-banana',single('finale-v78/eat')),
     part(.30,'aqua-drops-peel',single('finale-v78/drop')),
     part(.42,'banana-peel-falls',q=>({base:layer('story-v72/tired-transparent'),prop:{x:55,y:lerp(60,87,q),rotation:lerp(0,24,q)}})),
     part(.58,'aqua-slips',single('story-v72/slip')),
     part(.76,'aqua-falls-to-purple',q=>({base:layer('story-v72/fall',{y:lerp(0,110,q)})}))],
    [part(0,'purple-high-contact',single('coherent-v80/contact')),
     part(.07,'purple-mid-catch',single('coherent-v80/midcatch')),
     part(.14,'purple-lowers-aqua',single('coherent-v80/lowering')),
     part(.21,'purple-catch-held',single('coherent-v80/lowering')),
     part(.37,'purple-and-aqua-greeting',single('purple-v73/greeting')),
     part(.57,'aqua-leaves-purple',q=>({base:layer('purple-v73/farewell'),lead:actor(walk(q,'aqua'),{x:lerp(0,110,q),width:60,flip:-1})})),
     part(.70,'purple-closes-door',single('purple-v73/closing'))],
    [part(0,'purple-wave',single('purple-v73/wave')),
     part(.28,'purple-walks-to-team',q=>({base:layer('purple-v73/door'),lead:actor(walk(q,'purple'),{x:lerp(25,110,q),width:60})})),
     part(.65,'purple-door-closed',single('purple-v73/door'))],
    ...Array.from({length:5},(_,index)=>[
      part(0,`project-${index+1}-team-arrives`,q=>({base:layer(`coherent-v80/team-${Math.floor(q*6)%2?'b':'a'}`,{x:lerp(-55,0,q),flip:index%2?-1:1}),cardX:lerp(-16,0,q)})),
      part(.22,`project-${index+1}-presentation`,q=>({base:layer(`coherent-v80/team-${Math.floor(q*6)%2?'b':'a'}`,{x:lerp(0,4,q),flip:index%2?-1:1}),cardX:lerp(0,2,q)})),
      part(.80,`project-${index+1}-team-pulls`,q=>({base:layer(`coherent-v80/team-${Math.floor(q*8)%2?'b':'a'}`,{x:lerp(4,55,q),flip:index%2?-1:1}),cardX:lerp(2,16,q)}))]),
    [part(0,'team-gathers',single('coherent-v80/gather')),
     part(.30,'team-embraces',single('coherent-v80/embrace')),
     part(.55,'team-final-hug',single('coherent-v80/hug'))]
  ];
  // A beat holds long enough to be seen; all state depends only on chapter and progress.
  function sample(chapter,progress){
    const beats=stories[chapter],p=clamp(progress);
    let i=beats.length-1;while(i>0&&p<beats[i].at)i--;
    const beat=beats[i],end=beats[i+1]?.at??1;
    return {beat:beat.id,...beat.draw(phase(p,beat.at,end))};
  }
  window.ColorClikStoryTimeline={stories,sample};
})();
