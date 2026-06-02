'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Maximize, Scale, ArrowLeftRight } from 'lucide-react'
import { useT } from '@/lib/i18n'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

const formats: Record<string, { w: number; h: number }> = {
  'A3': { w: 297, h: 420 },
  'A4': { w: 210, h: 297 },
  'A5': { w: 148, h: 210 },
  'A6': { w: 105, h: 148 },
  'DL': { w: 99, h: 210 },
  'Визитка 90x50': { w: 90, h: 50 },
  'SRA3': { w: 320, h: 450 },
  'B1': { w: 700, h: 1000 },
  'B2': { w: 500, h: 700 },
  'B3': { w: 350, h: 500 },
}

export function CalculatorsClient() {
  const t = useT()
  const [tab, setTab] = useState<'weight' | 'layout' | 'gsm'>('weight')

  return (
    <>
    <Breadcrumbs items={[{ label: t.calculatorsPage.title }]} />
    <div className="max-w-[1200px] mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold tracking-tight mb-2">{t.calculatorsPage.title}</h1>
      <p className="text-gray-500 mb-8">{t.calculatorsPage.subtitle}</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {[
          { id: 'weight' as const, label: t.calculatorsPage.weightTab, icon: Scale },
          { id: 'layout' as const, label: t.calculatorsPage.layoutTab, icon: Maximize },
          { id: 'gsm' as const, label: t.calculatorsPage.gsmTab, icon: ArrowLeftRight },
        ]?.map?.((item: any) => {
          const Icon = item?.icon
          return (
            <button key={item?.id} onClick={() => setTab(item?.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                tab === item?.id ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              <Icon className="w-4 h-4" /> {item?.label}
            </button>
          )
        }) ?? []}
      </div>

      {tab === 'weight' && <WeightCalculator />}
      {tab === 'layout' && <LayoutCalculator />}
      {tab === 'gsm' && <GSMConverter />}
    </div>
    </>
  )
}

function WeightCalculator() {
  const t = useT()
  const [sheetFormat, setSheetFormat] = useState('SRA3')
  const [productFormat, setProductFormat] = useState('A4')
  const [gsm, setGsm] = useState(300)
  const [copies, setCopies] = useState(1000)
  const [bleed, setBleed] = useState(3)

  const sheet = formats?.[sheetFormat] ?? { w: 320, h: 450 }
  const product = formats?.[productFormat] ?? { w: 210, h: 297 }

  const pw = (product?.w ?? 0) + bleed * 2
  const ph = (product?.h ?? 0) + bleed * 2
  const normal = Math.floor((sheet?.w ?? 1) / pw) * Math.floor((sheet?.h ?? 1) / ph)
  const rotated = Math.floor((sheet?.w ?? 1) / ph) * Math.floor((sheet?.h ?? 1) / pw)
  const perSheet = Math.max(normal, rotated, 1)
  const totalSheets = Math.ceil(copies / perSheet)
  const sheetWeight = ((sheet?.w ?? 0) / 1000) * ((sheet?.h ?? 0) / 1000) * gsm / 1000
  const totalWeight = totalSheets * sheetWeight
  const waste = (1 - (copies / (totalSheets * perSheet))) * 100

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-display font-bold mb-6">{t.calculatorsPage.weightCalcTitle}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">{t.calculatorsPage.sheetFormat}</label>
            <select value={sheetFormat} onChange={(e: any) => setSheetFormat(e?.target?.value ?? 'SRA3')}
              className="w-full px-3 py-2 border rounded-lg text-sm">
              {Object.keys(formats ?? {})?.map?.((f: string) => <option key={f} value={f}>{f} ({formats?.[f]?.w}×{formats?.[f]?.h}мм)</option>) ?? []}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{t.calculatorsPage.productFormat}</label>
            <select value={productFormat} onChange={(e: any) => setProductFormat(e?.target?.value ?? 'A4')}
              className="w-full px-3 py-2 border rounded-lg text-sm">
              {Object.keys(formats ?? {})?.map?.((f: string) => <option key={f} value={f}>{f} ({formats?.[f]?.w}×{formats?.[f]?.h}мм)</option>) ?? []}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{t.calculatorsPage.paperDensity}</label>
            <input type="number" value={gsm} onChange={(e: any) => setGsm(Number(e?.target?.value) || 0)}
              className="w-full px-3 py-2 border rounded-lg text-sm" min={60} max={400} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{t.calculatorsPage.copies}</label>
            <input type="number" value={copies} onChange={(e: any) => setCopies(Number(e?.target?.value) || 0)}
              className="w-full px-3 py-2 border rounded-lg text-sm" min={1} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{t.calculatorsPage.bleed}</label>
            <input type="number" value={bleed} onChange={(e: any) => setBleed(Number(e?.target?.value) || 0)}
              className="w-full px-3 py-2 border rounded-lg text-sm" min={0} max={10} />
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="font-display font-bold text-lg">{t.calculatorsPage.result}</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-sm text-gray-500">{t.calculatorsPage.itemsPerSheet}:</span><span className="font-mono font-bold">{perSheet}</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-500">{t.calculatorsPage.sheetsRequired}:</span><span className="font-mono font-bold">{totalSheets}</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-500">{t.calculatorsPage.totalWeight}:</span><span className="font-mono font-bold">{totalWeight?.toFixed?.(2) ?? '0'} {t.calculatorsPage.kg}</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-500">{t.calculatorsPage.waste}:</span><span className="font-mono font-bold text-orange-600">{waste?.toFixed?.(1) ?? '0'}%</span></div>
          </div>
          {totalWeight > 50 && <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded">⚠️ {t.calculatorsPage.weightWarning}</p>}
        </div>
      </div>
    </motion.div>
  )
}

function LayoutCalculator() {
  const t = useT()
  const [sheetFormat, setSheetFormat] = useState('SRA3')
  const [productW, setProductW] = useState(90)
  const [productH, setProductH] = useState(50)
  const [bleed, setBleed] = useState(3)

  const sheet = formats?.[sheetFormat] ?? { w: 320, h: 450 }
  const pw = productW + bleed * 2
  const ph = productH + bleed * 2
  const normal = Math.floor((sheet?.w ?? 1) / pw) * Math.floor((sheet?.h ?? 1) / ph)
  const rotated = Math.floor((sheet?.w ?? 1) / ph) * Math.floor((sheet?.h ?? 1) / pw)
  const best = Math.max(normal, rotated)
  const usedArea = best * pw * ph
  const sheetArea = (sheet?.w ?? 1) * (sheet?.h ?? 1)
  const efficiency = (usedArea / sheetArea) * 100

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-display font-bold mb-6">{t.calculatorsPage.layoutCalcTitle}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">{t.calculatorsPage.sheetFormatLabel}</label>
            <select value={sheetFormat} onChange={(e: any) => setSheetFormat(e?.target?.value ?? 'SRA3')}
              className="w-full px-3 py-2 border rounded-lg text-sm">
              {Object.keys(formats ?? {})?.map?.((f: string) => <option key={f} value={f}>{f} ({formats?.[f]?.w}×{formats?.[f]?.h}мм)</option>) ?? []}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">{t.calculatorsPage.width}</label>
              <input type="number" value={productW} onChange={(e: any) => setProductW(Number(e?.target?.value) || 0)}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{t.calculatorsPage.height}</label>
              <input type="number" value={productH} onChange={(e: any) => setProductH(Number(e?.target?.value) || 0)}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{t.calculatorsPage.bleed}</label>
            <input type="number" value={bleed} onChange={(e: any) => setBleed(Number(e?.target?.value) || 0)}
              className="w-full px-3 py-2 border rounded-lg text-sm" min={0} max={10} />
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="font-display font-bold text-lg">{t.calculatorsPage.result}</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-sm text-gray-500">{t.calculatorsPage.noRotation}:</span><span className="font-mono font-bold">{normal} {t.calculatorsPage.pcs}</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-500">{t.calculatorsPage.withRotation}:</span><span className="font-mono font-bold">{rotated} {t.calculatorsPage.pcs}</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-500">{t.calculatorsPage.optimal}:</span><span className="font-mono font-bold text-red-600">{best} {t.calculatorsPage.pcs}</span></div>
            <div className="flex justify-between"><span className="text-sm text-gray-500">{t.calculatorsPage.efficiency}:</span><span className="font-mono font-bold">{efficiency?.toFixed?.(1) ?? '0'}%</span></div>
          </div>
          {/* Visual layout */}
          <div className="mt-4 bg-white border-2 border-dashed rounded-lg p-2" style={{ aspectRatio: `${sheet?.w ?? 1}/${sheet?.h ?? 1}` }}>
            <div className="w-full h-full relative">
              {Array.from({ length: best })?.map?.((_: any, i: number) => (
                <div key={i} className="absolute bg-red-100 border border-red-300 rounded-sm" style={{
                  width: `${(pw / (sheet?.w ?? 1)) * 100}%`,
                  height: `${(ph / (sheet?.h ?? 1)) * 100}%`,
                  left: `${((i % Math.floor((sheet?.w ?? 1) / pw)) * pw / (sheet?.w ?? 1)) * 100}%`,
                  top: `${(Math.floor(i / Math.floor((sheet?.w ?? 1) / pw)) * ph / (sheet?.h ?? 1)) * 100}%`,
                }} />
              )) ?? []}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function GSMConverter() {
  const t = useT()
  const [mode, setMode] = useState<'toGsm' | 'toWeight'>('toGsm')
  const [weight, setWeight] = useState(80)
  const [width, setWidth] = useState(210)
  const [height, setHeight] = useState(297)
  const [gsmVal, setGsmVal] = useState(80)

  const calcGsm = weight / ((width / 1000) * (height / 1000))
  const calcWeight = gsmVal * (width / 1000) * (height / 1000)

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-display font-bold mb-6">{t.calculatorsPage.gsmTitle}</h2>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setMode('toGsm')} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'toGsm' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>{t.calculatorsPage.weightToGsm}</button>
        <button onClick={() => setMode('toWeight')} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === 'toWeight' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>{t.calculatorsPage.gsmToWeight}</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block">{t.calculatorsPage.width}</label>
              <input type="number" value={width} onChange={(e: any) => setWidth(Number(e?.target?.value) || 0)}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{t.calculatorsPage.height}</label>
              <input type="number" value={height} onChange={(e: any) => setHeight(Number(e?.target?.value) || 0)}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
          </div>
          {mode === 'toGsm' ? (
            <div>
              <label className="text-sm font-medium mb-1 block">{t.calculatorsPage.sheetWeight}</label>
              <input type="number" value={weight} onChange={(e: any) => setWeight(Number(e?.target?.value) || 0)}
                className="w-full px-3 py-2 border rounded-lg text-sm" step={0.1} />
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium mb-1 block">{t.calculatorsPage.density}</label>
              <input type="number" value={gsmVal} onChange={(e: any) => setGsmVal(Number(e?.target?.value) || 0)}
                className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
          )}
        </div>
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-display font-bold text-lg mb-4">{t.calculatorsPage.result}</h3>
          {mode === 'toGsm' ? (
            <p className="text-3xl font-mono font-bold text-red-600">{isFinite(calcGsm) ? calcGsm?.toFixed?.(1) : '0'} <span className="text-base text-gray-500">{t.calculatorsPage.gsm}</span></p>
          ) : (
            <p className="text-3xl font-mono font-bold text-red-600">{calcWeight?.toFixed?.(2) ?? '0'} <span className="text-base text-gray-500">{t.calculatorsPage.grams}</span></p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
