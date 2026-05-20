'use client'

import { logout } from '@/app/admin/actions'

interface LogoutButtonProps {
  compact?: boolean
}

export function LogoutButton({ compact = false }: LogoutButtonProps) {
  const handleLogout = async () => {
    await logout()
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleLogout}
        className="flex flex-col items-center justify-center gap-0.5 py-3 w-full font-condensed text-[10px] text-gray-muted hover:text-red-primary uppercase tracking-wider transition-colors active:bg-white/5"
        aria-label="Cerrar sesión"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Salir</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-4 py-3 font-condensed text-xs text-gray-muted hover:text-red-primary uppercase tracking-wider transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Cerrar sesión
    </button>
  )
}
