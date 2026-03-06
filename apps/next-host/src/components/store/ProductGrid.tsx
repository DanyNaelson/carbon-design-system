'use client';

import { Grid, Column } from '@yourorg/design-system';
import { useStore } from '@/components/StoreProvider';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  columns?: number;
}

export function ProductGrid({ columns = 3 }: ProductGridProps) {
  const { store, dispatch } = useStore();
  const span = Math.floor(16 / columns);

  return (
    <div className="product-grid">
      <h2 className="product-grid__heading">Products</h2>
      <Grid>
        {store.products.map((product) => (
          <Column key={product.id} sm={4} md={4} lg={span}>
            <ProductCard
              name={product.name}
              description={product.description}
              price={product.price}
              currency={product.currency}
              category={product.category}
              inStock={product.inStock}
              onAddToCart={() =>
                dispatch({ type: 'ADD_TO_CART', payload: { product } })
              }
            />
          </Column>
        ))}
      </Grid>
    </div>
  );
}
