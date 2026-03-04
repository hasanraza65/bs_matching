import React, { createContext, useContext, useState, ReactNode } from 'react';
import { en } from '../translations/en';
import { fr } from '../translations/fr';

type Language = 'en' | 'fr';
type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  formatCurrency: (amount: number) => string;
  formatNumber: (num: number, decimals?: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr'); // Default to French as requested expert

  const t = language === 'en' ? en : fr;

  const formatCurrency = (amount: number) => {
    if (language === 'fr') {
      return amount.toFixed(2).replace('.', ',') + ' €';
    }
    return '€' + amount.toFixed(2);
  };

  const formatNumber = (num: number, decimals: number = 1) => {
    const formatted = num.toFixed(decimals);
    if (language === 'fr') {
      return formatted.replace('.', ',');
    }
    return formatted;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatCurrency, formatNumber }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
