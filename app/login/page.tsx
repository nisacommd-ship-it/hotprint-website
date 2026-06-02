import { PageLayout } from '@/components/layout/page-layout'
import { LoginClient } from './login-client'

export const metadata = {
  title: 'Вход в личный кабинет | HotPrint',
}

export default function LoginPage() {
  return (
    <PageLayout>
      <LoginClient />
    </PageLayout>
  )
}
