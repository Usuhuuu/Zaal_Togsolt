import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from 'expo-localization';

import en from "../assets/language/en.json";
import mn from "../assets/language/mn.json";
import kr from "../assets/language/kr.json";

const locales = getLocales(); 
const language = locales[0]?.languageCode;

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en.data },
    mn: { translation: mn.data },
    kr: { translation: kr.data }
  },
  lng: "en", 
  fallbackLng: "en", 
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4'
}).then(() => {
  i18n.on("languageChanged", (lng) => {
    console.log("Language changed to: ", lng);
  });
});



export default i18n;