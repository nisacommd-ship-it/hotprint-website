import { prisma } from '@/lib/db'
import { PageLayout } from '@/components/layout/page-layout'
import { ServicesClient } from './services-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Технологии печати и отделки | Офсет, цифра, шелкография, УФ-лак, тиснение | HotPrint',
  description: 'Все технологии HotPrint: офсетная печать (Heidelberg), цифровая (Ricoh), широкоформатная (Roland), шелкография, выборочный УФ-лак, тиснение фольгой, конгрев, тампопечать. Тиражи от 100 шт.',
}

export default async function ServicesPage() {
  let services: any[] = []
  try {
    services = await prisma.service.findMany({ where: { active: true }, orderBy: { createdAt: 'asc' } })
  } catch (e: any) { console.error(e) }

  return (
    <PageLayout>
      <ServicesClient services={JSON.parse(JSON.stringify(services ?? []))} />
    </PageLayout>
  )
}
