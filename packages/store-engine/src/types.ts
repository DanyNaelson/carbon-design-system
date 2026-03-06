import { z } from 'zod';

// ─── Store Schema ───

/** Schema for a single product */
export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  currency: z.string().default('USD'),
  images: z.array(z.string().url()).default([]),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  variants: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number().nonnegative().optional(),
        sku: z.string().optional(),
      })
    )
    .default([]),
  inStock: z.boolean().default(true),
  metadata: z.record(z.unknown()).optional(),
});

export type Product = z.infer<typeof ProductSchema>;

export interface ComponentNode {
  type: string;
  props: Record<string, unknown>;
  children?: ComponentNode[];
  key?: string;
}

/** Schema for a component node in the JSON layout tree */
export const ComponentNodeSchema: z.ZodType<ComponentNode> = z.lazy(() =>
  z.object({
    /** Which registered component to render */
    type: z.string(),
    /** Props to pass to the component */
    props: z.record(z.unknown()),
    /** Nested children nodes */
    children: z.array(z.lazy(() => ComponentNodeSchema)).optional(),
    /** Unique key for React reconciliation */
    key: z.string().optional(),
  })
);

/** Schema for a page within a store */
export const PageSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  /** The component tree that defines the page layout */
  layout: ComponentNodeSchema,
  meta: z
    .object({
      description: z.string().optional(),
      ogImage: z.string().url().optional(),
    })
    .optional(),
});

export type Page = z.infer<typeof PageSchema>;

/** Schema for an entire store definition */
export const StoreSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  /** Store configuration */
  config: z.object({
    theme: z.enum(['light', 'dark']).default('light'),
    currency: z.string().default('USD'),
    locale: z.string().default('en'),
  }),
  /** Pages that make up the store */
  pages: z.array(PageSchema),
  /** Product catalog */
  products: z.array(ProductSchema).default([]),
  /** Creation timestamp */
  createdAt: z.string().datetime().optional(),
  /** Last update timestamp */
  updatedAt: z.string().datetime().optional(),
});

export type Store = z.infer<typeof StoreSchema>;

// ─── State Machine Types ───

export type CartItem = {
  product: Product;
  quantity: number;
  variantId?: string;
};

export type StoreState = {
  /** Current page being viewed */
  currentPage: string;
  /** Shopping cart */
  cart: CartItem[];
  /** Whether a modal/drawer is open */
  uiState: {
    cartOpen: boolean;
    searchOpen: boolean;
    menuOpen: boolean;
  };
};

export type StoreAction =
  | { type: 'NAVIGATE'; payload: { pageSlug: string } }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity?: number; variantId?: string } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string; variantId?: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number; variantId?: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'TOGGLE_SEARCH' }
  | { type: 'TOGGLE_MENU' };
