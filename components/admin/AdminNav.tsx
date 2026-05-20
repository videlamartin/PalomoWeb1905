'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/productos', label: 'Productos', icon: '👕' },
  { href: '/admin/ordenes', label: 'Órdenes', icon: '📦' },
]

export function AdminDesktopNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 p-4 space-y-2" aria-label="Navegación admin">
      {NAV.map((item) => {
        const isActive = pathname.startsWith(item.href)
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 font-condensed text-sm uppercase tracking-wider transition-all rounded-sm border-l-2
              ${isActive 
                ? 'bg-red-500/10 text-white border-red-primary' 
                : 'text-gray-accent hover:text-white hover:bg-white/5 border-transparent'
              }
            `}
          >
            <span aria-hidden="true" className="text-lg">{item.icon}</span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function AdminMobileNav() {
  const pathname = usePathname()

  return (
    <div className="flex items-stretch flex-1">
      {NAV.map((item) => {
        const isActive = pathname.startsWith(item.href)
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-3 font-condensed text-[10px] uppercase tracking-wider transition-all border-t-2
              ${isActive 
                ? 'bg-red-500/10 text-white border-red-primary' 
                : 'text-gray-muted hover:text-white active:bg-white/5 border-transparent'
              }
            `}
          >
            <span className="text-xl leading-none" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
