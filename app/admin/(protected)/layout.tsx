import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from '@/components/admin/LogoutButton'

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // TypeScript guard — después del redirect user nunca es null
  const userEmail = user!.email ?? ''

  const NAV = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/productos', label: 'Productos', icon: '👕' },
    { href: '/admin/ordenes', label: 'Órdenes', icon: '📦' },
  ]

  return (
    <div className="min-h-screen bg-black-900">
      {/* ── MOBILE: Top header ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-black-800 border-b border-white/5 flex items-center justify-between px-4 h-14">
        <Link href="/" aria-label="Ir al sitio público">
          <span className="font-display text-lg text-white tracking-wider">EL PALOMO</span>
          <span className="font-condensed text-[9px] text-red-primary tracking-[0.3em] uppercase ml-2">Admin</span>
        </Link>
        <span className="font-condensed text-[10px] text-gray-muted uppercase tracking-wider truncate max-w-[140px]">
          {userEmail}
        </span>
      </header>

      <div className="flex">
        {/* ── DESKTOP: Sidebar ── */}
        <aside className="hidden lg:flex w-64 bg-black-800 border-r border-white/5 flex-shrink-0 flex-col min-h-screen">
          {/* Logo */}
          <div className="p-6 border-b border-white/5">
            <Link href="/" className="block" aria-label="Ir al sitio público">
              <span className="font-display text-xl text-white tracking-wider block">EL PALOMO</span>
              <span className="font-condensed text-[10px] text-red-primary tracking-[0.3em] uppercase">
                1950 · Admin
              </span>
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1" aria-label="Navegación admin">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 font-condensed text-sm text-gray-accent hover:text-white hover:bg-white/5 uppercase tracking-wider transition-colors"
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User / logout */}
          <div className="p-4 border-t border-white/5">
            <div className="mb-3 px-4">
              <p className="font-condensed text-xs text-gray-muted uppercase tracking-wider truncate">
                {userEmail}
              </p>
            </div>
            <LogoutButton />
          </div>
        </aside>

        {/* Main content */}
        {/* mobile: pt-18 (bajo header 56px) + pb-24 (sobre bottom nav). Desktop: p-8 normal */}
        <main className="flex-1 overflow-auto min-h-screen p-4 pt-18 pb-24 lg:p-8">
          {children}
        </main>
      </div>

      {/* ── MOBILE: Bottom navigation bar ── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-black-800 border-t border-white/10"
        aria-label="Navegación admin mobile"
      >
        <div className="flex items-stretch">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 font-condensed text-[10px] text-gray-muted hover:text-white uppercase tracking-wider transition-colors active:bg-white/5"
            >
              <span className="text-xl leading-none" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
          {/* Logout en la bottom bar */}
          <div className="flex-1 flex flex-col items-center justify-center border-l border-white/5">
            <LogoutButton compact />
          </div>
        </div>
      </nav>
    </div>
  )
}

