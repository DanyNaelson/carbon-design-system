'use client';

import { useStore } from '@/components/StoreProvider';
import { Button } from '@yourorg/design-system';

export function ProductList() {
  const { store, dispatch } = useStore();

  return (
    <div className="product-list">
      {store.products.map((product) => {
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: product.currency,
        }).format(product.price);

        return (
          <div key={product.id} className="product-list__item">
            <div className="product-list__info">
              <h3 className="product-list__name">{product.name}</h3>
              {product.description && (
                <p className="product-list__desc">{product.description}</p>
              )}
              <span className="product-list__price">{formatted}</span>
            </div>
            <Button
              variant="primary"
              onClick={() => dispatch({ type: 'ADD_TO_CART', payload: { product } })}
              disabled={!product.inStock}
            >
              {product.inStock ? 'Add to Cart' : 'Sold Out'}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
