import React, { createContext, useContext, useState, ReactNode } from 'react';
import { en } from '../translations/en';
import { fr } from '../translations/fr';
import { it } from '../translations/it';

type Language = 'en' | 'fr' | 'it';
type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  formatCurrency: (amount: number | string) => string;
  formatNumber: (num: number | string, decimals?: number) => string;
  formatDate: (date: Date | string | number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr'); // Default to French as requested expert

  const t = language === 'en' ? en : (language === 'fr' ? fr : it);

  const formatCurrency = (amount: number | string) => {
    const val = typeof amount === 'number' ? amount : parseFloat(amount);
    if (isNaN(val)) return '0,00 €';
    if (language === 'fr' || language === 'it') {
      return val.toFixed(2).replace('.', ',') + ' €';
    }
    return '€' + val.toFixed(2);
  };

  const formatNumber = (num: number | string, decimals: number = 1) => {
    const val = typeof num === 'number' ? num : parseFloat(num);
    if (isNaN(val)) return '0';
    const formatted = val.toFixed(decimals);
    if (language === 'fr') {
      return formatted.replace('.', ',');
    }
    return formatted;
  };

  const formatDate = (date?: Date | string | number) => {
    const d = date ? new Date(date) : new Date();
    if (isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatCurrency, formatNumber, formatDate }}>
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
