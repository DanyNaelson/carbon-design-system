'use client';

import { useState } from 'react';
import { StoreBuilder, type Store } from '@yourorg/store-engine';
import { StorePreview } from '@/components/StorePreview';
import { ChatPanel } from '@/components/ChatPanel';
import { sampleStore } from '@/lib/sample-store';

export default function HomePage() {
  const [store, setStore] = useState<Store>(sampleStore);

  function handleIntent(payload: Record<string, unknown>) {
    if (payload.name && typeof payload.name === 'string') {
      const slug = (payload.slug as string) ?? payload.name.toLowerCase().replaceAll(/\s+/g, '-');
      const builder = new StoreBuilder(slug, payload.name);

      if (payload.description) {
        builder.setDescription(payload.description as string);
      }
      if (payload.theme) {
        builder.setTheme(payload.theme as 'light' | 'dark');
      }

      const products = payload.products as Array<Record<string, unknown>> | undefined;
      if (products?.length) {
        for (const p of products) {
          builder.addProduct({
            id: crypto.randomUUID(),
            name: p.name as string,
            description: p.description as string | undefined,
            price: p.price as number,
            category: p.category as string | undefined,
          });
        }
      }

      builder.addPage('home', 'Home', (payload.layout as 'hero-with-catalog') ?? 'hero-with-catalog');

      try {
        setStore(builder.build());
      } catch {
        setStore(builder.buildDraft());
      }
    }
  }

  return (
    <main className="home">
      <section className="home__preview">
        <StorePreview store={store} />
      </section>
      <ChatPanel onIntent={handleIntent} />
    </main>
  );
}
