'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Printer, Layers, Sparkles, Scissors, Maximize, Crown, Star, Calculator, ChevronLeft, ChevronRight, FileText, Package, Truck, CheckCircle, Phone } from 'lucide-react'
import { useT, useLocale, localized } from '@/lib/i18n'

const iconMap: Record<string, any> = {
  Printer, Layers, Sparkles, Scissors, Maximize, Crown, Stamp: Printer, BookOpen: FileText,
}

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (inView) {
      let start = 0
      const increment = Math.ceil(value / 40)
      const timer = setInterval(() => {
        start += increment
        if (start >= value) { setCount(value); clearInterval(timer); }
        else { setCount(start); }
      }, 30)
      return () => clearInterval(timer)
    }
  }, [inView, value])

  return <span ref={ref} className="font-mono text-3xl font-bold text-red-600">{count}{suffix}</span>
}

export function HomeClient({ services, products, reviews }: { services: any[]; products: any[]; reviews: any[] }) {
  const t = useT()
  const locale = useLocale()
  const [slide, setSlide] = useState(0)

  const heroSlides = [
    { title: t.home.slide1Title, subtitle: t.home.slide1Sub, image: 'https://cdn.abacus.ai/images/54ec764a-1361-49fc-925a-f052adfc27a8.png', cta: t.home.slide1Cta, link: '/contacts' },
    { title: t.home.slide2Title, subtitle: t.home.slide2Sub, image: 'https://cdn.abacus.ai/images/73e0e2ae-3763-4805-bd40-eae1bff371d1.png', cta: t.home.slide2Cta, link: '/services/screen-printing' },
    { title: t.home.slide3Title, subtitle: t.home.slide3Sub, image: 'https://cdn.abacus.ai/images/30e24cae-4b7e-4ccb-9cc2-c6abecfb9480.png', cta: t.home.slide3Cta, link: '/services/foil-stamping' },
  ]

  const bentoCategories = [
    { name: t.home.screenPrintingCat, image: 'https://cdn.abacus.ai/images/73e0e2ae-3763-4805-bd40-eae1bff371d1.png', link: '/services/screen-printing', span: 'col-span-2 row-span-2' },
    { name: t.home.businessCardsCat, image: 'https://cdn.abacus.ai/images/ef284c68-c2ca-4b86-8233-1240ceb19c43.png', link: `/products?category=${encodeURIComponent(t.prodNames.businessCards)}`, span: 'col-span-1 row-span-1' },
    { name: t.home.packagingCat, image: 'https://cdn.abacus.ai/images/26042d64-5cbd-4253-80e3-5d6355cb7c9d.png', link: `/products?category=${encodeURIComponent(t.prodNames.packaging)}`, span: 'col-span-1 row-span-1' },
    { name: t.home.largeFormatCat, image: 'https://cdn.abacus.ai/images/3547b841-eb2c-47cb-ad27-11da96a3342f.png', link: '/services/large-format', span: 'col-span-2 row-span-1' },
  ]

  const steps = [
    { icon: FileText, title: t.home.step1, desc: t.home.step1Desc },
    { icon: Package, title: t.home.step2, desc: t.home.step2Desc },
    { icon: CheckCircle, title: t.home.step3, desc: t.home.step3Desc },
    { icon: Truck, title: t.home.step4, desc: t.home.step4Desc },
  ]

  useEffect(() => {
    const timer = setInterval(() => setSlide(prev => (prev + 1) % (heroSlides?.length ?? 1)), 5000)
    return () => clearInterval(timer)
  }, [heroSlides?.length])

  const currentSlide = heroSlides?.[slide] ?? heroSlides?.[0]

  return (
    <div>
      {/* Hero Carousel */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-black">
        {heroSlides?.map?.((s: any, i: number) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === slide ? 'opacity-100' : 'opacity-0'}`}>
            <div className="relative w-full h-full">
              <Image src={s?.image ?? ''} alt={s?.title ?? ''} fill className="object-cover" priority={i === 0} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            </div>
          </div>
        )) ?? []}
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 h-full flex items-center">
          <motion.div
            key={slide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg"
          >
            <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded mb-4">{t.home.heroTag}</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight">{currentSlide?.title}</h1>
            <p className="text-lg text-white/80 mb-6">{currentSlide?.subtitle}</p>
            <Link href={currentSlide?.link ?? '/contacts'} className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
              {currentSlide?.cta} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {heroSlides?.map?.((_: any, i: number) => (
            <button key={i} onClick={() => setSlide(i)} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === slide ? 'bg-red-600' : 'bg-white/50'}`} />
          )) ?? []}
        </div>
        <button onClick={() => setSlide(prev => (prev - 1 + (heroSlides?.length ?? 1)) % (heroSlides?.length ?? 1))} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition hidden md:block">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button onClick={() => setSlide(prev => (prev + 1) % (heroSlides?.length ?? 1))} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition hidden md:block">
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-8 border-b">
        <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div><AnimatedCounter value={15} suffix="+" /><p className="text-sm text-gray-600 mt-1">{t.home.yearsExp}</p></div>
          <div><AnimatedCounter value={5000} suffix="+" /><p className="text-sm text-gray-600 mt-1">{t.home.ordersCompleted}</p></div>
          <div><AnimatedCounter value={8} /><p className="text-sm text-gray-600 mt-1">{t.home.printTech}</p></div>
          <div><AnimatedCounter value={300} suffix="+" /><p className="text-sm text-gray-600 mt-1">{t.home.regularClients}</p></div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="max-w-[1200px] mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold tracking-tight">{t.home.categories}</h2>
          <p className="text-gray-500 mt-2">{t.home.categoriesSub}</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[200px] gap-3">
          {bentoCategories?.map?.((cat: any, i: number) => (
            <motion.div key={cat?.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`${cat?.span ?? ''} relative rounded-xl overflow-hidden group cursor-pointer`}>
              <Link href={cat?.link ?? '#'}>
                <div className="relative w-full h-full">
                  <Image src={cat?.image ?? ''} alt={cat?.name ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-white font-display font-bold text-lg">{cat?.name}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )) ?? []}
        </div>
      </section>

      {/* Popular Services */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold tracking-tight">{t.home.popularServices} <span className="text-red-600">{t.nav.technologies.toLowerCase()}</span></h2>
              <p className="text-gray-500 mt-2">{t.home.popularServicesSub}</p>
            </div>
            <Link href="/services" className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:underline">{t.home.allServices} <ArrowRight className="w-3.5 h-3.5" /></Link>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(services?.filter?.((s: any) => s?.featured) ?? [])?.slice?.(0, 4)?.map?.((s: any, i: number) => {
              const Icon = iconMap?.[s?.icon ?? ''] || Printer
              return (
                <motion.div key={s?.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Link href={`/services/${s?.slug ?? ''}`} className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group h-full">
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-600 transition-colors">
                      <Icon className="w-5 h-5 text-red-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-display font-bold text-lg mb-2">{localized(s, 'name', locale)}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{localized(s, 'shortDesc', locale)}</p>
                    <span className="inline-flex items-center gap-1 text-sm text-red-600 font-medium mt-3 group-hover:gap-2 transition-all">{t.home.learnMore} <ArrowRight className="w-3.5 h-3.5" /></span>
                  </Link>
                </motion.div>
              )
            }) ?? []}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-[1200px] mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-display font-bold tracking-tight">{t.home.popularProducts} <span className="text-red-600">{t.nav.products.toLowerCase()}</span></h2>
            <p className="text-gray-500 mt-2">{t.home.popularProductsSub}</p>
          </div>
          <Link href="/products" className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:underline">{t.home.allProductsLink} <ArrowRight className="w-3.5 h-3.5" /></Link>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(products ?? [])?.slice?.(0, 6)?.map?.((p: any, i: number) => (
            <motion.div key={p?.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link href={`/products`} className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                <div className="relative aspect-[4/3] bg-gray-100">
                  {p?.imageUrl && <Image src={p?.imageUrl} alt={p?.name ?? ''} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />}
                </div>
                <div className="p-4">
                  <span className="text-xs text-red-600 font-medium">{localized(p, 'category', locale)}</span>
                  <h3 className="font-display font-bold mt-1">{localized(p, 'name', locale)}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{localized(p, 'description', locale)}</p>
                  {(p?.minPrice != null) && <p className="text-sm font-mono font-bold mt-2">{t.home.from} {p?.minPrice} MDL</p>}
                </div>
              </Link>
            </motion.div>
          )) ?? []}
        </div>
      </section>

      {/* Calculators Preview */}
      <section className="bg-black text-white py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold tracking-tight">{t.home.calcTitle}</h2>
            <p className="text-gray-400 mt-2">{t.home.calcSub}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: t.home.calc1Title, desc: t.home.calc1Desc, icon: Calculator },
              { title: t.home.calc2Title, desc: t.home.calc2Desc, icon: Maximize },
              { title: t.home.calc3Title, desc: t.home.calc3Desc, icon: Sparkles },
            ]?.map?.((c: any, i: number) => {
              const Icon = c?.icon || Calculator
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                  <Link href="/calculators" className="block bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors group">
                    <Icon className="w-8 h-8 text-red-500 mb-4" />
                    <h3 className="font-display font-bold text-lg mb-2">{c?.title}</h3>
                    <p className="text-sm text-gray-400">{c?.desc}</p>
                    <span className="inline-flex items-center gap-1 text-sm text-red-500 font-medium mt-3">{t.home.open} <ArrowRight className="w-3.5 h-3.5" /></span>
                  </Link>
                </motion.div>
              )
            }) ?? []}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="max-w-[1200px] mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold tracking-tight">{t.home.howWeWork} <span className="text-red-600">{t.home.howWeWork === 'Как мы' ? 'работаем' : t.home.howWeWork === 'How we' ? 'work' : 'lucrăm'}</span></h2>
          <p className="text-gray-500 mt-2">{t.home.howWeWorkSub}</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps?.map?.((s: any, i: number) => {
            const Icon = s?.icon
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center relative">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-red-600" />
                </div>
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-6xl font-display font-bold text-red-600/10">{i + 1}</span>
                <h3 className="font-display font-bold text-lg">{s?.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{s?.desc}</p>
              </motion.div>
            )
          }) ?? []}
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold tracking-tight">{t.home.reviewsTitle} <span className="text-red-600">{t.home.reviewsTitle === 'Отзывы' ? 'клиентов' : t.home.reviewsTitle === 'Client' ? 'Reviews' : 'clienților'}</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(reviews ?? [])?.map?.((r: any, i: number) => (
              <motion.div key={r?.id ?? i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: r?.rating ?? 5 })?.map?.((_: any, j: number) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  )) ?? []}
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{r?.text}</p>
                <div>
                  <p className="font-medium text-sm">{r?.author}</p>
                  {r?.company && <p className="text-xs text-gray-400">{r?.company}</p>}
                </div>
              </motion.div>
            )) ?? []}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-red-600 text-white py-16">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">{t.home.ctaTitle}</h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto">{t.home.ctaSub}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contacts" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-red-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                <Phone className="w-4 h-4" /> {t.home.ctaContact}
              </Link>
              <Link href="/calculators" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white font-medium rounded-lg hover:bg-red-800 transition-colors">
                <Calculator className="w-4 h-4" /> {t.home.ctaCalculate}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
