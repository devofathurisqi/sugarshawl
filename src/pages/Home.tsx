import {useEffect,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowDown,ArrowLeft,ArrowRight,ArrowUpRight,MessageCircle} from 'lucide-react';
import {products,imageUrl,imageSet,priceLabel} from '../data/catalog';
import {whatsappUrl} from '../commerce';
import SilkRibbon from '../components/SilkRibbon';
const shades=[
 {id:'pale-olive',label:'Mint mood',name:'Pale Olive',image:'gradasi-pale-olive.webp',hex:'#9fc1a9'},
 {id:'creamy-nude',label:'Peach mood',name:'Creamy Nude',image:'gradasi-cream.webp',hex:'#efc2af'},
 {id:'blushy-rose',label:'Pink mood',name:'Blushy Rose',image:'gradasi.webp',hex:'#d3adc1'},
];
export default function Home(){
 const [shadeIndex,setShadeIndex]=useState(0),shade=shades[shadeIndex],gradasi=products.find(p=>p.id==='viscose-gradasi')!;
 const rail=useRef<HTMLDivElement>(null);
 const [edges,setEdges]=useState({start:true,end:false});
 useEffect(()=>{const el=rail.current;if(!el)return;const update=()=>{const next={start:el.scrollLeft<=2,end:el.scrollLeft+el.clientWidth>=el.scrollWidth-2};setEdges(old=>old.start===next.start&&old.end===next.end?old:next);};update();const observer=new ResizeObserver(update);observer.observe(el);el.addEventListener('scroll',update,{passive:true});return()=>{observer.disconnect();el.removeEventListener('scroll',update);};},[]);
 function scrollRail(direction:number){const el=rail.current;if(el)el.scrollBy({left:direction*el.clientWidth*.75,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
 const edit=['paris-japan','hawa-instan','bamboo-spandex','gana-instan','zoya-instan'].map(id=>products.find(p=>p.id===id)!);
 return <div className="sugar-home">
  <section className="sugar-universe" data-mood={shade.id}>
   <SilkRibbon/>
   <div className="sugar-issue"><span>THE SWEET SHADE STUDIO</span><span>HIJAB, WITH A LITTLE PERSONALITY.</span></div>
   <div className="sugar-hero-heading"><span className="eyebrow">COLOUR YOUR EVERYDAY</span><h1>Your colour.<br/>Your kind<br/>of <em>sweet.</em></h1><p>Hari ini, kamu ingin jadi warna apa?</p></div>
   <figure className="sugar-portrait"><img key={shade.image} src={imageUrl(shade.image)} srcSet={imageSet(shade.image)} sizes="(max-width:700px) 68vw, 38vw" alt={`Viscose Gradasi — ${shade.name}`} width="900" height="1200" fetchPriority="high"/><figcaption><span>01 / THE GRADASI EDIT</span><Link to={`/produk/viscose-gradasi?varian=${shade.id}`}>{shade.name}<ArrowUpRight size={20}/></Link></figcaption></figure>
   <div className="sugar-shade-picker"><span className="eyebrow">PICK YOUR MOOD</span><div>{shades.map((s,i)=><button key={s.id} className={shadeIndex===i?'selected':''} style={{'--shade':s.hex} as React.CSSProperties} aria-pressed={shadeIndex===i} aria-label={s.label} onClick={()=>setShadeIndex(i)}><i/>{s.label}</button>)}</div><p aria-live="polite">Viscose Gradasi · {shade.name}<br/><strong>{priceLabel(gradasi)}</strong></p></div>
   <Link className="sugar-round-link" to={`/produk/viscose-gradasi?varian=${shade.id}`}><ArrowUpRight size={35}/><span>MEET YOUR<br/>SWEET SHADE</span></Link>
   <a className="sugar-scroll" href="#sweet-selection">A little more sweetness <ArrowDown size={16}/></a>
  </section>
  <section className="sugar-wardrobe" id="sweet-selection"><div className="sugar-rail-heading"><div><span className="eyebrow">THE EVERYDAY WARDROBE</span><h2>Sweet things.<br/><em>Real favourites.</em></h2><p>Kenali pilihan untuk hari-harimu. Geser, lihat lebih dekat, lalu temukan yang paling kamu suka.</p><Link className="text-link" to="/koleksi">Masuk ke ruang koleksi <ArrowUpRight size={18}/></Link></div><div className="sugar-rail-controls"><button aria-label="Koleksi sebelumnya" disabled={edges.start} onClick={()=>scrollRail(-1)}><ArrowLeft size={21}/></button><button aria-label="Koleksi berikutnya" disabled={edges.end} onClick={()=>scrollRail(1)}><ArrowRight size={21}/></button></div></div><div className="sugar-product-rail" ref={rail} aria-label="Pilihan Sugar Shawl">{edit.map((p,i)=><Link className="sugar-rail-product" key={p.id} to={`/produk/${p.slug}`}><span className="sugar-look-number">0{i+1} / {p.category}</span><img src={imageUrl(p.images[0])} alt={p.name} width="600" height="800" loading="lazy"/><div><h3>{p.name}</h3><ArrowUpRight size={20}/></div><span>{priceLabel(p)}</span></Link>)}</div></section>
  <section className="sugar-collection-room"><div className="sugar-room-title"><span className="eyebrow">A ROOM FOR EVERY SIDE OF YOU</span><h2>Find your<br/><em>sweet spot.</em></h2><p>Siluet yang kamu suka.<br/>Untuk rencana yang kamu punya.</p></div><Link className="sugar-room-main" to="/koleksi?kategori=Pashmina"><img src={imageUrl('modal-alt.webp')} alt="Pashmina Modal Viscose putih" width="900" height="1200" loading="lazy"/><span><small>01 / WRAP IT YOUR WAY</small><strong>Pashmina</strong><ArrowUpRight size={29}/></span></Link><Link className="sugar-room-side" to="/koleksi?kategori=Hijab%20Instan"><img src={imageUrl('zoya.webp')} alt="Zoya Instan" width="600" height="800" loading="lazy"/><span>Ready in your own way.<strong>Hijab Instan <ArrowUpRight size={24}/></strong></span></Link><Link className="sugar-room-bottom" to="/koleksi?kategori=Khimar"><span>SOFT SILHOUETTES, SWEET DAYS.</span><h3>Khimar <ArrowUpRight size={30}/></h3><img src={imageUrl('lea-oval-khiban-rose.webp')} alt="Lea Oval Khiban pink" width="600" height="800" loading="lazy"/></Link></section>
  <section className="sugar-manifesto"><SilkRibbon/><span className="eyebrow">A NOTE FROM SUGAR SHAWL</span><h2>Life’s little moments.<br/>A little more <em>colour.</em></h2><p>Mint yang tenang. Peach yang hangat. Dan semua sisi dirimu di antaranya.<br/>Kami percaya, memilih hijab juga boleh terasa menyenangkan.</p><Link to="/tentang" className="text-link">The story behind the sweetness <ArrowUpRight size={18}/></Link></section>
  <section className="sugar-order-strip"><div><span>01</span><h3>Find your shade.</h3><p>Pilih koleksi dan varian favoritmu.</p></div><div><span>02</span><h3>Make it yours.</h3><p>Simpan ke tas dan atur jumlahnya.</p></div><div><span>03</span><h3>Say hello.</h3><p>Konfirmasi stok, ongkir, dan pembayaran lewat WhatsApp.</p></div><Link to="/panduan" aria-label="Lihat panduan belanja"><ArrowUpRight size={28}/></Link></section>
  <section className="sugar-hello"><div><span className="eyebrow">SWEET CHOICES START WITH A HELLO</span><h2>Let’s talk<br/><em>colours.</em></h2></div><div><p>Bingung memilih? Ceritakan warna dan koleksi yang kamu cari. Kita temukan pilihanmu bersama.</p><a className="button" href={whatsappUrl('Halo SUGARSHAWL, saya ingin dibantu memilih hijab.')} target="_blank" rel="noreferrer"><MessageCircle size={18}/>Say hello to Sugar Shawl <ArrowUpRight size={19}/></a><a href="https://www.instagram.com/sugarshawl.ss/" className="text-link" target="_blank" rel="noreferrer">@sugarshawl.ss <ArrowUpRight size={16}/></a></div></section>
 </div>;
}
