import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from "../assets/language/en.json";
import mn from "../assets/language/mn.json";
import kr from "../assets/language/kr.json";
import {  useState } from "react";

const locales = getLocales(); 
const language: string = locales[0]?.languageCode ?? "en";

const getLanguageFromStorage = async () => {
  try{
    const storedLanguage = await AsyncStorage.getItem("language");
    if(storedLanguage){
      return storedLanguage;
    }
    const locales = getLocales();
    const language:string = locales[0]?.languageCode ?? "en";
    return language;
  }catch(err){
    console.log("Error loading language:", err);
    return "en"; 
  }
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en.data },
    mn: { translation: mn.data },
    kr: { translation: kr.data }
  },
  lng: language, 
  fallbackLng: "en", 
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4'
})
export default i18n;