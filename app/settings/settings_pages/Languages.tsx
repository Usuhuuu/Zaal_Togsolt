import React, { createContext, useContext, useState, useEffect } from "react";
import i18n from "@/utils/i18";
import { I18nextProvider } from "react-i18next";

interface LanguageContextProps {
  language: string;
  changeLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: i18n.language,
  changeLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState(i18n.language);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang); // This forces a re-render
  };

  useEffect(() => {
    i18n.on("languageChanged", (lng) => {
      setLanguage(lng);
    });
  }, []);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
