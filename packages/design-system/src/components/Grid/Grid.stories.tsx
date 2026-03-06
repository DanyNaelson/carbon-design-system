import type { Meta, StoryObj } from '@storybook/react';
import { Grid, Column } from './Grid';

const meta: Meta<typeof Grid> = {
  title: 'Components/Grid',
  component: Grid,
  args: {
    children: null,
  },
  argTypes: {
    narrow: { control: 'boolean' },
    condensed: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    flexGrid: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: 1200 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

function Cell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      style={{
        background: '#e0e0e0',
        padding: '16px',
        borderRadius: 4,
        textAlign: 'center',
        fontSize: 14,
      }}
    >
      {children}
    </div>
  );
}

export const Default: Story = {
  render: (args) => (
    <Grid {...args}>
      <Column sm={4} md={4} lg={4}>
        <Cell>lg=4</Cell>
      </Column>
      <Column sm={4} md={4} lg={4}>
        <Cell>lg=4</Cell>
      </Column>
      <Column sm={4} md={4} lg={4}>
        <Cell>lg=4</Cell>
      </Column>
      <Column sm={4} md={4} lg={4}>
        <Cell>lg=4</Cell>
      </Column>
    </Grid>
  ),
};

export const TwoColumn: Story = {
  render: (args) => (
    <Grid {...args}>
      <Column sm={4} md={4} lg={8}>
        <Cell>Main (lg=8)</Cell>
      </Column>
      <Column sm={4} md={4} lg={8}>
        <Cell>Sidebar (lg=8)</Cell>
      </Column>
    </Grid>
  ),
};

export const ThreeColumn: Story = {
  render: (args) => (
    <Grid {...args}>
      <Column sm={4} md={4} lg={5}>
        <Cell>Column 1 (lg=5)</Cell>
      </Column>
      <Column sm={4} md={4} lg={5}>
        <Cell>Column 2 (lg=5)</Cell>
      </Column>
      <Column sm={4} md={4} lg={6}>
        <Cell>Column 3 (lg=6)</Cell>
      </Column>
    </Grid>
  ),
};

export const Narrow: Story = {
  args: { narrow: true },
  render: (args) => (
    <Grid {...args}>
      <Column lg={8}><Cell>Narrow Left</Cell></Column>
      <Column lg={8}><Cell>Narrow Right</Cell></Column>
    </Grid>
  ),
};

export const Condensed: Story = {
  args: { condensed: true },
  render: (args) => (
    <Grid {...args}>
      <Column lg={4}><Cell>1</Cell></Column>
      <Column lg={4}><Cell>2</Cell></Column>
      <Column lg={4}><Cell>3</Cell></Column>
      <Column lg={4}><Cell>4</Cell></Column>
    </Grid>
  ),
};
