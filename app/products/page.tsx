import { prisma } from '@/lib/db'
import { PageLayout } from '@/components/layout/page-layout'
import { ProductsClient } from './products-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Полиграфическая продукция в Кишинёве | Визитки, буклеты, упаковка, пластиковые карты | HotPrint',
  description: 'Каталог полиграфической продукции HotPrint: визитки, буклеты, каталоги, пластиковые карты, упаковка, наклейки, календари. Офсетная и цифровая печать, премиальная отделка. Тиражи от 100 шт.',
}

export default async function ProductsPage() {
  let products: any[] = []
  try {
    products = await prisma.product.findMany({ where: { active: true }, orderBy: { createdAt: 'asc' } })
  } catch (e: any) { console.error(e) }

  const categories = [...new Set((products ?? [])?.map?.((p: any) => p?.category)?.filter?.(Boolean) ?? [])]

  return (
    <PageLayout>
      <ProductsClient products={JSON.parse(JSON.stringify(products ?? []))} categories={categories as string[]} />
    </PageLayout>
  )
}
