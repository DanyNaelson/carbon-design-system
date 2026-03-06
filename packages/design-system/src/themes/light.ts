/**
 * Light theme — extends Carbon's "white" theme with brand overrides.
 */
import { carbonColorOverrides, neutralColors, brandColors } from '../tokens/colors';

export const lightTheme = {
  ...carbonColorOverrides,

  /* Light-specific overrides */
  background: neutralColors.white,
  'background-hover': neutralColors.gray10,
  'background-active': neutralColors.gray20,
  'background-selected': neutralColors.gray20,
  'background-brand': brandColors.primary,

  'layer-01': neutralColors.white,
  'layer-02': neutralColors.gray10,
  'layer-03': neutralColors.gray20,
  'layer-hover-01': neutralColors.gray10,
  'layer-hover-02': neutralColors.gray20,

  'text-primary': neutralColors.gray100,
  'text-secondary': neutralColors.gray70,
  'text-placeholder': neutralColors.gray50,
  'text-on-color': neutralColors.white,
  'text-inverse': neutralColors.white,

  'border-strong-01': neutralColors.gray50,
  'border-subtle-01': neutralColors.gray20,
  'border-interactive': brandColors.primary,

  'field-01': neutralColors.gray10,
  'field-02': neutralColors.white,
  'field-hover-01': neutralColors.gray20,
} as const;

export type LightTheme = typeof lightTheme;
