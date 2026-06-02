'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { ru, ro, enUS } from 'date-fns/locale'
import { useT, useLocale } from '@/lib/i18n'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

const dateFnsLocales: Record<string, any> = { ru, ro, en: enUS }

export function BlogPostClient({ post, otherPosts }: { post: any; otherPosts: any[] }) {
  const t = useT()
  const locale = useLocale()

  return (
    <>
    <Breadcrumbs items={[{ label: t.blogPage.title, href: '/blog' }, { label: post?.title ?? '' }]} />
    <div className="max-w-[800px] mx-auto px-4 py-10">
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> {t.blogPage.backToArticles}
      </Link>

      <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <Clock className="w-3.5 h-3.5" />
          {post?.createdAt ? format(new Date(post?.createdAt), 'd MMMM yyyy', { locale: dateFnsLocales[locale] || ru }) : ''}
          <span>·</span>
          <span>{post?.author ?? 'Hot Print'}</span>
        </div>

        <h1 className="text-3xl font-display font-bold tracking-tight mb-4">{post?.title}</h1>

        <div className="flex flex-wrap gap-1 mb-8">
          {(post?.tags ?? [])?.map?.((tag: string, j: number) => (
            <span key={j} className="px-2 py-0.5 bg-red-50 rounded text-xs text-red-600">#{tag}</span>
          )) ?? []}
        </div>

        <div className="prose prose-lg max-w-none">
          {(post?.content ?? '')?.split?.('\n')?.map?.((p: string, i: number) => (
            <p key={i} className="text-gray-600 leading-relaxed mb-4">{p}</p>
          )) ?? []}
        </div>
      </motion.article>

      {(otherPosts?.length ?? 0) > 0 && (
        <div className="mt-16 border-t pt-10">
          <h2 className="font-display font-bold text-xl mb-6">{t.blogPage.otherArticles}</h2>
          <div className="grid gap-4">
            {(otherPosts ?? [])?.map?.((op: any) => (
              <Link key={op?.id} href={`/blog/${op?.slug ?? ''}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition group">
                <div>
                  <h3 className="font-medium group-hover:text-red-600 transition-colors">{op?.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{op?.excerpt}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
              </Link>
            )) ?? []}
          </div>
        </div>
      )}
    </div>
    </>
  )
}
