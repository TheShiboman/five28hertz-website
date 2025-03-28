import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Language } from "@/contexts/LanguageContext"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Utility function to get translations
export async function getTranslations(language: Language) {
  try {
    return await import(`@/i18n/locales/${language}.json`);
  } catch (error) {
    console.error(`Failed to load ${language} translations:`, error);
    // Fallback to English
    return await import('@/i18n/locales/en.json');
  }
}
