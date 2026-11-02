/* ColorClik scene 07 — deterministic choreography, safe in both scroll directions. */
(() => {
  const clamp = value => Math.max(0, Math.min(1, value));
  const progress = (t, start, end) => clamp((t - start) / (end - start));
  const smooth = value => value * value * (3 - 2 * value);
  const mix = (a, b, value) => a + (b - a) * value;
  const walkFrame = value => Math.floor(value * 12) % 2 ? 43 : 45;
  function render(t, context) {
    const {gsap,w,h,nextSequence,blueActor,bluePose,redDoor,redDoorImage,redGirl,copy,setActorPose} = context;
    const actorWidth = blueActor.offsetWidth;
    const floor = nextSequence.getBoundingClientRect().bottom;
    const doorWidth = redDoor.offsetWidth;
    // Door left, visitor right: arrival and departure follow the storyboard arrows.
    const doorLeft = w * .57;
    const visitorHome = doorLeft + doorWidth - actorWidth * .25;
    const approach = progress(t,0,.20);
    const departure = progress(t,.65,.82);
    let blueFrame = 46;
    let blueX = visitorHome;
    let blueFlip = -1;
    let bob = 0;
    if (t < .20) {
      blueFrame = walkFrame(approach);
      blueX = mix(w + actorWidth*.2,visitorHome,approach);
      bob = -Math.sin(approach*Math.PI*12)*3;
    } else if (t < .27) blueFrame = 46;
    else if (t < .31) blueFrame = 47;
    else if (t < .34) blueFrame = 48;
    else if (t < .38) blueFrame = 47;
    else if (t < .42) blueFrame = 48;
    else if (t < .60) blueFrame = 46;
    else if (t < .65) { blueFrame = 42; blueFlip = 1; }
    else {
      blueFrame = walkFrame(departure);
      blueFlip = 1;
      blueX = mix(visitorHome,w+actorWidth*.35,departure);
      bob = -Math.sin(departure*Math.PI*12)*3;
    }
    setActorPose(bluePose,blueFrame);
    gsap.set(blueActor,{autoAlpha:t<.82?1:0,x:blueX,y:floor-blueActor.offsetHeight+bob,scaleX:blueFlip,scaleY:1,transformOrigin:'center bottom'});

    const opening = smooth(progress(t,.42,.54));
    const closing = smooth(progress(t,.80,.92));
    gsap.set(redDoor,{autoAlpha:1,left:doorLeft,right:'auto',x:0,y:floor-h});
    gsap.set(redDoorImage,{rotationY:-68*opening*(1-closing),transformOrigin:'16% 50%'});

    const step = smooth(progress(t,.61,.80));
    const peekX = doorLeft-actorWidth*.28;
    const outsideX = doorLeft-actorWidth*.60;
    const redFrame = t<.61 ? 49 : t<.80 ? 50 : 51;
    setActorPose(redGirl.querySelector('img'),redFrame);
    gsap.set(redGirl,{
      autoAlpha:progress(t,.46,.54),
      left:0,right:'auto',x:mix(peekX,outsideX,step),y:floor-h,
      scaleX:1,scaleY:1,zIndex:t<.61?21:23,transformOrigin:'center bottom'
    });
    gsap.set(copy,{autoAlpha:smooth(progress(t,.44,.56))});
    copy.style.pointerEvents=t>=.56?'auto':'none';
    redGirl.dataset.storyBeat=t<.20?'arrival':t<.42?'knocking':t<.61?'welcome':t<.80?'goodbye':'presentation';
  }
  window.ColorClikScene07=Object.freeze({render});
})();
