'use client';

import { useStore } from '@/components/StoreProvider';

export function StoreFooter() {
  const { store } = useStore();

  return (
    <footer className="store-footer">
      <p>&copy; {new Date().getFullYear()} {store.name}. Built with the AI Store Engine.</p>
    </footer>
  );
}
