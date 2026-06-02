import { DM_Sans, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler'
import { Providers } from '@/components/providers'
import { LocalBusinessSchema, OrganizationSchema } from '@/lib/schema'

export const dynamic = 'force-dynamic';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })
const jakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: 'HotPrint — Типография премиальной отделки в Кишинёве | Шелкография, УФ-лак, тиснение, пластиковые карты',
  description: 'Типография HotPrint в Кишинёве: офсетная (Heidelberg) и цифровая печать (Ricoh), шелкография, выборочный УФ-лак, тиснение фольгой, конгрев, тампопечать, пластиковые карты. Собственное производство, тиражи от 100 шт., онлайн-калькулятор. Работаем с 1999 года.',
  openGraph: {
    title: 'HotPrint — Типография премиальной отделки в Кишинёве',
    description: 'Офсетная и цифровая печать, шелкография, УФ-лак, тиснение фольгой. Собственное производство с 1999 года.',
    images: ['/og-image.png'],
  },
  alternates: {
    languages: {
      'ru': '/',
      'ro': '/',
      'en': '/',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js" />
      </head>
      <body className={`${dmSans.variable} ${jakartaSans.variable} ${jetbrainsMono.variable} font-sans`}>
        <LocalBusinessSchema />
        <OrganizationSchema />
        <Providers>
          {children}
          <Toaster />
          <ChunkLoadErrorHandler />
        </Providers>
      </body>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && !process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID.includes('PLACEHOLDER') && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </html>
  )
}
