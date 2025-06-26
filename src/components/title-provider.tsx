import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface TitleContextType {
  title: string;
  setTitle: (title: string) => void;
}

const TitleContext = createContext<TitleContextType | undefined>(undefined);

export const TitleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [title, setTitle] = useState('Dashboard');

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};

export const useTitle = () => {
  const context = useContext(TitleContext);
  if (context === undefined) {
    throw new Error('useTitle must be used within a TitleProvider');
  }
  return context;
};

// Custom hook to set page title
export const usePageTitle = (pageTitle: string) => {
  const { setTitle } = useTitle();
  
  React.useEffect(() => {
    setTitle(pageTitle);
  }, [pageTitle, setTitle]);
};
