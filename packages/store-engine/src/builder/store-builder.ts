import type { Store, Product, Page, ComponentNode } from '../types';
import { StoreSchema, ProductSchema } from '../types';
import { generateLayout, type LayoutPreset } from '../layout/layout-system';

/**
 * StoreBuilder — fluent API for constructing store definitions programmatically.
 *
 * Used by the AI bridge to translate AI intent into valid Store structures,
 * and by the UI for manual store construction.
 *
 * @example
 * ```ts
 * const store = new StoreBuilder('my-store', 'My Awesome Store')
 *   .setDescription('A store for awesome products')
 *   .setTheme('dark')
 *   .addProduct({ id: 'p1', name: 'Sneakers', price: 99 })
 *   .addPage('home', 'Home', 'hero-with-catalog')
 *   .build();
 * ```
 */
export class StoreBuilder {
  private store: Store;

  constructor(slug: string, name: string) {
    this.store = {
      id: crypto.randomUUID(),
      name,
      slug,
      config: {
        theme: 'light',
        currency: 'USD',
        locale: 'en',
      },
      pages: [],
      products: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /** Set the store description */
  setDescription(description: string): this {
    this.store.description = description;
    return this;
  }

  /** Set the store theme */
  setTheme(theme: 'light' | 'dark'): this {
    this.store.config.theme = theme;
    return this;
  }

  /** Set the store currency */
  setCurrency(currency: string): this {
    this.store.config.currency = currency;
    return this;
  }

  /** Set the store locale */
  setLocale(locale: string): this {
    this.store.config.locale = locale;
    return this;
  }

  /** Add a product to the store */
  addProduct(
    product: Omit<Product, 'currency' | 'images' | 'tags' | 'variants' | 'inStock'> &
      Partial<Product>
  ): this {
    const validated = ProductSchema.parse({
      currency: this.store.config.currency,
      images: [],
      tags: [],
      variants: [],
      inStock: true,
      ...product,
    });
    this.store.products.push(validated);
    return this;
  }

  /** Add multiple products */
  addProducts(
    products: Array<
      Omit<Product, 'currency' | 'images' | 'tags' | 'variants' | 'inStock'> &
        Partial<Product>
    >
  ): this {
    for (const product of products) {
      this.addProduct(product);
    }
    return this;
  }

  /** Add a page using a layout preset */
  addPage(slug: string, title: string, preset: LayoutPreset): this {
    const layout = generateLayout(preset);
    const page: Page = {
      id: crypto.randomUUID(),
      slug,
      title,
      layout,
    };
    this.store.pages.push(page);
    return this;
  }

  /** Add a page with a custom layout */
  addCustomPage(slug: string, title: string, layout: ComponentNode): this {
    const page: Page = {
      id: crypto.randomUUID(),
      slug,
      title,
      layout,
    };
    this.store.pages.push(page);
    return this;
  }

  /** Build and validate the final Store object */
  build(): Store {
    this.store.updatedAt = new Date().toISOString();
    return StoreSchema.parse(this.store);
  }

  /** Build without validation (for drafts) */
  buildDraft(): Store {
    this.store.updatedAt = new Date().toISOString();
    return structuredClone(this.store);
  }
}
