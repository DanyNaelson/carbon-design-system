import type { Meta, StoryObj } from '@storybook/react';
import {
  brandColors,
  neutralColors,
  spacing,
  semanticSpacing,
  fontFamilies,
  fontWeights,
  fontSizes,
} from '@yourorg/design-system';

function ColorSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 6,
          background: value,
          border: '1px solid #e0e0e0',
          flexShrink: 0,
        }}
      />
      <div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
        <div style={{ fontSize: 12, color: '#525252', fontFamily: 'monospace' }}>{value}</div>
      </div>
    </div>
  );
}

function SpacingSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
      <div
        style={{
          width: parseInt(value) || 8,
          height: 24,
          background: '#6F2DBD',
          borderRadius: 3,
          flexShrink: 0,
          minWidth: 4,
        }}
      />
      <span style={{ fontSize: 13 }}>
        <strong>{name}</strong>
        <span style={{ color: '#525252', marginLeft: 8, fontFamily: 'monospace' }}>{value}</span>
      </span>
    </div>
  );
}

function TokensPanel() {
  return null;
}

const meta = {
  title: 'Tokens',
  component: TokensPanel,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TokensPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, maxWidth: 700 }}>
      <div>
        <h3 style={{ marginBottom: 16 }}>Brand Colors</h3>
        {Object.entries(brandColors).map(([name, value]) => (
          <ColorSwatch key={name} name={name} value={value} />
        ))}
      </div>
      <div>
        <h3 style={{ marginBottom: 16 }}>Neutral Colors</h3>
        {Object.entries(neutralColors).map(([name, value]) => (
          <ColorSwatch key={name} name={name} value={value} />
        ))}
      </div>
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div style={{ maxWidth: 500 }}>
      <h3 style={{ marginBottom: 16 }}>Base Spacing Scale</h3>
      {Object.entries(spacing).map(([name, value]) => (
        <SpacingSwatch key={name} name={name} value={value} />
      ))}
      <h3 style={{ marginTop: 32, marginBottom: 16 }}>Semantic Spacing</h3>
      {Object.entries(semanticSpacing).map(([name, value]) => (
        <SpacingSwatch key={name} name={name} value={value} />
      ))}
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div style={{ maxWidth: 600 }}>
      <h3 style={{ marginBottom: 16 }}>Font Families</h3>
      {Object.entries(fontFamilies).map(([name, value]) => (
        <div key={name} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: '#525252', marginBottom: 4 }}>{name}</div>
          <div style={{ fontFamily: value, fontSize: 18 }}>
            The quick brown fox jumps over the lazy dog
          </div>
        </div>
      ))}

      <h3 style={{ marginTop: 32, marginBottom: 16 }}>Font Weights</h3>
      {Object.entries(fontWeights).map(([name, value]) => (
        <div key={name} style={{ marginBottom: 8, fontWeight: value, fontSize: 16 }}>
          {name} ({value}) — The quick brown fox
        </div>
      ))}

      <h3 style={{ marginTop: 32, marginBottom: 16 }}>Font Sizes</h3>
      {Object.entries(fontSizes).map(([name, value]) => (
        <div key={name} style={{ marginBottom: 8, fontSize: value, lineHeight: 1.3 }}>
          <span style={{ color: '#525252', fontSize: 12, fontFamily: 'monospace', marginRight: 8 }}>
            {name} ({value})
          </span>
          Sample Text
        </div>
      ))}
    </div>
  ),
};
