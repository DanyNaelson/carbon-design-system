import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider, useTheme, Button, Card, Grid, Column } from '@yourorg/design-system';

function ThemeDemo() {
  const { mode, toggleTheme } = useTheme();

  return (
    <div style={{ padding: 32, minWidth: 500 }}>
      <div style={{ marginBottom: 24 }}>
        <h2>Current Theme: {mode}</h2>
        <Button variant="primary" onClick={toggleTheme}>
          Toggle Theme
        </Button>
      </div>
      <Grid>
        <Column sm={4} md={4} lg={8}>
          <Card title="Product Card" subtitle="$49.99">
            <p>This card respects the current theme tokens.</p>
          </Card>
        </Column>
        <Column sm={4} md={4} lg={8}>
          <Card title="Another Card" subtitle="$29.99">
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </Card>
        </Column>
      </Grid>
    </div>
  );
}

function ThemeWrapper() {
  return null;
}

const meta = {
  title: 'Providers/ThemeProvider',
  component: ThemeWrapper,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ThemeWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightMode: Story = {
  render: () => (
    <ThemeProvider defaultMode="light">
      <ThemeDemo />
    </ThemeProvider>
  ),
};

export const DarkMode: Story = {
  render: () => (
    <ThemeProvider defaultMode="dark">
      <ThemeDemo />
    </ThemeProvider>
  ),
};

export const Interactive: Story = {
  name: 'Toggle Theme',
  render: () => (
    <ThemeProvider defaultMode="light">
      <ThemeDemo />
    </ThemeProvider>
  ),
};
