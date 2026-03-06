import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from './ThemeProvider';

function ThemeConsumer() {
  const { mode, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-mode">{mode}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  it('renders children correctly', () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Hello</div>
      </ThemeProvider>
    );
    expect(screen.getByTestId('child')).toHaveTextContent('Hello');
  });

  it('defaults to light mode', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
  });

  it('respects defaultMode prop', () => {
    render(
      <ThemeProvider defaultMode="dark">
        <ThemeConsumer />
      </ThemeProvider>
    );
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
  });

  it('toggles theme mode', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
    await user.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
    await user.click(screen.getByText('Toggle'));
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
  });

  it('throws error when useTheme is used outside ThemeProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<ThemeConsumer />);
    }).toThrow('useTheme must be used within a <ThemeProvider>');

    consoleSpy.mockRestore();
  });
});
