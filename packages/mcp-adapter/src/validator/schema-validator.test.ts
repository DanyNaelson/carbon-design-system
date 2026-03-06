import { describe, it, expect } from 'vitest';
import {
  validate,
  validateMcpMessage,
  validatePayload,
  validateFullMessage,
} from './schema-validator';
import { McpMessageSchema, CreateStorePayloadSchema } from '../types';

describe('validate', () => {
  it('returns success for valid data', () => {
    const result = validate(CreateStorePayloadSchema, {
      name: 'My Store',
      slug: 'my-store',
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      name: 'My Store',
      slug: 'my-store',
    });
  });

  it('returns errors for invalid data', () => {
    const result = validate(CreateStorePayloadSchema, {
      name: '', // empty name
      slug: 'INVALID SLUG!', // invalid slug format
    });

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors!.length).toBeGreaterThan(0);
  });
});

describe('validateMcpMessage', () => {
  const validMessage = {
    version: '1.0',
    messageId: 'msg-123',
    timestamp: '2025-01-01T00:00:00.000Z',
    action: 'create-store',
    payload: { name: 'Test', slug: 'test' },
  };

  it('validates a correct MCP message', () => {
    const result = validateMcpMessage(validMessage);
    expect(result.success).toBe(true);
    expect(result.data?.action).toBe('create-store');
  });

  it('rejects message without required fields', () => {
    const result = validateMcpMessage({ version: '1.0' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid timestamp format', () => {
    const result = validateMcpMessage({
      ...validMessage,
      timestamp: 'not-a-date',
    });
    expect(result.success).toBe(false);
  });
});

describe('validatePayload', () => {
  it('validates create-store payload', () => {
    const result = validatePayload('create-store', {
      name: 'Shoe Store',
      slug: 'shoe-store',
      theme: 'dark',
    });

    expect(result.success).toBe(true);
  });

  it('validates add-product payload', () => {
    const result = validatePayload('add-product', {
      storeId: 'store-1',
      product: {
        name: 'Sneakers',
        price: 99.99,
      },
    });

    expect(result.success).toBe(true);
  });

  it('rejects unknown action types', () => {
    const result = validatePayload('unknown-action', {});

    expect(result.success).toBe(false);
    expect(result.errors![0].message).toContain('Unknown action type');
  });

  it('rejects invalid create-store payload', () => {
    const result = validatePayload('create-store', {
      name: 'Valid Name',
      slug: 'INVALID SLUG WITH SPACES',
    });

    expect(result.success).toBe(false);
  });
});

describe('validateFullMessage', () => {
  it('validates both envelope and payload', () => {
    const result = validateFullMessage({
      version: '1.0',
      messageId: 'msg-1',
      timestamp: '2025-06-01T12:00:00.000Z',
      action: 'create-store',
      payload: {
        name: 'My Store',
        slug: 'my-store',
      },
    });

    expect(result.success).toBe(true);
    expect(result.payloadValidation?.success).toBe(true);
  });

  it('fails if envelope is invalid', () => {
    const result = validateFullMessage({
      version: '1.0',
      // missing required fields
    });

    expect(result.success).toBe(false);
    expect(result.payloadValidation).toBeUndefined();
  });

  it('envelope valid but payload invalid', () => {
    const result = validateFullMessage({
      version: '1.0',
      messageId: 'msg-2',
      timestamp: '2025-06-01T12:00:00.000Z',
      action: 'create-store',
      payload: {
        name: '', // invalid: empty
        slug: 'BAD SLUG',
      },
    });

    expect(result.success).toBe(true); // envelope is valid
    expect(result.payloadValidation?.success).toBe(false); // payload is not
  });
});
