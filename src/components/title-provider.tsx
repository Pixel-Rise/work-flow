import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';

interface TitleContextType {
  title: string;
  setTitle: (title: string) => void;
}

export const TitleContext = createContext<TitleContextType | undefined>(undefined);

export const TitleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [title, setTitle] = useState('Dashboard');

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};
