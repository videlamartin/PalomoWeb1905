'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginSchema } from '@/lib/validations'
import type { Metadata } from 'next'

export default function AdminLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginSchema) => {
    setIsLoading(true)
    setLoginError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        setLoginError('Email o contraseña incorrectos')
        return
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch {
      setLoginError('Error de conexión. Intentá de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="font-display text-4xl text-white tracking-wider block">EL PALOMO</span>
          <span className="font-condensed text-[11px] text-red-primary tracking-[0.4em] uppercase">
            1950 · Panel Admin
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="label-field" htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className={`input-field ${errors.email ? 'input-error' : ''}`}
              placeholder="admin@elpalomo.com"
            />
            {errors.email && (
              <p className="mt-1 font-condensed text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="label-field" htmlFor="admin-password">Contraseña</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              className={`input-field ${errors.password ? 'input-error' : ''}`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 font-condensed text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>

          {loginError && (
            <div className="p-3 border border-red-500/30 bg-red-500/10">
              <p className="font-condensed text-xs text-red-400">{loginError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-4 mt-2 disabled:opacity-60"
            id="admin-login-btn"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Ingresando...
              </span>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

        <p className="mt-8 text-center font-condensed text-xs text-gray-muted uppercase tracking-wider">
          <a href="/" className="hover:text-white transition-colors">← Volver al sitio</a>
        </p>
      </div>
    </div>
  )
}
