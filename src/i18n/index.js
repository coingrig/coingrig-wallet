import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
var numeral = require('numeral');
import english from './languages/en.json';
import french from './languages/fr.json';
import romanian from './languages/ro.json';

const numberFormatter = (value, format) => numeral(value).format(format);

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: english,
    fr: french,
    ro: romanian,
  },
  react: {
    useSuspense: false,
  },
  interpolation: {
    format: (value, format) => numberFormatter(value, format),
  },
});
export default i18n;
