import { describe, it, expect, vi } from 'vitest';
import {
  normalizeProduct,
  normalizeStorePayload,
  normalizeSlug,
  normalizePrice,
} from './normalizer';

// Mock crypto.randomUUID for deterministic tests
vi.stubGlobal('crypto', {
  randomUUID: () => 'test-uuid-1234',
});

describe('normalizeProduct', () => {
  it('normalizes a basic product', () => {
    const result = normalizeProduct({
      name: '  Cool Sneakers  ',
      price: 99.999,
    });

    expect(result.id).toBe('test-uuid-1234');
    expect(result.name).toBe('Cool Sneakers');
    expect(result.price).toBe(100.0);
    expect(result.currency).toBe('USD');
    expect(result.images).toEqual([]);
    expect(result.tags).toEqual([]);
    expect(result.variants).toEqual([]);
    expect(result.inStock).toBe(true);
  });

  it('uses provided currency', () => {
    const result = normalizeProduct(
      { name: 'Product', price: 50 },
      'EUR'
    );

    expect(result.currency).toBe('EUR');
  });

  it('normalizes product with all optional fields', () => {
    const result = normalizeProduct({
      name: 'Sneakers',
      description: '  Great shoes  ',
      price: 89.99,
      images: ['https://example.com/img.jpg'],
      category: '  Footwear  ',
      tags: ['shoes', 'sport'],
      variants: [
        { name: '  Red  ', price: 94.999, sku: '  SKU-001  ' },
        { name: 'Blue' },
      ],
    });

    expect(result.description).toBe('Great shoes');
    expect(result.category).toBe('Footwear');
    expect(result.images).toEqual(['https://example.com/img.jpg']);
    expect(result.tags).toEqual(['shoes', 'sport']);
    expect(result.variants).toHaveLength(2);
    expect(result.variants[0].name).toBe('Red');
    expect(result.variants[0].price).toBe(95.0);
    expect(result.variants[0].sku).toBe('SKU-001');
    expect(result.variants[1].price).toBeUndefined();
  });

  it('rounds price to 2 decimal places', () => {
    const result = normalizeProduct({ name: 'Item', price: 19.995 });
    expect(result.price).toBe(20.0);
  });
});

describe('normalizeStorePayload', () => {
  it('normalizes a basic store payload', () => {
    const result = normalizeStorePayload({
      name: '  My Store  ',
      slug: '  MY-STORE  ',
    });

    expect(result.name).toBe('My Store');
    expect(result.slug).toBe('my-store');
    expect(result.theme).toBe('light');
    expect(result.currency).toBe('USD');
    expect(result.locale).toBe('en');
    expect(result.products).toEqual([]);
    expect(result.layout).toBe('grid-catalog');
  });

  it('respects provided optional values', () => {
    const result = normalizeStorePayload({
      name: 'Fashion Store',
      slug: 'fashion-store',
      description: '  Best fashion  ',
      theme: 'dark',
      currency: 'EUR',
      locale: 'es',
      layout: 'hero-with-catalog',
    });

    expect(result.description).toBe('Best fashion');
    expect(result.theme).toBe('dark');
    expect(result.currency).toBe('EUR');
    expect(result.locale).toBe('es');
    expect(result.layout).toBe('hero-with-catalog');
  });

  it('normalizes products within store payload', () => {
    const result = normalizeStorePayload({
      name: 'Store',
      slug: 'store',
      products: [
        { name: 'Product 1', price: 10 },
        { name: 'Product 2', price: 20, category: 'Cat A' },
      ],
    });

    expect(result.products).toHaveLength(2);
    expect(result.products[0].name).toBe('Product 1');
    expect(result.products[1].category).toBe('Cat A');
  });
});

describe('normalizeSlug', () => {
  it('converts to lowercase', () => {
    expect(normalizeSlug('Hello World')).toBe('hello-world');
  });

  it('replaces special characters with hyphens', () => {
    expect(normalizeSlug('My Store!!!')).toBe('my-store');
  });

  it('trims whitespace', () => {
    expect(normalizeSlug('  hello  ')).toBe('hello');
  });

  it('removes leading and trailing hyphens', () => {
    expect(normalizeSlug('---hello---')).toBe('hello');
  });

  it('collapses multiple special chars into single hyphen', () => {
    expect(normalizeSlug('hello   world!!!test')).toBe('hello-world-test');
  });

  it('handles empty string', () => {
    expect(normalizeSlug('')).toBe('');
  });
});

describe('normalizePrice', () => {
  it('rounds to 2 decimal places', () => {
    expect(normalizePrice(19.999)).toBe(20.0);
    expect(normalizePrice(19.994)).toBe(19.99);
  });

  it('clamps negative prices to 0', () => {
    expect(normalizePrice(-5)).toBe(0);
    expect(normalizePrice(-0.01)).toBe(0);
  });

  it('handles zero', () => {
    expect(normalizePrice(0)).toBe(0);
  });

  it('handles whole numbers', () => {
    expect(normalizePrice(100)).toBe(100);
  });
});
