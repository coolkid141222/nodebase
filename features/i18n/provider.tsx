"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  APP_LOCALE_STORAGE_KEY,
  type AppLocale,
  getDateFnsLocale,
  resolveInitialLocale,
  translate,
} from "./shared";

type I18nContextValue = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
  dateLocale: ReturnType<typeof getDateFnsLocale>;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<AppLocale>(resolveInitialLocale);

  useEffect(() => {
    window.localStorage.setItem(APP_LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => {
    return {
      locale,
      setLocale,
      t: (key, values) => translate(locale, key, values),
      dateLocale: getDateFnsLocale(locale),
    };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
}
