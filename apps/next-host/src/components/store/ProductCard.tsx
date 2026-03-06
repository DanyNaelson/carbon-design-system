'use client';

import { Card, Button } from '@yourorg/design-system';

interface ProductCardProps {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  category?: string;
  inStock?: boolean;
  onAddToCart?: () => void;
}

export function ProductCard({
  name,
  description,
  price,
  currency = 'USD',
  category,
  inStock = true,
  onAddToCart,
}: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);

  return (
    <Card
      title={name}
      subtitle={formattedPrice}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div className="product-card__image" />
      {category && <span className="product-card__category">{category}</span>}
      {description && <p className="product-card__description">{description}</p>}
      <div className="product-card__actions">
        <Button
          variant={inStock ? 'primary' : 'ghost'}
          onClick={onAddToCart}
          disabled={!inStock}
        >
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </Card>
  );
}
