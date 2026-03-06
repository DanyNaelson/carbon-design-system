import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Store Engine — Host',
  description: 'AI-powered store builder using the design system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-layout">
          <header className="app-header">
            <span className="app-header__title">Store Engine</span>
            <nav className="app-header__nav">
              <Link href="/" className="app-header__link">Builder</Link>
              <Link href="/store" className="app-header__link">Preview</Link>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
