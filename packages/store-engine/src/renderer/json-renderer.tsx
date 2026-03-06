import React from 'react';
import type { ComponentNode } from '../types';
import type { ComponentRegistry } from '../registry/component-registry';

export interface JsonRendererProps {
  /** The component tree to render (from store JSON) */
  node: ComponentNode;
  /** Registry that maps type strings → React components */
  registry: ComponentRegistry;
  /** Fallback component when a type is not found in the registry */
  fallback?: React.ComponentType<{ type: string }>;
}

/**
 * Default fallback — renders a warning box for unknown component types.
 */
function DefaultFallback({ type }: { type: string }) {
  return (
    <div
      style={{
        border: '2px dashed #DA1E28',
        padding: '8px 16px',
        margin: '4px',
        borderRadius: '4px',
        color: '#DA1E28',
        fontSize: '14px',
        fontFamily: 'monospace',
      }}
    >
      Unknown component type: <strong>{type}</strong>
    </div>
  );
}

/**
 * Renders a single ComponentNode recursively.
 *
 * This is the core of the store engine — it takes a JSON tree of components
 * and resolves each node to a real React component via the registry.
 */
function renderNode(
  node: ComponentNode,
  registry: ComponentRegistry,
  FallbackComponent: React.ComponentType<{ type: string }>
): React.ReactNode {
  const Component = registry.resolve(node.type);

  if (!Component) {
    return <FallbackComponent type={node.type} key={node.key} />;
  }

  const children = node.children?.map((child, index) =>
    renderNode(
      { ...child, key: child.key ?? `${node.type}-child-${index}` },
      registry,
      FallbackComponent
    )
  );

  return (
    <Component key={node.key} {...node.props}>
      {children && children.length > 0 ? children : undefined}
    </Component>
  );
}

/**
 * JsonRenderer — renders a JSON component tree using the registry.
 *
 * This is what turns AI-generated store structures into real React UIs.
 *
 * @example
 * ```tsx
 * import { JsonRenderer } from '@yourorg/store-engine';
 *
 * const storeLayout = {
 *   type: 'grid',
 *   props: {},
 *   children: [
 *     { type: 'card', props: { title: 'Product 1', subtitle: '$29' } },
 *     { type: 'card', props: { title: 'Product 2', subtitle: '$49' } },
 *   ],
 * };
 *
 * <JsonRenderer node={storeLayout} registry={registry} />
 * ```
 */
export function JsonRenderer({
  node,
  registry,
  fallback: FallbackComponent = DefaultFallback,
}: JsonRendererProps): React.ReactElement {
  return <>{renderNode(node, registry, FallbackComponent)}</>;
}
