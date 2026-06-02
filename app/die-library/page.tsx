import { prisma } from '@/lib/db'
import { PageLayout } from '@/components/layout/page-layout'
import { DieLibraryClient } from './die-library-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Библиотека штанц-форм | Готовые формы для вырубки упаковки | HotPrint',
  description: 'Каталог готовых штанц-форм для вырубки коробок, папок, конвертов. Выберите форму, скачайте и закажите производство.',
}

export default async function DieLibraryPage() {
  let dieCuts: any[] = []
  try {
    dieCuts = await prisma.dieCutForm.findMany({ orderBy: { createdAt: 'asc' } })
  } catch (e: any) { console.error(e) }

  const categories = [...new Set((dieCuts ?? [])?.map?.((d: any) => d?.category)?.filter?.(Boolean) ?? [])]

  return (
    <PageLayout>
      <DieLibraryClient dieCuts={JSON.parse(JSON.stringify(dieCuts ?? []))} categories={categories as string[]} />
    </PageLayout>
  )
}
