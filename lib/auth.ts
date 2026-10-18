import {cookies} from 'next/headers';
import {randomBytes,scrypt as scryptCallback,timingSafeEqual,createHash} from 'node:crypto';
import {promisify} from 'node:util';
import {db} from './db';
const scrypt=promisify(scryptCallback);
export const cookieName='jotly_session';
export async function hashPassword(password:string){const salt=randomBytes(16).toString('hex');const key=await scrypt(password,salt,64) as Buffer;return salt+':'+key.toString('hex')}
export async function verifyPassword(password:string,stored:string){const [salt,key]=stored.split(':');const candidate=await scrypt(password,salt,64) as Buffer;const expected=Buffer.from(key,'hex');return expected.length===candidate.length&&timingSafeEqual(expected,candidate)}
export function digest(token:string){return createHash('sha256').update(token).digest('hex')}
export async function getCurrentUser(){const token=(await cookies()).get(cookieName)?.value;if(!token)return null;const row=db().prepare('SELECT u.id,u.name,u.email FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=? AND s.expires>?').get(digest(token),Date.now()) as {id:string;name:string;email:string}|undefined;return row||null}
export function sameOrigin(req:Request){const origin=req.headers.get('origin');if(!origin)return process.env.NODE_ENV!=='production';try{const host=req.headers.get('x-forwarded-host')||req.headers.get('host')||new URL(req.url).host;return new URL(origin).host===host}catch{return false}}
export function rateLimit(key:string,limit=15,windowMs=900000){const now=Date.now();db().prepare('DELETE FROM attempts WHERE expires<?').run(now);db().prepare('INSERT INTO attempts(key,count,expires) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1').run(key,now+windowMs);return Number((db().prepare('SELECT count FROM attempts WHERE key=?').get(key) as {count:number}).count)<=limit}
export async function createSession(userId:string){const token=randomBytes(32).toString('hex');const expiry=Date.now()+30*86400000;db().prepare('DELETE FROM sessions WHERE expires<?').run(Date.now());db().prepare('INSERT INTO sessions(token,user_id,expires) VALUES(?,?,?)').run(digest(token),userId,expiry);(await cookies()).set(cookieName,token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:30*86400})}
