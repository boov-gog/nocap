import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize'; 

const resources = {
  en: {
    translation: require('../locales/en/translation.json'),
  },
  es: {
    translation: require('../locales/es/translation.json'),
  },
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (callback) => {
    try {
      const { languageTag } = RNLocalize.findBestLanguageTag(['en', 'es']) || { languageTag: 'en' }; 
      callback(languageTag);
    } catch (error) {
      console.error("Error detecting language:", error);
      callback('en'); 
    }
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en', 
    debug: true, 
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;