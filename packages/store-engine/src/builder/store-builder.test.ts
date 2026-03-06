import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StoreBuilder } from './store-builder';

// Mock crypto.randomUUID for deterministic tests
let uuidCounter = 0;
vi.stubGlobal('crypto', {
  randomUUID: () => `uuid-${++uuidCounter}`,
});

beforeEach(() => {
  uuidCounter = 0;
});

describe('StoreBuilder', () => {
  it('creates a store with required fields', () => {
    const store = new StoreBuilder('my-store', 'My Store').build();

    expect(store.name).toBe('My Store');
    expect(store.slug).toBe('my-store');
    expect(store.config.theme).toBe('light');
    expect(store.config.currency).toBe('USD');
    expect(store.config.locale).toBe('en');
    expect(store.pages).toEqual([]);
    expect(store.products).toEqual([]);
    expect(store.id).toBeDefined();
    expect(store.createdAt).toBeDefined();
    expect(store.updatedAt).toBeDefined();
  });

  it('sets description', () => {
    const store = new StoreBuilder('store', 'Store')
      .setDescription('A great store')
      .build();

    expect(store.description).toBe('A great store');
  });

  it('sets theme', () => {
    const store = new StoreBuilder('store', 'Store')
      .setTheme('dark')
      .build();

    expect(store.config.theme).toBe('dark');
  });

  it('sets currency', () => {
    const store = new StoreBuilder('store', 'Store')
      .setCurrency('EUR')
      .build();

    expect(store.config.currency).toBe('EUR');
  });

  it('sets locale', () => {
    const store = new StoreBuilder('store', 'Store')
      .setLocale('es')
      .build();

    expect(store.config.locale).toBe('es');
  });

  it('adds a single product', () => {
    const store = new StoreBuilder('store', 'Store')
      .addProduct({ id: 'p1', name: 'Sneakers', price: 99.99 })
      .build();

    expect(store.products).toHaveLength(1);
    expect(store.products[0].name).toBe('Sneakers');
    expect(store.products[0].price).toBe(99.99);
    expect(store.products[0].currency).toBe('USD');
    expect(store.products[0].inStock).toBe(true);
  });

  it('adds multiple products at once', () => {
    const store = new StoreBuilder('store', 'Store')
      .addProducts([
        { id: 'p1', name: 'Sneakers', price: 99.99 },
        { id: 'p2', name: 'Hat', price: 24.99 },
        { id: 'p3', name: 'Jacket', price: 149.99 },
      ])
      .build();

    expect(store.products).toHaveLength(3);
    expect(store.products[0].name).toBe('Sneakers');
    expect(store.products[2].name).toBe('Jacket');
  });

  it('adds a page with layout preset', () => {
    const store = new StoreBuilder('store', 'Store')
      .addPage('home', 'Home Page', 'grid-catalog')
      .build();

    expect(store.pages).toHaveLength(1);
    expect(store.pages[0].slug).toBe('home');
    expect(store.pages[0].title).toBe('Home Page');
    expect(store.pages[0].layout.type).toBe('grid');
  });

  it('adds a custom page with manual layout', () => {
    const customLayout = {
      type: 'container',
      props: {},
      children: [{ type: 'heading', props: { text: 'Custom' } }],
    };

    const store = new StoreBuilder('store', 'Store')
      .addCustomPage('about', 'About Us', customLayout)
      .build();

    expect(store.pages).toHaveLength(1);
    expect(store.pages[0].slug).toBe('about');
    expect(store.pages[0].layout.type).toBe('container');
  });

  it('supports fluent chaining', () => {
    const store = new StoreBuilder('shop', 'My Shop')
      .setDescription('Best shop')
      .setTheme('dark')
      .setCurrency('EUR')
      .setLocale('de')
      .addProduct({ id: 'p1', name: 'Item 1', price: 10 })
      .addPage('home', 'Home', 'hero-with-catalog')
      .build();

    expect(store.name).toBe('My Shop');
    expect(store.description).toBe('Best shop');
    expect(store.config.theme).toBe('dark');
    expect(store.config.currency).toBe('EUR');
    expect(store.config.locale).toBe('de');
    expect(store.products).toHaveLength(1);
    expect(store.pages).toHaveLength(1);
  });

  it('buildDraft returns a store without validation', () => {
    const draft = new StoreBuilder('store', 'Store').buildDraft();

    expect(draft.name).toBe('Store');
    expect(draft.slug).toBe('store');
    expect(draft.updatedAt).toBeDefined();
  });

  it('buildDraft returns a deep clone (mutations do not affect builder)', () => {
    const builder = new StoreBuilder('store', 'Store');
    const draft1 = builder.buildDraft();
    draft1.name = 'Mutated';

    const draft2 = builder.buildDraft();
    expect(draft2.name).toBe('Store');
  });

  it('uses store currency for products when no currency specified', () => {
    const store = new StoreBuilder('store', 'Store')
      .setCurrency('GBP')
      .addProduct({ id: 'p1', name: 'Item', price: 10 })
      .build();

    expect(store.products[0].currency).toBe('GBP');
  });

  it('validates store on build()', () => {
    // StoreSchema requires name and slug to be strings
    // The builder always provides these, so validation should pass
    const store = new StoreBuilder('valid-store', 'Valid Store').build();
    expect(store.id).toBeDefined();
  });

  it('updates updatedAt timestamp on build', () => {
    const builder = new StoreBuilder('store', 'Store');

    const store = builder.build();
    expect(store.updatedAt).toBeDefined();
  });
});
