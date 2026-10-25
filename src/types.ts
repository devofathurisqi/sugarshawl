export interface Variant { id: string; name: string; hex: string; image: string; family?: string; contain?: boolean; reference?: boolean }
export interface Product {
  aliases?: string[];
  legacyIds?: string[];
  legacyVariants?: Variant[];
  referenceImages?: string[];
  pricingSource?: 'brand' | 'retail' | 'unresolved';
  id: string; slug: string; name: string; category: string; material: string | null;
  retailPrice: number | null; pricingStatus: 'verified' | 'inquiry'; description: string;
  measurements: string | null; images: string[]; variants: Variant[]; colorFamily: string;
  featured: boolean; contain?: boolean; availabilityStatus: 'confirm';
}
export interface CartItem { productId: string; variantId: string; quantity: number }
export interface Customer { name?: string; city?: string; address?: string; notes?: string }
