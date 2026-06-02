'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Printer, Layers, Sparkles, Crown, Scissors, Stamp, Maximize, BookOpen } from 'lucide-react'
import { useT, useLocale, localized } from '@/lib/i18n'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

const iconMap: Record<string, any> = { Printer, Layers, Sparkles, Crown, Scissors, Stamp, Maximize, BookOpen }

export function ServicesClient({ services }: { services: any[] }) {
  const t = useT()
  const locale = useLocale()
  return (
    <>
    <Breadcrumbs items={[{ label: t.servicesPage.title }]} />
    <div className="max-w-[1200px] mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold tracking-tight mb-2">{t.servicesPage.title}</h1>
      <p className="text-gray-500 mb-10">{t.servicesPage.subtitle}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {(services ?? [])?.map?.((s: any, i: number) => {
          const Icon = iconMap?.[s?.icon ?? ''] || Printer
          return (
            <motion.div key={s?.id ?? i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link href={`/services/${s?.slug ?? ''}`} className="flex bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                <div className="relative w-40 md:w-52 shrink-0 bg-gray-100">
                  {s?.imageUrl && <Image src={s?.imageUrl} alt={localized(s, 'name', locale)} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />}
                </div>
                <div className="p-5 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-red-500" />
                    <h2 className="font-display font-bold text-lg">{localized(s, 'name', locale)}</h2>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{localized(s, 'shortDesc', locale)}</p>
                  <span className="inline-flex items-center gap-1 text-sm text-red-600 font-medium group-hover:gap-2 transition-all">
                    {t.servicesPage.learnMore} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          )
        }) ?? []}
      </div>
    </div>
    </>
  )
}
