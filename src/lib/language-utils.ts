import type { PreferredLanguage } from '@/types/auth.types';
import { PREFERRED_LANGUAGES } from '@/types/auth.types';

export type { PreferredLanguage };

/**
 * Detect browser/app language and map to supported languages.
 * Defaults to 'nl' (Nederlands) if language is not supported.
 */
export function detectBrowserLanguage(): PreferredLanguage {
  const browserLang = typeof navigator !== 'undefined' ? navigator.language?.slice(0, 2) : null;

  if (browserLang && PREFERRED_LANGUAGES.includes(browserLang as PreferredLanguage)) {
    return browserLang as PreferredLanguage;
  }

  return 'nl'; // Default to Dutch (Nederlands)
}

/**
 * Get language label for display in UI
 */
export function getLanguageLabel(lang: PreferredLanguage): string {
  const labels: Record<PreferredLanguage, string> = {
    nl: 'Nederlands',
    fr: 'Français',
    en: 'English',
    de: 'Deutsch',
  };
  return labels[lang];
}

/**
 * Get language flag emoji
 */
export function getLanguageFlag(lang: PreferredLanguage): string {
  const flags: Record<PreferredLanguage, string> = {
    nl: '🇳🇱',
    fr: '🇫🇷',
    en: '🇬🇧',
    de: '🇩🇪',
  };
  return flags[lang];
}
