// ─── Registry ───
export { ComponentRegistry, createDefaultRegistry } from './registry/component-registry';

// ─── Renderer ───
export { JsonRenderer, type JsonRendererProps } from './renderer/json-renderer';

// ─── Layout ───
export {
  generateLayout,
  getAvailablePresets,
  type LayoutPreset,
} from './layout/layout-system';

// ─── Builder ───
export { StoreBuilder } from './builder/store-builder';

// ─── State Machine ───
export {
  storeReducer,
  createInitialState,
  selectCartItemCount,
  selectCartTotal,
  selectIsInCart,
} from './state/store-machine';

// ─── Types & Schemas ───
export {
  ProductSchema,
  ComponentNodeSchema,
  PageSchema,
  StoreSchema,
  type Product,
  type ComponentNode,
  type Page,
  type Store,
  type CartItem,
  type StoreState,
  type StoreAction,
} from './types';
