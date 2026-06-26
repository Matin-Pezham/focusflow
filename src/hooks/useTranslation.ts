import { getTranslation, type TranslationKey } from "../i18n";
import { useLanguageStore } from "../stores/useLanguageStore";

export const useTranslation = () => {
  const locale = useLanguageStore((state) => state.locale);

  const t = (key: string) => getTranslation(locale, key as TranslationKey);

  return { locale, t, isRTL: locale === "fa" };
};

export type { Locale, TranslationKey } from "../i18n";
