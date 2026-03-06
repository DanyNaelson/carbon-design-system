/**
 * Dark theme — extends Carbon's "g100" theme with brand overrides.
 */
import { carbonColorOverrides, neutralColors, brandColors } from '../tokens/colors';

export const darkTheme = {
  ...carbonColorOverrides,

  /* Dark-specific overrides */
  background: neutralColors.gray100,
  'background-hover': neutralColors.gray90,
  'background-active': neutralColors.gray80,
  'background-selected': neutralColors.gray80,
  'background-brand': brandColors.primary,

  'layer-01': neutralColors.gray90,
  'layer-02': neutralColors.gray80,
  'layer-03': neutralColors.gray70,
  'layer-hover-01': neutralColors.gray80,
  'layer-hover-02': neutralColors.gray70,

  'text-primary': neutralColors.gray10,
  'text-secondary': neutralColors.gray30,
  'text-placeholder': neutralColors.gray50,
  'text-on-color': neutralColors.white,
  'text-inverse': neutralColors.gray100,

  'border-strong-01': neutralColors.gray50,
  'border-subtle-01': neutralColors.gray80,
  'border-interactive': brandColors.primary,

  'field-01': neutralColors.gray90,
  'field-02': neutralColors.gray80,
  'field-hover-01': neutralColors.gray80,
} as const;

export type DarkTheme = typeof darkTheme;
