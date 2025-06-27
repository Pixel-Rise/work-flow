import { useContext } from "react";
import { LanguageContext } from "@/components/language-provider";
import en from "@/locales/en.json";
import ru from "@/locales/ru.json";
import uz from "@/locales/uz.json";

const translations: Record<string, Record<string, string>> = {
  en,
  ru,
  uz,
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const useTranslation = () => {
  const { language } = useLanguage();
  return (key: string) => translations[language]?.[key] || key;
};
