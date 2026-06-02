'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Search, User, ShoppingBag, ChevronDown, Printer, Layers, Sparkles, Crown, Scissors, Stamp, Maximize, BookOpen, CreditCard, Package, Shirt, Coffee, Bookmark, MonitorSmartphone, StickyNote, Calculator, Phone, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useI18n, Locale } from '@/lib/i18n'

const techSlugs = [
  { key: 'digitalPrinting' as const, slug: 'digital-printing', icon: Printer },
  { key: 'screenPrinting' as const, slug: 'screen-printing', icon: Layers },
  { key: 'uvVarnish' as const, slug: 'uv-varnish', icon: Sparkles },
  { key: 'foilStamping' as const, slug: 'foil-stamping', icon: Crown },
  { key: 'dieCutting' as const, slug: 'die-cutting', icon: Scissors },
  { key: 'padPrinting' as const, slug: 'pad-printing', icon: Stamp },
  { key: 'largeFormat' as const, slug: 'large-format', icon: Maximize },
  { key: 'offsetPrinting' as const, slug: 'offset-printing', icon: BookOpen },
]

const prodSlugs = [
  { key: 'businessCards' as const, slug: 'business-cards', icon: CreditCard },
  { key: 'packaging' as const, slug: 'packaging', icon: Package },
  { key: 'tshirts' as const, slug: 'tshirts', icon: Shirt },
  { key: 'mugs' as const, slug: 'mugs', icon: Coffee },
  { key: 'notebooks' as const, slug: 'notebooks', icon: Bookmark },
  { key: 'banners' as const, slug: 'banners', icon: MonitorSmartphone },
  { key: 'brochures' as const, slug: 'brochures', icon: BookOpen },
  { key: 'stickers' as const, slug: 'stickers', icon: StickyNote },
]

const localeLabels: Record<Locale, string> = { ru: 'RU', ro: 'RO', en: 'EN' }
const localeFlags: Record<Locale, string> = { ru: '🇷🇺', ro: '🇲🇩', en: '🇬🇧' }

