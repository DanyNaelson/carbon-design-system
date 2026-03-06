import { z } from 'zod';

// ─── AI Intent Types ───

/**
 * The possible intents that Gemini can express.
 * Each intent maps to a specific store-engine action.
 */
export const AiIntentSchema = z.discriminatedUnion('intent', [
  z.object({
    intent: z.literal('create-store'),
    storeName: z.string(),
    storeDescription: z.string().optional(),
    theme: z.enum(['light', 'dark']).optional(),
    layout: z.string().optional(),
    products: z
      .array(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          price: z.number(),
          category: z.string().optional(),
          imageUrl: z.string().optional(),
        })
      )
      .optional(),
  }),

  z.object({
    intent: z.literal('add-product'),
    storeId: z.string(),
    productName: z.string(),
    productDescription: z.string().optional(),
    price: z.number(),
    category: z.string().optional(),
    imageUrl: z.string().optional(),
    variants: z
      .array(
        z.object({
          name: z.string(),
          price: z.number().optional(),
        })
      )
      .optional(),
  }),

  z.object({
    intent: z.literal('update-layout'),
    storeId: z.string(),
    pageSlug: z.string().optional(),
    layoutPreset: z.string().optional(),
    customLayout: z.record(z.unknown()).optional(),
  }),

  z.object({
    intent: z.literal('update-theme'),
    storeId: z.string(),
    theme: z.enum(['light', 'dark']),
  }),

  z.object({
    intent: z.literal('add-page'),
    storeId: z.string(),
    pageTitle: z.string(),
    pageSlug: z.string().optional(),
    layoutPreset: z.string().optional(),
  }),

  z.object({
    intent: z.literal('recommend-products'),
    storeId: z.string(),
    context: z.string().optional(),
    count: z.number().optional(),
  }),
]);

export type AiIntent = z.infer<typeof AiIntentSchema>;

/**
 * Result of translating an AI intent to a store action.
 */
export interface TranslationResult {
  success: boolean;
  /** The MCP action name to invoke */
  action?: string;
  /** The normalized payload for the action */
  payload?: Record<string, unknown>;
  /** Human-readable description of what will happen */
  description?: string;
  /** Errors if translation failed */
  errors?: Array<{ message: string }>;
}

/**
 * Prompt template configuration for structured output.
 */
export interface PromptConfig {
  /** Available component types in the registry */
  availableComponents: string[];
  /** Available layout presets */
  availableLayouts: string[];
  /** Current store context (if editing existing store) */
  storeContext?: {
    storeId: string;
    storeName: string;
    existingPages: string[];
    productCount: number;
  };
}
