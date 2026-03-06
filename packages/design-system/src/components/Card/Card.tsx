import React from 'react';
import { Tile, ClickableTile } from '@carbon/react';

export interface CardProps {
  /** Card content */
  children: React.ReactNode;
  /** Optional title displayed at the top */
  title?: string;
  /** Optional subtitle */
  subtitle?: string;
  /** If provided, the card becomes clickable */
  onClick?: () => void;
  /** Optional href — makes the card a link */
  href?: string;
  /** Additional CSS class names */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
}

/**
 * Card component — wraps Carbon Tile for consistent card patterns.
 * Automatically switches to ClickableTile when onClick or href is provided.
 *
 * @example
 * ```tsx
 * import { Card } from '@yourorg/design-system';
 *
 * <Card title="Product Name" subtitle="$29.99">
 *   <img src="/product.jpg" alt="Product" />
 * </Card>
 * ```
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, title, subtitle, onClick, href, className, style }, ref) => {
    const content = (
      <>
        {(title || subtitle) && (
          <div className="ds-card__header">
            {title && <h3 className="ds-card__title">{title}</h3>}
            {subtitle && <p className="ds-card__subtitle">{subtitle}</p>}
          </div>
        )}
        <div className="ds-card__body">{children}</div>
      </>
    );

    const isInteractive = !!onClick || !!href;

    if (isInteractive) {
      return (
        <ClickableTile
          ref={ref as React.Ref<HTMLAnchorElement>}
          onClick={onClick}
          href={href}
          className={`ds-card ${className ?? ''}`}
          style={style}
        >
          {content}
        </ClickableTile>
      );
    }

    return (
      <Tile ref={ref} className={`ds-card ${className ?? ''}`} style={style}>
        {content}
      </Tile>
    );
  }
);

Card.displayName = 'Card';
