/* Native reading keeps every chapter available on touch screens and without GSAP. */
window.ColorClikReading = matchMedia('(max-width: 1100px), (prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.toggle('reading', window.ColorClikReading);
let readingMounted = false;
function mountReading() {
  if (!window.gsap || !window.ScrollTrigger) {
    window.ColorClikReading = true;
    document.documentElement.classList.add('reading');
  }
  if (!window.ColorClikReading) {document.querySelectorAll('.stage img').forEach(im => im.loading='eager');return;}
  if (readingMounted) return;
  readingMounted = true;
  window.ScrollTrigger?.getAll().forEach(t => t.kill(true));
  document.documentElement.classList.add('reading');
  document.querySelectorAll('.scene').forEach(el => {el.style.removeProperty('height');el.style.removeProperty('position');});
  const artwork = ['yellow/1','yellow/15','yellow/25','yellow/31','yellow/38','yellow/41','red/v68/09','red/51','story-v72/caught','social/rest','purple-v73/greeting','purple-v73/wave'];
  document.querySelectorAll('.stage > [aria-hidden="true"] img').forEach(im => { im.loading = 'lazy'; im.decoding = 'async'; });
  document.querySelectorAll('.scene').forEach((scene, i) => {
    scene.inert = false;
    if (i < 12 || i === 17) {
      const image = new Image();
      image.src = 'assets/optimized/' + (artwork[i] || 'coherent-v80/hug') + '.webp';
      image.alt = ''; image.width = 640; image.height = 480;
      image.loading = i === 0 ? 'eager' : 'lazy'; image.decoding = 'async';
      image.className = 'reading-art'; scene.append(image);
    } else {
      const card = document.querySelector('#ccPortfolioCard').cloneNode(true);
      card.removeAttribute('id'); card.className = 'reading-project';
      card.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      const clients = ['freshclean','manton','naturalmentores','indeedinsurance','colorclik'];
      const urls = ['https://comercializadorafreshclean.cl/','http://manton.cl/','https://naturalmentores.com/','http://indeedinsurance.net/','https://andreluyarizzo.github.io/colorclik-web/'];
      const names = ['FreshClean','Manton','Naturalmentores','Indeed Insurance','ColorClik'];
      const client = clients[i-12];
      card.querySelectorAll('[data-client]').forEach(el => { if (el.dataset.client !== client) el.remove(); });
      card.querySelector('h3').textContent = names[i-12];
      card.querySelector('p').textContent = 'Conoce el proyecto de ' + names[i-12] + '.';
      const link = card.querySelector('a'); link.href = urls[i-12]; link.rel = 'noopener noreferrer';
      card.querySelectorAll('img').forEach(im => {im.loading='lazy'; im.decoding='async';});
      scene.append(card);
    }
  });
  document.querySelectorAll('#ccPricingTrack [data-plan]').forEach(b => b.dataset.plan = b.dataset.plan.trim());
  window.ColorClikMobileMotion?.mount();
}
addEventListener('DOMContentLoaded', mountReading);
matchMedia('(max-width: 1100px), (prefers-reduced-motion: reduce)').addEventListener('change', e => {
 if (e.matches) {window.ColorClikReading=true; mountReading();}
});
