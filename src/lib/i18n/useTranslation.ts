import { useLanguageStore } from '@/store/useLanguageStore';
import vi from './dictionaries/vi.json';
import en from './dictionaries/en.json';

const dictionaries = { vi, en };

export function useTranslation() {
  const { language, setLanguage, toggleLanguage } = useLanguageStore();
  const t = dictionaries[language] || dictionaries.vi;

  return {
    t,
    language,
    setLanguage,
    toggleLanguage,
  };
}
