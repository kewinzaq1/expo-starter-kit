import i18n from '_locales/index';
import { create } from 'zustand';

type LangState = {
  language: string;
  setLang: (language: string) => void;
};

export const useLang = create<LangState>((set) => ({
  language: i18n.language,
  setLang(language) {
    i18n.changeLanguage(language);
    set({ language });
  },
}));
