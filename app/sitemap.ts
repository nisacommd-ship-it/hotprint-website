import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = headers()
  const host = headersList.get('x-forwarded-host') || process.env.NEXTAUTH_URL?.replace(/^https?:\/\//, '') || 'hotprint.abacusai.app'
  const siteUrl = `https://${host}`

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${siteUrl}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/products`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/contacts`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/portfolio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/calculators`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/die-library`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  let servicePages: MetadataRoute.Sitemap = []
  let productPages: MetadataRoute.Sitemap = []
  let blogPages: MetadataRoute.Sitemap = []

  try {
    const services = await prisma.service.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } })
    servicePages = services.map((s) => ({
      url: `${siteUrl}/services/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {}

  try {
    const products = await prisma.product.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } })
    productPages = products.map((p) => ({
      url: `${siteUrl}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch {}

  try {
    const posts = await prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } })
    blogPages = posts.map((b) => ({
      url: `${siteUrl}/blog/${b.slug}`,
      lastModified: b.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch {}

  return [...staticPages, ...servicePages, ...productPages, ...blogPages]
}
