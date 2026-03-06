'use client';

import React, { createContext, useContext, useReducer, useMemo } from 'react';
import { storeReducer, createInitialState, type Store, type StoreState, type StoreAction } from '@yourorg/store-engine';

interface StoreContextValue {
  store: Store;
  state: StoreState;
  dispatch: React.Dispatch<StoreAction>;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

interface StoreProviderProps {
  store: Store;
  children: React.ReactNode;
}

export function StoreProvider({ store, children }: StoreProviderProps) {
  const initialPage = store.pages[0]?.slug ?? 'home';
  const [state, dispatch] = useReducer(storeReducer, createInitialState(initialPage));

  const value = useMemo<StoreContextValue>(
    () => ({ store, state, dispatch }),
    [store, state]
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within a <StoreProvider>');
  }
  return ctx;
}
