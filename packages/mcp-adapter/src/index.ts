// ─── Validator ───
export {
  validate,
  validateMcpMessage,
  validatePayload,
  validateFullMessage,
  type ValidationResult,
} from './validator/schema-validator';

// ─── Normalizer ───
export {
  normalizeProduct,
  normalizeStorePayload,
  normalizeSlug,
  normalizePrice,
} from './normalizer/normalizer';

// ─── Contracts / Versioning ───
export {
  checkCompatibility,
  getContractVersion,
  createVersionHeader,
  type VersionCheck,
} from './contracts/versioning';

// ─── Types & Schemas ───
export {
  CONTRACT_VERSION,
  McpMessageSchema,
  CreateStorePayloadSchema,
  AddProductPayloadSchema,
  UpdateLayoutPayloadSchema,
  McpResponseSchema,
  type McpMessage,
  type CreateStorePayload,
  type AddProductPayload,
  type UpdateLayoutPayload,
  type McpResponse,
} from './types';
