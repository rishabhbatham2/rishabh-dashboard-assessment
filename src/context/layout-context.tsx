'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextType {
  headerActions: React.ReactNode;
  setHeaderActions: (actions: React.ReactNode) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [headerActions, setHeaderActions] = useState<React.ReactNode>(null);

  const value = {
    headerActions,
    setHeaderActions,
  };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
