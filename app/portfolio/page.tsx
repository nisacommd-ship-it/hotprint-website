import { prisma } from '@/lib/db'
import { PageLayout } from '@/components/layout/page-layout'
import { PortfolioClient } from './portfolio-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Портфолио работ | Примеры полиграфии и премиальной отделки | HotPrint',
  description: 'Портфолио выполненных работ HotPrint: визитки с тиснением, премиальная упаковка, корпоративная полиграфия, пластиковые карты.',
}

export default async function PortfolioPage() {
  let items: any[] = []
  try {
    items = await prisma.portfolioItem.findMany({ orderBy: { createdAt: 'desc' } })
  } catch (e: any) { console.error(e) }

  const categories = [...new Set((items ?? [])?.map?.((i: any) => i?.category)?.filter?.(Boolean) ?? [])]

  return (
    <PageLayout>
      <PortfolioClient items={JSON.parse(JSON.stringify(items ?? []))} categories={categories as string[]} />
    </PageLayout>
  )
}
