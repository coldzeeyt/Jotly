export type Kind='Text'|'Audio'|'Photos'|'Video'|'Checklist';
export type Attachment={id:string;name:string;type:string;url:string};
export type Note={id:string;title:string;body:string;kind:Kind;folder:string;tags:string[];pinned:boolean;archived:boolean;trashed:boolean;date:string;due:string;items:{id:string;text:string;done:boolean}[];attachments:Attachment[];cover?:string;position?:{x:number;y:number}};
export type Folder={id:string;name:string};
export function blank(kind:Kind='Text'):Note{return {id:crypto.randomUUID(),title:'',body:'',kind,folder:'',tags:[],pinned:false,archived:false,trashed:false,date:new Date().toISOString(),due:'',items:[],attachments:[]}}
