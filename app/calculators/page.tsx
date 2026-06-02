import { PageLayout } from '@/components/layout/page-layout'
import { CalculatorsClient } from './calculators-client'

export const metadata = {
  title: 'Калькуляторы печати онлайн | Расчёт веса, раскроя и GSM | HotPrint',
  description: 'Бесплатные онлайн-калькуляторы для полиграфии: расчёт веса тиража, оптимальный раскрой листа, конвертер плотности бумаги GSM.',
}

export default function CalculatorsPage() {
  return (
    <PageLayout>
      <CalculatorsClient />
    </PageLayout>
  )
}
