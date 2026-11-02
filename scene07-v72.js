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
      gsap.set(redGirl,{autoAlpha:c.planPhase<.48?1:0,height:ah*.95,left:0,right:'auto',top:0,bottom:'auto',x:left+pw*.69-redGirl.offsetWidth*.5,y:floor-ah*.95-Math.sin(live*Math.PI*4)*2,rotation:Math.sin(live*Math.PI*4)*1.2,scaleX:1,scaleY:1,zIndex:25,transformOrigin:'center bottom'});
      const flight=document.querySelector('#ccRedFlight');
      const fh=ah*.95*.82,fw=fh*514/731;
      gsap.set(flight,{autoAlpha:c.planPhase>=.48?1:0,width:fw,height:fh,x:left+pw*.69-fw*.5+w*.025*jump,y:floor-fh-innerHeight*.18*Math.sin(Math.PI*jump)+innerHeight*1.15*jump*jump,rotation:jump*-14,transformOrigin:'center center'});
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
  window.ColorClikScene07=Object.freeze({render,renderCatch,renderSocialPlans});
})();
