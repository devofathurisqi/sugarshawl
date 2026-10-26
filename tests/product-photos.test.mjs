import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {initialProductPhoto,productPhotos} from '../src/product-photos.ts';
import {cartSummary,orderMessage} from '../src/commerce.ts';

const products=JSON.parse(readFileSync(new URL('../src/data/products.json',import.meta.url),'utf8'));

test('model examples stay available when any fabric or chart-only shade is selected',()=>{
 for(const p of products.filter(p=>p.modelImages?.length)){
  for(const v of p.variants){
   const gallery=productPhotos(p,v);
   assert.ok(gallery.includes(v.image),`${p.id}: ${v.id}`);
   for(const image of [...p.modelImages,...p.images,...(p.referenceImages||[])])assert.ok(gallery.includes(image),image);
   assert.equal(gallery.length,new Set(gallery).size);
   assert.equal(initialProductPhoto(p,v),p.modelImages[0]);
   assert.equal(initialProductPhoto(p,v,true),v.image);
  }
 }
});

test('products without model photography retain their genuine photos or photo inquiry',()=>{
 const p=products.find(p=>p.id==='mukena-segenggam-lily');
 assert.equal(p.modelImages,undefined);
 assert.equal(initialProductPhoto(p,p.variants[0]),p.variants[0].image);
 const pending=products.find(p=>p.id==='inner-tali');
 assert.deepEqual(productPhotos(pending),[]);
 assert.equal(initialProductPhoto(pending),'');
});

test('Zea price is Rp48000 throughout cart totals and the WhatsApp order',()=>{
 const zea=products.find(p=>p.id==='zea-sport-instan');
 const cart=[{productId:zea.id,variantId:zea.variants[1].id,quantity:2}];
 assert.equal(zea.retailPrice,48000);
 assert.equal(cartSummary(cart,products).subtotal,96000);
 const message=orderMessage(cart,products);
 assert.match(message,/48\.000/);
 assert.match(message,/96\.000/);
 assert.match(message,/Taupe/);
 assert.doesNotMatch(message,/tanya harga/i);
});
