'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight, Phone, Printer, Layers, Sparkles, Crown, Scissors, Stamp, Maximize, BookOpen } from 'lucide-react'
import { useT, useLocale, localized, localizedArray } from '@/lib/i18n'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

const iconMap: Record<string, any> = { Printer, Layers, Sparkles, Crown, Scissors, Stamp, Maximize, BookOpen }

export function ServiceDetailClient({ service, otherServices, faqItems = [] }: { service: any; otherServices: any[]; faqItems?: { question: string; answer: string }[] }) {
  const t = useT()
  const locale = useLocale()
  const Icon = iconMap?.[service?.icon ?? ''] || Printer
  const features = localizedArray(service, 'features', locale)

  // FAQ: pick locale-specific JSON if available
  const localizedFaqItems = (() => {
    if (locale === 'ro' && service?.faqJsonRo) {
      try { return JSON.parse(service.faqJsonRo) } catch {}
    }
    if (locale === 'en' && service?.faqJsonEn) {
      try { return JSON.parse(service.faqJsonEn) } catch {}
    }
    return faqItems
  })()

  return (
    <>
    <Breadcrumbs items={[{ label: t.servicesPage.title, href: '/services' }, { label: localized(service, 'name', locale) }]} />
    <div>
      {/* Hero */}
      <section className="relative h-[350px] md:h-[400px] overflow-hidden bg-black">
        {service?.imageUrl && (
          <Image src={service?.imageUrl} alt={service?.name ?? ''} fill className="object-cover opacity-40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 h-full flex items-end pb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">{service?.seoH1 || localized(service, 'name', locale)}</h1>
            </div>
            <p className="text-white/70 max-w-2xl">{localized(service, 'shortDesc', locale)}</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* AEO Answer Block */}
            {service?.aeoAnswer && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-red-50 border border-red-100 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed font-medium">{localized(service, 'aeoAnswer', locale)}</p>
              </motion.div>
            )}

            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-display font-bold mb-4">{t.serviceDetail.techDescription}</h2>
              <p className="text-gray-600 leading-relaxed">{localized(service, 'fullDesc', locale)}</p>
            </motion.div>

            {/* Features */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-display font-bold mb-4">{t.serviceDetail.advantages}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(features ?? [])?.map?.((f: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <CheckCircle className="w-5 h-5 text-red-500 shrink-0" />
                    <span className="text-sm">{f}</span>
                  </div>
                )) ?? []}
              </div>
            </motion.div>

            {/* FAQ - dynamic from database */}
            {localizedFaqItems && localizedFaqItems.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-display font-bold mb-4">{t.serviceDetail.faq}</h2>
                <div className="space-y-4">
                  {localizedFaqItems.map((faq: { question: string; answer: string }, i: number) => (
                    <div key={i} className={i < localizedFaqItems.length - 1 ? 'border-b pb-4' : ''}>
                      <h3 className="font-medium mb-2">{faq.question}</h3>
                      <p className="text-sm text-gray-500">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-red-600 text-white rounded-xl p-6">
              <h3 className="font-display font-bold text-lg mb-2">{t.serviceDetail.orderService} {localized(service, 'name', locale)?.toLowerCase?.()}</h3>
              <p className="text-white/80 text-sm mb-4">{t.serviceDetail.leaveRequest}</p>
              <Link href="/contacts" className="flex items-center justify-center gap-2 w-full py-2.5 bg-white text-red-600 font-medium rounded-lg hover:bg-gray-100 transition">
                <Phone className="w-4 h-4" /> {t.serviceDetail.contact}
              </Link>
            </motion.div>

            {/* Price */}
            {service?.minPrice != null && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-display font-bold mb-2">{t.serviceDetail.price}</h3>
                <p className="text-2xl font-mono font-bold text-red-600">{t.productsPage.from} {service?.minPrice} MDL</p>
                <p className="text-xs text-gray-400 mt-1">{t.serviceDetail.priceNote}</p>
              </div>
            )}

            {/* Other services */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-display font-bold mb-4">{t.serviceDetail.otherTech}</h3>
              <div className="space-y-2">
                {(otherServices ?? [])?.map?.((os: any) => {
                  const OIcon = iconMap?.[os?.icon ?? ''] || Printer
                  return (
                    <Link key={os?.id} href={`/services/${os?.slug ?? ''}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <OIcon className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium">{localized(os, 'name', locale)}</span>
                    </Link>
                  )
                }) ?? []}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
