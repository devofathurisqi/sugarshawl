import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {cleanCart,clampQuantity,cartSummary,orderMessage,whatsappUrl} from '../src/commerce.ts';
import {config} from '../src/config.ts';
const products=JSON.parse(readFileSync(new URL('../src/data/products.json',import.meta.url),'utf8'));
const prices=JSON.parse(readFileSync(new URL('../src/data/prices.json',import.meta.url),'utf8'));
const retail=JSON.parse(readFileSync(new URL('../src/data/retail-prices.json',import.meta.url),'utf8'));
const modal=products.find(p=>p.id==='modal-viscose'),gradasi=products.find(p=>p.id==='viscose-gradasi'),pending=products.find(p=>p.id==='mukena-rayon-viscose');
const line=(p,n=1,v=p.variants[0].id)=>({productId:p.id,variantId:v,quantity:n});
test('all supplied selling prices override retail and no product is duplicated',()=>{
 assert.equal(Object.keys(prices).length,config.key==='roona'?21:13);
 for(const [id,price] of Object.entries(prices)){const p=products.find(p=>p.id===id);assert.ok(p,id);assert.equal(p.retailPrice,price,id);}
 assert.equal(new Set(products.map(p=>p.id)).size,products.length);assert.equal(new Set(products.map(p=>p.slug)).size,products.length);
 assert.equal(products.length,27);
 assert.equal(products.find(p=>p.id==='paris-japan').retailPrice,config.key==='roona'?49000:48000);
 assert.equal(products.find(p=>p.id==='gana-instan').retailPrice,config.key==='roona'?49000:56000);
});
test('page 2 confirms Paris Jadul as Paris Legend; one photographed product uses Rp29000',()=>{
 assert.equal(products.filter(p=>p.id==='paris-legend'||p.id==='paris-jadul').length,1);
 const legend=products.find(p=>p.id==='paris-legend');assert.equal(legend.retailPrice,29000);assert.ok(legend.images.length);assert.ok(legend.aliases.includes('Paris Jadul'));
 const legacy={productId:'paris-jadul',variantId:legend.variants[0].id,quantity:2};const summary=cartSummary([legacy,line(legend)],products);assert.equal(summary.lines.length,1);assert.equal(summary.count,3);assert.equal(summary.subtotal,87000);
});
test('every product follows brand price, verified Ecer, then inquiry in that order',()=>{
 for(const p of products){const expected=prices[p.id]??retail[p.id]??null;assert.equal(p.retailPrice,expected,p.id);assert.equal(p.pricingSource,prices[p.id]!==undefined?'brand':retail[p.id]!==undefined?'retail':'unresolved',p.id);}
 assert.equal(products.find(p=>p.id==='armani-lasercut').retailPrice,279000);
 assert.equal(products.find(p=>p.id==='armani-panel-printing').retailPrice,config.key==='roona'?345000:349000);
 assert.equal(products.filter(p=>p.retailPrice===null).length,config.key==='roona'?4:6);
});
test('each photographed variant has a real asset and responsive derivatives',()=>{
 for(const p of products){assert.equal(p.pricingStatus,p.retailPrice===null?'inquiry':'verified');assert.equal(p.availabilityStatus,'confirm');assert.ok(p.retailPrice===null||Number.isSafeInteger(p.retailPrice)&&p.retailPrice>0);
  for(const im of [...p.images,...(p.modelImages||[]),...p.variants.map(v=>v.image)])for(const file of [im,...[360,640,960].map(w=>im.replace('.webp',`-${w}.webp`))])assert.ok(existsSync(new URL('../public/assets/images/'+file,import.meta.url)),file);
  assert.doesNotMatch(JSON.stringify(p),/costPrice|internalCost|wholesalePrice|RUMEA|Vuyama|reseller/i);
 }
});
test('malformed and stale persisted cart lines are discarded',()=>{
 assert.deepEqual(cleanCart(null,products),[]);assert.deepEqual(cleanCart([null,{},line(modal,1,'stale'),{productId:'unknown',variantId:'x',quantity:2}],products),[]);
 assert.deepEqual(cleanCart([{productId:'inner-tali',variantId:'invented',quantity:1}],products),[]);
});
test('duplicate variants merge and different colors remain separate',()=>{
 const cart=cleanCart([line(gradasi,2),line(gradasi,3),line(gradasi,1,gradasi.variants[1].id)],products);
 assert.equal(cart.length,2);assert.equal(cart[0].quantity,5);assert.equal(cart[1].quantity,1);
});
test('quantities are bounded integers and subtotal uses current brand prices',()=>{
 for(const n of [undefined,'bad',0,-10])assert.equal(clampQuantity(n),1);assert.equal(clampQuantity(1000),99);assert.equal(clampQuantity(2.8),2);
 const summary=cartSummary([line(modal,2),line(gradasi,3)],products);assert.equal(summary.count,5);assert.equal(summary.subtotal,modal.retailPrice*2+gradasi.retailPrice*3);assert.equal(summary.pending,0);
});
test('unknown prices are explicitly excluded from mixed subtotal',()=>{
 const cart=[line(modal,2),line(pending,3)],summary=cartSummary(cart,products),message=orderMessage(cart,products);
 assert.equal(summary.subtotal,modal.retailPrice*2);assert.equal(summary.pending,3);assert.equal(summary.lines[1].total,null);assert.match(message,/3 pcs dengan harga konfirmasi belum termasuk subtotal/);assert.match(message,/Subtotal produk berharga/);
});
test('an all-inquiry order does not advertise free products',()=>{const message=orderMessage([line(pending,2)],products);assert.match(message,/Subtotal: menunggu konfirmasi harga/);assert.doesNotMatch(message,/Rp/);});
test('WhatsApp contains exact selected colors, quantities, totals and encoded notes',()=>{
 const cart=[line(modal,2),line(gradasi,3,gradasi.variants[2].id)],before=JSON.stringify(cart),message=orderMessage(cart,products,{name:'Dewi & Putri',notes:'Pilihan ♥ + warna?'}),url=new URL(whatsappUrl(message));
 assert.equal(url.origin,'https://wa.me');assert.equal(url.pathname,config.key==='roona'?'/6285190952722':'/628132217724');assert.equal(url.searchParams.get('text'),message);assert.match(message,new RegExp(config.brand));assert.match(message,/Creamy Nude/);assert.match(message,/Jumlah: 3 pcs/);assert.match(message,/Dewi & Putri/);assert.match(message,/Pilihan ♥ \+ warna\?/);assert.match(message,/ketersediaan produk dan varian/);assert.equal(JSON.stringify(cart),before);
});
test('empty cart cannot produce a checkout message',()=>assert.throws(()=>orderMessage([],products),/kosong/));
test('storage and order destinations are isolated per brand',()=>{assert.ok(config.storageKey.startsWith(config.key+'-'));assert.ok(config.favoritesKey.startsWith(config.key+'-'));assert.match(config.whatsapp,/^62\d+$/);});
