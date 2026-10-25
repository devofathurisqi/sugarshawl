import data from './products.json';
import type { Product } from '../types';
export const products = data as Product[];
export const getProduct = (id: string) => products.find(p => p.slug === id || p.legacyIds?.includes(id));
export const imageUrl = (name: string) => '/assets/images/' + name;
export const imageSet = (name: string) => [360, 640, 960].map(w => `${imageUrl(name.replace(/\.webp$/, `-${w}.webp`))} ${w}w`).concat(`${imageUrl(name)} 1200w`).join(', ');
export const money = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
export const priceLabel = (p: Product) => p.retailPrice === null ? 'Tanya Harga' : money(p.retailPrice);
