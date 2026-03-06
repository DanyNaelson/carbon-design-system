import type { Meta, StoryObj } from '@storybook/react';
import {
  validateFullMessage,
  normalizeProduct,
  normalizeSlug,
  normalizePrice,
  checkCompatibility,
  getContractVersion,
  createVersionHeader,
  CONTRACT_VERSION,
} from '@yourorg/mcp-adapter';

function McpAdapterDocs() {
  return null;
}

const meta = {
  title: 'Packages/McpAdapter',
  component: McpAdapterDocs,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof McpAdapterDocs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Validation: Story = {
  render: () => {
    const validResult = validateFullMessage({
      version: CONTRACT_VERSION,
      action: 'create-store',
      payload: {
        name: 'Test Store',
        slug: 'test-store',
      },
    });

    const invalidResult = validateFullMessage({
      version: '0.0.0',
      action: '',
      payload: null,
    });

    return (
      <div style={{ maxWidth: 700 }}>
        <h2 style={{ marginBottom: 16 }}>Message Validation</h2>
        <p style={{ marginBottom: 24, color: '#525252' }}>
          Validates MCP messages against the contract schema.
        </p>

        <h3 style={{ marginBottom: 8 }}>Valid Message</h3>
        <pre style={{ background: '#e6f4ea', padding: 12, borderRadius: 6, fontSize: 12, marginBottom: 24 }}>
          {JSON.stringify(validResult, null, 2)}
        </pre>

        <h3 style={{ marginBottom: 8 }}>Invalid Message</h3>
        <pre style={{ background: '#fce8e6', padding: 12, borderRadius: 6, fontSize: 12 }}>
          {JSON.stringify(invalidResult, null, 2)}
        </pre>
      </div>
    );
  },
};

export const Normalization: Story = {
  render: () => {
    const examples = [
      { label: 'normalizeSlug', input: 'My Awesome Store!', output: normalizeSlug('My Awesome Store!') },
      { label: 'normalizePrice (99.999)', input: 99.999, output: normalizePrice(99.999) },
      { label: 'normalizePrice (-5)', input: -5, output: normalizePrice(-5) },
    ];

    const productExample = normalizeProduct({
      name: '  Cool Sneakers  ',
      price: 89.995,
      description: '  Premium shoes  ',
    });

    return (
      <div style={{ maxWidth: 700 }}>
        <h2 style={{ marginBottom: 16 }}>Normalization Utilities</h2>

        <div style={{ marginBottom: 32 }}>
          {examples.map((ex) => (
            <div key={ex.label} style={{ marginBottom: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
              <code style={{ fontSize: 13, fontWeight: 600 }}>{ex.label}</code>
              <span style={{ color: '#525252' }}>{JSON.stringify(ex.input)}</span>
              <span>&rarr;</span>
              <code style={{ color: '#6F2DBD' }}>{JSON.stringify(ex.output)}</code>
            </div>
          ))}
        </div>

        <h3 style={{ marginBottom: 8 }}>normalizeProduct</h3>
        <pre style={{ background: '#f4f4f4', padding: 12, borderRadius: 6, fontSize: 12 }}>
          {JSON.stringify(productExample, null, 2)}
        </pre>
      </div>
    );
  },
};

export const Versioning: Story = {
  render: () => {
    const version = getContractVersion();
    const header = createVersionHeader();
    const compatible = checkCompatibility(CONTRACT_VERSION);
    const incompatible = checkCompatibility('0.0.1');

    return (
      <div style={{ maxWidth: 700 }}>
        <h2 style={{ marginBottom: 16 }}>Contract Versioning</h2>
        <p style={{ marginBottom: 24, color: '#525252' }}>
          MCP adapter enforces semantic versioning for contracts between frontend and AI backend.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <h3 style={{ marginBottom: 8 }}>Current Version</h3>
            <code style={{ fontSize: 18, color: '#6F2DBD' }}>{version}</code>
          </div>
          <div>
            <h3 style={{ marginBottom: 8 }}>Version Header</h3>
            <pre style={{ background: '#f4f4f4', padding: 12, borderRadius: 6, fontSize: 12 }}>
              {JSON.stringify(header, null, 2)}
            </pre>
          </div>
          <div>
            <h3 style={{ marginBottom: 8 }}>Compatible Check</h3>
            <pre style={{ background: '#e6f4ea', padding: 12, borderRadius: 6, fontSize: 12 }}>
              {JSON.stringify(compatible, null, 2)}
            </pre>
          </div>
          <div>
            <h3 style={{ marginBottom: 8 }}>Incompatible Check</h3>
            <pre style={{ background: '#fce8e6', padding: 12, borderRadius: 6, fontSize: 12 }}>
              {JSON.stringify(incompatible, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  },
};
