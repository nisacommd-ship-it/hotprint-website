import { PageLayout } from '@/components/layout/page-layout'
import { DashboardClient } from './dashboard-client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Личный кабинет | Hot Print',
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  let user: any = null
  let orders: any[] = []
  try {
    user = await prisma.user.findUnique({ where: { id: session?.user?.id } })
    orders = await prisma.order.findMany({
      where: { userId: session?.user?.id },
      orderBy: { createdAt: 'desc' },
      include: { product: true },
    })
  } catch (e: any) { console.error(e) }

  return (
    <PageLayout>
      <DashboardClient
        user={JSON.parse(JSON.stringify(user ?? {}))}
        orders={JSON.parse(JSON.stringify(orders ?? []))}
      />
    </PageLayout>
  )
}
