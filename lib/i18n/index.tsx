'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Locale, Translations } from './types'
import { ru } from './ru'
import { ro } from './ro'
import { en } from './en'

const translations: Record<Locale, Translations> = { ru, ro, en }

const LOCALE_COOKIE = 'hp_locale'
const DEFAULT_LOCALE: Locale = 'ru'

interface I18nContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: Translations
}

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: ru,
})

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  try {
    const cookie = document.cookie.split('; ').find(c => c.startsWith(LOCALE_COOKIE + '='))
    if (cookie) {
      const val = cookie.split('=')[1] as Locale
      if (val === 'ru' || val === 'ro' || val === 'en') return val
    }
  } catch {}
  return DEFAULT_LOCALE
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setLocaleState(getInitialLocale())
    setMounted(true)
  }, [])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    document.cookie = `${LOCALE_COOKIE}=${l};path=/;max-age=${365 * 24 * 60 * 60};SameSite=Lax`
    // Update html lang attribute
    document.documentElement.lang = l
  }, [])

  const t = translations[locale] || ru

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}

export function useLocale() {
  const { locale } = useContext(I18nContext)
  return locale
}

export function useT() {
  const { t } = useContext(I18nContext)
  return t
}

// Helper to get localized field from DB object
// Usage: localized(service, 'name', locale) → returns nameRo/nameEn/name based on locale
export function localized(obj: any, field: string, locale: Locale): string {
  if (!obj) return ''
  if (locale === 'ro' && obj[field + 'Ro']) return obj[field + 'Ro']
  if (locale === 'en' && obj[field + 'En']) return obj[field + 'En']
  return obj[field] || ''
}

// Helper for array fields (features)
export function localizedArray(obj: any, field: string, locale: Locale): string[] {
  if (!obj) return []
  if (locale === 'ro' && obj[field + 'Ro']?.length) return obj[field + 'Ro']
  if (locale === 'en' && obj[field + 'En']?.length) return obj[field + 'En']
  return obj[field] || []
}

export { type Locale, type Translations }
