'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ru, ro, enUS } from 'date-fns/locale'
import { useT, useLocale } from '@/lib/i18n'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

const dateFnsLocales: Record<string, any> = { ru, ro, en: enUS }

export function BlogClient({ posts }: { posts: any[] }) {
  const t = useT()
  const locale = useLocale()

  return (
    <>
    <Breadcrumbs items={[{ label: t.blogPage.title }]} />
    <div className="max-w-[1200px] mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold tracking-tight mb-2">{t.blogPage.title}</h1>
      <p className="text-gray-500 mb-8">{t.blogPage.subtitle}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(posts ?? [])?.map?.((post: any, i: number) => (
          <motion.div key={post?.id ?? i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <Link href={`/blog/${post?.slug ?? ''}`} className="block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all group p-6 h-full">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                <Clock className="w-3.5 h-3.5" />
                {post?.createdAt ? format(new Date(post?.createdAt), 'd MMMM yyyy', { locale: dateFnsLocales[locale] || ru }) : ''}
              </div>
              <h2 className="font-display font-bold text-lg mb-2 group-hover:text-red-600 transition-colors">{post?.title}</h2>
              <p className="text-sm text-gray-500 line-clamp-3 mb-4">{post?.excerpt}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {(post?.tags ?? [])?.map?.((tag: string, j: number) => (
                  <span key={j} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-500">#{tag}</span>
                )) ?? []}
              </div>
              <span className="inline-flex items-center gap-1 text-sm text-red-600 font-medium group-hover:gap-2 transition-all">
                {t.blogPage.read} <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </motion.div>
        )) ?? []}
      </div>
    </div>
    </>
  )
}
