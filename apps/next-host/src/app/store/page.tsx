'use client';

import { StorePreview } from '@/components/StorePreview';
import { sampleStore } from '@/lib/sample-store';

export default function StoreDetailPage() {
  return (
    <div className="store-page">
      <div className="store-page__header">
        <h1 className="store-page__title">{sampleStore.name}</h1>
        {sampleStore.description && (
          <p className="store-page__description">{sampleStore.description}</p>
        )}
        <div className="store-page__meta">
          <span className="store-page__meta-item">
            {sampleStore.products.length} products
          </span>
          <span className="store-page__meta-item">
            {sampleStore.pages.length} pages
          </span>
          <span className="store-page__meta-item">
            Theme: {sampleStore.config.theme}
          </span>
        </div>
      </div>
      <StorePreview store={sampleStore} />
    </div>
  );
}
