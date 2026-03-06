import { describe, it, expect } from 'vitest';
import {
  storeReducer,
  createInitialState,
  selectCartItemCount,
  selectCartTotal,
  selectIsInCart,
} from './store-machine';
import type { Product, StoreState } from '../types';

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Test Sneakers',
  price: 99.99,
  currency: 'USD',
  images: [],
  tags: [],
  variants: [],
  inStock: true,
};

const mockProduct2: Product = {
  id: 'prod-2',
  name: 'Test Hat',
  price: 24.99,
  currency: 'USD',
  images: [],
  tags: [],
  variants: [],
  inStock: true,
};

describe('storeReducer', () => {
  describe('NAVIGATE', () => {
    it('changes current page and closes menu', () => {
      const state = createInitialState();
      state.uiState.menuOpen = true;

      const newState = storeReducer(state, {
        type: 'NAVIGATE',
        payload: { pageSlug: 'catalog' },
      });

      expect(newState.currentPage).toBe('catalog');
      expect(newState.uiState.menuOpen).toBe(false);
    });
  });

  describe('ADD_TO_CART', () => {
    it('adds a new product to the cart', () => {
      const state = createInitialState();
      const newState = storeReducer(state, {
        type: 'ADD_TO_CART',
        payload: { product: mockProduct },
      });

      expect(newState.cart).toHaveLength(1);
      expect(newState.cart[0].product.id).toBe('prod-1');
      expect(newState.cart[0].quantity).toBe(1);
    });

    it('increments quantity if product already in cart', () => {
      let state = createInitialState();
      state = storeReducer(state, {
        type: 'ADD_TO_CART',
        payload: { product: mockProduct },
      });
      state = storeReducer(state, {
        type: 'ADD_TO_CART',
        payload: { product: mockProduct, quantity: 2 },
      });

      expect(state.cart).toHaveLength(1);
      expect(state.cart[0].quantity).toBe(3);
    });

    it('treats different variants as separate items', () => {
      let state = createInitialState();
      state = storeReducer(state, {
        type: 'ADD_TO_CART',
        payload: { product: mockProduct, variantId: 'red' },
      });
      state = storeReducer(state, {
        type: 'ADD_TO_CART',
        payload: { product: mockProduct, variantId: 'blue' },
      });

      expect(state.cart).toHaveLength(2);
    });
  });

  describe('REMOVE_FROM_CART', () => {
    it('removes a product from the cart', () => {
      let state = createInitialState();
      state = storeReducer(state, {
        type: 'ADD_TO_CART',
        payload: { product: mockProduct },
      });
      state = storeReducer(state, {
        type: 'REMOVE_FROM_CART',
        payload: { productId: 'prod-1' },
      });

      expect(state.cart).toHaveLength(0);
    });
  });

  describe('UPDATE_QUANTITY', () => {
    it('updates the quantity of a cart item', () => {
      let state = createInitialState();
      state = storeReducer(state, {
        type: 'ADD_TO_CART',
        payload: { product: mockProduct },
      });
      state = storeReducer(state, {
        type: 'UPDATE_QUANTITY',
        payload: { productId: 'prod-1', quantity: 5 },
      });

      expect(state.cart[0].quantity).toBe(5);
    });

    it('removes item when quantity is set to 0', () => {
      let state = createInitialState();
      state = storeReducer(state, {
        type: 'ADD_TO_CART',
        payload: { product: mockProduct },
      });
      state = storeReducer(state, {
        type: 'UPDATE_QUANTITY',
        payload: { productId: 'prod-1', quantity: 0 },
      });

      expect(state.cart).toHaveLength(0);
    });
  });

  describe('CLEAR_CART', () => {
    it('removes all items from the cart', () => {
      let state = createInitialState();
      state = storeReducer(state, {
        type: 'ADD_TO_CART',
        payload: { product: mockProduct },
      });
      state = storeReducer(state, {
        type: 'ADD_TO_CART',
        payload: { product: mockProduct2 },
      });
      state = storeReducer(state, { type: 'CLEAR_CART' });

      expect(state.cart).toHaveLength(0);
    });
  });

  describe('UI toggles', () => {
    it('toggles cart open/close', () => {
      let state = createInitialState();
      state = storeReducer(state, { type: 'TOGGLE_CART' });
      expect(state.uiState.cartOpen).toBe(true);
      state = storeReducer(state, { type: 'TOGGLE_CART' });
      expect(state.uiState.cartOpen).toBe(false);
    });

    it('toggles search', () => {
      let state = createInitialState();
      state = storeReducer(state, { type: 'TOGGLE_SEARCH' });
      expect(state.uiState.searchOpen).toBe(true);
    });

    it('toggles menu', () => {
      let state = createInitialState();
      state = storeReducer(state, { type: 'TOGGLE_MENU' });
      expect(state.uiState.menuOpen).toBe(true);
    });
  });
});

describe('Selectors', () => {
  function stateWithCart(): StoreState {
    let state = createInitialState();
    state = storeReducer(state, {
      type: 'ADD_TO_CART',
      payload: { product: mockProduct, quantity: 2 },
    });
    state = storeReducer(state, {
      type: 'ADD_TO_CART',
      payload: { product: mockProduct2, quantity: 3 },
    });
    return state;
  }

  it('selectCartItemCount returns total quantity', () => {
    expect(selectCartItemCount(stateWithCart())).toBe(5);
  });

  it('selectCartTotal returns correct total', () => {
    const total = selectCartTotal(stateWithCart());
    expect(total).toBeCloseTo(99.99 * 2 + 24.99 * 3);
  });

  it('selectIsInCart returns true for items in cart', () => {
    expect(selectIsInCart(stateWithCart(), 'prod-1')).toBe(true);
    expect(selectIsInCart(stateWithCart(), 'prod-99')).toBe(false);
  });
});
