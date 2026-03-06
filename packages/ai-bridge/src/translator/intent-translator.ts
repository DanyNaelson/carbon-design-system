import { normalizeSlug, normalizePrice } from '@yourorg/mcp-adapter';
import type { AiIntent, TranslationResult, PromptConfig } from '../types';
import { AiIntentSchema } from '../types';

/**
 * IntentTranslator — converts Gemini AI intents into MCP-compatible payloads.
 *
 * This is the glue between what the AI "wants to do" and what the
 * store-engine can actually execute.
 *
 * @example
 * ```ts
 * const translator = new IntentTranslator();
 *
 * // AI says: "create a shoe store with 3 products"
 * const result = translator.translate({
 *   intent: 'create-store',
 *   storeName: 'Cool Shoes',
 *   products: [
 *     { name: 'Sneakers', price: 99.99 },
 *     { name: 'Boots', price: 149.99 },
 *     { name: 'Sandals', price: 39.99 },
 *   ],
 * });
 *
 * // result.action = 'create-store'
 * // result.payload = { name: 'Cool Shoes', slug: 'cool-shoes', ... }
 * ```
 */
export class IntentTranslator {
  /**
   * Translate a raw AI intent into a structured MCP payload.
   */
  translate(rawIntent: unknown): TranslationResult {
    // 1. Validate the intent structure
    const parsed = AiIntentSchema.safeParse(rawIntent);

    if (!parsed.success) {
      return {
        success: false,
        errors: parsed.error.issues.map((issue) => ({
          message: `${issue.path.join('.')}: ${issue.message}`,
        })),
      };
    }

    const intent = parsed.data;

    // 2. Route to specific translator
    switch (intent.intent) {
      case 'create-store':
        return this.translateCreateStore(intent);
      case 'add-product':
        return this.translateAddProduct(intent);
      case 'update-layout':
        return this.translateUpdateLayout(intent);
      case 'update-theme':
        return this.translateUpdateTheme(intent);
      case 'add-page':
        return this.translateAddPage(intent);
      case 'recommend-products':
        return this.translateRecommendProducts(intent);
    }
  }

  private translateCreateStore(
    intent: Extract<AiIntent, { intent: 'create-store' }>
  ): TranslationResult {
    const slug = normalizeSlug(intent.storeName);

    return {
      success: true,
      action: 'create-store',
      payload: {
        name: intent.storeName,
        slug,
        description: intent.storeDescription,
        theme: intent.theme ?? 'light',
        layout: intent.layout ?? 'grid-catalog',
        products: intent.products?.map((p) => ({
          name: p.name,
          description: p.description,
          price: normalizePrice(p.price),
          images: p.imageUrl ? [p.imageUrl] : [],
          category: p.category,
        })),
      },
      description: `Create store "${intent.storeName}" with ${intent.products?.length ?? 0} products`,
    };
  }

  private translateAddProduct(
    intent: Extract<AiIntent, { intent: 'add-product' }>
  ): TranslationResult {
    return {
      success: true,
      action: 'add-product',
      payload: {
        storeId: intent.storeId,
        product: {
          name: intent.productName,
          description: intent.productDescription,
          price: normalizePrice(intent.price),
          images: intent.imageUrl ? [intent.imageUrl] : [],
          category: intent.category,
          variants: intent.variants?.map((v) => ({
            name: v.name,
            price: v.price != null ? normalizePrice(v.price) : undefined,
          })),
        },
      },
      description: `Add product "${intent.productName}" ($${normalizePrice(intent.price)})`,
    };
  }

  private translateUpdateLayout(
    intent: Extract<AiIntent, { intent: 'update-layout' }>
  ): TranslationResult {
    return {
      success: true,
      action: 'update-layout',
      payload: {
        storeId: intent.storeId,
        pageSlug: intent.pageSlug ?? 'home',
        layout: intent.customLayout ?? intent.layoutPreset ?? 'grid-catalog',
      },
      description: `Update layout for page "${intent.pageSlug ?? 'home'}"`,
    };
  }

  private translateUpdateTheme(
    intent: Extract<AiIntent, { intent: 'update-theme' }>
  ): TranslationResult {
    return {
      success: true,
      action: 'update-theme',
      payload: {
        storeId: intent.storeId,
        theme: intent.theme,
      },
      description: `Switch store to ${intent.theme} theme`,
    };
  }

  private translateAddPage(
    intent: Extract<AiIntent, { intent: 'add-page' }>
  ): TranslationResult {
    const slug = intent.pageSlug ?? normalizeSlug(intent.pageTitle);

    return {
      success: true,
      action: 'add-page',
      payload: {
        storeId: intent.storeId,
        title: intent.pageTitle,
        slug,
        layout: intent.layoutPreset ?? 'single-column',
      },
      description: `Add page "${intent.pageTitle}" (/${slug})`,
    };
  }

  private translateRecommendProducts(
    intent: Extract<AiIntent, { intent: 'recommend-products' }>
  ): TranslationResult {
    return {
      success: true,
      action: 'recommend-products',
      payload: {
        storeId: intent.storeId,
        context: intent.context,
        count: intent.count ?? 5,
      },
      description: `Get ${intent.count ?? 5} product recommendations`,
    };
  }
}

/**
 * Generate the system prompt that instructs Gemini how to output structured intents.
 *
 * This prompt is sent alongside the user's message to ensure Gemini returns
 * valid AiIntent JSON that the IntentTranslator can process.
 */
export function generateSystemPrompt(config: PromptConfig): string {
  const storeContext = config.storeContext
    ? `\nCurrent store context:
- Store ID: ${config.storeContext.storeId}
- Store Name: ${config.storeContext.storeName}
- Existing pages: ${config.storeContext.existingPages.join(', ')}
- Product count: ${config.storeContext.productCount}`
    : '';

  return `You are a store builder AI assistant. You help users create and manage online stores.

You MUST respond with valid JSON matching one of these intent types:
- "create-store": Create a new store with optional products
- "add-product": Add a product to an existing store
- "update-layout": Change the layout of a store page
- "update-theme": Switch between light and dark theme
- "add-page": Add a new page to a store
- "recommend-products": Get product recommendations

Available UI components: ${config.availableComponents.join(', ')}
Available layout presets: ${config.availableLayouts.join(', ')}
${storeContext}

IMPORTANT: Always respond with a single JSON object containing an "intent" field.
Do NOT include any text outside the JSON object.

Example response for "create a shoe store":
{
  "intent": "create-store",
  "storeName": "Urban Shoes",
  "storeDescription": "Premium urban footwear",
  "theme": "dark",
  "layout": "hero-with-catalog",
  "products": [
    { "name": "Classic Sneakers", "price": 89.99, "category": "sneakers" }
  ]
}`;
}
