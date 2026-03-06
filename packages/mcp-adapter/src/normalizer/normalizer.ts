import type { CreateStorePayload, AddProductPayload } from '../types';
import type { Product } from '@yourorg/store-engine';

/**
 * Normalizer — transforms MCP payloads into the internal structures
 * expected by the store-engine.
 *
 * This ensures loose AI-generated data is cleaned and standardized
 * before it reaches the rendering layer.
 */

/**
 * Normalize a product from an MCP payload into the store-engine Product format.
 */
export function normalizeProduct(
  raw: AddProductPayload['product'],
  currency = 'USD'
): Omit<Product, 'id'> & { id: string } {
  return {
    id: crypto.randomUUID(),
    name: raw.name.trim(),
    description: raw.description?.trim(),
    price: Math.round(raw.price * 100) / 100, // Round to 2 decimals
    currency,
    images: raw.images ?? [],
    category: raw.category?.trim(),
    tags: raw.tags ?? [],
    variants: (raw.variants ?? []).map((v) => ({
      id: crypto.randomUUID(),
      name: v.name.trim(),
      price: v.price != null ? Math.round(v.price * 100) / 100 : undefined,
      sku: v.sku?.trim(),
    })),
    inStock: true,
  };
}

/**
 * Normalize a store creation payload into structured parameters
 * ready for StoreBuilder.
 */
export function normalizeStorePayload(payload: CreateStorePayload) {
  return {
    name: payload.name.trim(),
    slug: payload.slug.toLowerCase().trim(),
    description: payload.description?.trim(),
    theme: payload.theme ?? 'light',
    currency: payload.currency ?? 'USD',
    locale: payload.locale ?? 'en',
    products:
      payload.products?.map((p) =>
        normalizeProduct(
          {
            name: p.name,
            description: p.description,
            price: p.price,
            images: p.images,
            category: p.category,
          },
          payload.currency ?? 'USD'
        )
      ) ?? [],
    layout: payload.layout ?? 'grid-catalog',
  } as const;
}

/**
 * Normalize a slug — ensures it's URL-safe.
 */
export function normalizeSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Normalize a price — ensures 2 decimal places.
 */
export function normalizePrice(price: number): number {
  return Math.round(Math.max(0, price) * 100) / 100;
}
