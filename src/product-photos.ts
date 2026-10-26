import type { Product, Variant } from './types';

export function productPhotos(product: Product, variant?: Variant) {
  return [...new Set([
    ...(product.modelImages || []),
    ...(variant ? [variant.image] : []),
    ...product.images,
    ...(product.referenceImages || []),
  ])];
}

export function initialProductPhoto(product: Product, variant?: Variant, explicitVariant = false) {
  return (explicitVariant ? variant?.image : product.modelImages?.[0]) || variant?.image || product.images[0] || '';
}
