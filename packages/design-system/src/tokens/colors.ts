/**
 * Custom color tokens that override Carbon's default palette.
 * These define your brand's visual identity across all Micro Frontends.
 *
 * Carbon token reference:
 * @see https://carbondesignsystem.com/elements/color/tokens/
 */

export const brandColors = {
  /** Primary brand color — used for CTAs, links, focus states */
  primary: '#6F2DBD',
  /** Secondary brand color — used for secondary actions */
  secondary: '#1A1A2E',
  /** Accent color — used for highlights and badges */
  accent: '#E94560',
  /** Success states */
  success: '#24A148',
  /** Warning states */
  warning: '#F1C21B',
  /** Error/danger states */
  danger: '#DA1E28',
  /** Info states */
  info: '#4589FF',
} as const;

export const neutralColors = {
  white: '#FFFFFF',
  gray10: '#F4F4F4',
  gray20: '#E0E0E0',
  gray30: '#C6C6C6',
  gray50: '#8D8D8D',
  gray70: '#525252',
  gray80: '#393939',
  gray90: '#262626',
  gray100: '#161616',
  black: '#000000',
} as const;

/**
 * Maps brand tokens → Carbon theme token names.
 * These are injected into Carbon's theming system.
 */
export const carbonColorOverrides = {
  /* Interactive / brand */
  interactive: brandColors.primary,
  'interactive-hover': '#5A24A0',
  'interactive-active': '#4A1D85',

  /* Backgrounds */
  background: neutralColors.white,
  'background-hover': neutralColors.gray10,
  'background-selected': neutralColors.gray20,
  'background-brand': brandColors.primary,

  /* Text */
  'text-primary': neutralColors.gray100,
  'text-secondary': neutralColors.gray70,
  'text-placeholder': neutralColors.gray50,
  'text-on-color': neutralColors.white,

  /* Borders */
  'border-strong-01': neutralColors.gray50,
  'border-subtle-01': neutralColors.gray20,

  /* Support */
  'support-error': brandColors.danger,
  'support-success': brandColors.success,
  'support-warning': brandColors.warning,
  'support-info': brandColors.info,

  /* Buttons */
  'button-primary': brandColors.primary,
  'button-primary-hover': '#5A24A0',
  'button-primary-active': '#4A1D85',
  'button-secondary': brandColors.secondary,
  'button-secondary-hover': '#2A2A4E',
  'button-secondary-active': '#0F0F1E',
  'button-danger-primary': brandColors.danger,
  'button-danger-secondary': brandColors.danger,

  /* Focus */
  focus: brandColors.primary,
  'focus-inset': neutralColors.white,
} as const;

export type BrandColors = typeof brandColors;
export type NeutralColors = typeof neutralColors;
export type CarbonColorOverrides = typeof carbonColorOverrides;
