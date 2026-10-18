import type {MetadataRoute} from 'next';
export default function manifest():MetadataRoute.Manifest{return {name:'Jotly Notes',short_name:'Jotly',description:'All your notes. One place.',start_url:'/',scope:'/',display:'standalone',background_color:'#faf9f6',theme_color:'#ffc522',icons:[{src:'/app-icon',sizes:'512x512',type:'image/png',purpose:'any'}]}}
