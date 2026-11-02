import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { dictionaries, type Language, type Strings } from "./strings";

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (l: Language) => void;
  t: Strings;
}>({ language: "de", setLanguage: () => {}, t: dictionaries.de });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(
    () => (navigator.language.startsWith("de") ? "de" : "en"),
  );
  const value = useMemo(
    () => ({ language, setLanguage, t: dictionaries[language] }),
    [language],
  );
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useI18n = () => useContext(LanguageContext);
