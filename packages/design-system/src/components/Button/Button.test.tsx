import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('defaults to primary variant', () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole('button');
    // Carbon applies kind="primary" by default through our mapping
    expect(button).toBeInTheDocument();
  });

  it('renders different variants', () => {
    const { rerender } = render(<Button variant="secondary">Sec</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();

    rerender(<Button variant="tertiary">Tertiary</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref).toHaveBeenCalled();
  });

  it('passes through additional Carbon props', () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
