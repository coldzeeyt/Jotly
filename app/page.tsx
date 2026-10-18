import {getCurrentUser} from '../lib/auth';
import Jotly from './jotly';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export default async function Page(){const u=await getCurrentUser();return <Jotly user={u?{name:u.name,email:u.email}:null}/>}
