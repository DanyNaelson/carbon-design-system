import { ComponentRegistry } from '@yourorg/store-engine';
import { Button, Card, Grid, Column } from '@yourorg/design-system';
import { ProductCard } from '@/components/store/ProductCard';
import { HeroBanner } from '@/components/store/HeroBanner';
import { StoreHeader } from '@/components/store/StoreHeader';
import { StoreFooter } from '@/components/store/StoreFooter';
import { ProductGrid } from '@/components/store/ProductGrid';
import { ProductList } from '@/components/store/ProductList';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function createAppRegistry(): ComponentRegistry {
  const registry = new ComponentRegistry();

  const components: Record<string, any> = {
    button: Button,
    card: Card,
    grid: Grid,
    column: Column,
    'product-card': ProductCard,
    'hero-banner': HeroBanner,
    'store-header': StoreHeader,
    'store-footer': StoreFooter,
    'product-grid': ProductGrid,
    'product-list': ProductList,
  };

  registry.registerAll(components);
  return registry;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
