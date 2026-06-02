'use client'

import { signOut } from 'next-auth/react'
import { motion } from 'framer-motion'
import { User, ShoppingBag, Wallet, LogOut, Package, Clock, CheckCircle, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { ru as ruLocale } from 'date-fns/locale'
import { ro as roLocale } from 'date-fns/locale/ro'
import { enUS } from 'date-fns/locale'
import { useI18n } from '@/lib/i18n'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

const dateLocales: Record<string, any> = { ru: ruLocale, ro: roLocale, en: enUS }

export function DashboardClient({ user, orders }: { user: any; orders: any[] }) {
  const { locale, t } = useI18n()
  const dl = dateLocales[locale] || ruLocale

  const statusMap: Record<string, { label: string; color: string; icon: any }> = {
    PENDING: { label: t.dashboardPage.statusPending, color: 'text-yellow-600 bg-yellow-50', icon: Clock },
    IN_PROGRESS: { label: t.dashboardPage.statusInProgress, color: 'text-blue-600 bg-blue-50', icon: Package },
    COMPLETED: { label: t.dashboardPage.statusCompleted, color: 'text-green-600 bg-green-50', icon: CheckCircle },
    CANCELLED: { label: t.dashboardPage.statusCancelled, color: 'text-red-600 bg-red-50', icon: XCircle },
  }

  const roleLabel = user?.role === 'ADMIN' ? t.dashboardPage.admin : user?.role === 'AGENCY' ? t.dashboardPage.agency : t.dashboardPage.client

  return (
    <>
    <Breadcrumbs items={[{ label: t.dashboardPage.title }]} />
    <div className="max-w-[1200px] mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight">{t.dashboardPage.title}</h1>
        <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition">
          <LogOut className="w-4 h-4" /> {t.dashboardPage.logout}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-6 shadow-sm">
          <User className="w-8 h-8 text-red-500 mb-3" />
          <h3 className="font-display font-bold">{user?.name || t.dashboardPage.user}</h3>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">{roleLabel}</span>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-6 shadow-sm">
          <ShoppingBag className="w-8 h-8 text-red-500 mb-3" />
          <h3 className="font-display font-bold">{t.dashboardPage.orders}</h3>
          <p className="text-3xl font-mono font-bold mt-1">{orders?.length ?? 0}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-6 shadow-sm">
          <Wallet className="w-8 h-8 text-red-500 mb-3" />
          <h3 className="font-display font-bold">{t.dashboardPage.cashback}</h3>
          <p className="text-3xl font-mono font-bold mt-1">{user?.cashback?.toFixed?.(2) ?? '0.00'} <span className="text-sm text-gray-500">MDL</span></p>
        </motion.div>
      </div>

      <h2 className="font-display font-bold text-xl mb-4">{t.dashboardPage.orderHistory}</h2>
      {(orders?.length ?? 0) === 0 ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400">{t.dashboardPage.noOrders}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(orders ?? [])?.map?.((order: any) => {
            const status = statusMap?.[order?.status ?? ''] ?? statusMap?.PENDING
            const StatusIcon = status?.icon ?? Clock
            return (
              <motion.div key={order?.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-white rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-bold">#{order?.orderNumber}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${status?.color ?? ''}`}>
                      <StatusIcon className="w-3 h-3" /> {status?.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{order?.serviceName || order?.product?.name || t.dashboardPage.orderLabel}</p>
                  {order?.description && <p className="text-xs text-gray-400 mt-1 line-clamp-1">{order?.description}</p>}
                </div>
                <div className="text-right">
                  {order?.totalPrice != null && <p className="font-mono font-bold">{order?.totalPrice} MDL</p>}
                  <p className="text-xs text-gray-400">{order?.createdAt ? format(new Date(order?.createdAt), 'd MMM yyyy', { locale: dl }) : ''}</p>
                </div>
              </motion.div>
            )
          }) ?? []}
        </div>
      )}
    </div>
    </>
  )
}
