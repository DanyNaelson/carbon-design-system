import type { ComponentType } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponentType = ComponentType<any>;

/**
 * ComponentRegistry — maps string type names to actual React components.
 *
 * This is the bridge between the JSON store definition and real rendered components.
 * The AI returns component types as strings; the registry resolves them to React components.
 *
 * @example
 * ```ts
 * import { ComponentRegistry } from '@yourorg/store-engine';
 * import { Button, Card } from '@yourorg/design-system';
 *
 * const registry = new ComponentRegistry();
 * registry.register('button', Button);
 * registry.register('card', Card);
 *
 * // Later, the renderer uses:
 * const Component = registry.resolve('button'); // → Button component
 * ```
 */
export class ComponentRegistry {
  private components = new Map<string, AnyComponentType>();

  /**
   * Register a component under a type name.
   * @throws if the type name is already registered (use `override` to replace)
   */
  register(type: string, component: AnyComponentType): void {
    if (this.components.has(type)) {
      throw new Error(
        `Component type "${type}" is already registered. Use override() to replace it.`
      );
    }
    this.components.set(type, component);
  }

  /**
   * Register multiple components at once.
   */
  registerAll(components: Record<string, AnyComponentType>): void {
    for (const [type, component] of Object.entries(components)) {
      this.register(type, component);
    }
  }

  /**
   * Override an existing registration (or register if new).
   */
  override(type: string, component: AnyComponentType): void {
    this.components.set(type, component);
  }

  /**
   * Resolve a component type string to the actual React component.
   * @returns The component, or undefined if not found
   */
  resolve(type: string): AnyComponentType | undefined {
    return this.components.get(type);
  }

  /**
   * Check if a component type is registered.
   */
  has(type: string): boolean {
    return this.components.has(type);
  }

  /**
   * Get all registered type names.
   */
  getRegisteredTypes(): string[] {
    return Array.from(this.components.keys());
  }

  /**
   * Remove a component registration.
   */
  unregister(type: string): boolean {
    return this.components.delete(type);
  }

  /**
   * Clear all registrations.
   */
  clear(): void {
    this.components.clear();
  }
}

/**
 * Create a pre-configured registry with the default design system components.
 * Consumers can extend this with their own custom components.
 */
export function createDefaultRegistry(): ComponentRegistry {
  return new ComponentRegistry();
}
