'use client';

interface HeroBannerProps {
  title?: string;
  subtitle?: string;
  fullWidth?: boolean;
}

export function HeroBanner({
  title = 'Welcome',
  subtitle,
}: HeroBannerProps) {
  return (
    <section className="hero-banner">
      <div className="hero-banner__content">
        <h1 className="hero-banner__title">{title}</h1>
        {subtitle && <p className="hero-banner__subtitle">{subtitle}</p>}
      </div>
    </section>
  );
}
