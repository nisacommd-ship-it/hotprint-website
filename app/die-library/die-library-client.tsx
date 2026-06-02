'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, Package, Download, Scissors, Filter } from 'lucide-react'
import { useT } from '@/lib/i18n'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

export function DieLibraryClient({ dieCuts, categories }: { dieCuts: any[]; categories: string[] }) {
  const t = useT()
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let result = [...(dieCuts ?? [])]
    if (category !== 'all') result = result?.filter?.((d: any) => d?.category === category) ?? []
    if (search) {
      const q = search?.toLowerCase?.() ?? ''
      result = result?.filter?.((d: any) => (d?.name ?? '')?.toLowerCase?.()?.includes?.(q) || (d?.description ?? '')?.toLowerCase?.()?.includes?.(q)) ?? []
    }
    return result
  }, [dieCuts, category, search])

  return (
    <>
    <Breadcrumbs items={[{ label: t.dieLibrary.title }]} />
    <div className="max-w-[1200px] mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold tracking-tight mb-2">{t.dieLibrary.title}</h1>
      <p className="text-gray-500 mb-8">{t.dieLibrary.subtitle}</p>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder={t.dieLibrary.searchPlaceholder} value={search}
            onChange={(e: any) => setSearch(e?.target?.value ?? '')}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 text-sm" />
        </div>
        <select value={category} onChange={(e: any) => setCategory(e?.target?.value ?? 'all')}
          className="px-4 py-2.5 rounded-lg border bg-white text-sm">
          <option value="all">{t.dieLibrary.allCategories}</option>
          {(categories ?? [])?.map?.((c: string) => <option key={c} value={c}>{c}</option>) ?? []}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(filtered ?? [])?.map?.((d: any, i: number) => (
          <motion.div key={d?.id ?? i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
              <Scissors className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-display font-bold">{d?.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{d?.description}</p>
            <div className="mt-3 space-y-1">
              <p className="text-xs text-gray-400">{t.dieLibrary.size}: <span className="text-gray-700 font-mono">{d?.dimensions}</span></p>
              <p className="text-xs text-gray-400">{t.dieLibrary.knifeType}: <span className="text-gray-700">{d?.knifeType}</span></p>
              <p className="text-xs">
                <span className={d?.available ? 'text-green-600' : 'text-orange-600'}>
                  {d?.available ? `✅ ${t.dieLibrary.inStock}` : `📦 ${t.dieLibrary.toOrder}`}
                </span>
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <Link href="/contacts" className="flex-1 text-center py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition">
                {t.dieLibrary.order}
              </Link>
            </div>
          </motion.div>
        )) ?? []}
      </div>

      {(filtered?.length ?? 0) === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{t.dieLibrary.notFound}</p>
        </div>
      )}

      {/* Custom form CTA */}
      <div className="mt-12 bg-gray-50 rounded-xl p-8 text-center">
        <Package className="w-10 h-10 text-red-500 mx-auto mb-4" />
        <h3 className="font-display font-bold text-xl mb-2">{t.dieLibrary.customTitle}</h3>
        <p className="text-gray-500 mb-4">{t.dieLibrary.customSub}</p>
        <Link href="/contacts" className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition">
          {t.dieLibrary.customCta}
        </Link>
      </div>
    </div>
    </>
  )
}
