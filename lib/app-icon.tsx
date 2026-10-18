import {ImageResponse} from 'next/og';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
export async function renderAppIcon(pixels:number,opaque=false){const source=await readFile(path.join(process.cwd(),'public','jotly-mark.png'));return new ImageResponse(<div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:opaque?'#24251f':'transparent'}}><img alt="" width={pixels} height={pixels} src={'data:image/png;base64,'+source.toString('base64')}/></div>,{width:pixels,height:pixels})}

