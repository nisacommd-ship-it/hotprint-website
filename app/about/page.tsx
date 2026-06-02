import { PageLayout } from '@/components/layout/page-layout'
import { AboutClient } from './about-client'

export const metadata = {
  title: 'О компании HotPrint | Типография в Кишинёве с 1999 года',
  description: 'Типография HotPrint — собственное производство с 1999 года. Оборудование Heidelberg, Ricoh, Roland. Команда профессионалов полиграфии в Кишинёве.',
}

export default function AboutPage() {
  return (
    <PageLayout>
      <AboutClient />
    </PageLayout>
  )
}
