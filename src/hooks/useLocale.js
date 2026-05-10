import { useAdmin } from './useAdmin';
import { useLanguage } from './useLanguage';

export function useLocale() {
  const { content, arContent } = useAdmin();
  const { lang } = useLanguage();
  return lang === 'ar' ? arContent : content;
}
