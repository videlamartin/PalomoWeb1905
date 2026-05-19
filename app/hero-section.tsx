'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { getWhatsAppUrl } from '@/lib/utils'

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center"
      style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #1A0000 50%, #0A0A0A 100%)' }}
    >
      {/* Diagonal texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #CC0000 0, #CC0000 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Red glow */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-red-primary/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-red-dark/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Year watermark */}
      <div className="absolute right-0 top-0 bottom-0 flex items-center overflow-hidden pointer-events-none" aria-hidden="true">
        <span
          className="font-display text-[20vw] text-white/[0.02] select-none"
          style={{ lineHeight: '1', writingMode: 'vertical-rl' }}
        >
          1950
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-8 h-px bg-red-primary" />
            <span className="font-condensed text-xs text-red-primary tracking-[0.4em] uppercase">
              Indumentaria Oficial · Club Atlético Independiente
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-hero text-white uppercase leading-none mb-8"
          >
            La mejor<br />
            <span className="text-red-primary">ropa</span><br />
            del Rojo
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="font-body text-lg text-gray-accent mb-10 max-w-lg leading-relaxed"
          >
            Camisetas, buzos, pantalones y accesorios oficiales. Marcas Puma y Kanji.
            Pago al recibir. Envíos a todo el país.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/catalogo"
              className="btn-primary px-10 py-4 text-base"
              id="hero-cta-btn"
            >
              Ver colección
            </Link>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary px-10 py-4 text-base"
            >
              Consultar por WhatsApp
            </a>
          </motion.div>
        </div>

        {/* Vertical label */}
        <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2" aria-hidden="true">
          <span
            className="font-condensed text-xs text-gray-muted tracking-[0.5em] uppercase"
            style={{ writingMode: 'vertical-rl' }}
          >
            El Palomo · 1950
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <svg className="w-5 h-5 text-gray-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
