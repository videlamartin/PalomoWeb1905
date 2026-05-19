import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const NAV = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/productos', label: 'Productos', icon: '👕' },
    { href: '/admin/ordenes', label: 'Órdenes', icon: '📦' },
  ]

  return (
    <div className="min-h-screen bg-black-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black-800 border-r border-white/5 flex-shrink-0 flex flex-col">
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
              {user.email}
            </p>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button
              type="button"
              onClick={async () => {
                const supabase = (await import('@/lib/supabase/client')).createClient()
                await supabase.auth.signOut()
                window.location.href = '/admin/login'
              }}
              className="w-full flex items-center gap-3 px-4 py-3 font-condensed text-xs text-gray-muted hover:text-red-primary uppercase tracking-wider transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  )
}
