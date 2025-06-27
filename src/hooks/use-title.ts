import { useContext, useEffect } from 'react';
import { TitleContext } from '@/components/title-provider';

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
  
  useEffect(() => {
    setTitle(pageTitle);
  }, [pageTitle, setTitle]);
};
