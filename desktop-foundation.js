/* The original ColorClik quotation app is reused, not recreated. */
(() => {
 if(innerWidth<=800)return;
 document.querySelectorAll('#ccPricingTrack [data-plan]').forEach(button=>{
  button.dataset.plan=button.dataset.plan.trim();
  button.dataset.quote='';
  button.dataset.quoteService='Marketing Digital';
 });
 document.querySelectorAll('.cc-webplan a').forEach(link=>{
  const button=document.createElement('button');
  button.type='button';button.dataset.quote='';button.dataset.quoteService='Desarrollo Web';
  button.dataset.plan=link.closest('article').querySelector('h3').textContent.trim();
  button.textContent='Elegir '+button.dataset.plan;link.replaceWith(button);
 });
 const mount=document.createElement('div');mount.id='quote-ui';document.body.append(mount);
 const fallback=document.createElement('dialog');fallback.id='quote-dialog';fallback.hidden=true;document.body.append(fallback);
 const script=document.createElement('script');script.src='assets/vendor/colorclik-quote.js';script.defer=true;
 script.onerror=()=>{document.querySelectorAll('[data-quote]').forEach(button=>button.addEventListener('click',()=>{location.href='https://andreluyarizzo.github.io/colorclik-web/contacto.html';}));};
 document.body.append(script);
})();
