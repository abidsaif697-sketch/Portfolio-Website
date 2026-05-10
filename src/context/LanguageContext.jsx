import { useState, useEffect } from 'react';
import { LanguageContext } from './LanguageContextCore';

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('portfolio_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('portfolio_lang', lang);
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}
