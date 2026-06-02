'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin } from 'lucide-react'
import { useT } from '@/lib/i18n'

export function Footer() {
  const t = useT()
  return (
    <footer className="bg-black text-white">
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & info */}
          <div>
            <div className="relative w-32 h-10 mb-4">
              <Image src="/logo.png" alt="Hot Print" fill className="object-contain object-left" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t.footer.description}
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-bold mb-4">{t.footer.technologies}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/services/digital-printing" className="hover:text-red-500 transition-colors">{t.footer.digitalPrinting}</Link></li>
              <li><Link href="/services/screen-printing" className="hover:text-red-500 transition-colors">{t.footer.screenPrinting}</Link></li>
              <li><Link href="/services/foil-stamping" className="hover:text-red-500 transition-colors">{t.footer.foilStamping}</Link></li>
              <li><Link href="/services/large-format" className="hover:text-red-500 transition-colors">{t.footer.largeFormat}</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-display font-bold mb-4">{t.footer.products}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/products" className="hover:text-red-500 transition-colors">{t.footer.businessCards}</Link></li>
              <li><Link href="/products" className="hover:text-red-500 transition-colors">{t.footer.packaging}</Link></li>
              <li><Link href="/products" className="hover:text-red-500 transition-colors">{t.footer.banners}</Link></li>
              <li><Link href="/products" className="hover:text-red-500 transition-colors">{t.footer.merch}</Link></li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-display font-bold mb-4">{t.footer.contacts}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-red-500" /><span>+373 68 690 899</span></li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-red-500" /><a href="mailto:info@hotprint.md">info@hotprint.md</a></li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-red-500 mt-0.5" /><span>{t.contactsPage.addressDetail}</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">{t.footer.allRights}</p>
          <div className="flex gap-4">
            <Link href="/about" className="text-xs text-gray-500 hover:text-red-500 transition-colors">{t.nav.about}</Link>
            <Link href="/contacts" className="text-xs text-gray-500 hover:text-red-500 transition-colors">{t.nav.contacts}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
