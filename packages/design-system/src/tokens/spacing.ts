/**
 * Spacing tokens based on Carbon's 8px grid system.
 * Override or extend as needed for your brand.
 *
 * @see https://carbondesignsystem.com/elements/spacing/overview/
 */

/** Base spacing unit in pixels */
const BASE_UNIT = 8;

export const spacing = {
  /** 2px */
  spacing01: `${BASE_UNIT * 0.25}px`,
  /** 4px */
  spacing02: `${BASE_UNIT * 0.5}px`,
  /** 8px */
  spacing03: `${BASE_UNIT}px`,
  /** 12px */
  spacing04: `${BASE_UNIT * 1.5}px`,
  /** 16px */
  spacing05: `${BASE_UNIT * 2}px`,
  /** 24px */
  spacing06: `${BASE_UNIT * 3}px`,
  /** 32px */
  spacing07: `${BASE_UNIT * 4}px`,
  /** 40px */
  spacing08: `${BASE_UNIT * 5}px`,
  /** 48px */
  spacing09: `${BASE_UNIT * 6}px`,
  /** 64px */
  spacing10: `${BASE_UNIT * 8}px`,
  /** 80px */
  spacing11: `${BASE_UNIT * 10}px`,
  /** 96px */
  spacing12: `${BASE_UNIT * 12}px`,
  /** 160px */
  spacing13: `${BASE_UNIT * 20}px`,
} as const;

/** Semantic spacing aliases for common use cases */
export const semanticSpacing = {
  /** Padding inside compact elements (buttons, tags) */
  paddingCompact: spacing.spacing03,
  /** Standard padding for cards, containers */
  paddingStandard: spacing.spacing05,
  /** Large padding for sections */
  paddingLarge: spacing.spacing07,
  /** Gap between inline elements */
  gapInline: spacing.spacing03,
  /** Gap between stacked elements */
  gapStack: spacing.spacing05,
  /** Page-level horizontal margin */
  pageMargin: spacing.spacing07,
  /** Section vertical spacing */
  sectionGap: spacing.spacing10,
} as const;

export type Spacing = typeof spacing;
export type SemanticSpacing = typeof semanticSpacing;
