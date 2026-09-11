import { createContext, useContext, useCallback } from "react";
import type { Settings } from "../types";
import pl from "./pl.json";
import en from "./en.json";

const translations: Record<string, Record<string, string>> = { pl, en };

type I18nContextType = {
  t: (key: string) => string;
  locale: string;
};

const I18nContext = createContext<I18nContextType>({
  t: (key: string) => key,
  locale: "pl",
});

export function useI18n() {
  return useContext(I18nContext);
}

export function I18nProvider({ settings, children }: { settings: Settings; children: React.ReactNode }) {
  const locale = settings.language;
  const dict = translations[locale] ?? translations.pl;

  const t = useCallback(
    (key: string): string => dict[key] ?? key,
    [dict]
  );

  return <I18nContext.Provider value={{ t, locale }}>{children}</I18nContext.Provider>;
}
