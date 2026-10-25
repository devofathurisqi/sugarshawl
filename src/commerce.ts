import type { CartItem, Product, Customer } from './types.ts';
import { config } from './config.ts';
export const clampQuantity = (n: unknown) => Math.min(99, Math.max(1, Math.floor(Number(n) || 1)));
export function cleanCart(value: unknown, products: Product[]): CartItem[] {
  if (!Array.isArray(value)) return [];
  const result: CartItem[] = [];
  for (const raw of value.slice(0, 100)) {
    if (!raw || typeof raw !== 'object') continue;
    const p = products.find(p => p.id === raw.productId || p.legacyIds?.includes(raw.productId));
    if (!p || ![...p.variants,...(p.legacyVariants || [])].some(v => v.id === raw.variantId)) continue;
    const old = result.find(x => x.productId === p.id && x.variantId === raw.variantId);
    if (old) old.quantity = clampQuantity(old.quantity + clampQuantity(raw.quantity));
    else result.push({ productId: p.id, variantId: raw.variantId, quantity: clampQuantity(raw.quantity) });
  }
  return result;
}
export function resolveCart(cart: CartItem[], products: Product[]) {
  return cleanCart(cart, products).map(item => {
    const product = products.find(p => p.id === item.productId)!;
    const variant = [...product.variants,...(product.legacyVariants || [])].find(v => v.id === item.variantId)!;
    return { ...item, product, variant, total: product.retailPrice === null ? null : product.retailPrice * item.quantity };
  });
}
export function cartSummary(cart: CartItem[], products: Product[]) {
  const lines = resolveCart(cart, products);
  return {
    lines, subtotal: lines.reduce((n, l) => n + (l.total ?? 0), 0),
    pending: lines.filter(l => l.total === null).reduce((n, l) => n + l.quantity, 0),
    hasPriced: lines.some(l => l.total !== null), count: lines.reduce((n, l) => n + l.quantity, 0),
  };
}
const rp = (n: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
export function orderMessage(cart: CartItem[], products: Product[], customer: Customer = {}) {
  const { lines, pending, hasPriced, subtotal } = cartSummary(cart, products);
  if (!lines.length) throw new Error('Tas belanja masih kosong.');
  return [
    `Halo ${config.brand}, saya ingin melakukan pemesanan:`, '',
    ...lines.map((l, i) => `${i + 1}. ${l.product.name}\n   Varian: ${l.variant.name}\n   Jumlah: ${l.quantity} pcs\n   ${l.total === null ? 'Harga: mohon konfirmasi' : `Harga: ${rp(l.product.retailPrice!)} / pcs\n   Total: ${rp(l.total)}`}`), '',
    hasPriced ? `Subtotal${pending ? ' produk berharga' : ''}: ${rp(subtotal)}` : 'Subtotal: menunggu konfirmasi harga',
    ...(pending ? [`${pending} pcs dengan harga konfirmasi belum termasuk subtotal.`] : []),
    ...(customer.name?.trim() ? ['', `Nama: ${customer.name.trim()}`] : []),
    ...(customer.city?.trim() ? [`Kota/Kabupaten: ${customer.city.trim()}`] : []),
    ...(customer.address?.trim() ? [`Alamat: ${customer.address.trim()}`] : []),
    ...(customer.notes?.trim() ? [`Catatan: ${customer.notes.trim()}`] : []), '',
    'Mohon informasi ketersediaan produk dan varian, ongkos kirim, total akhir, dan langkah pembayaran. Terima kasih.',
  ].join('\n');
}
export function whatsappUrl(message: string) { return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`; }
