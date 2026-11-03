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

  const ease = q => q*q*q*(q*(q*6-15)+10);
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
    const walk=phase(t,.53,.71),wh=rh*1.1,ww=wh;
    walkFrames('#ccSocialRedWalk',walk*w,rh*.55);
    gsap.set('#ccSocialRedWalk',{autoAlpha:t>=.53&&t<.72?1:0,width:ww,height:wh,
      x:mix(center-ww/2,w+ww*.2,ease(walk)),y:floor-wh*1060/1100,
      scaleX:-1,scaleY:1,rotation:0,transformOrigin:'center bottom'});
    gsap.set('#ccBanana',{autoAlpha:0});
    gsap.set(copy,{autoAlpha:phase(t,0,.08)});aqua.dataset.beat=state;
    deckProgress(t);
  }
  function deckProgress(t){document.querySelector('#ccAquaAction').dataset.progress=t.toFixed(4);}
  function renderSocialPlans(t,c){
    const {gsap,redGirl,copy}=c;
    const state=t<.08?'tired':t<.30?'eat':t<.42?'drop':t<.58?'tired':t<.76?'slip':'fall';
    const l=frame(c,state);hideLegacy(c);
    gsap.set('#ccAquaStage,#ccRedLanding,#ccSocialRedWalk',{autoAlpha:0});gsap.set(redGirl,{autoAlpha:0});
    const drop=phase(t,.42,.54),q=ease(phase(t,.58,.80));
    gsap.set('#ccBanana',{autoAlpha:t>=.42&&state!=='slip'?1:0,left:l.left+REGISTER.bananaX*l.unit,top:l.floor-14-l.ah*.26*(1-drop*drop),
      width:l.size*.12,x:-22*q,y:-Math.sin(q*Math.PI)*9,rotation:24*q});
    gsap.set(copy,{autoAlpha:1});deckProgress(t);
  }

  const PURPLE = {"flightRatio": 1, "aquaWalkRatio": 1, "purpleWalkRatio": 1};
  function walkFrames(id,distance,stride){
    const node=document.querySelector(id),images=[...node.querySelectorAll('img')];
    if(!images.length)return;
    const index=Math.floor(Math.abs(distance)/Math.max(1,stride)*images.length)%images.length;
    images.forEach((im,i)=>im.style.opacity=i===index?'1':'0');node.dataset.walkFrame=String(index);
  }
  function renderPurple(t,c){
    const {gsap,w,h,redGirl,copy}=c,l=layout(c);
    hideLegacy(c);gsap.set('#ccAquaStage,#ccAquaAction,#ccRedLanding,#ccSocialRedWalk,#ccBanana',{autoAlpha:0});gsap.set(redGirl,{autoAlpha:0});
    const state=t<.13?'ready':t<.37?'caught':t<.57?'greeting':t<.70?'farewell':'closing';
    const deck=document.querySelector('#ccPurpleAction');
    gsap.set(deck,{autoAlpha:1,left:l.left,top:l.top,width:l.size,height:l.size});
    deck.querySelectorAll('img').forEach(im=>im.style.opacity=(im.dataset.pose===state||state==='wave'&&im.dataset.pose==='door')?'1':'0');
    deck.dataset.beat=t<.13?'falling':t<.37?'caught':t<.57?'greeting':t<.70?'aqua-departure':'closing';
    deck.dataset.progress=t.toFixed(4);
    const q=ease(phase(t,0,.13)),fh=l.ah*1.035,fw=fh*PURPLE.flightRatio;
    gsap.set('#ccAquaFall',{autoAlpha:t<.13?1:0,width:fw,height:fh,
      x:mix(w*.66,l.left+260*l.unit,q)-fw/2,y:mix(-fh,l.floor-fh*1060/1100,q),scaleX:1,scaleY:1,rotation:0});
    const aq=phase(t,.57,.70),ah=l.ah*1.078,aw=ah*PURPLE.aquaWalkRatio;
    const ax=mix(l.left+300*l.unit-aw/2,w+aw*.2,ease(aq));
    walkFrames('#ccAquaWalk',ax-(l.left+300*l.unit-aw/2),l.ah*.55);
    gsap.set('#ccAquaWalk',{autoAlpha:t>=.57&&t<.70?1:0,width:aw,height:ah,
      x:ax,y:l.floor-ah*1060/1100,
      scaleX:-1,scaleY:1,rotation:0});
    const pq=phase(t,.88,1),ph=l.ah*1.15,pw=ph*PURPLE.purpleWalkRatio;
    gsap.set('#ccPurpleWalk',{autoAlpha:0,width:pw,height:ph,
      x:mix(l.left+630*l.unit-pw/2,w+pw*.2,ease(pq)),y:l.floor-ph-Math.sin(pq*Math.PI*10)*2,
      scaleX:1,scaleY:1,rotation:0});
    gsap.set(copy,{autoAlpha:phase(t,0,.06)});
  }

  function renderPurplePlans(t,c){
    const {gsap,w,redGirl,copy}=c,l=layout(c),deck=document.querySelector('#ccPurpleAction');
    hideLegacy(c);gsap.set('#ccAquaStage,#ccAquaAction,#ccRedLanding,#ccSocialRedWalk,#ccBanana,#ccAquaFall,#ccAquaWalk',{autoAlpha:0});gsap.set(redGirl,{autoAlpha:0});
    gsap.set(deck,{autoAlpha:1,left:l.left,top:l.top,width:l.size,height:l.size});
    deck.querySelectorAll('img').forEach(im=>im.style.opacity=(im.dataset.pose==='door'||t<.28&&(im.dataset.pose==='wave'))?'1':'0');
    deck.dataset.beat=t<.28?'plans-wave':t<.65?'purple-exit':'plans';deck.dataset.progress=t.toFixed(4);
    const q=phase(t,.28,.65),ph=l.ah*1.265,pw=ph*PURPLE.purpleWalkRatio;
    const px=mix(l.left+500*l.unit-pw/2,w+pw*.2,ease(q));
    walkFrames('#ccPurpleWalk',px-(l.left+500*l.unit-pw/2),l.ah*.60);
    gsap.set('#ccPurpleWalk',{autoAlpha:t>=.28&&t<.65?1:0,width:pw,height:ph,
      x:px,y:l.floor-ph*1060/1100,
      scaleX:1,scaleY:1,rotation:0});
    gsap.set(copy,{autoAlpha:phase(t,0,.06)});
  }
  const PROJECTS = [{"id": "freshclean", "name": "FreshClean", "image": "comercializadorafreshclean", "url": "https://comercializadorafreshclean.cl/", "description": "Una propuesta fresca y directa que pone los productos de limpieza en primer plano.", "color": "#efbc18"}, {"id": "manton", "name": "Manton", "image": "manton", "url": "http://manton.cl/", "description": "Una presencia sólida y visual que expresa la fuerza de la marca y su trabajo en fabricación de remolques.", "color": "#146cff"}, {"id": "naturalmentores", "name": "Naturalmentores", "image": "naturalmentores", "url": "https://naturalmentores.com/", "description": "Formación y bienestar en un espacio digital que invita a descubrir nuevas maneras de aprender y crecer.", "color": "#e52c32"}, {"id": "indeedinsurance", "name": "Indeed Insurance", "image": "indeedinsurance", "url": "http://indeedinsurance.net/", "description": "Una presentación clara y cercana para comunicar la propuesta de la agencia y sus soluciones de seguros.", "color": "#00aeb3"}, {"id": "colorclik", "name": "ColorClik", "image": null, "url": "https://andreluyarizzo.github.io/colorclik-web/", "description": "Diseño web interactivo para dar forma a nuevas ideas y proyectos.", "color": "#7939ed"}];
  function renderPortfolio(progress,c){
    const {gsap,w,h,redGirl,copy}=c;
    hideLegacy(c);gsap.set('#ccAquaStage,#ccAquaAction,#ccRedLanding,#ccSocialRedWalk,#ccBanana,#ccAquaFall,#ccAquaWalk,#ccPurpleAction,#ccPurpleWalk',{autoAlpha:0});gsap.set(redGirl,{autoAlpha:0});
    const index=Math.min(4,Math.floor(progress)),t=clamp(progress-index),project=PROJECTS[index];
    const reduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    const shift=reduced?0:t<.22?mix(-w,0,ease(phase(t,0,.22))):index<4&&t>.72?mix(w*.02,w*1.2,ease(phase(t,.72,1))):mix(0,w*.02,phase(t,.22,.72));
    const teamWidth=Math.min(w*.47,980),teamHeight=teamWidth*748/1580,floor=h*.84;
    const bob=reduced?0:Math.sin(phase(t,0,1)*Math.PI*16)*2;
    const mirrored=index%2===1;
    const teamX=mirrored?w-w*.49-teamWidth-shift:w*.49+shift,teamY=floor-teamHeight+bob,handY=teamY+teamHeight*.40;
    const cardWidth=Math.min(w*.30,560),cardHeight=cardWidth/1.6+120,cardX=mirrored?w-w*.06-cardWidth-shift:w*.06+shift,cardY=handY-cardHeight/2;
    const alpha=reduced?1:phase(t,0,.04)*(index<4?1-phase(t,.97,1):1);
    const team=document.querySelector('#ccPortfolioTeam'),card=document.querySelector('#ccPortfolioCard'),rope=document.querySelector('#ccPortfolioRope');
    gsap.set(team,{autoAlpha:alpha,width:teamWidth,height:teamHeight,x:teamX,y:teamY,rotation:0,scaleX:mirrored?-1:1,scaleY:1});
    gsap.set(card,{autoAlpha:alpha,width:cardWidth,height:cardHeight,x:cardX,y:cardY,rotation:0});
    gsap.set(rope,{autoAlpha:alpha,width:Math.max(0,mirrored?cardX-teamX-teamWidth+8:teamX-cardX-cardWidth+8),height:24,x:mirrored?teamX+teamWidth-6:cardX+cardWidth-2,y:handY-12});
    card.style.setProperty('--project-accent',project.color);card.style.pointerEvents=alpha>.85?'auto':'none';card.dataset.client=project.id;card.dataset.side=mirrored?'right':'left';
    document.querySelector('#ccPortfolioTitle').textContent=project.name;
    document.querySelector('#ccPortfolioDescription').textContent=project.description;
    const link=document.querySelector('#ccPortfolioLink');link.href=project.url;link.setAttribute('aria-label','Ver proyecto '+project.name);
    document.querySelector('#ccPortfolioPreview').querySelectorAll('[data-client]').forEach(im=>im.style.opacity=im.dataset.client===project.id?'1':'0');
    team.dataset.direction=mirrored?'backward-left':'backward-right';team.dataset.progress=t.toFixed(4);
    gsap.set(copy,{autoAlpha:phase(t,0,.08)});
  }
  function renderFinale(t,c){
    const {gsap,w,h,redGirl,copy}=c;
    hideLegacy(c);gsap.set(redGirl,{autoAlpha:0});
    gsap.set('#ccAquaStage,#ccAquaAction,#ccRedLanding,#ccSocialRedWalk,#ccBanana,#ccAquaFall,#ccAquaWalk,#ccPurpleAction,#ccPurpleWalk,#ccPortfolioTeam,#ccPortfolioCard,#ccPortfolioRope',{autoAlpha:0});
    const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const floor=h*.88,groupH=Math.min(w*.47*1024/1481,h*.48),groupW=groupH*1481/1024;
    const joined=reduced||t>=.64;
    gsap.set('#ccFinalHug',{autoAlpha:joined?1:0,left:w*.055,top:floor-groupH,width:groupW,height:groupH,scale:1,rotation:0});
    const names=['purple','aqua','yellow','blue','red'];
    names.forEach((name,i)=>{
      const q=ease(phase(t,.03+i*.065,.30+i*.065));
      const el=document.querySelector('#ccFinal-'+name),ratio=Number(el.dataset.ratio),ah=groupH*(name==='red'?.75:.94),aw=ah*ratio;
      const target=w*.055+groupW*(.12+i*.175)-aw/2;
      const fromRight=i%2===1;
      const start=fromRight?w+aw:-aw;
      const direction=fromRight?-1:1;
      const nativeLeft=['aqua','red'].includes(name);
      const facing=(nativeLeft?-1:1)*direction;
      const x=mix(start,target,q);
      walkFrames('#ccFinal-'+name,x-start,ah*.55);
      gsap.set(el,{autoAlpha:!joined&&t>=.03+i*.065?1:0,width:aw,height:ah,x,y:floor-ah*1060/1100,scaleX:facing,scaleY:1,rotation:0,transformOrigin:'center bottom',zIndex:40+i});
    });
    gsap.set(copy,{autoAlpha:1});copy.style.pointerEvents='auto';
  }
  window.ColorClikScene07=Object.freeze({render,renderCatch,renderSocialPlans,renderPurple,renderPurplePlans,renderPortfolio,renderFinale});
})();
