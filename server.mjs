// Optional production static server. TLS must be terminated by the hosting proxy.
import {contactAPI} from './contact-api.mjs';
import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('.',import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon'};
const policy=await readFile(new URL('./security-policy.txt',import.meta.url),'utf8');
export const server=createServer(async(req,res)=>{
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
 res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
 res.setHeader('Content-Security-Policy',policy.trim());
 if(req.url.startsWith('/api/'))return contactAPI(req,res);
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});return res.end();}
 try{
  const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const relative=path==='/'?'index.html':path.slice(1);
  if(relative.split('/').some(p=>p.startsWith('.'))||!['index.html','story-desktop.html','responsive.js','responsive.css','mobile-motion.js','story-timeline.js','actor-metrics.js','actor-layout.js','desktop-foundation.js','desktop-foundation.css','scene07-v80.js','scene07-v80.css'].includes(relative)&&!relative.startsWith('assets/'))throw Error();
  const file=resolve(root,relative);if(!file.startsWith(root.endsWith(sep)?root:root+sep))throw Error();
  if(!(await stat(file)).isFile())throw Error();
  const body=await readFile(file);res.setHeader('Content-Type',mime[extname(file)]||'application/octet-stream');res.setHeader('Cache-Control',relative.startsWith('assets/')?'public, max-age=86400':'no-cache');res.writeHead(200);res.end(req.method==='HEAD'?undefined:body);
 }catch{res.writeHead(404);res.end('No encontrado');}
});
server.requestTimeout=15000;
server.headersTimeout=10000;
if(process.argv[1]===fileURLToPath(import.meta.url))server.listen(Number(process.env.PORT)||8000,'0.0.0.0');
