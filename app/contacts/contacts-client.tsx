'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useT } from '@/lib/i18n'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

export function ContactsClient() {
  const t = useT()
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: any) => {
    e?.preventDefault?.()
    if (!form?.name || !form?.email || !form?.message) {
      toast.error(t.contactsPage.fillRequired)
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res?.json?.() ?? {}
      if (res?.ok) {
        setSent(true)
        toast.success(t.contactsPage.messageSent)
        setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        toast.error(data?.error ?? t.contactsPage.sendError)
      }
    } catch {
      toast.error(t.contactsPage.sendError)
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    { icon: Phone, title: t.contactsPage.phone, detail: t.contactsPage.phoneDetail, sub: t.contactsPage.phoneSchedule },
    { icon: Mail, title: t.contactsPage.email, detail: 'info@hotprint.md', sub: t.contactsPage.emailResponse },
    { icon: MapPin, title: t.contactsPage.address, detail: t.contactsPage.addressDetail, sub: 'MD-2001' },
    { icon: Clock, title: t.contactsPage.workHours, detail: t.contactsPage.workSchedule, sub: t.contactsPage.workScheduleSat },
  ]

  return (
    <>
    <Breadcrumbs items={[{ label: t.contactsPage.title }]} />
    <div className="max-w-[1200px] mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold tracking-tight mb-2">{t.contactsPage.title}</h1>
      <p className="text-gray-500 mb-10">{t.contactsPage.subtitle}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          {contactInfo.map((c, i) => {
            const Icon = c.icon
            return (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 bg-gray-50 rounded-xl p-5">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-medium">{c.title}</h3>
                  <p className="text-sm text-gray-700">{c.detail}</p>
                  <p className="text-xs text-gray-400">{c.sub}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          {sent ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="font-display font-bold text-xl mb-2">{t.contactsPage.sent}</h3>
              <p className="text-gray-500">{t.contactsPage.sentMessage}</p>
              <button onClick={() => setSent(false)} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">{t.contactsPage.sendAnother}</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-display font-bold text-xl mb-4">{t.contactsPage.formTitle}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">{t.contactsPage.nameLabel}</label>
                  <input type="text" value={form?.name ?? ''} onChange={(e: any) => setForm({ ...(form ?? {}), name: e?.target?.value ?? '' })}
                    className="w-full px-4 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm" required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">{t.contactsPage.emailLabel}</label>
                  <input type="email" value={form?.email ?? ''} onChange={(e: any) => setForm({ ...(form ?? {}), email: e?.target?.value ?? '' })}
                    className="w-full px-4 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">{t.contactsPage.phoneLabel}</label>
                  <input type="tel" value={form?.phone ?? ''} onChange={(e: any) => setForm({ ...(form ?? {}), phone: e?.target?.value ?? '' })}
                    className="w-full px-4 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">{t.contactsPage.subjectLabel}</label>
                  <input type="text" value={form?.subject ?? ''} onChange={(e: any) => setForm({ ...(form ?? {}), subject: e?.target?.value ?? '' })}
                    className="w-full px-4 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t.contactsPage.messageLabel}</label>
                <textarea rows={5} value={form?.message ?? ''} onChange={(e: any) => setForm({ ...(form ?? {}), message: e?.target?.value ?? '' })}
                  className="w-full px-4 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm resize-none" required />
              </div>
              <p className="text-xs text-gray-400">{t.contactsPage.consent}</p>
              <button type="submit" disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50">
                <Send className="w-4 h-4" /> {loading ? t.contactsPage.sending : t.contactsPage.send}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
    </>
  )
}
