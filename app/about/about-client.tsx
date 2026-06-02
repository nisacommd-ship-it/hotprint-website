'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Award, Users, Zap, Shield, Printer, Layers } from 'lucide-react'
import { useT } from '@/lib/i18n'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

export function AboutClient() {
  const t = useT()

  const advantages = [
    { icon: Zap, title: t.aboutPage.adv1Title, desc: t.aboutPage.adv1Desc },
    { icon: Users, title: t.aboutPage.adv2Title, desc: t.aboutPage.adv2Desc },
    { icon: Award, title: t.aboutPage.adv3Title, desc: t.aboutPage.adv3Desc },
    { icon: Shield, title: t.aboutPage.adv4Title, desc: t.aboutPage.adv4Desc },
  ]

  const equipment = [
    { icon: Printer, name: t.aboutPage.eq1Name, detail: t.aboutPage.eq1Detail },
    { icon: Layers, name: t.aboutPage.eq2Name, detail: t.aboutPage.eq2Detail },
    { icon: Zap, name: t.aboutPage.eq3Name, detail: t.aboutPage.eq3Detail },
    { icon: Award, name: t.aboutPage.eq4Name, detail: t.aboutPage.eq4Detail },
  ]

  return (
    <>
    <Breadcrumbs items={[{ label: t.aboutPage.title }]} />
    <div>
      <section className="relative h-[350px] overflow-hidden bg-black">
        <Image src="https://cdn.abacus.ai/images/6cd1df5b-716a-4269-964f-e3d4499bf29c.png" alt="Hot Print" fill className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 h-full flex items-end pb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">{t.aboutPage.title}</h1>
            <p className="text-white/70 mt-2">{t.aboutPage.subtitle}</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 py-16 space-y-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-display font-bold tracking-tight mb-4">{t.aboutPage.historyTitle} <span className="text-red-600">{t.aboutPage.historyTitle === 'Наша' ? 'история' : t.aboutPage.historyTitle === 'Our' ? 'History' : 'noastră'}</span></h2>
            <p className="text-gray-600 leading-relaxed mb-4">{t.aboutPage.historyP1}</p>
            <p className="text-gray-600 leading-relaxed">{t.aboutPage.historyP2}</p>
          </div>
          <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
            <Image src="https://cdn.abacus.ai/images/a05176b7-86af-4f5d-8d32-f0da79292f5a.png" alt="Hot Print Team" fill className="object-cover" />
          </div>
        </motion.div>

        <div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-2xl font-display font-bold tracking-tight mb-8 text-center">{t.aboutPage.advantagesTitle} <span className="text-red-600">{t.aboutPage.advantagesTitle === 'Наши' ? 'преимущества' : t.aboutPage.advantagesTitle === 'Our' ? 'Advantages' : 'noastre'}</span></motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((a, i) => {
              const Icon = a.icon
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-gray-50 rounded-xl p-6 text-center">
                  <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-red-600" />
                  </div>
                  <h3 className="font-display font-bold">{a.title}</h3>
                  <p className="text-sm text-gray-500 mt-2">{a.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-black text-white rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-display font-bold mb-6">{t.aboutPage.equipmentTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {equipment.map((eq, i) => {
              const Icon = eq.icon
              return (
                <div key={i} className="flex items-start gap-4 bg-white/5 rounded-xl p-4">
                  <Icon className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">{eq.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{eq.detail}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
    </>
  )
}
