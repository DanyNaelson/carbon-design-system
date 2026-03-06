import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders title and subtitle', () => {
    render(
      <Card title="Product" subtitle="$29.99">
        Description
      </Card>
    );
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('renders as non-interactive tile by default', () => {
    const { container } = render(<Card>Static card</Card>);
    expect(container.querySelector('.ds-card')).toBeInTheDocument();
  });

  it('renders as clickable when onClick is provided', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Card onClick={handleClick}>Clickable</Card>);
    await user.click(screen.getByText('Clickable'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('applies inline styles', () => {
    const { container } = render(
      <Card style={{ maxWidth: '300px' }}>Styled</Card>
    );
    const card = container.querySelector('.ds-card');
    expect(card).toHaveStyle({ maxWidth: '300px' });
  });

  it('renders without title or subtitle', () => {
    const { container } = render(<Card>Just body</Card>);
    expect(container.querySelector('.ds-card__header')).not.toBeInTheDocument();
    expect(container.querySelector('.ds-card__body')).toBeInTheDocument();
  });
});
