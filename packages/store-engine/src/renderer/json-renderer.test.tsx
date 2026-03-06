import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JsonRenderer } from './json-renderer';
import { ComponentRegistry } from '../registry/component-registry';
import type { ComponentNode } from '../types';

// Mock components for testing
function MockContainer({ children }: { children?: React.ReactNode }) {
  return <div data-testid="container">{children}</div>;
}

function MockHeading({ text }: { text: string }) {
  return <h1 data-testid="heading">{text}</h1>;
}

function MockProductCard({ name, price }: { name: string; price: number }) {
  return (
    <div data-testid="product-card">
      <span>{name}</span>
      <span>${price}</span>
    </div>
  );
}

function createTestRegistry(): ComponentRegistry {
  const registry = new ComponentRegistry();
  registry.register('container', MockContainer);
  registry.register('heading', MockHeading);
  registry.register('product-card', MockProductCard);
  return registry;
}

describe('JsonRenderer', () => {
  it('renders a simple component node', () => {
    const registry = createTestRegistry();
    const node: ComponentNode = {
      type: 'heading',
      props: { text: 'Welcome' },
    };

    render(<JsonRenderer node={node} registry={registry} />);
    expect(screen.getByTestId('heading')).toHaveTextContent('Welcome');
  });

  it('renders nested component trees', () => {
    const registry = createTestRegistry();
    const node: ComponentNode = {
      type: 'container',
      props: {},
      children: [
        { type: 'heading', props: { text: 'Store Title' }, key: 'h1' },
        { type: 'product-card', props: { name: 'Shoes', price: 99.99 }, key: 'p1' },
        { type: 'product-card', props: { name: 'Hat', price: 24.99 }, key: 'p2' },
      ],
    };

    render(<JsonRenderer node={node} registry={registry} />);

    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('heading')).toHaveTextContent('Store Title');
    expect(screen.getAllByTestId('product-card')).toHaveLength(2);
    expect(screen.getByText('Shoes')).toBeInTheDocument();
    expect(screen.getByText('Hat')).toBeInTheDocument();
  });

  it('renders fallback for unknown component types', () => {
    const registry = createTestRegistry();
    const node: ComponentNode = {
      type: 'unknown-widget',
      props: {},
    };

    render(<JsonRenderer node={node} registry={registry} />);
    expect(screen.getByText(/unknown-widget/i)).toBeInTheDocument();
  });

  it('uses custom fallback component', () => {
    const registry = createTestRegistry();
    const CustomFallback = ({ type }: { type: string }) => (
      <div data-testid="custom-fallback">Missing: {type}</div>
    );

    const node: ComponentNode = {
      type: 'nonexistent',
      props: {},
    };

    render(<JsonRenderer node={node} registry={registry} fallback={CustomFallback} />);
    expect(screen.getByTestId('custom-fallback')).toHaveTextContent('Missing: nonexistent');
  });

  it('handles deeply nested structures', () => {
    const registry = createTestRegistry();
    const node: ComponentNode = {
      type: 'container',
      props: {},
      children: [
        {
          type: 'container',
          props: {},
          key: 'inner',
          children: [
            { type: 'heading', props: { text: 'Deep heading' }, key: 'deep' },
          ],
        },
      ],
    };

    render(<JsonRenderer node={node} registry={registry} />);
    expect(screen.getByText('Deep heading')).toBeInTheDocument();
    expect(screen.getAllByTestId('container')).toHaveLength(2);
  });

  it('renders node with no children', () => {
    const registry = createTestRegistry();
    const node: ComponentNode = {
      type: 'product-card',
      props: { name: 'Solo Product', price: 50 },
    };

    render(<JsonRenderer node={node} registry={registry} />);
    expect(screen.getByText('Solo Product')).toBeInTheDocument();
  });
});