export function Header() {
  const { data: session } = useSession() || {}
  const { locale, setLocale, t } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaMenu, setMegaMenu] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [langOpen, setLangOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window?.scrollY > 10)
    window?.addEventListener?.('scroll', onScroll)
    return () => window?.removeEventListener?.('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'
      )}>
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="relative w-36 h-10">
              <Image src="/logo.png" alt="Hot Print" fill className="object-contain object-left" priority />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            <button
              onMouseEnter={() => setMegaMenu('products')}
              onClick={() => setMegaMenu(megaMenu === 'products' ? null : 'products')}
              className="flex items-center gap-1 px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium hover:text-red-600 transition-colors"
            >
              {t.nav.products} <ChevronDown className="w-3 h-3" />
            </button>
            <button
              onMouseEnter={() => setMegaMenu('services')}
              onClick={() => setMegaMenu(megaMenu === 'services' ? null : 'services')}
              className="flex items-center gap-1 px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium hover:text-red-600 transition-colors"
            >
              {t.nav.technologies} <ChevronDown className="w-3 h-3" />
            </button>
            <Link href="/calculators" className="flex items-center gap-1 px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium hover:text-red-600 transition-colors">
              <Calculator className="w-3.5 h-3.5 hidden lg:inline" /> {t.nav.calculators}
            </Link>
            <Link href="/die-library" className="px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium hover:text-red-600 transition-colors">{t.nav.dieForms}</Link>
            <Link href="/portfolio" className="px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium hover:text-red-600 transition-colors">{t.nav.portfolio}</Link>
            <Link href="/blog" className="px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium hover:text-red-600 transition-colors">{t.nav.blog}</Link>
            <Link href="/contacts" className="px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium hover:text-red-600 transition-colors">
              <Phone className="w-3.5 h-3.5 hidden lg:inline mr-1" />{t.nav.contacts}
            </Link>
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition text-xs font-medium"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{localeLabels[locale]}</span>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border py-1 min-w-[120px] z-50"
                    onMouseLeave={() => setLangOpen(false)}
                  >
                    {(['ru', 'ro', 'en'] as Locale[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLocale(l); setLangOpen(false) }}
                        className={cn(
                          'flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 transition-colors',
                          locale === l && 'text-red-600 font-medium bg-red-50'
                        )}
                      >
                        <span>{localeFlags[l]}</span>
                        <span>{l === 'ru' ? 'Русский' : l === 'ro' ? 'Română' : 'English'}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-full hover:bg-gray-100 transition">
              <Search className="w-5 h-5" />
            </button>
            {session?.user ? (
              <Link href="/dashboard" className="p-2 rounded-full hover:bg-gray-100 transition">
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <Link href="/login" className="p-2 rounded-full hover:bg-gray-100 transition">
                <User className="w-5 h-5" />
              </Link>
            )}
            <button className="md:hidden p-2 rounded-full hover:bg-gray-100 transition" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mega Menu */}
        <AnimatePresence>
          {megaMenu && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="hidden md:block absolute left-0 right-0 bg-white shadow-lg border-t"
              onMouseLeave={() => setMegaMenu(null)}
            >
              <div className="max-w-[1200px] mx-auto px-4 py-6">
                {megaMenu === 'products' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-display font-bold">{t.nav.products}</h3>
                      <Link href="/products" className="text-sm text-red-600 hover:underline font-medium">{t.nav.allProducts}</Link>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {prodSlugs.map((p) => {
                        const Icon = p.icon
                        const name = t.prodNames[p.key]
                        return (
                          <Link key={p.slug} href={`/products?category=${encodeURIComponent(name)}`} onClick={() => setMegaMenu(null)}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                            <Icon className="w-5 h-5 text-red-500 group-hover:text-red-600" />
                            <span className="text-sm font-medium">{name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}
                {megaMenu === 'services' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-display font-bold">{t.nav.printTechnologies}</h3>
                      <Link href="/services" className="text-sm text-red-600 hover:underline font-medium">{t.nav.allTechnologies}</Link>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {techSlugs.map((tech) => {
                        const Icon = tech.icon
                        return (
                          <Link key={tech.slug} href={`/services/${tech.slug}`} onClick={() => setMegaMenu(null)}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                            <Icon className="w-5 h-5 text-red-500 group-hover:text-red-600" />
                            <span className="text-sm font-medium">{t.techNames[tech.key]}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t bg-white"
            >
              <div className="max-w-[1200px] mx-auto px-4 py-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text" placeholder={t.nav.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e: any) => setSearchQuery(e?.target?.value ?? '')}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-white pt-16 overflow-y-auto md:hidden"
          >
            <nav className="px-4 py-6 space-y-1">
              <Link href="/products" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-gray-50 font-medium">{t.nav.products}</Link>
              <Link href="/services" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-gray-50 font-medium">{t.nav.technologies}</Link>
              <Link href="/calculators" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-gray-50 font-medium">{t.nav.calculators}</Link>
              <Link href="/die-library" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-gray-50 font-medium">{t.nav.dieForms}</Link>
              <Link href="/portfolio" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-gray-50 font-medium">{t.nav.portfolio}</Link>
              <Link href="/about" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-gray-50 font-medium">{t.nav.about}</Link>
              <Link href="/blog" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-gray-50 font-medium">{t.nav.blog}</Link>
              <Link href="/contacts" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-gray-50 font-medium">{t.nav.contacts}</Link>
              {/* Mobile language selector */}
              <div className="border-t my-3 pt-3">
                <div className="flex gap-2 px-4">
                  {(['ru', 'ro', 'en'] as Locale[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLocale(l); setMobileOpen(false) }}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        locale === l ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                      )}
                    >
                      {localeFlags[l]} {localeLabels[l]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t my-3" />
              {session?.user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg hover:bg-gray-50 font-medium">{t.nav.personalAccount}</Link>
                  <button onClick={() => { signOut(); setMobileOpen(false); }} className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 font-medium text-red-600">{t.nav.logout}</button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg bg-red-600 text-white text-center font-medium">{t.nav.login}</Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
