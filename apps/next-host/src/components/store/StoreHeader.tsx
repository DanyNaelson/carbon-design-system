'use client';

import { useStore } from '@/components/StoreProvider';
import { selectCartItemCount } from '@yourorg/store-engine';

export function StoreHeader() {
  const { store, state, dispatch } = useStore();
  const cartCount = selectCartItemCount(state);

  return (
    <header className="store-header">
      <div className="store-header__left">
        <h2 className="store-header__brand">{store.name}</h2>
        <nav className="store-header__nav">
          {store.pages.map((page) => (
            <button
              key={page.slug}
              className={`store-header__link ${state.currentPage === page.slug ? 'store-header__link--active' : ''}`}
              onClick={() => dispatch({ type: 'NAVIGATE', payload: { pageSlug: page.slug } })}
            >
              {page.title}
            </button>
          ))}
        </nav>
      </div>
      <div className="store-header__right">
        <button
          className="store-header__cart-btn"
          onClick={() => dispatch({ type: 'TOGGLE_CART' })}
        >
          Cart {cartCount > 0 && <span className="store-header__badge">{cartCount}</span>}
        </button>
      </div>
    </header>
  );
}
