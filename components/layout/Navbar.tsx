'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { CartIcon } from '@/components/cart/CartIcon'

const NAV_LINKS = [
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/catalogo?categoria=camisetas', label: 'Camisetas' },
  { href: '/catalogo?categoria=buzos', label: 'Buzos' },
  { href: '/catalogo?categoria=accesorios', label: 'Accesorios' },
]

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const openCart = useCartStore((s) => s.openCart)
  const itemCount = useCartStore((s) => s.getItemCount())

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isAdmin = pathname.startsWith('/admin')
  if (isAdmin) return null

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-black-900/95 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group" aria-label="El Palomo 1950 - Inicio">
            <span className="font-display text-2xl text-white tracking-wider group-hover:text-red-primary transition-colors">
              EL PALOMO
            </span>
            <span className="font-condensed text-[10px] text-red-primary tracking-[0.4em] uppercase -mt-1">
              1950 · Independiente
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-condensed text-sm uppercase tracking-widest text-gray-accent hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={openCart}
              className="relative p-2 text-gray-accent hover:text-white transition-colors"
              aria-label={`Carrito (${itemCount} items)`}
            >
              <CartIcon />
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </motion.span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-accent hover:text-white transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú"
              aria-expanded={menuOpen}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black-900/98 backdrop-blur-md border-b border-white/5"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-condensed text-sm uppercase tracking-widest text-gray-accent hover:text-white py-3 border-b border-white/5 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
