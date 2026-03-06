import { describe, it, expect } from 'vitest';
import { generateLayout, getAvailablePresets } from './layout-system';

describe('generateLayout', () => {
  describe('single-column preset', () => {
    it('generates a single-column layout', () => {
      const layout = generateLayout('single-column');

      expect(layout.type).toBe('grid');
      expect(layout.children).toBeDefined();
      // header + main column + footer
      expect(layout.children!.length).toBe(3);
    });

    it('includes header and footer by default', () => {
      const layout = generateLayout('single-column');
      const types = layout.children!.map((c) => c.type);

      expect(types).toContain('store-header');
      expect(types).toContain('store-footer');
    });

    it('excludes header when includeHeader is false', () => {
      const layout = generateLayout('single-column', { includeHeader: false });
      const types = layout.children!.map((c) => c.type);

      expect(types).not.toContain('store-header');
    });

    it('excludes footer when includeFooter is false', () => {
      const layout = generateLayout('single-column', { includeFooter: false });
      const types = layout.children!.map((c) => c.type);

      expect(types).not.toContain('store-footer');
    });

    it('main column spans full width (lg: 16)', () => {
      const layout = generateLayout('single-column');
      const mainColumn = layout.children!.find((c) => c.key === 'main');

      expect(mainColumn?.props.lg).toBe(16);
    });

    it('contains a product-list with columns: 1', () => {
      const layout = generateLayout('single-column');
      const mainColumn = layout.children!.find((c) => c.key === 'main');
      const productList = mainColumn?.children?.[0];

      expect(productList?.type).toBe('product-list');
      expect(productList?.props.columns).toBe(1);
    });
  });

  describe('two-column preset', () => {
    it('generates a two-column layout', () => {
      const layout = generateLayout('two-column');

      expect(layout.type).toBe('grid');
      expect(layout.children).toBeDefined();
    });

    it('has main column with lg: 8 when no sidebar', () => {
      const layout = generateLayout('two-column');
      const mainColumn = layout.children!.find((c) => c.key === 'main');

      expect(mainColumn?.props.lg).toBe(8);
    });

    it('adds sidebar when includeSidebar is true', () => {
      const layout = generateLayout('two-column', { includeSidebar: true });
      const sidebar = layout.children!.find((c) => c.key === 'sidebar');

      expect(sidebar).toBeDefined();
      expect(sidebar?.props.lg).toBe(4);
    });

    it('main column is lg: 12 when sidebar is included', () => {
      const layout = generateLayout('two-column', { includeSidebar: true });
      const mainColumn = layout.children!.find((c) => c.key === 'main');

      expect(mainColumn?.props.lg).toBe(12);
    });

    it('sidebar contains category-filter', () => {
      const layout = generateLayout('two-column', { includeSidebar: true });
      const sidebar = layout.children!.find((c) => c.key === 'sidebar');
      const filter = sidebar?.children?.[0];

      expect(filter?.type).toBe('category-filter');
    });

    it('contains a product-list with columns: 2', () => {
      const layout = generateLayout('two-column');
      const mainColumn = layout.children!.find((c) => c.key === 'main');
      const productList = mainColumn?.children?.[0];

      expect(productList?.type).toBe('product-list');
      expect(productList?.props.columns).toBe(2);
    });
  });

  describe('grid-catalog preset', () => {
    it('generates a grid-catalog layout', () => {
      const layout = generateLayout('grid-catalog');

      expect(layout.type).toBe('grid');
    });

    it('uses default productsPerRow of 3', () => {
      const layout = generateLayout('grid-catalog');
      const catalog = layout.children!.find((c) => c.key === 'catalog');
      const productGrid = catalog?.children?.[0];

      expect(productGrid?.type).toBe('product-grid');
      expect(productGrid?.props.columns).toBe(3);
    });

    it('respects custom productsPerRow', () => {
      const layout = generateLayout('grid-catalog', { productsPerRow: 4 });
      const catalog = layout.children!.find((c) => c.key === 'catalog');
      const productGrid = catalog?.children?.[0];

      expect(productGrid?.props.columns).toBe(4);
    });
  });

  describe('hero-with-catalog preset', () => {
    it('generates a hero-with-catalog layout', () => {
      const layout = generateLayout('hero-with-catalog');

      expect(layout.type).toBe('grid');
    });

    it('includes a hero-banner section', () => {
      const layout = generateLayout('hero-with-catalog');
      const hero = layout.children!.find((c) => c.key === 'hero');
      const heroBanner = hero?.children?.[0];

      expect(heroBanner?.type).toBe('hero-banner');
      expect(heroBanner?.props.fullWidth).toBe(true);
    });

    it('includes a product-grid catalog section', () => {
      const layout = generateLayout('hero-with-catalog');
      const catalog = layout.children!.find((c) => c.key === 'catalog');
      const productGrid = catalog?.children?.[0];

      expect(productGrid?.type).toBe('product-grid');
    });
  });

  describe('config combinations', () => {
    it('generates layout with no header and no footer', () => {
      const layout = generateLayout('grid-catalog', {
        includeHeader: false,
        includeFooter: false,
      });

      const types = layout.children!.map((c) => c.type);
      expect(types).not.toContain('store-header');
      expect(types).not.toContain('store-footer');
    });
  });
});

describe('getAvailablePresets', () => {
  it('returns all layout presets', () => {
    const presets = getAvailablePresets();

    expect(presets).toContain('single-column');
    expect(presets).toContain('two-column');
    expect(presets).toContain('grid-catalog');
    expect(presets).toContain('hero-with-catalog');
    expect(presets).toHaveLength(4);
  });
});
