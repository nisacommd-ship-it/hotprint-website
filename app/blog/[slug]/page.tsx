import { prisma } from '@/lib/db'
import { PageLayout } from '@/components/layout/page-layout'
import { BlogPostClient } from './blog-post-client'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BreadcrumbListSchema, ArticleSchema } from '@/lib/schema'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({ where: { slug: params?.slug } }).catch(() => null)
  return {
    title: post?.seoTitle || `${post?.title ?? ''} | Hot Print`,
    description: post?.seoDesc || post?.excerpt || '',
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params?.slug } }).catch(() => null)
  if (!post) notFound()

  const otherPosts = await prisma.blogPost.findMany({
    where: { published: true, slug: { not: params?.slug } },
    take: 3,
    orderBy: { createdAt: 'desc' },
  }).catch(() => []) ?? []

  const breadcrumbs = [
    { name: 'Главная', url: '/' },
    { name: 'Блог', url: '/blog' },
    { name: post.title, url: `/blog/${post.slug}` },
  ]

  return (
    <PageLayout>
      <BreadcrumbListSchema items={breadcrumbs} />
      <ArticleSchema article={{ title: post.title, excerpt: post.excerpt, slug: post.slug, imageUrl: post.imageUrl || undefined, createdAt: post.createdAt?.toISOString?.() || new Date().toISOString(), author: 'HotPrint' }} />
      <BlogPostClient post={JSON.parse(JSON.stringify(post ?? {}))} otherPosts={JSON.parse(JSON.stringify(otherPosts ?? []))} />
    </PageLayout>
  )
}
