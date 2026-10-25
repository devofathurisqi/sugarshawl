import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { products } from './data/catalog';
import { cleanCart, clampQuantity } from './commerce';
import { config } from './config';
import type { CartItem } from './types';
function read(key: string): unknown { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } }
function useShopState() {
  const [cart, setCart] = useState<CartItem[]>(() => cleanCart(read(config.storageKey), products));
  const [favorites, setFavorites] = useState<string[]>(() => { const raw = read(config.favoritesKey); return Array.isArray(raw) ? [...new Set(raw.map(id => products.find(p => p.id === id || p.legacyIds?.includes(id))?.id).filter((id): id is string => Boolean(id)))] : []; });
  const [bagOpen, setBagOpen] = useState(false);
  const [toast, setToast] = useState('');
  useEffect(() => { try { localStorage.setItem(config.storageKey, JSON.stringify(cart)); } catch { /* In-memory shopping remains available. */ } }, [cart]);
  useEffect(() => { try { localStorage.setItem(config.favoritesKey, JSON.stringify(favorites)); } catch { /* Favorites remain available in this tab. */ } }, [favorites]);
  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(''), 3500); return () => clearTimeout(timer); } }, [toast]);
  useEffect(() => { const sync = (e: StorageEvent) => { if (e.key === config.storageKey) setCart(cleanCart(read(config.storageKey), products)); }; addEventListener('storage', sync); return () => removeEventListener('storage', sync); }, []);
  function add(productId: string, variantId: string, quantity: number) {
    setCart(old => cleanCart([...old, { productId, variantId, quantity }], products));
    setToast('Pilihanmu telah ditambahkan ke tas.'); setBagOpen(true);
  }
  function update(productId: string, variantId: string, quantity: number) { setCart(old => old.map(l => l.productId === productId && l.variantId === variantId ? { ...l, quantity: clampQuantity(quantity) } : l)); }
  function remove(productId: string, variantId: string) { setCart(old => old.filter(l => l.productId !== productId || l.variantId !== variantId)); }
  function toggleFavorite(id: string) { setFavorites(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]); }
  return { cart, add, update, remove, bagOpen, setBagOpen, favorites, toggleFavorite, toast };
}
const ShopContext = createContext<ReturnType<typeof useShopState> | null>(null);
export function ShopProvider({ children }: { children: ReactNode }) { const state = useShopState(); return <ShopContext.Provider value={state}>{children}</ShopContext.Provider>; }
export function useShop() { const state = useContext(ShopContext); if (!state) throw new Error('ShopProvider is required'); return state; }
