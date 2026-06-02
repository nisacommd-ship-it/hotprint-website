import { prisma } from '@/lib/db'
import { PageLayout } from '@/components/layout/page-layout'
import { ServiceDetailClient } from './service-detail-client'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BreadcrumbListSchema, FAQPageSchema, ServiceSchema } from '@/lib/schema'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await prisma.service.findUnique({ where: { slug: params?.slug } }).catch(() => null)
  return {
    title: service?.seoTitle || `${service?.name ?? ''} | Hot Print`,
    description: service?.seoDesc || service?.shortDesc || '',
  }
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = await prisma.service.findUnique({ where: { slug: params?.slug } }).catch(() => null)
  if (!service) notFound()

  const otherServices = await prisma.service.findMany({
    where: { active: true, slug: { not: params?.slug } },
    take: 4,
  }).catch(() => []) ?? []

  let faqItems: { question: string; answer: string }[] = []
  try {
    if (service.faqJson) faqItems = JSON.parse(service.faqJson)
  } catch {}

  const breadcrumbs = [
    { name: 'Главная', url: '/' },
    { name: 'Технологии', url: '/services' },
    { name: service.name, url: `/services/${service.slug}` },
  ]

  return (
    <PageLayout>
      <BreadcrumbListSchema items={breadcrumbs} />
      {faqItems.length > 0 && <FAQPageSchema faqs={faqItems} />}
      <ServiceSchema service={{ name: service.name, description: service.shortDesc || '', slug: service.slug, imageUrl: service.imageUrl || undefined }} />
      <ServiceDetailClient
        service={JSON.parse(JSON.stringify(service ?? {}))}
        otherServices={JSON.parse(JSON.stringify(otherServices ?? []))}
        faqItems={faqItems}
      />
    </PageLayout>
  )
}
