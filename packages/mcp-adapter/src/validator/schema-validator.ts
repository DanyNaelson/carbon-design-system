import { ZodError, type ZodSchema } from 'zod';
import {
  McpMessageSchema,
  CreateStorePayloadSchema,
  AddProductPayloadSchema,
  UpdateLayoutPayloadSchema,
  type McpMessage,
} from '../types';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Array<{
    path: string;
    message: string;
  }>;
}

/**
 * Validate any data against a Zod schema, returning a structured result.
 */
export function validate<T>(schema: ZodSchema<T>, data: unknown): ValidationResult<T> {
  try {
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        errors: error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      };
    }
    throw error;
  }
}

/**
 * Validate an incoming MCP message envelope.
 */
export function validateMcpMessage(data: unknown): ValidationResult<McpMessage> {
  return validate(McpMessageSchema, data);
}

/**
 * Validate the payload for a specific action type.
 */
export function validatePayload(
  action: string,
  payload: unknown
): ValidationResult<unknown> {
  const schemaMap: Record<string, ZodSchema> = {
    'create-store': CreateStorePayloadSchema,
    'add-product': AddProductPayloadSchema,
    'update-layout': UpdateLayoutPayloadSchema,
  };

  const schema = schemaMap[action];
  if (!schema) {
    return {
      success: false,
      errors: [{ path: 'action', message: `Unknown action type: "${action}"` }],
    };
  }

  return validate(schema, payload);
}

/**
 * Full validation: validates envelope + action-specific payload.
 */
export function validateFullMessage(
  data: unknown
): ValidationResult<McpMessage> & { payloadValidation?: ValidationResult<unknown> } {
  const envelopeResult = validateMcpMessage(data);

  if (!envelopeResult.success) {
    return envelopeResult;
  }

  const message = envelopeResult.data!;
  const payloadResult = validatePayload(message.action, message.payload);

  return {
    ...envelopeResult,
    payloadValidation: payloadResult,
  };
}
