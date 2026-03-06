import type { StoreState, StoreAction, CartItem } from '../types';

/**
 * Initial state for a store instance.
 */
export function createInitialState(initialPage = 'home'): StoreState {
  return {
    currentPage: initialPage,
    cart: [],
    uiState: {
      cartOpen: false,
      searchOpen: false,
      menuOpen: false,
    },
  };
}

/**
 * Filter out a specific cart item by productId and variantId.
 * Shared helper to avoid code duplication in reducer cases.
 */
function removeCartItem(
  cart: CartItem[],
  productId: string,
  variantId?: string
): CartItem[] {
  return cart.filter(
    (item) =>
      !(item.product.id === productId && item.variantId === variantId)
  );
}

/**
 * Pure reducer for store state management.
 * This is the state machine that drives the store's runtime behavior.
 *
 * Can be used with React's useReducer or any state management solution.
 *
 * @example
 * ```tsx
 * import { storeReducer, createInitialState } from '@yourorg/store-engine';
 *
 * function StoreApp() {
 *   const [state, dispatch] = useReducer(storeReducer, createInitialState());
 *
 *   return (
 *     <StoreContext.Provider value={{ state, dispatch }}>
 *       <StorePage />
 *     </StoreContext.Provider>
 *   );
 * }
 * ```
 */
export function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case 'NAVIGATE':
      return {
        ...state,
        currentPage: action.payload.pageSlug,
        uiState: { ...state.uiState, menuOpen: false },
      };

    case 'ADD_TO_CART': {
      const { product, quantity = 1, variantId } = action.payload;
      const existingIndex = state.cart.findIndex(
        (item) => item.product.id === product.id && item.variantId === variantId
      );

      if (existingIndex >= 0) {
        // Increment quantity of existing item
        const updatedCart = [...state.cart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + quantity,
        };
        return { ...state, cart: updatedCart };
      }

      // Add new item
      const newItem: CartItem = { product, quantity, variantId };
      return { ...state, cart: [...state.cart, newItem] };
    }

    case 'REMOVE_FROM_CART': {
      const { productId, variantId } = action.payload;
      return {
        ...state,
        cart: removeCartItem(state.cart, productId, variantId),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity, variantId } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          cart: removeCartItem(state.cart, productId, variantId),
        };
      }

      return {
        ...state,
        cart: state.cart.map((item) =>
          item.product.id === productId && item.variantId === variantId
            ? { ...item, quantity }
            : item
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, cart: [] };

    case 'TOGGLE_CART':
      return {
        ...state,
        uiState: { ...state.uiState, cartOpen: !state.uiState.cartOpen },
      };

    case 'TOGGLE_SEARCH':
      return {
        ...state,
        uiState: { ...state.uiState, searchOpen: !state.uiState.searchOpen },
      };

    case 'TOGGLE_MENU':
      return {
        ...state,
        uiState: { ...state.uiState, menuOpen: !state.uiState.menuOpen },
      };
  }
}

// ─── Selectors ───

/** Get total number of items in cart */
export function selectCartItemCount(state: StoreState): number {
  return state.cart.reduce((total, item) => total + item.quantity, 0);
}

/** Get cart total price */
export function selectCartTotal(state: StoreState): number {
  return state.cart.reduce((total, item) => {
    const price = item.product.price;
    return total + price * item.quantity;
  }, 0);
}

/** Check if a product is in the cart */
export function selectIsInCart(
  state: StoreState,
  productId: string,
  variantId?: string
): boolean {
  return state.cart.some(
    (item) => item.product.id === productId && item.variantId === variantId
  );
}
