import { Header } from './header'
import { Footer } from './footer'

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}
