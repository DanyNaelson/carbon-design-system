import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@yourorg/design-system';

const meta = {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Card Title',
    subtitle: 'Subtitle text',
    children: <p>Card body content goes here.</p>,
  },
};

export const WithoutTitle: Story = {
  args: {
    children: <p>A card without a title — just content.</p>,
  },
};

export const Clickable: Story = {
  args: {
    title: 'Clickable Card',
    subtitle: 'Click me',
    children: <p>This card has an onClick handler.</p>,
  },
};

export const ProductCard: Story = {
  args: {
    title: 'Minimalist Backpack',
    subtitle: '$89.00',
    children: null,
  },
  render: () => (
    <Card title="Minimalist Backpack" subtitle="$89.00">
      <div
        style={{
          height: 160,
          background: 'linear-gradient(135deg, #e0e0e0, #c6c6c6)',
          borderRadius: 4,
          marginBottom: 12,
        }}
      />
      <p style={{ fontSize: 13, color: '#525252', lineHeight: 1.5 }}>
        Clean-line daypack in waterproof canvas. Fits a 15&quot; laptop.
      </p>
    </Card>
  ),
};

export const CardGrid: Story = {
  args: {
    children: null,
  },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 260px)', gap: 16 }}>
      <Card title="Product A" subtitle="$29">
        <p style={{ fontSize: 13, color: '#525252' }}>Short description</p>
      </Card>
      <Card title="Product B" subtitle="$49">
        <p style={{ fontSize: 13, color: '#525252' }}>Short description</p>
      </Card>
      <Card title="Product C" subtitle="$19">
        <p style={{ fontSize: 13, color: '#525252' }}>Short description</p>
      </Card>
    </div>
  ),
};
