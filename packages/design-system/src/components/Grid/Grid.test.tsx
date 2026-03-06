import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Grid, Column } from './Grid';

describe('Grid', () => {
  it('renders children in a grid', () => {
    render(
      <Grid>
        <Column lg={8}>
          <span data-testid="col-1">Column 1</span>
        </Column>
        <Column lg={4}>
          <span data-testid="col-2">Column 2</span>
        </Column>
      </Grid>
    );

    expect(screen.getByTestId('col-1')).toHaveTextContent('Column 1');
    expect(screen.getByTestId('col-2')).toHaveTextContent('Column 2');
  });

  it('renders with narrow variant', () => {
    const { container } = render(
      <Grid narrow>
        <Column lg={16}>Content</Column>
      </Grid>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with condensed variant', () => {
    const { container } = render(
      <Grid condensed>
        <Column lg={16}>Content</Column>
      </Grid>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Grid className="my-grid">
        <Column lg={16}>Content</Column>
      </Grid>
    );
    expect(container.querySelector('.my-grid')).toBeInTheDocument();
  });
});

describe('Column', () => {
  it('renders children', () => {
    render(
      <Grid>
        <Column lg={8}>
          <p>Column content</p>
        </Column>
      </Grid>
    );
    expect(screen.getByText('Column content')).toBeInTheDocument();
  });

  it('accepts responsive breakpoint props', () => {
    render(
      <Grid>
        <Column sm={4} md={4} lg={8} xlg={8} max={8}>
          Responsive
        </Column>
      </Grid>
    );
    expect(screen.getByText('Responsive')).toBeInTheDocument();
  });
});
