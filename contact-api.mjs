// Optional email API. Requires an HTTPS origin, Turnstile and Resend credentials.
const attempts=new Map();
const services=new Set(['Marketing Digital','Desarrollo Web','Branding y Diseño','Redes y Contenido','Soluciones a Medida']);
export async function contactAPI(req,res){
 const reply=(code,data)=>{res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
 const configured=Boolean(process.env.PUBLIC_ORIGIN&&process.env.TURNSTILE_SITE_KEY&&process.env.TURNSTILE_SECRET_KEY&&process.env.RESEND_API_KEY&&process.env.MAIL_FROM&&process.env.MAIL_TO);
 if(req.url==='/api/contact-config'&&req.method==='GET') {reply(200,{enabled:configured,siteKey:configured?process.env.TURNSTILE_SITE_KEY:null});return;}
 if(req.url!=='/api/contact'||req.method!=='POST'){reply(405,{error:'Método no permitido'});return;}
 if(!configured){reply(503,{error:'El envío directo no está configurado.'});return;}
 if(req.headers.origin!==process.env.PUBLIC_ORIGIN){reply(403,{error:'Origen no permitido'});return;}
 if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']||'')){reply(415,{error:'Formato no permitido'});return;}
 const now=Date.now(),ip=req.socket.remoteAddress; // Do not trust client-supplied forwarding headers.
 for(const [key,entry] of attempts)if(entry.until<now)attempts.delete(key);
 const entry=attempts.get(ip)||{count:0,until:now+600000};
 if(entry.count>=5||attempts.size>=10000&&!attempts.has(ip)){res.setHeader('Retry-After','600');reply(429,{error:'Demasiados intentos. Intenta más tarde.'});return;}
 entry.count++;attempts.set(ip,entry);
 try{
  let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>16384){reply(413,{error:'Mensaje demasiado largo'});return;}}
  let d;try{d=JSON.parse(body);}catch{reply(400,{error:'JSON no válido'});return;}
  if(!d||typeof d!=='object'||Array.isArray(d)){reply(400,{error:'Solicitud no válida'});return;}
  if(d.website){reply(400,{error:'Solicitud no válida'});return;}
  for(const [key,min,max] of [['name',1,100],['email',3,254],['message',10,3000],['plan',0,100],['token',1,2048]])if(typeof d[key]!=='string'||d[key].trim().length<min||d[key].length>max){reply(400,{error:'Revisa los campos del formulario.'});return;}
  if(!services.has(d.service)||!/^\S+@\S+\.\S+$/.test(d.email)||/[\r\n]/.test(d.email)){reply(400,{error:'Revisa el servicio y el correo.'});return;}
  const verify=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:process.env.TURNSTILE_SECRET_KEY,response:d.token}),signal:AbortSignal.timeout(8000)});
  const challenge=await verify.json();
  if(!challenge.success||challenge.hostname!==new URL(process.env.PUBLIC_ORIGIN).hostname||challenge.action!=='contact'){reply(403,{error:'No se pudo verificar la solicitud. Intenta nuevamente.'});return;}
  const sent=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.MAIL_FROM,to:[process.env.MAIL_TO],reply_to:d.email,subject:('Cotización '+d.service+' · '+d.plan).replace(/[\r\n]/g,' '),text:`Nombre: ${d.name}\nCorreo: ${d.email}\nServicio: ${d.service}\nPlan: ${d.plan}\n\n${d.message}`}),signal:AbortSignal.timeout(10000)});
  if(!sent.ok)throw Error('delivery');reply(200,{ok:true});
 }catch{reply(502,{error:'No se pudo enviar. Intenta nuevamente más tarde.'});}
}
