import React, { createContext, useContext, useState, useEffect } from "react";
import i18n from "i18next";
import { I18nextProvider } from "react-i18next";

interface LanguageContextProps {
  language: string;
  changeLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: i18n.language,
  changeLanguage: (lang: string) => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState(i18n.language);
  const [isLanguageChanged, setIsLanguageChanged] = useState(false);

  const changeLanguage = (lang: string) => {
    if (lang !== language) {
      i18n.changeLanguage(lang);
      setLanguage(lang);
      setIsLanguageChanged(true); // Mark language as changed
    }
  };

  useEffect(() => {
    if (isLanguageChanged) {
      // Wait for the re-render to complete
      setIsLanguageChanged(false); // Reset state after the re-render
      console.log("Language changed and component re-rendered:", language);
    }
  }, [language, isLanguageChanged]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
