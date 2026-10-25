import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Heart, Plus, ArrowUpRight } from 'lucide-react';
import type { Product } from '../types';
import { imageUrl, imageSet, priceLabel } from '../data/catalog';
import { useShop } from '../store';
export default function ProductCard({ product:p }:{product:Product}) {
 const [selected,setSelected]=useState(p.variants[0]);
 const [params]=useSearchParams(),color=params.get('warna'),query=params.get('q');
 useEffect(()=>{const match=p.variants.find(v=>(color&&(v.family||p.colorFamily)===color)||(query&&v.name.toLowerCase().includes(query.toLowerCase())));setSelected(match||p.variants[0]);},[p,color,query]);
 const {favorites,toggleFavorite,add}=useShop();
 return <article className={`product-card ${!selected?'inquiry-card':''}`}><div className={`product-photo ${p.contain||selected?.contain?'contain-photo':''}`}>
  <Link to={`/produk/${p.slug}${selected?`?varian=${selected.id}`:''}`} aria-label={`Lihat ${p.name}`}>{selected?<img src={imageUrl(selected.image)} srcSet={imageSet(selected.image)} sizes="(max-width:700px) 45vw, 24vw" alt={`${p.name} — ${selected.name}`} width="600" height="800" loading="lazy"/>:<div className="photography-inquiry"><span className="eyebrow">MARI PILIH BERSAMA</span><span>{p.name}</span><small>Tanyakan foto & pilihan warna <ArrowUpRight size={16}/></small></div>}</Link>
  <button className={`favorite-button ${favorites.includes(p.id)?'is-favorite':''}`} aria-label={`Simpan ${p.name}`} aria-pressed={favorites.includes(p.id)} onClick={()=>toggleFavorite(p.id)}><Heart size={17}/></button>
  {selected&&<button className="card-quick" onClick={()=>add(p.id,selected.id,1)}><span>Tambahkan ke tas</span><Plus size={17}/></button>}
 </div><div className="product-meta"><span className="product-material">{p.category}</span><Link to={`/produk/${p.slug}${selected?`?varian=${selected.id}`:''}`} className="product-name">{p.name}<ArrowUpRight size={15}/></Link><div className="product-bottom"><span className="product-price">{priceLabel(p)}</span><div className="card-swatches">{p.variants.slice(0,4).map(v=><button key={v.id} aria-label={`${p.name}: ${v.name}`} title={v.name} aria-pressed={selected?.id===v.id} style={{'--swatch':v.hex} as React.CSSProperties} onClick={()=>setSelected(v)}/>)}{p.variants.length>4&&<Link to={`/produk/${p.slug}`} aria-label={`Lihat ${p.variants.length} varian`}>+{p.variants.length-4}</Link>}</div></div></div></article>;
}
