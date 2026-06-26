import { dictionaries } from "./dictionaries";
import type { Locale, TranslationKey } from "./types";

export const getTranslation = (locale: Locale, key: TranslationKey): string => {
  const parts = key.split(".");
  let current: unknown = dictionaries[locale];

  for (const part of parts) {
    if (typeof current !== "object" || current === null || !(part in current)) {
      return key;
    }

    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === "string" ? current : key;
};

export const isRTLLocale = (locale: Locale) => locale === "fa";

export type { Locale, TranslationKey } from "./types";
export { dictionaries } from "./dictionaries";
