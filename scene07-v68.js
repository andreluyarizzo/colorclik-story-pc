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
    // Scene 8's final beat: the character leaves downward while the plans and
    // closed door remain fixed. Existing pose 50 is already a transparent asset.
    if(c.planPhase!==null && c.planPhase!==undefined){
      const release=phase(c.planPhase,.76,.80);
      const drop=phase(c.planPhase,.80,1);
      const closed=document.querySelector('#ccRedPresentation');
      const closedImage=closed.querySelector('img');
      if(!closedImage.dataset.closed){closedImage.src='assets/optimized/red/v68/00.webp';closedImage.dataset.closed='true';}
      gsap.set(closed,{autoAlpha:release,left,width:pw,height:ph,bottom:innerHeight-floor-ph*.03,x:0});
      gsap.set(closedImage,{scaleX:.86,scaleY:1,transformOrigin:'37.5% 0%'});
      gsap.set(portal,{autoAlpha:1-release});
      if(release>0){
        setActorPose(redGirl.querySelector('img'),50);
        gsap.set(redGirl,{autoAlpha:release,left:0,right:'auto',top:0,bottom:'auto',x:left+pw*.69-redGirl.offsetWidth*.5+w*.025*drop,y:floor-ah+innerHeight*1.22*drop*drop,rotation:drop*-14,scaleX:1,scaleY:1,zIndex:25,transformOrigin:'center center'});
      }
    }
    portal.dataset.frame=String(index);
    redGirl.dataset.storyBeat=t<.20?'arrival':t<.39?'knocking':t<.54?'welcome':t<.70?'departure':t<.80?'step-out':t<1?'closing':'wave';
  }
  window.ColorClikScene07=Object.freeze({render});
})();
