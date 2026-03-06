import type { Meta, StoryObj } from '@storybook/react';
import { IntentTranslator, generateSystemPrompt } from '@yourorg/ai-bridge';
import { getAvailablePresets } from '@yourorg/store-engine';

function AiBridgeDocs() {
  return null;
}

const meta = {
  title: 'Packages/AiBridge',
  component: AiBridgeDocs,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof AiBridgeDocs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IntentTranslation: Story = {
  name: 'Intent Translation',
  render: () => {
    const translator = new IntentTranslator();

    const examples = [
      {
        label: 'Create Store',
        intent: {
          intent: 'create-store',
          storeName: 'Urban Shoes',
          storeDescription: 'Premium urban footwear',
          theme: 'dark',
          layout: 'hero-with-catalog',
          products: [
            { name: 'Classic Sneakers', price: 89.99, category: 'sneakers' },
            { name: 'Leather Boots', price: 149.99, category: 'boots' },
          ],
        },
      },
      {
        label: 'Add Product',
        intent: {
          intent: 'add-product',
          storeId: 'store-123',
          productName: 'Running Shoes',
          productDescription: 'Lightweight performance shoe',
          price: 119.99,
          category: 'running',
        },
      },
      {
        label: 'Update Layout',
        intent: {
          intent: 'update-layout',
          storeId: 'store-123',
          layoutPreset: 'two-column',
        },
      },
      {
        label: 'Update Theme',
        intent: {
          intent: 'update-theme',
          storeId: 'store-123',
          theme: 'dark',
        },
      },
    ];

    return (
      <div style={{ maxWidth: 700 }}>
        <h2 style={{ marginBottom: 16 }}>IntentTranslator</h2>
        <p style={{ marginBottom: 24, color: '#525252' }}>
          Converts AI intents into MCP-compatible payloads for the store engine.
        </p>
        {examples.map(({ label, intent }) => {
          const result = translator.translate(intent);
          return (
            <div key={label} style={{ marginBottom: 32 }}>
              <h3 style={{ marginBottom: 8 }}>{label}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Input</div>
                  <pre style={{ background: '#f4f4f4', padding: 12, borderRadius: 6, fontSize: 11, overflow: 'auto' }}>
                    {JSON.stringify(intent, null, 2)}
                  </pre>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Output</div>
                  <pre style={{ background: '#e8f0fe', padding: 12, borderRadius: 6, fontSize: 11, overflow: 'auto' }}>
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
};

export const SystemPrompt: Story = {
  name: 'System Prompt',
  render: () => {
    const prompt = generateSystemPrompt({
      availableComponents: ['button', 'card', 'grid', 'column', 'hero-banner', 'product-grid'],
      availableLayouts: getAvailablePresets(),
      storeContext: {
        storeId: 'demo-store',
        storeName: 'Urban Shoes',
        existingPages: ['home', 'about'],
        productCount: 12,
      },
    });

    return (
      <div style={{ maxWidth: 700 }}>
        <h2 style={{ marginBottom: 16 }}>Generated System Prompt</h2>
        <p style={{ marginBottom: 16, color: '#525252' }}>
          This prompt is sent to Gemini to ensure it responds with valid AiIntent JSON.
        </p>
        <pre
          style={{
            background: '#f4f4f4',
            padding: 16,
            borderRadius: 6,
            fontSize: 12,
            whiteSpace: 'pre-wrap',
            lineHeight: 1.5,
          }}
        >
          {prompt}
        </pre>
      </div>
    );
  },
};
