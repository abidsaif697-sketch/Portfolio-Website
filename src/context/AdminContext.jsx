import { useState, useCallback } from 'react';
import { AdminContext } from './AdminContextCore';
import { DEFAULT_CONTENT, DEFAULT_CONTENT_AR } from '../data/defaultContent';

function loadContent(key, defaults) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  } catch { return defaults; }
}

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin]     = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [content, setContent]     = useState(() => loadContent('portfolio_content', DEFAULT_CONTENT));
  const [arContent, setArContent] = useState(() => loadContent('portfolio_content_ar', DEFAULT_CONTENT_AR));

  const login  = useCallback((pw) => { if (pw === 'abid2024') { setIsAdmin(true); return true; } return false; }, []);
  const logout = useCallback(() => { setIsAdmin(false); setPanelOpen(false); }, []);

  const updateContent = useCallback((path, value) => {
    setContent(prev => {
      const next = structuredClone(prev);
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      localStorage.setItem('portfolio_content', JSON.stringify(next));
      return next;
    });
  }, []);

  const updateArContent = useCallback((path, value) => {
    setArContent(prev => {
      const next = structuredClone(prev);
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      localStorage.setItem('portfolio_content_ar', JSON.stringify(next));
      return next;
    });
  }, []);

  const resetContent = useCallback(() => {
    localStorage.removeItem('portfolio_content');
    setContent(DEFAULT_CONTENT);
  }, []);

  const resetArContent = useCallback(() => {
    localStorage.removeItem('portfolio_content_ar');
    setArContent(DEFAULT_CONTENT_AR);
  }, []);

  return (
    <AdminContext.Provider value={{
      isAdmin, login, logout, panelOpen, setPanelOpen,
      content, updateContent, resetContent,
      arContent, updateArContent, resetArContent,
    }}>
      {children}
    </AdminContext.Provider>
  );
}
