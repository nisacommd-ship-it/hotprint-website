import { prisma } from '@/lib/db'
import { PageLayout } from '@/components/layout/page-layout'
import { BlogClient } from './blog-client'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Блог о полиграфии | Статьи о технологиях печати и отделки | HotPrint',
  description: 'Экспертные статьи о полиграфии: виды постпечатной обработки, УФ-лак, тиснение фольгой, подготовка макетов к печати, сравнение цифровой и офсетной печати.',
}

export default async function BlogPage() {
  let posts: any[] = []
  try {
    posts = await prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } })
  } catch (e: any) { console.error(e) }

  return (
    <PageLayout>
      <BlogClient posts={JSON.parse(JSON.stringify(posts ?? []))} />
    </PageLayout>
  )
}
