'use client';

import { useMemo } from 'react';
import { JsonRenderer, type Store } from '@yourorg/store-engine';
import { createAppRegistry } from '@/lib/registry';
import { StoreProvider, useStore } from './StoreProvider';

function StoreRenderer() {
  const { store, state } = useStore();
  const registry = useMemo(() => createAppRegistry(), []);

  const currentPage = store.pages.find((p) => p.slug === state.currentPage) ?? store.pages[0];

  if (!currentPage) {
    return (
      <div className="store-preview__empty">
        <p>No pages in this store yet.</p>
      </div>
    );
  }

  return <JsonRenderer node={currentPage.layout} registry={registry} />;
}

interface StorePreviewProps {
  readonly store: Store;
}

export function StorePreview({ store }: Readonly<StorePreviewProps>) {
  return (
    <StoreProvider store={store}>
      <div className="store-preview">
        <StoreRenderer />
      </div>
    </StoreProvider>
  );
}
