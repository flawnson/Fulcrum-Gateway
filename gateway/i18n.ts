import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './assets/translations/en/translation.json'
import frTranslation from './assets/translations/fr/translation.json'
import zhTranslation from './assets/translations/zh/translation.json'
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

export const resources = {
    en: enTranslation,
    fr: frTranslation,
    zh: zhTranslation,
}

i18n
    // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
    // learn more: https://github.com/i18next/i18next-http-backend
    // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        resources,
        ns: ['common'],
        defaultNS: 'common',
        lng: 'en',
        fallbackLng: 'en',
        debug: true,
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        keySeparator: false,
    });

export default i18n;
