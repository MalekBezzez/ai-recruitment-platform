import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importer les traductions
import translationEN from './app/translations/en/common.json';
import translationFR from './app/translations/fr/common.json';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: { // we use it for language change   i18n.changeLanguage('en'); like we definie the key 
    translation: translationEN,
  },
  fr: { // we use it for language change 
    translation: translationFR,
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en', // if label in active language not find it use the  label on en file 

    keySeparator: true, // we do not use keys in form messages.welcome , malek change it to true 

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
