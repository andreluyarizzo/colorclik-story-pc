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
      gsap.set(redGirl,{autoAlpha:c.planPhase<.48?1:0,left:0,right:'auto',top:0,bottom:'auto',x:left+pw*.69-redGirl.offsetWidth*.5,y:floor-ah-Math.sin(live*Math.PI*4)*2,rotation:Math.sin(live*Math.PI*4)*1.2,scaleX:1,scaleY:1,zIndex:25,transformOrigin:'center bottom'});
      const flight=document.querySelector('#ccRedFlight');
      const fh=ah*1.35*555/919,fw=fh*514/731;
      gsap.set(flight,{autoAlpha:c.planPhase>=.48?1:0,width:fw,height:fh,x:left+pw*.69-fw*.5+w*.025*jump,y:floor-fh-innerHeight*.18*Math.sin(Math.PI*jump)+innerHeight*1.15*jump*jump,rotation:jump*-14,transformOrigin:'center center'});
    }
    portal.dataset.frame=String(index);
    redGirl.dataset.storyBeat=t<.20?'arrival':t<.39?'knocking':t<.54?'welcome':t<.70?'departure':t<.80?'step-out':t<1?'closing':'wave';
  }
  const ease = q => q*q*(3-2*q);
  function socialStage(c, opacity){
    const ah=c.blueActor.offsetHeight, floor=c.nextSequence.getBoundingClientRect().bottom;
    const ph=ah*1.25,pw=ph*600/656;
    c.gsap.set('#ccSocialStage',{autoAlpha:opacity,left:c.w*.56,top:floor-ph,width:pw,height:ph});
    return {ah,floor,ph,pw};
  }
  function renderCatch(t,c){
    const {gsap,w,h,blueActor,nextSequence,redGirl,redDoor,copy,setActorPose}=c;
    const aqua=document.querySelector('#ccAquaStage');
    const ah=blueActor.offsetHeight,floor=nextSequence.getBoundingClientRect().bottom;
    const ph=ah*1.35,pw=ph*840/919;
    const close=ease(phase(t,.83,.98));
    const restPW=ah*1.25*600/656;
    const left=mix(w*.57,w*.56+restPW*.72-pw*.75,close),top=floor-ph;
    const arrival=ease(phase(t,0,.26));
    const cradle=ease(phase(t,.26,.36));
    const release=ease(phase(t,.42,.53));
    const arrivalCenter=w*.58+(ah*1.22*1200/1540)*.69+w*.025;
    const redCenter=left+pw*.238;
    const groundedX=w*.64;
    const catchX=pw*.065*cradle,catchY=ph*.105*cradle;
    const boundary=mix(w,w*.48,close);
    gsap.set(aqua,{autoAlpha:phase(t,0,.04),left,top,width:pw,height:ph,clipPath:`inset(0 ${clamp((left+pw-boundary)/pw)*100}% 0 0)`});
    gsap.set('#ccAquaReady',{autoAlpha:1});
    gsap.set('#ccAquaJoined',{autoAlpha:0});
    gsap.set('#ccRedApproach',{autoAlpha:1-ease(phase(t,.50,.54)),
      x:t<.26?mix(arrivalCenter-redCenter,0,arrival):mix(catchX,groundedX-redCenter,release),
      y:t<.26?mix(-ph-h*.25,0,arrival):mix(catchY,ph*.39,release),
      rotation:mix(8*cradle,0,release),transformOrigin:'24% 40%'});
    // A separate standing pose greets him before she takes her first step.
    setActorPose(redGirl.querySelector('img'),50);
    const greet=ease(phase(t,.50,.54))*(1-ease(phase(t,.61,.65)));
    gsap.set(redGirl,{autoAlpha:greet,left:0,right:'auto',top:0,bottom:'auto',
      x:groundedX-redGirl.offsetWidth*.5,y:floor-ah,scaleX:.82,scaleY:.82,
      zIndex:27,rotation:Math.sin(phase(t,.53,.63)*Math.PI*2)*1.8,transformOrigin:'center bottom'});
    const walk=ease(phase(t,.61,.89)),wh=ah*.82,ww=wh*398/631;
    gsap.set('#ccSocialRedWalk',{autoAlpha:ease(phase(t,.61,.65))*(1-phase(t,.89,.91)),width:ww,height:wh,
      x:mix(groundedX-ww*.5,w+ww*.3,walk),y:floor-wh-Math.sin(walk*Math.PI*10)*3,
      scaleX:-1,scaleY:1,rotation:Math.sin(walk*Math.PI*10)*1.2,transformOrigin:'center bottom'});
    socialStage(c,close>0?1:0);
    gsap.set('#ccSocialStage',{clipPath:`inset(0 0 0 ${clamp((boundary-w*.56)/restPW)*100}%)`});
    gsap.set('#ccSocialRest',{autoAlpha:1,x:0,y:0,rotation:0,clipPath:'inset(0 0 0 0)'});
    gsap.set('#ccSocialStumble,#ccBanana,#ccRedWelcome,#ccRedPresentation,#ccRedFlight',{autoAlpha:0});
    gsap.set(blueActor,{autoAlpha:0});gsap.set(redDoor,{autoAlpha:0});
    gsap.set(copy,{autoAlpha:phase(t,0,.08)});
    aqua.dataset.beat=t<.26?'falling':t<.42?'caught':t<.53?'set-down':t<.65?'greeting':t<.83?'red-exit':t<.98?'closing':'tired';
    aqua.dataset.progress=t.toFixed(4);
  }
  function renderSocialPlans(t,c){
    const {gsap,w,blueActor,copy,redGirl,redDoor}=c;
    const {floor,ph,pw}=socialStage(c,1);
    const slip=ease(phase(t,.61,.78));
    gsap.set('#ccSocialStage',{clipPath:'inset(0 0 0 0)'});
    gsap.set('#ccSocialRest',{autoAlpha:slip<1?1:0,x:0,y:0,rotation:0,clipPath:`inset(0 0 ${slip*100}% 0)`});
    gsap.set('#ccSocialStumble',{autoAlpha:slip>0?1:0,x:0,y:0,rotation:0,clipPath:`inset(${(1-slip)*100}% 0 0 0)`});
    gsap.set('#ccBanana',{autoAlpha:ease(phase(t,.43,.51)),left:w*.56+pw*.28,top:floor-16,
      x:mix(0,-28,slip),y:-Math.sin(slip*Math.PI)*12,rotation:mix(-8,24,slip),width:Math.max(42,pw*.14)});
    gsap.set('#ccSocialRedWalk,#ccAquaStage,#ccRedWelcome,#ccRedPresentation,#ccRedFlight',{autoAlpha:0});
    gsap.set(blueActor,{autoAlpha:0});gsap.set(redGirl,{autoAlpha:0});gsap.set(redDoor,{autoAlpha:0});
    gsap.set(copy,{autoAlpha:1});document.querySelector('#ccSocialStage').dataset.beat=t<.43?'tired':t<.61?'banana':t<.78?'slipping':'stumble';
  }
  window.ColorClikScene07=Object.freeze({render,renderCatch,renderSocialPlans});
})();
