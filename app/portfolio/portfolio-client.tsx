'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useT } from '@/lib/i18n'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

export function PortfolioClient({ items, categories }: { items: any[]; categories: string[] }) {
  const t = useT()
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<any>(null)

  const filtered = useMemo(() => {
    if (filter === 'all') return items ?? []
    return (items ?? [])?.filter?.((i: any) => i?.category === filter) ?? []
  }, [items, filter])

  return (
    <>
    <Breadcrumbs items={[{ label: t.portfolioPage.title }]} />
    <div className="max-w-[1200px] mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold tracking-tight mb-2">{t.portfolioPage.title}</h1>
      <p className="text-gray-500 mb-8">{t.portfolioPage.subtitle}</p>

      <div className="flex gap-2 mb-8 flex-wrap">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{t.portfolioPage.all}</button>
        {(categories ?? [])?.map?.((c: string) => (
          <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === c ? 'bg-red-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>{c}</button>
        )) ?? []}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(filtered ?? [])?.map?.((item: any, i: number) => (
          <motion.div key={item?.id ?? i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="group cursor-pointer" onClick={() => setSelected(item)}>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
              {item?.imageUrl && <Image src={item?.imageUrl} alt={item?.title ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                <div className="p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                  <span className="text-white font-medium">{item?.title}</span>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xs text-red-600 font-medium">{item?.category}</span>
              <h3 className="font-medium text-sm">{item?.title}</h3>
            </div>
          </motion.div>
        )) ?? []}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white rounded-xl max-w-2xl w-full overflow-hidden" onClick={(e: any) => e?.stopPropagation?.()}>
              <div className="relative aspect-video bg-gray-100">
                {selected?.imageUrl && <Image src={selected?.imageUrl} alt={selected?.title ?? ''} fill className="object-cover" />}
                <button onClick={() => setSelected(null)} className="absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white hover:bg-black/70">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6">
                <span className="text-xs text-red-600 font-medium">{selected?.category}</span>
                <h2 className="font-display font-bold text-xl mt-1">{selected?.title}</h2>
                {selected?.description && <p className="text-gray-500 text-sm mt-2">{selected?.description}</p>}
                <div className="flex gap-4 mt-4 text-sm text-gray-400">
                  {selected?.client && <span>{t.portfolioPage.client}: <strong className="text-gray-700">{selected?.client}</strong></span>}
                  {selected?.technology && <span>{t.portfolioPage.technology}: <strong className="text-gray-700">{selected?.technology}</strong></span>}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  )
}
