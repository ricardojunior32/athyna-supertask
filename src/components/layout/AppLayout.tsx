import { Outlet, ScrollRestoration } from 'react-router'
import { Footer } from './Footer'
import { Header } from './Header'

export const AppLayout = () => {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex-1 pt-6 pb-20">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
