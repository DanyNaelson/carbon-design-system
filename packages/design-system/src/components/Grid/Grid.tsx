import React from 'react';
import {
  Grid as CarbonGrid,
  Column as CarbonColumn,
  FlexGrid,
} from '@carbon/react';

/* ─── Grid ─── */
export interface GridProps {
  children: React.ReactNode;
  /** Use CSS Flexbox grid instead of CSS Grid */
  flexGrid?: boolean;
  /** Narrow grid variant (reduced gutter) */
  narrow?: boolean;
  /** Condensed grid variant (minimal gutter) */
  condensed?: boolean;
  /** Full width — removes max-width constraint */
  fullWidth?: boolean;
  className?: string;
}

/**
 * Grid component — wraps Carbon Grid for responsive layouts.
 *
 * @example
 * ```tsx
 * import { Grid, Column } from '@yourorg/design-system';
 *
 * <Grid>
 *   <Column sm={4} md={4} lg={8}>Main</Column>
 *   <Column sm={4} md={4} lg={4}>Sidebar</Column>
 * </Grid>
 * ```
 */
export function Grid({
  children,
  flexGrid = false,
  narrow = false,
  condensed = false,
  fullWidth = false,
  className,
}: GridProps) {
  const GridComponent = flexGrid ? FlexGrid : CarbonGrid;

  return (
    <GridComponent
      narrow={narrow}
      condensed={condensed}
      fullWidth={fullWidth}
      className={className}
    >
      {children}
    </GridComponent>
  );
}

/* ─── Column ─── */
export interface ColumnProps {
  children: React.ReactNode;
  /** Span on small breakpoint (0-4) */
  sm?: number | { span?: number; offset?: number };
  /** Span on medium breakpoint (0-8) */
  md?: number | { span?: number; offset?: number };
  /** Span on large breakpoint (0-16) */
  lg?: number | { span?: number; offset?: number };
  /** Span on xlarge breakpoint (0-16) */
  xlg?: number | { span?: number; offset?: number };
  /** Span on max breakpoint (0-16) */
  max?: number | { span?: number; offset?: number };
  className?: string;
}

/**
 * Column component — wraps Carbon Column for grid layouts.
 */
export function Column({ children, sm, md, lg, xlg, max, className }: ColumnProps) {
  return (
    <CarbonColumn sm={sm} md={md} lg={lg} xlg={xlg} max={max} className={className}>
      {children}
    </CarbonColumn>
  );
}
