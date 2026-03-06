import type { ComponentNode } from '../types';

/**
 * Layout presets — predefined component tree structures
 * that the AI or store builder can use as starting points.
 */

export type LayoutPreset = 'single-column' | 'two-column' | 'grid-catalog' | 'hero-with-catalog';

interface LayoutConfig {
  /** Number of products per row (for grid layouts) */
  productsPerRow?: number;
  /** Whether to include a header section */
  includeHeader?: boolean;
  /** Whether to include a footer section */
  includeFooter?: boolean;
  /** Whether to include a sidebar */
  includeSidebar?: boolean;
}

/**
 * Generate a layout component tree from a preset name.
 * The AI can reference these presets instead of specifying every node.
 *
 * @example
 * ```ts
 * const layout = generateLayout('grid-catalog', {
 *   productsPerRow: 3,
 *   includeHeader: true,
 * });
 * // Returns a ComponentNode tree ready for JsonRenderer
 * ```
 */
export function generateLayout(
  preset: LayoutPreset,
  config: LayoutConfig = {}
): ComponentNode {
  const {
    productsPerRow = 3,
    includeHeader = true,
    includeFooter = true,
    includeSidebar = false,
  } = config;

  const header: ComponentNode = {
    type: 'store-header',
    props: {},
    key: 'header',
  };

  const footer: ComponentNode = {
    type: 'store-footer',
    props: {},
    key: 'footer',
  };

  switch (preset) {
    case 'single-column':
      return {
        type: 'grid',
        props: {},
        children: [
          ...(includeHeader ? [header] : []),
          {
            type: 'column',
            props: { lg: 16 },
            key: 'main',
            children: [
              { type: 'product-list', props: { columns: 1 }, key: 'products' },
            ],
          },
          ...(includeFooter ? [footer] : []),
        ],
      };

    case 'two-column':
      return {
        type: 'grid',
        props: {},
        children: [
          ...(includeHeader ? [header] : []),
          {
            type: 'column',
            props: { lg: includeSidebar ? 12 : 8 },
            key: 'main',
            children: [
              { type: 'product-list', props: { columns: 2 }, key: 'products' },
            ],
          },
          ...(includeSidebar
            ? [
                {
                  type: 'column',
                  props: { lg: 4 },
                  key: 'sidebar',
                  children: [
                    { type: 'category-filter', props: {}, key: 'filters' },
                  ],
                },
              ]
            : []),
          ...(includeFooter ? [footer] : []),
        ],
      };

    case 'grid-catalog':
      return {
        type: 'grid',
        props: {},
        children: [
          ...(includeHeader ? [header] : []),
          {
            type: 'column',
            props: { lg: 16 },
            key: 'catalog',
            children: [
              {
                type: 'product-grid',
                props: { columns: productsPerRow },
                key: 'products',
              },
            ],
          },
          ...(includeFooter ? [footer] : []),
        ],
      };

    case 'hero-with-catalog':
      return {
        type: 'grid',
        props: {},
        children: [
          ...(includeHeader ? [header] : []),
          {
            type: 'column',
            props: { lg: 16 },
            key: 'hero',
            children: [
              {
                type: 'hero-banner',
                props: { fullWidth: true },
                key: 'hero-banner',
              },
            ],
          },
          {
            type: 'column',
            props: { lg: 16 },
            key: 'catalog',
            children: [
              {
                type: 'product-grid',
                props: { columns: productsPerRow },
                key: 'product-grid',
              },
            ],
          },
          ...(includeFooter ? [footer] : []),
        ],
      };

    default: {
      const _exhaustive: never = preset;
      throw new Error(`Unknown layout preset: ${_exhaustive}`);
    }
  }
}

/**
 * Get all available layout preset names.
 */
export function getAvailablePresets(): LayoutPreset[] {
  return ['single-column', 'two-column', 'grid-catalog', 'hero-with-catalog'];
}
