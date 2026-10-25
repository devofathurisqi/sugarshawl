import {readFile,access,readdir} from 'node:fs/promises';
import path from 'node:path';
import {config} from '../src/config.ts';
const products=JSON.parse(await readFile('src/data/products.json','utf8'));
const routes=['/','/koleksi','/tentang','/panduan','/tas','/tersimpan',...products.map(p=>'/produk/'+p.slug)];
const assets=new Set();
for(const route of routes){
 const html=await readFile(path.join('dist',route,'index.html'),'utf8');
 if(!html.includes('<h1'))throw new Error('Missing h1: '+route);
 if(/RUMEA|Vuyama|khusus reseller|harga modal|placeholder text|href="#"/i.test(html))throw new Error('Non-public copy or dead link: '+route);
 if(!html.includes(config.brand))throw new Error('Missing brand: '+route);
 for(const m of html.matchAll(/(?:src|href)="(\/[^"?#]*)[^"\s]*"/g))assets.add(decodeURIComponent(m[1]));
 for(const m of html.matchAll(/srcSet="([^"]+)"/gi))for(const item of m[1].split(','))assets.add(item.trim().split(' ')[0]);
 if(route.startsWith('/produk/')&&!html.includes('"@type":"Product"'))throw new Error('Missing product schema: '+route);
}
for(const asset of assets){const dest=path.join('dist',asset);try{await access(dest);}catch{try{await access(path.join(dest,'index.html'));}catch{throw new Error('Missing asset or route: '+asset);}}}
async function audit(dir){for(const ent of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,ent.name);if(ent.isDirectory())await audit(file);else{if(/\.(pdf|env)$/i.test(file))throw new Error('Private document in public build: '+file);if(/\.(js|json|html)$/i.test(file)){const text=await readFile(file,'utf8');if(/"(?:costPrice|internalCost|wholesalePrice|margin)"\s*:/.test(text))throw new Error('Private pricing field: '+file);}}}}
await audit('dist');await access('dist/404.html');
console.log(`Verified ${routes.length} HTML routes and ${assets.size} local assets/links; public build has no private pricing documents or fields.`);
