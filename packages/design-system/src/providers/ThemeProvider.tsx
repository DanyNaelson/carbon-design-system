import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Theme } from '@carbon/react';
import { lightTheme } from '../themes/light';
import { darkTheme } from '../themes/dark';

type ThemeMode = 'light' | 'dark';
type CarbonThemeName = 'white' | 'g10' | 'g90' | 'g100';

interface ThemeContextValue {
  /** Current active theme mode */
  mode: ThemeMode;
  /** Toggle between light and dark */
  toggleTheme: () => void;
  /** Set a specific theme mode */
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/** Maps our theme modes to Carbon's base theme names */
const carbonBaseTheme: Record<ThemeMode, CarbonThemeName> = {
  light: 'white',
  dark: 'g100',
};

export interface ThemeProviderProps {
  /** Initial theme mode */
  defaultMode?: ThemeMode;
  /** Custom theme overrides — merged on top of the selected theme */
  overrides?: Record<string, string>;
  children: React.ReactNode;
}

/**
 * Converts token overrides into CSS custom property format for Carbon.
 * Carbon uses `--cds-<token-name>` as the CSS custom property convention.
 */
function tokensToCssVars(tokens: Record<string, string>): React.CSSProperties {
  const cssVars: Record<string, string> = {};
  for (const [key, value] of Object.entries(tokens)) {
    cssVars[`--cds-${key}`] = value;
  }
  return cssVars as React.CSSProperties;
}

/**
 * ThemeProvider wraps Carbon's Theme component with your brand tokens.
 * Use this at the root of every Micro Frontend to ensure consistent theming.
 *
 * It applies:
 * 1. A Carbon base theme (white / g100)
 * 2. Brand token overrides via CSS custom properties
 *
 * @example
 * ```tsx
 * import { ThemeProvider } from '@yourorg/design-system';
 *
 * function App() {
 *   return (
 *     <ThemeProvider defaultMode="light">
 *       <YourApp />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */
export function ThemeProvider({
  defaultMode = 'light',
  overrides = {},
  children,
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);

  const toggleTheme = useCallback(() => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const cssVars = useMemo(() => {
    const baseTokens = mode === 'light' ? lightTheme : darkTheme;
    return tokensToCssVars({ ...baseTokens, ...overrides });
  }, [mode, overrides]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({ mode, toggleTheme, setTheme: setMode }),
    [mode, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <Theme theme={carbonBaseTheme[mode]}>
        <div style={cssVars} className="ds-theme-root">
          {children}
        </div>
      </Theme>
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access and control the current theme.
 *
 * @example
 * ```tsx
 * const { mode, toggleTheme } = useTheme();
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a <ThemeProvider>');
  }
  return context;
}
