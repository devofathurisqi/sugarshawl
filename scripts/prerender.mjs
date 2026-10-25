import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {build} from 'esbuild';
import {createRequire} from 'node:module';
import {config} from '../src/config.ts';
const products=JSON.parse(await readFile('src/data/products.json','utf8'));
const origin=(process.env.SITE_URL||'').replace(/\/$/,'');
if(origin&&!/^https?:\/\/[^/]+$/.test(origin))throw new Error('SITE_URL must be an HTTP(S) origin without a path.');
const base=await readFile('dist/index.html','utf8');
await mkdir('.sites',{recursive:true});
await build({entryPoints:['src/entry-server.tsx'],bundle:true,platform:'node',format:'cjs',outfile:'.sites/entry-server.cjs',external:['react','react-dom','react-dom/server'],jsx:'automatic',logLevel:'warning'});
const require=createRequire(import.meta.url),{render}=require('../.sites/entry-server.cjs');
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const titles={'/koleksi':'Koleksi','/tentang':'Cerita kami','/panduan':'Panduan belanja','/tas':'Tas belanja','/tersimpan':'Pilihan tersimpan'};
const routes=['/','/koleksi','/tentang','/panduan','/tas','/tersimpan',...products.map(p=>'/produk/'+p.slug)];
for(const route of routes){
 const p=products.find(p=>route==='/produk/'+p.slug),title=p?`${p.name} — ${config.brand}`:titles[route]?`${titles[route]} — ${config.brand}`:`${config.brand} — ${config.tagline}`;
 const description=p?.description||`Temukan pilihan hijab, pashmina, khimar, dan mukena ${config.brand}. Pilih koleksimu dan pesan melalui WhatsApp.`;
 let html=base.replace('<div id="root"></div>',`<div id="root">${render(route)}</div>`).replace(/<title>.*?<\/title>/,`<title>${escape(title)}</title>`).replace(/(<meta name="description" content=")[^"]*/,`$1${escape(description)}`).replace(/(<meta property="og:title" content=")[^"]*/,`$1${escape(title)}`).replace(/(<meta property="og:description" content=")[^"]*/,`$1${escape(description)}`);
 const schema=p?{'@context':'https://schema.org','@type':'Product',name:p.name,description:p.description,brand:{'@type':'Brand',name:config.brand},sku:p.id,...(p.material?{material:p.material}:{}),...(origin&&p.images[0]?{image:origin+'/assets/images/'+p.images[0]}:{})}:null;
 html=html.replace('</head>',`${origin?`<link rel="canonical" href="${origin}${route}"/><meta property="og:url" content="${origin}${route}"/>`:''}${origin&&p?.images[0]?`<meta property="og:image" content="${origin}/assets/images/${p.images[0]}"/>`:''}${schema?`<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>`:''}</head>`);
 const dir=route==='/'?'dist':'dist'+route;await mkdir(dir,{recursive:true});await writeFile(dir+'/index.html',html);
}
await writeFile('dist/404.html',base.replace('<div id="root"></div>',`<div id="root">${render('/404')}</div>`));
if(origin)await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.filter(r=>!['/tas','/tersimpan'].includes(r)).map(r=>`<url><loc>${origin}${r}</loc></url>`).join('')}</urlset>`);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\n${origin?`Sitemap: ${origin}/sitemap.xml\n`:''}`);
console.log(`Prerendered ${routes.length} ${config.brand} routes. ${origin?'Canonical URLs and sitemap use '+origin:'Set SITE_URL to the real domain for canonical URLs and sitemap.'}`);
