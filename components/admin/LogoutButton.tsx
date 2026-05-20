'use client'

export function LogoutButton() {
  const handleLogout = async () => {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
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
