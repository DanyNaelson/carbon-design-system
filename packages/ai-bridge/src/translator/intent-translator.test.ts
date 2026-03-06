import { describe, it, expect } from 'vitest';
import { IntentTranslator, generateSystemPrompt } from './intent-translator';

describe('IntentTranslator', () => {
  const translator = new IntentTranslator();

  describe('create-store intent', () => {
    it('translates a basic create-store intent', () => {
      const result = translator.translate({
        intent: 'create-store',
        storeName: 'Cool Shoes',
      });

      expect(result.success).toBe(true);
      expect(result.action).toBe('create-store');
      expect(result.payload?.name).toBe('Cool Shoes');
      expect(result.payload?.slug).toBe('cool-shoes');
      expect(result.payload?.theme).toBe('light');
      expect(result.description).toContain('Cool Shoes');
    });

    it('translates create-store with products', () => {
      const result = translator.translate({
        intent: 'create-store',
        storeName: 'My Fashion Store',
        storeDescription: 'Best fashion',
        theme: 'dark',
        products: [
          { name: 'Sneakers', price: 99.99 },
          { name: 'Hat', price: 24.99 },
        ],
      });

      expect(result.success).toBe(true);
      expect(result.payload?.theme).toBe('dark');
      expect(result.payload?.description).toBe('Best fashion');
      const products = result.payload?.products as Array<{ name: string }>;
      expect(products).toHaveLength(2);
      expect(result.description).toContain('2 products');
    });

    it('normalizes slug from store name', () => {
      const result = translator.translate({
        intent: 'create-store',
        storeName: 'My AWESOME Store!!!',
      });

      expect(result.payload?.slug).toBe('my-awesome-store');
    });
  });

  describe('add-product intent', () => {
    it('translates add-product intent', () => {
      const result = translator.translate({
        intent: 'add-product',
        storeId: 'store-1',
        productName: 'Cool Sneakers',
        price: 99.995,
        category: 'shoes',
      });

      expect(result.success).toBe(true);
      expect(result.action).toBe('add-product');
      const product = result.payload?.product as Record<string, unknown>;
      expect(product?.name).toBe('Cool Sneakers');
      expect(product?.price).toBe(100.0);
      expect(product?.category).toBe('shoes');
    });

    it('handles product with variants', () => {
      const result = translator.translate({
        intent: 'add-product',
        storeId: 'store-1',
        productName: 'T-Shirt',
        price: 29.99,
        variants: [
          { name: 'Small' },
          { name: 'Medium' },
          { name: 'Large', price: 34.99 },
        ],
      });

      expect(result.success).toBe(true);
      const product = result.payload?.product as Record<string, unknown>;
      const variants = product?.variants as Array<{ name: string }>;
      expect(variants).toHaveLength(3);
    });
  });

  describe('update-layout intent', () => {
    it('translates update-layout with preset', () => {
      const result = translator.translate({
        intent: 'update-layout',
        storeId: 'store-1',
        layoutPreset: 'hero-with-catalog',
      });

      expect(result.success).toBe(true);
      expect(result.action).toBe('update-layout');
      expect(result.payload?.layout).toBe('hero-with-catalog');
    });

    it('defaults page slug to home', () => {
      const result = translator.translate({
        intent: 'update-layout',
        storeId: 'store-1',
      });

      expect(result.payload?.pageSlug).toBe('home');
    });
  });

  describe('update-theme intent', () => {
    it('translates theme change', () => {
      const result = translator.translate({
        intent: 'update-theme',
        storeId: 'store-1',
        theme: 'dark',
      });

      expect(result.success).toBe(true);
      expect(result.action).toBe('update-theme');
      expect(result.payload?.theme).toBe('dark');
    });
  });

  describe('add-page intent', () => {
    it('translates add-page with auto slug', () => {
      const result = translator.translate({
        intent: 'add-page',
        storeId: 'store-1',
        pageTitle: 'About Us',
      });

      expect(result.success).toBe(true);
      expect(result.action).toBe('add-page');
      expect(result.payload?.slug).toBe('about-us');
      expect(result.payload?.title).toBe('About Us');
    });

    it('uses provided slug when given', () => {
      const result = translator.translate({
        intent: 'add-page',
        storeId: 'store-1',
        pageTitle: 'About Us',
        pageSlug: 'custom-about',
      });

      expect(result.payload?.slug).toBe('custom-about');
    });
  });

  describe('recommend-products intent', () => {
    it('translates recommendation request', () => {
      const result = translator.translate({
        intent: 'recommend-products',
        storeId: 'store-1',
        context: 'summer collection',
        count: 10,
      });

      expect(result.success).toBe(true);
      expect(result.action).toBe('recommend-products');
      expect(result.payload?.count).toBe(10);
      expect(result.payload?.context).toBe('summer collection');
    });

    it('defaults to 5 recommendations', () => {
      const result = translator.translate({
        intent: 'recommend-products',
        storeId: 'store-1',
      });

      expect(result.payload?.count).toBe(5);
    });
  });

  describe('invalid intents', () => {
    it('returns errors for completely invalid input', () => {
      const result = translator.translate({ foo: 'bar' });
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });

    it('returns errors for missing required fields', () => {
      const result = translator.translate({
        intent: 'create-store',
        // missing storeName
      });

      expect(result.success).toBe(false);
    });
  });
});

describe('generateSystemPrompt', () => {
  it('includes available components and layouts', () => {
    const prompt = generateSystemPrompt({
      availableComponents: ['button', 'card', 'grid'],
      availableLayouts: ['grid-catalog', 'hero-with-catalog'],
    });

    expect(prompt).toContain('button');
    expect(prompt).toContain('card');
    expect(prompt).toContain('grid-catalog');
    expect(prompt).toContain('hero-with-catalog');
  });

  it('includes store context when provided', () => {
    const prompt = generateSystemPrompt({
      availableComponents: ['button'],
      availableLayouts: ['grid-catalog'],
      storeContext: {
        storeId: 'store-1',
        storeName: 'My Store',
        existingPages: ['home', 'about'],
        productCount: 15,
      },
    });

    expect(prompt).toContain('store-1');
    expect(prompt).toContain('My Store');
    expect(prompt).toContain('home, about');
    expect(prompt).toContain('15');
  });

  it('omits store context when not provided', () => {
    const prompt = generateSystemPrompt({
      availableComponents: ['button'],
      availableLayouts: ['grid-catalog'],
    });

    expect(prompt).not.toContain('Current store context');
  });
});
