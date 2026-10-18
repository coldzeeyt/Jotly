import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
const base=process.env.TEST_URL||'http://127.0.0.1:3000';
async function call(route,body,cookie='',origin=base){const r=await fetch(base+route,{method:body?'POST':'GET',headers:{...(body?{'Content-Type':'application/json'}:{}),...(cookie?{Cookie:cookie}:{}),...(origin?{Origin:origin}:{})},body:body?JSON.stringify(body):undefined});return r}
test('accounts, private notes, uploads, reminders, and trash lifecycle',async()=>{
const anon=await call('/api/workspace');assert.equal(anon.status,401);
const badOrigin=await call('/api/auth',{action:'signup'},'','https://attacker.invalid');assert.equal(badOrigin.status,403);
const password='Test-'+randomUUID(),email='jotly-'+randomUUID()+'@example.invalid';
const signup=await call('/api/auth',{action:'signup',name:'Jotly Test',email,password});assert.equal(signup.status,200,await signup.text());const cookie=signup.headers.get('set-cookie').split(';')[0];assert.match(signup.headers.get('set-cookie'),/HttpOnly/i);
const signed=await call('/api/auth',undefined,cookie);assert.equal((await signed.json()).user.email,email);
const folder=await call('/api/workspace',{action:'folder',name:'Test folder'},cookie);const f=await folder.json();assert.ok(f.id);
const form=new FormData();form.append('file',new File([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aL1cAAAAASUVORK5CYII=','base64')],'test.png',{type:'image/png'}));
const upload=await fetch(base+'/api/media',{method:'POST',headers:{Cookie:cookie,Origin:base},body:form});assert.equal(upload.status,200,await upload.clone().text());const attachment=await upload.json();
const id=randomUUID();const note={id,title:'Private test note',body:'A thought worth keeping.',kind:'Checklist',folder:f.id,tags:['test'],pinned:true,archived:false,trashed:false,date:new Date().toISOString(),due:'2026-12-25',items:[{id:'1',text:'Keep this private',done:true}],attachments:[attachment]};
const save=await call('/api/workspace',{note},cookie);assert.equal(save.status,200,await save.clone().text());
const loaded=await (await call('/api/workspace',undefined,cookie)).json();assert.equal(loaded.notes[0].due,'2026-12-25');assert.equal(loaded.notes[0].items[0].done,true);assert.equal(loaded.folders[0].name,'Test folder');
const moved=await call('/api/workspace',{action:'layout',id,position:{x:220,y:180}},cookie);assert.equal(moved.status,200);const movedData=await (await call('/api/workspace',undefined,cookie)).json();assert.deepEqual(movedData.notes[0].position,{x:220,y:180});
const media=await fetch(base+attachment.url,{headers:{Cookie:cookie,Range:'bytes=0-7'}});assert.equal(media.status,206);assert.equal((await media.arrayBuffer()).byteLength,8);
const second=await call('/api/auth',{action:'signup',name:'Other User',email:'other-'+randomUUID()+'@example.invalid',password});const other=second.headers.get('set-cookie').split(';')[0];
assert.equal((await call('/api/workspace',{action:'layout',id,position:{x:1,y:1}},other)).status,404);
const privateWorkspace=await (await call('/api/workspace',undefined,other)).json();assert.equal(privateWorkspace.notes.length,0);assert.equal((await fetch(base+attachment.url,{headers:{Cookie:other}})).status,404);assert.equal((await call('/api/workspace',{note},other)).status,404);
assert.equal((await call('/api/workspace',{action:'delete',id},cookie)).status,400);
assert.equal((await call('/api/workspace',{note:{...note,archived:true}},cookie)).status,200);
assert.equal((await call('/api/workspace',{note:{...note,trashed:true}},cookie)).status,200);
assert.equal((await call('/api/workspace',{action:'delete',id},cookie)).status,200);
assert.equal((await fetch(base+attachment.url,{headers:{Cookie:cookie}})).status,404);
await call('/api/auth',{action:'signout'},cookie);assert.equal((await call('/api/workspace',undefined,cookie)).status,401);
const bad=await call('/api/auth',{action:'signin',email,password:'wrong-password'});assert.equal(bad.status,401);
const signin=await call('/api/auth',{action:'signin',email,password});assert.equal(signin.status,200);
});

