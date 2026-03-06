import type { Meta, StoryObj } from '@storybook/react';
import {
  StoreBuilder,
  generateLayout,
  getAvailablePresets,
  type LayoutPreset,
} from '@yourorg/store-engine';

function StoreEngineDocs() {
  return null;
}

const meta = {
  title: 'Packages/StoreEngine',
  component: StoreEngineDocs,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof StoreEngineDocs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LayoutPresets: Story = {
  name: 'Layout Presets',
  render: () => {
    const presets = getAvailablePresets();

    return (
      <div style={{ maxWidth: 700 }}>
        <h2 style={{ marginBottom: 16 }}>Available Layout Presets</h2>
        <p style={{ marginBottom: 24, color: '#525252' }}>
          These presets generate pre-configured component trees for the JsonRenderer.
        </p>
        {presets.map((preset) => {
          const layout = generateLayout(preset);
          return (
            <div key={preset} style={{ marginBottom: 24 }}>
              <h3 style={{ marginBottom: 8, fontFamily: 'monospace' }}>{preset}</h3>
              <pre
                style={{
                  background: '#f4f4f4',
                  padding: 16,
                  borderRadius: 6,
                  fontSize: 12,
                  overflow: 'auto',
                  maxHeight: 300,
                }}
              >
                {JSON.stringify(layout, null, 2)}
              </pre>
            </div>
          );
        })}
      </div>
    );
  },
};

export const BuilderExample: Story = {
  name: 'StoreBuilder',
  render: () => {
    const store = new StoreBuilder('demo-store', 'Demo Store')
      .setDescription('A demo store built with StoreBuilder')
      .setTheme('dark')
      .addProduct({
        id: 'p1',
        name: 'Classic Tee',
        description: 'Organic cotton crew neck',
        price: 35,
        category: 'apparel',
      })
      .addProduct({
        id: 'p2',
        name: 'Canvas Sneakers',
        description: 'Vulcanized rubber sole',
        price: 79,
        category: 'footwear',
      })
      .addPage('home', 'Home', 'hero-with-catalog')
      .buildDraft();

    return (
      <div style={{ maxWidth: 700 }}>
        <h2 style={{ marginBottom: 16 }}>StoreBuilder Output</h2>
        <p style={{ marginBottom: 24, color: '#525252' }}>
          Fluent API for building store definitions programmatically.
        </p>
        <pre
          style={{
            background: '#f4f4f4',
            padding: 16,
            borderRadius: 6,
            fontSize: 12,
            overflow: 'auto',
            maxHeight: 500,
          }}
        >
          {JSON.stringify(store, null, 2)}
        </pre>
      </div>
    );
  },
};
