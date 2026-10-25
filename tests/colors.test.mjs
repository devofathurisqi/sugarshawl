import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {cleanCart,orderMessage} from '../src/commerce.ts';
const products=JSON.parse(readFileSync(new URL('../src/data/products.json',import.meta.url),'utf8'));
const audit=JSON.parse(readFileSync(new URL('../catalog/color-coverage.json',import.meta.url),'utf8'));
const expected={'modal-viscose':32,'viscose-gradasi':12,'paris-legend':65,'airtech-ultrasoft':8,'gana-instan':24,'printed-viscose':30,'motif-tryspan':82,'bamboo-spandex':20,'zoya-instan':13,'bamboo-slip-on':19,'paris-japan':21,'hawa-instan':20,'viscose-highlight':14,'aisha-khiban':20,'hayla-khiban':18,'mukena-armani':33,'mukena-segenggam-polos':6,'mukena-segenggam-lily':4,'mukena-rayon-viscose':5,'hampers-soft-box':1,'lea-oval-khiban':2,'zea-sport-instan':2,'inner-tali':0,'armani-polka':7,'armani-lasercut':0,'armani-panel-printing':0,'mukena-armani-ori':10};
test('all audited products expose every evidenced shade without duplicate options',()=>{
 assert.deepEqual(products.map(p=>p.id).sort(),Object.keys(expected).sort());
 for(const p of products){
  assert.equal(p.variants.length,expected[p.id],p.id);
  assert.equal(new Set(p.variants.map(v=>v.id)).size,p.variants.length,p.id);
  assert.deepEqual(p.variants.map(v=>v.name),audit.products[p.id].colors,p.id);
  for(const v of p.variants)assert.ok(/^#[a-f0-9]{6}$/i.test(v.hex),v.name);
  for(const image of [...(p.referenceImages||[]),...(p.legacyVariants||[]).map(v=>v.image)])for(const w of ['', '-360','-640','-960'])assert.ok(existsSync(new URL('../public/assets/images/'+image.replace('.webp',w+'.webp'),import.meta.url)),image);
 }
});
test('chart-only and series colors are explicit choices, and wrong-folder photos are excluded',()=>{
 for(const [id,names] of Object.entries({'paris-japan':['Charcoal','Sheer Blue','Granola'],'hawa-instan':['Dark Beige','Soft Apricot'],'gana-instan':['Biscuit','Tea Flower','Ekspreso'],'aisha-khiban':['Coffee','Palm Sugar'],'printed-viscose':['Cloudy — Pinky Malt','Windy — Cherry Oak'],'motif-tryspan':['Iliya — Tosca','Daisy — Lilac Grey','Nebula — Peach Galaxy']})){
  const p=products.find(p=>p.id===id);for(const name of names)assert.ok(p.variants.some(v=>v.name===name),id+': '+name);
 }
 assert.ok(!products.find(p=>p.id==='hawa-instan').variants.some(v=>/mustard/i.test(v.name)));
});
test('every color including the final option survives cart sanitization and WhatsApp checkout',()=>{
 for(const p of products)for(const v of p.variants){
  const line={productId:p.id,variantId:v.id,quantity:2};assert.deepEqual(cleanCart([line],products),[line]);
  assert.ok(orderMessage([line],products).includes('Varian: '+v.name),p.id+': '+v.id);
 }
});
test('previously saved generic colors keep their original descriptions and quantities',()=>{
 for(const p of products)for(const v of p.legacyVariants||[]){
  const line={productId:p.id,variantId:v.id,quantity:3};assert.deepEqual(cleanCart([line],products),[line]);assert.ok(orderMessage([line],products).includes(v.name));
 }
});

