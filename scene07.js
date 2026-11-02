/* ColorClik scene 07 — deterministic choreography, safe in both scroll directions. */
(() => {
  const clamp = value => Math.max(0, Math.min(1, value));
  const progress = (t, start, end) => clamp((t - start) / (end - start));
  const smooth = value => value * value * (3 - 2 * value);
  const mix = (a, b, value) => a + (b - a) * value;
  const walkFrame = value => Math.floor(value * 12) % 2 ? 43 : 45;
  function render(t, context) {
    const {gsap,w,h,nextSequence,blueActor,bluePose,redDoor,redDoorImage,redGirl,copy,setActorPose} = context;
    const welcome = document.querySelector('#ccRedWelcome');
    const presentation = document.querySelector('#ccRedPresentation');
    const ready = layer => {
      const image = layer.querySelector('img');
      return image.complete && image.naturalWidth > 0;
    };
    const reveal = ready(welcome) ? smooth(progress(t,.42,.50)) : 0;
    const farewell = reveal === 1 && ready(presentation) ? smooth(progress(t,.64,.72)) : 0;
    const portalHeight = welcome.offsetHeight;
    const actorWidth = blueActor.offsetWidth;
    const floor = nextSequence.getBoundingClientRect().bottom;
    // Door left, visitor right: arrival and departure follow the storyboard arrows.
    const doorLeft = w * .57;
    const visitorHome = doorLeft + welcome.offsetHeight * .42;
    const approach = progress(t,0,.20);
    const departure = progress(t,.72,.90);
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
    else if (t < .72) { blueFrame = 42; blueFlip = 1; }
    else {
      blueFrame = walkFrame(departure);
      blueFlip = 1;
      blueX = mix(visitorHome,w+actorWidth*.35,departure);
      bob = -Math.sin(departure*Math.PI*12)*3;
    }
    setActorPose(bluePose,blueFrame);
    gsap.set(blueActor,{autoAlpha:reveal<1?1:(t>=.72 && t<.90?1:0),x:blueX,y:floor-blueActor.offsetHeight+bob,scaleX:blueFlip,scaleY:1,transformOrigin:'center bottom'});

    // Draw the incoming artwork OVER an opaque outgoing layer. Fading both
    // transparent PNGs at once exposes the white stage at their midpoint.
    // All three sources keep their native aspect ratio and share a portal anchor.
    gsap.set(redDoor,{autoAlpha:reveal<1?1:0,left:doorLeft,right:'auto',x:-portalHeight*.04,y:floor-h});
    gsap.set(redDoorImage,{rotationY:0,scaleX:1,scaleY:1});
    gsap.set(redGirl,{autoAlpha:0});
    gsap.set(welcome,{autoAlpha:farewell<1?reveal:0});
    gsap.set(presentation,{autoAlpha:farewell,x:-portalHeight*.265});
    gsap.set(copy,{autoAlpha:1});
    copy.style.pointerEvents='auto';
    redGirl.dataset.storyBeat=t<.20?'arrival':t<.42?'knocking':t<.61?'welcome':t<.80?'goodbye':'presentation';
  }
  window.ColorClikScene07=Object.freeze({render});
})();
