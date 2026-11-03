/* Scene 07: every visual state is derived solely from scroll progress. */
(() => {
  const clamp = n => Math.max(0, Math.min(1,n));
  const phase = (t,a,b) => clamp((t-a)/(b-a));
  const mix = (a,b,q) => a+(b-a)*q;
  const beats = [0,.39,.435,.48,.70,.75,.80,.845,.89,1];
  const walk = q => Math.floor(q*12)%2 ? 43 : 45;
  function render(t,c) {
    const {gsap,w,nextSequence,blueActor,bluePose,redDoor,redGirl,copy,setActorPose}=c;
    const portal=document.querySelector('#ccRedWelcome');
    const images=[...portal.querySelectorAll('img')];
    // Keep all decoded frames mounted: changing scroll never starts a new request.
    const ready=images.length===10 && images.every(im=>im.complete && im.naturalWidth);
    let index=beats.reduce((n,at,i)=>t>=at?i:n,0);
    if (!ready) index=0;
    images.forEach((im,i)=>{im.style.opacity=i===index?'1':'0';});
    const floor=nextSequence.getBoundingClientRect().bottom;
    const ah=blueActor.offsetHeight,aw=blueActor.offsetWidth;
    const ph=ah*1.22,pw=ph*1200/1540;
    const left=w*.58;
    // Frame 47's mirrored fist lands on the closed leaf, beside the handle.
    const home=left+pw*.48+ah*.24-aw*.5;
    const arriving=t<.20,leaving=t>=.54;
    const q=arriving?phase(t,0,.20):phase(t,.54,.70);
    let frame=46;
    if(arriving || leaving)frame=walk(q);
    else if(t>=.27 && t<.31 || t>=.34 && t<.38)frame=47;
    else if(t>=.31 && t<.34 || t>=.38 && t<.40)frame=48;
    setActorPose(bluePose,frame);
    const x=arriving?mix(w+aw*.2,home,q):leaving?mix(home,w+aw*.35,q):home;
    gsap.set(blueActor,{autoAlpha:t<.70?1:0,x,y:floor-ah,scaleX:leaving?1:-1,scaleY:1,transformOrigin:'center bottom'});
    gsap.set(portal,{autoAlpha:phase(t,0,.06),left,width:pw,height:ph,bottom:innerHeight-floor-ph*.03,x:0});
    gsap.set(redDoor,{autoAlpha:0});
    gsap.set(redGirl,{autoAlpha:0});
    gsap.set('#ccRedPresentation',{autoAlpha:0});
    gsap.set(copy,{autoAlpha:1});copy.style.pointerEvents='auto';
    gsap.set('#ccAquaStage',{autoAlpha:0});
    gsap.set('#ccRedFlight',{autoAlpha:0});
    if(c.planPhase!==null && c.planPhase!==undefined){
      const jump=phase(c.planPhase,.48,1);
      const closed=document.querySelector('#ccRedPresentation');
      const closedImage=closed.querySelector('img');
      if(closedImage.dataset.closed!=='v70'){closedImage.src='assets/optimized/red/v70/closed.webp';closedImage.dataset.closed='v70';}
      gsap.set(closed,{autoAlpha:1-phase(c.planPhase,.94,1),left,width:pw,height:ph,bottom:innerHeight-floor-ph*.03,x:0});
      gsap.set(closedImage,{scaleX:1,scaleY:1,rotation:0,transformOrigin:'center center'});
      gsap.set(portal,{autoAlpha:0});
      const presenting=c.planPhase>=.20;
      setActorPose(redGirl.querySelector('img'),presenting?51:50);
      const live=phase(c.planPhase,0,.48);
      gsap.set(redGirl,{autoAlpha:c.planPhase<.48?1:0,height:ah*.95,left:0,right:'auto',top:0,bottom:'auto',x:left+pw*.69-redGirl.offsetWidth*.5,y:floor-ah*.95,rotation:0,scaleX:1,scaleY:1,zIndex:25,transformOrigin:'center bottom'});
      const flight=document.querySelector('#ccRedFlight');
      const fh=ah*.95*.82,fw=fh*514/731;
      gsap.set(flight,{autoAlpha:c.planPhase>=.48?1:0,width:fw,height:fh,x:left+pw*.69-fw*.5,y:floor-fh-innerHeight*.06*Math.sin(Math.PI*jump)+innerHeight*1.10*jump*jump,rotation:0,transformOrigin:'center center'});
    }
    portal.dataset.frame=String(index);
    redGirl.dataset.storyBeat=t<.20?'arrival':t<.39?'knocking':t<.54?'welcome':t<.70?'departure':t<.80?'step-out':t<1?'closing':'wave';
  }

  const ease = q => q*q*(3-2*q);
  const REGISTER = {"arrival": {"x": 111.941, "y": 63.077, "width": 1169.231, "height": 1279.194}, "landingRatio": 0.8803353658536586, "redCenter": 350, "bananaX": 800};
  function layout(c){
    const ah=c.blueActor.offsetHeight,floor=c.nextSequence.getBoundingClientRect().bottom;
    const size=ah*1.45,unit=size/1400,left=c.w*.98-size,top=floor-1320*unit;
    return {ah,floor,size,unit,left,top};
  }
  function frame(c, name, visible=true){
    const l=layout(c),deck=document.querySelector('#ccAquaAction');
    c.gsap.set(deck,{autoAlpha:visible?1:0,left:l.left,top:l.top,width:l.size,height:l.size});
    deck.querySelectorAll('img').forEach(im=>im.style.opacity=im.dataset.pose===name?'1':'0');
    deck.dataset.beat=name;
    return l;
  }
  function hideLegacy(c){
    c.gsap.set('#ccSocialStage,#ccRedWelcome,#ccRedPresentation,#ccRedFlight',{autoAlpha:0});
    c.gsap.set(c.blueActor,{autoAlpha:0});c.gsap.set(c.redDoor,{autoAlpha:0});
  }
  function renderCatch(t,c){
    const {gsap,w,h,redGirl,copy,setActorPose}=c;
    const state=t<.18?'arrival':t<.37?'caught':t<.71?'farewell':t<.82?'closing':t<.90?'closed':'tired';
    const l=frame(c,state,state!=='arrival');
    const {ah,floor,unit,left,top}=l;
    hideLegacy(c);
    const a=REGISTER.arrival;
    const aqua=document.querySelector('#ccAquaStage');
    gsap.set(aqua,{autoAlpha:state==='arrival'?1:0,left:left+a.x*unit,top:top+a.y*unit,
      width:a.width*unit,height:a.height*unit,filter:'none',clipPath:'none'});
    gsap.set('#ccAquaReady',{autoAlpha:1});gsap.set('#ccAquaJoined',{autoAlpha:0});
    const q=ease(phase(t,0,.18));
    gsap.set('#ccRedApproach',{autoAlpha:1,x:0,y:mix(-h*.95,0,q),rotation:0});
    // Landing has a real bent-knee drawing and a shared, fixed floor.
    const center=left+REGISTER.redCenter*unit;
    const rh=ah*.95,landingH=rh*.95,lw=landingH*REGISTER.landingRatio;
    gsap.set('#ccRedLanding',{autoAlpha:t>=.37&&t<.45?1:0,width:lw,height:landingH,
      x:center-lw/2,y:floor-landingH,scaleX:1,scaleY:1,rotation:0});
    setActorPose(redGirl.querySelector('img'),50);
    gsap.set(redGirl,{autoAlpha:t>=.45&&t<.53?1:0,height:rh,left:0,right:'auto',top:0,bottom:'auto',
      x:center-redGirl.offsetWidth/2,y:floor-rh,scaleX:1,scaleY:1,zIndex:27,
      rotation:Math.sin(phase(t,.45,.53)*Math.PI*2),transformOrigin:'center bottom'});
    const walk=phase(t,.53,.71),wh=rh,ww=wh*398/631;
    gsap.set('#ccSocialRedWalk',{autoAlpha:t>=.53&&t<.72?1:0,width:ww,height:wh,
      x:mix(center-ww/2,w+ww*.2,ease(walk)),y:floor-wh-Math.sin(walk*Math.PI*12)*3,
      scaleX:-1,scaleY:1,rotation:Math.sin(walk*Math.PI*12),transformOrigin:'center bottom'});
    gsap.set('#ccBanana',{autoAlpha:0});
    gsap.set(copy,{autoAlpha:phase(t,0,.08)});aqua.dataset.beat=state;
    const handQ=phase(t,.53,.71);
    const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.set('#ccAquaWaveHand',{rotation:reduced?0:Math.sin(handQ*Math.PI*4)*8,transformOrigin:'26.429% 45.357%'});
    deckProgress(t);
  }
  function deckProgress(t){document.querySelector('#ccAquaAction').dataset.progress=t.toFixed(4);}
  function renderSocialPlans(t,c){
    const {gsap,redGirl,copy}=c;
    const state=t<.48?'tired':t<.66?'slip':'fall';
    const l=frame(c,state);hideLegacy(c);
    gsap.set('#ccAquaStage,#ccRedLanding,#ccSocialRedWalk',{autoAlpha:0});gsap.set(redGirl,{autoAlpha:0});
    const banana=phase(t,.39,.45),q=ease(phase(t,.48,.72));
    gsap.set('#ccBanana',{autoAlpha:state==='slip'?0:banana,left:l.left+REGISTER.bananaX*l.unit,top:l.floor-14,
      width:l.size*.12,x:-22*q,y:-Math.sin(q*Math.PI)*9,rotation:24*q});
    gsap.set(copy,{autoAlpha:1});deckProgress(t);
  }

  const PURPLE = {"flightRatio": 0.9919871794871795, "aquaWalkRatio": 0.9276160503540519, "purpleWalkRatio": 0.6738636363636363};
  function renderPurple(t,c){
    const {gsap,w,h,redGirl,copy}=c,l=layout(c);
    hideLegacy(c);gsap.set('#ccAquaStage,#ccAquaAction,#ccRedLanding,#ccSocialRedWalk,#ccBanana',{autoAlpha:0});gsap.set(redGirl,{autoAlpha:0});
    const state=t<.18?'ready':t<.37?'caught':t<.57?'greeting':t<.70?'farewell':t<.80?'closing':'wave';
    const deck=document.querySelector('#ccPurpleAction');
    gsap.set(deck,{autoAlpha:1,left:l.left,top:l.top,width:l.size,height:l.size});
    deck.querySelectorAll('img').forEach(im=>im.style.opacity=(im.dataset.pose===state||state==='wave'&&im.dataset.pose==='door')?'1':'0');
    deck.dataset.beat=t<.18?'falling':t<.37?'caught':t<.57?'greeting':t<.70?'aqua-departure':t<.80?'closing':'public-wave';
    deck.dataset.progress=t.toFixed(4);
    const q=ease(phase(t,.02,.18)),fh=l.ah*1.05,fw=fh*PURPLE.flightRatio;
    gsap.set('#ccAquaFall',{autoAlpha:t<.18?1:0,width:fw,height:fh,
      x:mix(w*.66,l.left+330*l.unit,q)-fw/2,y:mix(-fh,l.floor-fh*1.20,q),scaleX:1,scaleY:1,rotation:0});
    const aq=phase(t,.57,.70),ah=l.ah*.98,aw=ah*PURPLE.aquaWalkRatio;
    gsap.set('#ccAquaWalk',{autoAlpha:t>=.57&&t<.70?1:0,width:aw,height:ah,
      x:mix(l.left+300*l.unit-aw/2,w+aw*.2,ease(aq)),y:l.floor-ah-Math.sin(aq*Math.PI*12)*2,
      scaleX:-1,scaleY:1,rotation:0});
    const pq=phase(t,.88,1),ph=l.ah*1.15,pw=ph*PURPLE.purpleWalkRatio;
    gsap.set('#ccPurpleWalk',{autoAlpha:0,width:pw,height:ph,
      x:mix(l.left+630*l.unit-pw/2,w+pw*.2,ease(pq)),y:l.floor-ph-Math.sin(pq*Math.PI*10)*2,
      scaleX:1,scaleY:1,rotation:0});
    gsap.set(copy,{autoAlpha:phase(t,.10,.22)});
  }

  function renderPurplePlans(t,c){
    const {gsap,w,redGirl,copy}=c,l=layout(c),deck=document.querySelector('#ccPurpleAction');
    hideLegacy(c);gsap.set('#ccAquaStage,#ccAquaAction,#ccRedLanding,#ccSocialRedWalk,#ccBanana,#ccAquaFall,#ccAquaWalk',{autoAlpha:0});gsap.set(redGirl,{autoAlpha:0});
    gsap.set(deck,{autoAlpha:1,left:l.left,top:l.top,width:l.size,height:l.size});
    deck.querySelectorAll('img').forEach(im=>im.style.opacity=im.dataset.pose==='door'?'1':'0');
    deck.dataset.beat=t<.30?'purple-exit':'plans';deck.dataset.progress=t.toFixed(4);
    const q=phase(t,0,.30),ph=l.ah*1.15,pw=ph*PURPLE.purpleWalkRatio;
    gsap.set('#ccPurpleWalk',{autoAlpha:t<.30?1:0,width:pw,height:ph,
      x:mix(l.left+500*l.unit-pw/2,w+pw*.2,ease(q)),y:l.floor-ph-Math.sin(q*Math.PI*12)*2,
      scaleX:1,scaleY:1,rotation:0});
    gsap.set(copy,{autoAlpha:phase(t,0,.06)});
  }
  window.ColorClikScene07=Object.freeze({render,renderCatch,renderSocialPlans,renderPurple,renderPurplePlans});
})();
