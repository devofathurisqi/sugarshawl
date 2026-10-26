import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Heart, Plus, ArrowUpRight } from 'lucide-react';
import type { Product } from '../types';
import { imageUrl, imageSet, priceLabel } from '../data/catalog';
import { useShop } from '../store';
export default function ProductCard({ product:p }:{product:Product}) {
 const [selected,setSelected]=useState(p.variants[0]),[picked,setPicked]=useState(false);
 const [params]=useSearchParams(),color=params.get('warna'),query=params.get('q');
 useEffect(()=>{const match=p.variants.find(v=>(color&&(v.family||p.colorFamily)===color)||(query&&v.name.toLowerCase().includes(query.toLowerCase())));setSelected(match||p.variants[0]);setPicked(Boolean(match));},[p,color,query]);
 const {favorites,toggleFavorite,add}=useShop();
 const href=`/produk/${p.slug}${picked&&selected?`?varian=${selected.id}`:''}`;
 const photo=picked?selected?.image:p.modelImages?.[0]||p.images[0],contain=!p.modelImages?.includes(photo||'')&&(p.contain||(picked&&selected?.contain));
 return <article className={`product-card ${!selected?'inquiry-card':''}`}><div className={`product-photo ${contain?'contain-photo':''}`}>
  <Link to={href} aria-label={`Lihat ${p.name}`}>{photo?<img src={imageUrl(photo)} srcSet={imageSet(photo)} sizes="(max-width:700px) 45vw, 24vw" alt={picked?`${p.name} — ${selected.name}`:`${p.name} — tampilan koleksi`} width="600" height="800" loading="lazy"/>:<div className="photography-inquiry"><span className="eyebrow">MARI PILIH BERSAMA</span><span>{p.name}</span><small>Tanyakan foto & pilihan warna <ArrowUpRight size={16}/></small></div>}</Link>
  <button className={`favorite-button ${favorites.includes(p.id)?'is-favorite':''}`} aria-label={`Simpan ${p.name}`} aria-pressed={favorites.includes(p.id)} onClick={()=>toggleFavorite(p.id)}><Heart size={17}/></button>
  {selected&&(picked||p.variants.length===1?<button className="card-quick" onClick={()=>add(p.id,selected.id,1)}><span>Tambahkan ke tas</span><Plus size={17}/></button>:<Link className="card-quick" to={href+'#pilihan-varian'}><span>Pilih warna</span><ArrowUpRight size={17}/></Link>)}
 </div><div className="product-meta"><span className="product-material">{p.category}</span><Link to={href} className="product-name">{p.name}<ArrowUpRight size={15}/></Link><div className="product-bottom"><span className="product-price">{priceLabel(p)}</span><div className="card-swatches">{p.variants.slice(0,4).map(v=><button key={v.id} aria-label={`${p.name}: ${v.name}`} title={v.name} aria-pressed={picked&&selected?.id===v.id} style={{'--swatch':v.hex} as React.CSSProperties} onClick={()=>{setSelected(v);setPicked(true);}}/>)}{p.variants.length>4&&<Link to={`/produk/${p.slug}#pilihan-varian`} aria-label={`Lihat ${p.variants.length} varian`}>+{p.variants.length-4}</Link>}</div></div>{p.variants.length>1&&<Link className="variant-count-link" to={`/produk/${p.slug}#pilihan-varian`}>{p.variants.length} pilihan warna / motif <ArrowUpRight size={12}/></Link>}</div></article>;
}
