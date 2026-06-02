'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { useT } from '@/lib/i18n'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const t = useT()

  return (
    <nav aria-label="Breadcrumb" className="max-w-[1200px] mx-auto px-4 pt-4 pb-0">
      <ol className="flex items-center flex-wrap gap-1 text-sm text-gray-500">
        <li className="flex items-center">
          <Link href="/" className="flex items-center gap-1 hover:text-red-600 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>{t.breadcrumbs.home}</span>
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center">
            <ChevronRight className="w-3.5 h-3.5 mx-1 text-gray-300" />
            {item.href ? (
              <Link href={item.href} className="hover:text-red-600 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
