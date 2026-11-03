/* Native-scroll player for the complete storyboard. Pauses offscreen and at rest. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = n => Math.max(0, Math.min(1,n));
  const cache = new Map(), records = [], nearby = new Set();
  let mounted = false, pending = false, viewportProbe;

  function imageFor(frame) {
    let image = cache.get(frame);
    if (!image) {
      image = new Image();image.decoding = 'async';
      image.src = `assets/optimized/${frame}.webp`;
      image.decode().then(schedule).catch(() => {});
    }
    cache.delete(frame);cache.set(frame,image);
    if (cache.size>20) cache.delete(cache.keys().next().value);
    return image;
  }

  function paint(record,state) {
    const keys = ['base','lead','support'];
    const frames = keys.filter(key=>state[key]).map(key=>imageFor(state[key].frame));
    // Swap the whole composition together: never show a new actor over an old beat.
    if (frames.some(image=>!image.complete||!image.naturalWidth)) return;
    const clusterTop=record.designed&&record.card?Math.max(16,(record.figure.clientHeight-record.card.offsetHeight-record.unit*record.artRatio-32)/2):16;
    if(record.designed&&record.card)record.card.style.top=`${clusterTop}px`;
    const stageFloor=record.designed?(record.card?clusterTop:Math.max(16,(record.figure.clientHeight-record.unit*record.artRatio)/2)):12;
    record.figure.style.setProperty('--stage-floor',`${stageFloor}px`);
    const geometry={width:record.figure.clientWidth,height:record.figure.clientHeight,unit:record.unit,floor:stageFloor};
    keys.forEach(key=>{
      const target=record.layers[key];let values=state[key];
      target.hidden=!values;
      if (!values) return;
      if(record.designed&&record.index<4&&key==='base'){
        const distance=Math.abs(values.x);
        values={...values,x:Math.sign(values.x)*(distance<=20?distance*.15:3+(distance-20)*107/90)};
      }
      target.loading='eager';
      if (target.dataset.frame!==values.frame) {
        target.src=imageFor(values.frame).src;target.dataset.frame=values.frame;
      }
      const box=window.ColorClikActorScale.layout(values.frame,values,geometry,key);
      target.style.left=`${box.left}px`;target.style.width=`${box.width}px`;
      target.style.height=`${box.height}px`;target.style.bottom=`${box.bottom}px`;
      target.style.transform=`translate3d(0,${box.offsetY}px,0) scaleX(${values.flip}) rotate(${values.rotation||0}deg)`;
      target.dataset.standingHeight=box.standingHeight.toFixed(3);
      target.dataset.floor=String(geometry.floor);

    });
    record.prop.hidden=!state.prop;
    if(state.prop&&state.base){
      const m=window.ColorClikActorMetrics[state.base.frame];
      const box=window.ColorClikActorScale.layout(state.base.frame,state.base,geometry,'base');
      record.prop.style.left=`${box.left+m.w*state.prop.x/100*box.sourceScale}px`;
      record.prop.style.top=`${geometry.height-box.bottom-box.height+m.h*state.prop.y/100*box.sourceScale}px`;
      record.prop.style.width=`${record.unit*.18}px`;
      record.prop.style.transform=`rotate(${state.prop.rotation}deg)`;
    }
    if(record.card){
      const direction=record.index%2?-1:1;
      record.card.style.transform=`translate3d(${direction*(state.cardX||0)}%,0,0)`;
      const figure=record.figure.getBoundingClientRect(),card=record.card.getBoundingClientRect(),team=record.layers.base.getBoundingClientRect();
      const line=record.rope.querySelector('line');
      record.rope.setAttribute('viewBox',`0 0 ${figure.width} ${figure.height}`);
      line.setAttribute('x1',card.left-figure.left+card.width*(direction===1?.8:.2));
      line.setAttribute('y1',card.bottom-figure.top-4);
      line.setAttribute('x2',team.left-figure.left+team.width*(direction===1?.12:.88));
      line.setAttribute('y2',team.top-figure.top+team.height*.45);
    }
    record.scene.dataset.motionBeat=state.beat;
  }

  function render(record) {
    const rect=record.runway.getBoundingClientRect();
    const distance=Math.max(1,rect.height-record.moment.offsetHeight);
    const progress=clamp(-rect.top/distance);
    record.scene.dataset.motionProgress=progress.toFixed(4);
    const timeline=window.ColorClikStoryTimeline;
    paint(record,timeline.sample(record.index,progress));
    // Warm only the next beat, rather than decoding the whole story in advance.
    const beats=timeline.stories[record.index];
    const next=beats.find(beat=>beat.at>progress+.0001);
    if(next){const state=timeline.sample(record.index,next.at);['base','lead','support'].forEach(key=>{if(state[key])imageFor(state[key].frame);});}
  }
  function tick(){pending=false;if(reduced.matches||document.hidden)return;nearby.forEach(render);}
  function schedule(){if(!pending&&!reduced.matches&&mounted){pending=true;requestAnimationFrame(tick);}}
  function sizeStages(){
    if(document.querySelector('dialog[open]'))return;
    const availableWidth=Math.min(...records.map(record=>record.figure.clientWidth));
    const phone=matchMedia('(max-width:600px) and (orientation:portrait)').matches;
    const viewportHeight=viewportProbe.getBoundingClientRect().height;
    let closeUnit=window.ColorClikActorScale.unit(availableWidth,viewportHeight,phone);
    const composed=phone&&getComputedStyle(document.querySelector('.story-toolbar')).display!=='none';
    if(composed){
      const space=record=>{
        const style=getComputedStyle(record.moment);
        const copy=record.scene.querySelector('.copy').getBoundingClientRect().height;
        const toolbar=record.moment.querySelector('.story-toolbar').getBoundingClientRect().height;
        return Math.max(100,viewportHeight-copy-toolbar-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom)-2*parseFloat(style.rowGap));
      };
      const fit=(indices,ratio)=>Math.min(availableWidth/ratio,...indices.map(i=>(space(records[i])-32)/records[i].artRatio));
      const cameras={portrait:Math.min(560,fit([0,1,2,3],.72)),blue:fit([4,5],1.35),red:fit([6,7],.8),aqua:fit([8,9],1.2),purple:fit([10,11],1.17),wide:availableWidth/2.5,finale:fit([17],1.55)};
      records.forEach(record=>{
        const camera=record.index<4?'portrait':record.index<6?'blue':record.index<8?'red':record.index<10?'aqua':record.index<12?'purple':record.index<17?'wide':'finale';
        record.unit=cameras[camera];record.designed=true;record.scene.dataset.camera=camera;
        record.figure.style.setProperty('--actor-unit',`${record.unit}px`);
      });
    }else{
      const wideUnit=window.ColorClikActorScale.unit(availableWidth,viewportHeight,phone,true);
      records.forEach(record=>{
        record.unit=phone&&record.card?wideUnit:closeUnit;record.designed=false;
        record.scene.dataset.camera=phone&&record.card?'wide':'close';
        record.figure.style.setProperty('--actor-unit',`${record.unit}px`);
      });
    }
    schedule();
  }
  function applyPreference(){
    document.documentElement.classList.toggle('touch-motion',!reduced.matches);
    if(reduced.matches){
      records.forEach(record=>{
        const image=record.layers.base;image.hidden=false;image.style.cssText='';
        image.src=record.poster;delete image.dataset.frame;
        record.layers.lead.hidden=true;record.layers.support.hidden=true;record.prop.hidden=true;
        if(record.card)record.card.style.transform='';
      });
      cache.clear();
    }else sizeStages();
  }

  function mount(){
    if(mounted||!window.ColorClikReading||!window.ColorClikStoryTimeline||!window.ColorClikActorScale)return;
    mounted=true;
    document.documentElement.classList.add('story-composed');
    viewportProbe=document.createElement('div');viewportProbe.className='story-viewport-probe';
    viewportProbe.setAttribute('aria-hidden','true');document.body.append(viewportProbe);
    document.querySelectorAll('.scene').forEach((scene,index)=>{
      const copy=scene.querySelector('.copy'),original=scene.querySelector('.reading-art'),card=scene.querySelector('.reading-project');
      const runway=document.createElement('div');runway.className='story-runway';
      const moment=document.createElement('div');moment.className='story-moment';
      const toolbar=document.createElement('div');toolbar.className='story-toolbar';
      const logo=document.querySelector('.header .logo img').cloneNode(true);logo.removeAttribute('width');logo.removeAttribute('height');logo.loading='eager';
      const actions=document.createElement('div');actions.className='story-toolbar-actions';
      const counter=document.createElement('span');counter.className='story-chapter-count';counter.textContent=String(index+1).padStart(2,'0')+' / 18';counter.setAttribute('aria-label','Capítulo '+(index+1)+' de 18');
      const quote=document.createElement('button');quote.type='button';quote.dataset.quote='';quote.textContent='Conversemos';
      quote.dataset.quoteService=index<4?'Marketing Digital':index<6?'Desarrollo Web':index<8?'Branding y Diseño':index<10?'Redes y Contenido':index<12?'Soluciones a Medida':'Marketing Digital';
      actions.append(counter,quote);toolbar.append(logo,actions);
      const tints=['#fff3ce','#fff3ce','#fff3ce','#fff3ce','#eaf1ff','#eaf1ff','#fff0ee','#fff0ee','#e8f6f2','#e8f6f2','#f2edfc','#f2edfc','#fff4db','#edf3ff','#edf7ed','#edf8f8','#f4effb','#fff2dc'];
      scene.style.setProperty('--scene-tint',tints[index]);
      const details=document.createElement('div');details.className='story-details';
      // Every action gets its own visible scroll distance, before lengthy pricing content.
      copy.querySelectorAll('.cc-plan-carousel,.cc-webplans-grid,.cc-brandplans-grid,.cc-final-quote').forEach(el=>details.append(el));
      const figure=document.createElement('div');figure.className='story-visual';
      const layers={};
      ['base','lead','support'].forEach(key=>{
        const image=key==='base'&&original?original:new Image();
        image.className=key==='base'?'motion-pose':'motion-layer';image.alt='';
        if(key==='base'&&!original)image.src='assets/optimized/coherent-v80/team-a.webp';
        image.loading=index===0?'eager':'lazy';image.decoding='async';
        image.setAttribute('aria-hidden','true');image.hidden=key!=='base';
        layers[key]=image;figure.append(image);
      });
      const prop=document.createElement('div');prop.className='story-peel';prop.hidden=true;
      const banana=document.querySelector('#ccBanana').cloneNode(true);banana.removeAttribute('id');prop.append(banana);figure.append(prop);
      let rope;
      if(card){
        card.querySelector('a').textContent='Ver proyecto';
        figure.classList.add('story-project-visual');
        rope=document.createElementNS('http://www.w3.org/2000/svg','svg');
        rope.classList.add('story-rope');rope.setAttribute('aria-hidden','true');
        const line=document.createElementNS('http://www.w3.org/2000/svg','line');rope.append(line);figure.append(rope,card);
      }
      moment.append(toolbar,copy,figure);runway.append(moment);scene.append(runway);
      if(details.childElementCount)scene.append(details);
      scene.classList.remove('motion-content');scene.classList.add('motion-chapter');
      // Longer sequences get more gesture distance so their intermediate poses remain readable.
      const count=window.ColorClikStoryTimeline.stories[index].length;
      scene.style.setProperty('--story-distance',`${Math.max(100,Math.min(240,count*14))}svh`);
            let artRatio=1;
      window.ColorClikStoryTimeline.stories[index].forEach((beat,i,beats)=>{
        const state=window.ColorClikStoryTimeline.sample(index,beat.at+((beats[i+1]?.at??1)-beat.at)*.5);
        ['base','lead','support'].forEach(key=>{if(state[key]){const m=window.ColorClikActorMetrics[state[key].frame];artRatio=Math.max(artRatio,(m.floor-m.bounds[1])/m.body);}});
      });
      records.push({artRatio,unit:0,scene,runway,moment,figure,layers,prop,card,rope,index,poster:layers.base.src});
    });
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        const record=records.find(r=>r.runway===entry.target);
        if(entry.isIntersecting)nearby.add(record);else nearby.delete(record);
      });schedule();
    },{rootMargin:'25% 0px'});
    records.forEach(record=>observer.observe(record.runway));
    addEventListener('scroll',schedule,{passive:true});addEventListener('resize',sizeStages,{passive:true});
    document.addEventListener('visibilitychange',schedule);reduced.addEventListener('change',applyPreference);
    document.fonts?.ready.then(sizeStages);
    const textObserver=new ResizeObserver(sizeStages);
    records.forEach(record=>textObserver.observe(record.scene.querySelector('.copy')));
    applyPreference();
  }
  window.ColorClikMobileMotion={mount};
})();
