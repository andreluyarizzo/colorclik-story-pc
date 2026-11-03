import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Readable} from 'node:stream';
import {contactAPI} from '../contact-api.mjs';
let counter=0;
async function request(body={},headers={},url='/api/contact',method='POST',ip){
 const req=Readable.from([JSON.stringify(body)]);Object.assign(req,{url,method,headers:{origin:'https://example.com','content-type':'application/json',...headers},socket:{remoteAddress:ip||'test-'+counter++}});
 const res={headers:{},setHeader(k,v){this.headers[k]=v;},writeHead(code,headers){this.code=code;Object.assign(this.headers,headers)},end(body){this.body=JSON.parse(body)}};
 await contactAPI(req,res);return res;
}
test('contact API validates origin, size, spam controls and challenge before delivery',async()=>{
 const keys=['PUBLIC_ORIGIN','TURNSTILE_SITE_KEY','TURNSTILE_SECRET_KEY','RESEND_API_KEY','MAIL_FROM','MAIL_TO'];const original=Object.fromEntries(keys.map(k=>[k,process.env[k]]));const nativeFetch=globalThis.fetch;
 try{
  keys.forEach(k=>delete process.env[k]);assert.equal((await request()).code,503);
  Object.assign(process.env,{PUBLIC_ORIGIN:'https://example.com',TURNSTILE_SITE_KEY:'public',TURNSTILE_SECRET_KEY:'secret',RESEND_API_KEY:'key',MAIL_FROM:'site@example.com',MAIL_TO:'owner@example.com'});
  const body={name:'Cliente',email:'cliente@example.com',message:'Necesito una página web.',plan:'Landing',service:'Desarrollo Web',website:'',token:'test'};
  assert.equal((await request(body,{origin:'https://evil.example'})).code,403);
  assert.equal((await request({...body,website:'spam'})).code,400);
  assert.equal((await request({...body,email:'x\r\nBcc:evil@example.com'})).code,400);
  assert.equal((await request({...body,message:'x'.repeat(17000)})).code,413);
  globalThis.fetch=async()=>({json:async()=>({success:false})});assert.equal((await request(body)).code,403);
  globalThis.fetch=async()=>({json:async()=>({success:true,hostname:'evil.example',action:'contact'})});assert.equal((await request(body)).code,403);
  let delivered;globalThis.fetch=async(url,options)=>url.includes('siteverify')?{json:async()=>({success:true,hostname:'example.com',action:'contact'})}:(delivered=JSON.parse(options.body),{ok:true});
  assert.equal((await request(body)).code,200);assert.equal(delivered.reply_to,body.email);assert.equal(delivered.html,undefined);
  for(let i=0;i<5;i++)await request({...body,website:'spam'},{},'/api/contact','POST','rate-test');assert.equal((await request(body,{},'/api/contact','POST','rate-test')).code,429);
 }finally{globalThis.fetch=nativeFetch;keys.forEach(k=>original[k]===undefined?delete process.env[k]:process.env[k]=original[k]);}
});
