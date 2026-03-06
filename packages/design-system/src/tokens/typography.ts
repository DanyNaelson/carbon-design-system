/**
 * Typography tokens that extend Carbon's type system.
 * Carbon uses IBM Plex by default — override fontFamily for your brand font.
 *
 * @see https://carbondesignsystem.com/elements/typography/overview/
 */

export const fontFamilies = {
  /** Primary font for body text and UI */
  sans: "'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif",
  /** Monospace font for code and data */
  mono: "'IBM Plex Mono', 'Courier New', monospace",
  /** Serif font for editorial content (optional) */
  serif: "'IBM Plex Serif', Georgia, serif",
} as const;

export const fontWeights = {
  light: 300,
  regular: 400,
  semibold: 600,
  bold: 700,
} as const;

export const fontSizes = {
  /** 12px — Labels, captions */
  caption01: '0.75rem',
  /** 14px — Body compact, helper text */
  bodyCompact01: '0.875rem',
  /** 16px — Body standard */
  body01: '1rem',
  /** 18px — Body large */
  bodyLarge: '1.125rem',
  /** 20px — Heading compact */
  heading01: '1.25rem',
  /** 24px — Heading */
  heading02: '1.5rem',
  /** 28px — Heading large */
  heading03: '1.75rem',
  /** 32px — Display */
  display01: '2rem',
  /** 42px — Display large */
  display02: '2.625rem',
  /** 54px — Display XL */
  display03: '3.375rem',
} as const;

export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.7,
} as const;

export const typography = {
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
} as const;

export type Typography = typeof typography;
