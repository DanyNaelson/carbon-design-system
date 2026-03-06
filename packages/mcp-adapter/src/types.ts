import { z } from 'zod';

/**
 * Contract version format: "MAJOR.MINOR"
 * - MAJOR: breaking changes (new required fields, removed fields)
 * - MINOR: backwards-compatible additions (new optional fields)
 */
export const CONTRACT_VERSION = '1.0' as const;

// ─── MCP Message Schemas ───

/**
 * Base envelope for all MCP messages.
 * Every message from the backend must conform to this structure.
 */
export const McpMessageSchema = z.object({
  /** Protocol version for contract compatibility */
  version: z.string(),
  /** Unique message ID for tracking */
  messageId: z.string(),
  /** Timestamp of the message */
  timestamp: z.string().datetime(),
  /** The action/tool being invoked */
  action: z.string(),
  /** Payload specific to the action */
  payload: z.record(z.unknown()),
});

export type McpMessage = z.infer<typeof McpMessageSchema>;

/** Schema for store creation requests from the MCP backend */
export const CreateStorePayloadSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  theme: z.enum(['light', 'dark']).optional(),
  currency: z.string().length(3).optional(),
  locale: z.string().optional(),
  products: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.number().nonnegative(),
        images: z.array(z.string()).optional(),
        category: z.string().optional(),
      })
    )
    .optional(),
  layout: z.string().optional(), // Layout preset name
});

export type CreateStorePayload = z.infer<typeof CreateStorePayloadSchema>;

/** Schema for product addition requests */
export const AddProductPayloadSchema = z.object({
  storeId: z.string(),
  product: z.object({
    name: z.string(),
    description: z.string().optional(),
    price: z.number().nonnegative(),
    images: z.array(z.string()).optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    variants: z
      .array(
        z.object({
          name: z.string(),
          price: z.number().nonnegative().optional(),
          sku: z.string().optional(),
        })
      )
      .optional(),
  }),
});

export type AddProductPayload = z.infer<typeof AddProductPayloadSchema>;

/** Schema for layout update requests */
export const UpdateLayoutPayloadSchema = z.object({
  storeId: z.string(),
  pageSlug: z.string(),
  layout: z.union([
    z.string(), // Layout preset name
    z.record(z.unknown()), // Custom ComponentNode
  ]),
});

export type UpdateLayoutPayload = z.infer<typeof UpdateLayoutPayloadSchema>;

/** MCP response sent back to the backend */
export const McpResponseSchema = z.object({
  version: z.string(),
  messageId: z.string(),
  timestamp: z.string().datetime(),
  status: z.enum(['success', 'error', 'partial']),
  data: z.record(z.unknown()).optional(),
  error: z
    .object({
      code: z.string(),
      message: z.string(),
      details: z.record(z.unknown()).optional(),
    })
    .optional(),
});

export type McpResponse = z.infer<typeof McpResponseSchema>;
