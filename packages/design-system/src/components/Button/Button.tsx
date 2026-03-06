import React from 'react';
import { Button as CarbonButton } from '@carbon/react';
import type { ButtonBaseProps } from '@carbon/react';

export interface ButtonProps extends ButtonBaseProps {
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost';
  children?: React.ReactNode;
}

const variantToKind: Record<
  NonNullable<ButtonProps['variant']>,
  ButtonBaseProps['kind']
> = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  danger: 'danger',
  ghost: 'ghost',
};

/**
 * Button component — wraps Carbon Button with your design system's API.
 *
 * @example
 * ```tsx
 * import { Button } from '@yourorg/design-system';
 *
 * <Button variant="primary" onClick={handleClick}>
 *   Add to Cart
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', children, ...props }, ref) => {
    return (
      <CarbonButton ref={ref} kind={variantToKind[variant]} {...props}>
        {children}
      </CarbonButton>
    );
  }
);

Button.displayName = 'Button';
