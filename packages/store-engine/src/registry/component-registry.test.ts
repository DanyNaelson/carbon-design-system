import { describe, it, expect } from 'vitest';
import { ComponentRegistry, createDefaultRegistry } from './component-registry';

// Mock components
const MockButton = () => null;
MockButton.displayName = 'MockButton';

const MockCard = () => null;
MockCard.displayName = 'MockCard';

const MockButtonV2 = () => null;
MockButtonV2.displayName = 'MockButtonV2';

describe('ComponentRegistry', () => {
  it('registers and resolves a component', () => {
    const registry = new ComponentRegistry();
    registry.register('button', MockButton);

    expect(registry.resolve('button')).toBe(MockButton);
  });

  it('returns undefined for unregistered types', () => {
    const registry = new ComponentRegistry();
    expect(registry.resolve('nonexistent')).toBeUndefined();
  });

  it('throws when registering duplicate type', () => {
    const registry = new ComponentRegistry();
    registry.register('button', MockButton);

    expect(() => registry.register('button', MockCard)).toThrow(
      'Component type "button" is already registered'
    );
  });

  it('allows override of existing registration', () => {
    const registry = new ComponentRegistry();
    registry.register('button', MockButton);
    registry.override('button', MockButtonV2);

    expect(registry.resolve('button')).toBe(MockButtonV2);
  });

  it('registers multiple components at once', () => {
    const registry = new ComponentRegistry();
    registry.registerAll({
      button: MockButton,
      card: MockCard,
    });

    expect(registry.resolve('button')).toBe(MockButton);
    expect(registry.resolve('card')).toBe(MockCard);
  });

  it('checks if a type is registered', () => {
    const registry = new ComponentRegistry();
    registry.register('button', MockButton);

    expect(registry.has('button')).toBe(true);
    expect(registry.has('nonexistent')).toBe(false);
  });

  it('returns all registered type names', () => {
    const registry = new ComponentRegistry();
    registry.register('button', MockButton);
    registry.register('card', MockCard);

    const types = registry.getRegisteredTypes();
    expect(types).toContain('button');
    expect(types).toContain('card');
    expect(types).toHaveLength(2);
  });

  it('unregisters a component', () => {
    const registry = new ComponentRegistry();
    registry.register('button', MockButton);

    expect(registry.unregister('button')).toBe(true);
    expect(registry.has('button')).toBe(false);
  });

  it('returns false when unregistering nonexistent type', () => {
    const registry = new ComponentRegistry();
    expect(registry.unregister('nonexistent')).toBe(false);
  });

  it('clears all registrations', () => {
    const registry = new ComponentRegistry();
    registry.registerAll({ button: MockButton, card: MockCard });

    registry.clear();
    expect(registry.getRegisteredTypes()).toHaveLength(0);
  });
});

describe('createDefaultRegistry', () => {
  it('creates a fresh registry instance', () => {
    const registry = createDefaultRegistry();
    expect(registry).toBeInstanceOf(ComponentRegistry);
    expect(registry.getRegisteredTypes()).toHaveLength(0);
  });
});
