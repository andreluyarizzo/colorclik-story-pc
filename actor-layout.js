/* One anatomical scale, regardless of pose canvas or CSS object-fit constraints. */
(() => {
  function unit(width,viewportHeight) {
    // Five linked people are the widest composition. Reserve space for full bodies.
    return Math.min(width / 2.35, viewportHeight * .27, 280);
  }
  function layout(frame,values,geometry,role) {
    const m=window.ColorClikActorMetrics[frame];
    if(!m)throw Error('Missing actor reference: '+frame);
    const scale=geometry.unit/m.body;
    const width=m.w*scale,height=m.h*scale;
    const center=values.flip===-1?m.w-m.center:m.center;
    const anchor=role==='base'?.5:(values.x+values.width/2)/100;
    const shift=role==='base'?values.x/100:0;
    const left=(anchor+shift)*geometry.width-center*scale;
    const bottom=geometry.floor-(m.h-m.floor)*scale;
    return {width,height,left,bottom,offsetY:values.y/100*geometry.height,
      standingHeight:m.body*scale,sourceScale:scale,
      visible:{left:left+(values.flip===-1?m.w-m.bounds[2]:m.bounds[0])*scale,
        width:(m.bounds[2]-m.bounds[0])*scale,height:(m.bounds[3]-m.bounds[1])*scale}};
  }
  window.ColorClikActorScale={unit,layout};
})();
