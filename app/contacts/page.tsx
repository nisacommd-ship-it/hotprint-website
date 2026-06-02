import { PageLayout } from '@/components/layout/page-layout'
import { ContactsClient } from './contacts-client'

export const metadata = {
  title: 'Контакты HotPrint | Типография в Кишинёве, ул. Academia 3/3',
  description: 'Свяжитесь с типографией HotPrint: +373 68 690 899, info@hotprint.md. Адрес: Кишинёв, ул. Academia 3/3. Работаем Пн–Пт 09:00–18:00.',
}

export default function ContactsPage() {
  return (
    <PageLayout>
      <ContactsClient />
    </PageLayout>
  )
}
