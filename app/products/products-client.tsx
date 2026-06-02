'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Filter, ArrowRight } from 'lucide-react'
import { useT, useLocale, localized } from '@/lib/i18n'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

export function ProductsClient({ products, categories }: { products: any[]; categories: string[] }) {
  const t = useT()
  const locale = useLocale()
  const searchParams = useSearchParams()
  const initialCategory = searchParams?.get?.('category') ?? 'all'
  const [category, setCategory] = useState(initialCategory)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('name')

  const filtered = useMemo(() => {
    let result = [...(products ?? [])]
    if (category && category !== 'all') {
      result = result?.filter?.((p: any) => p?.category === category) ?? []
    }
    if (search) {
      const q = search?.toLowerCase?.() ?? ''
      result = result?.filter?.((p: any) => (localized(p, 'name', locale) ?? '')?.toLowerCase?.()?.includes?.(q) || (localized(p, 'description', locale) ?? '')?.toLowerCase?.()?.includes?.(q)) ?? []
    }
    if (sort === 'price-asc') result?.sort?.((a: any, b: any) => (a?.minPrice ?? 0) - (b?.minPrice ?? 0))
    else if (sort === 'price-desc') result?.sort?.((a: any, b: any) => (b?.minPrice ?? 0) - (a?.minPrice ?? 0))
    else result?.sort?.((a: any, b: any) => (localized(a, 'name', locale) ?? '')?.localeCompare?.(localized(b, 'name', locale) ?? ''))
    return result
  }, [products, category, search, sort, locale])

  return (
    <>
    <Breadcrumbs items={[{ label: t.productsPage.title }]} />
    <div className="max-w-[1200px] mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold tracking-tight mb-2">{t.productsPage.title}</h1>
      <p className="text-gray-500 mb-8">{t.productsPage.subtitle}</p>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder={t.productsPage.searchPlaceholder} value={search} onChange={(e: any) => setSearch(e?.target?.value ?? '')}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm" />
        </div>
        <select value={category} onChange={(e: any) => setCategory(e?.target?.value ?? 'all')}
          className="px-4 py-2.5 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20">
          <option value="all">{t.productsPage.allCategories}</option>
          {(categories ?? [])?.map?.((c: string) => <option key={c} value={c}>{c}</option>) ?? []}
        </select>
        <select value={sort} onChange={(e: any) => setSort(e?.target?.value ?? 'name')}
          className="px-4 py-2.5 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20">
          <option value="name">{t.productsPage.sortByName}</option>
          <option value="price-asc">{t.productsPage.sortPriceAsc}</option>
          <option value="price-desc">{t.productsPage.sortPriceDesc}</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {(filtered ?? [])?.map?.((p: any, i: number) => (
          <motion.div key={p?.id ?? i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group">
            <div className="relative aspect-[4/3] bg-gray-100">
              {p?.imageUrl && <Image src={p?.imageUrl} alt={p?.name ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />}
            </div>
            <div className="p-5">
              <span className="text-xs text-red-600 font-medium uppercase">{localized(p, 'category', locale)}</span>
              <h3 className="font-display font-bold text-lg mt-1">{localized(p, 'name', locale)}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{localized(p, 'description', locale)}</p>
              <div className="flex items-center justify-between mt-4">
                {p?.minPrice != null && <span className="font-mono font-bold">{t.productsPage.from} {p?.minPrice} MDL</span>}
                <Link href="/contacts" className="inline-flex items-center gap-1 text-sm text-red-600 font-medium hover:gap-2 transition-all">
                  {t.productsPage.order} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )) ?? []}
      </div>

      {(filtered?.length ?? 0) === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{t.productsPage.nothingFound}</p>
        </div>
      )}
    </div>
    </>
  )
}
