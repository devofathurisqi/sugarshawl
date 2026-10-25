import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Minus, Plus, X } from 'lucide-react';
export function TextLink({ to, children, className = '' }: { to: string; children: ReactNode; className?: string }) { return <Link className={`text-link ${className}`} to={to}>{children}<ArrowUpRight size={17} strokeWidth={1.3} /></Link>; }
export function SectionHeading({ eyebrow, title, to, children }: { eyebrow: string; title: ReactNode; to?: string; children?: ReactNode }) { return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{to ? <TextLink to={to}>Lihat semua koleksi</TextLink> : children}</div>; }
export function Quantity({ value, onChange, label = 'Jumlah' }: { value: number; onChange: (value: number) => void; label?: string }) { return <div className="quantity"><button type="button" aria-label={`Kurangi ${label}`} disabled={value <= 1} onClick={() => onChange(value - 1)}><Minus size={14} /></button><input aria-label={label} type="number" min={1} max={99} value={value} onChange={e => onChange(Number(e.target.value))} /><button type="button" aria-label={`Tambah ${label}`} disabled={value >= 99} onClick={() => onChange(value + 1)}><Plus size={14} /></button></div>; }
export function Modal({ open, onClose, title, children, className = '' }: { open: boolean; onClose: () => void; title: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const d = ref.current!; if (open && !d.open) d.showModal(); else if (!open && d.open) d.close(); }, [open]);
  useEffect(() => { if (!open) return; const old = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = old; }; }, [open]);
  return <dialog ref={ref} className={`modal ${className}`} aria-label={title} onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) { const rect = e.currentTarget.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) onClose(); } }}><div className="modal-header"><h2>{title}</h2><button className="icon-button" aria-label={`Tutup ${title}`} onClick={onClose}><X size={22} strokeWidth={1.2} /></button></div>{children}</dialog>;
}
