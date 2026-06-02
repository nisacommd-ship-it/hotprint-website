import { prisma } from '@/lib/db'
import { PageLayout } from '@/components/layout/page-layout'
import { HomeClient } from '@/components/home/home-client'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let services: any[] = []
  let products: any[] = []
  let reviews: any[] = []
  try {
    services = await prisma.service.findMany({ where: { active: true }, orderBy: { createdAt: 'asc' } })
    products = await prisma.product.findMany({ where: { active: true, featured: true }, take: 6 })
    reviews = await prisma.review.findMany({ where: { approved: true }, take: 4 })
  } catch (e: any) {
    console.error('Home data error:', e)
  }

  return (
    <PageLayout>
      <HomeClient
        services={JSON.parse(JSON.stringify(services ?? []))}
        products={JSON.parse(JSON.stringify(products ?? []))}
        reviews={JSON.parse(JSON.stringify(reviews ?? []))}
      />
    </PageLayout>
  )
}
