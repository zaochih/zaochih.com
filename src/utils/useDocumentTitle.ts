import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Hook to dynamically update document title based on current locale
 */
export const useDocumentTitle = () => {
  const { t } = useTranslation();
  
  useEffect(() => {
    document.title = t('name');
  }, [t]);
};
