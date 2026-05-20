import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function getWhatsAppUrl(message?: string): string {
  const phone = '5491125452488'
  const encodedMessage = message ? encodeURIComponent(message) : ''
  return `https://wa.me/${phone}${encodedMessage ? `?text=${encodedMessage}` : ''}`
}

export function getProductWhatsAppUrl(productName: string, size?: string): string {
  const message = size
    ? `Hola! Me interesa ${productName} talle ${size}. ¿Tienen disponibilidad?`
    : `Hola! Me interesa ${productName}. ¿Tienen disponibilidad?`
  return getWhatsAppUrl(message)
}

export function getOrderWhatsAppUrl(orderNumber: string, customerName: string): string {
  const message = `Hola! Quiero consultar sobre mi pedido #${orderNumber}. Soy ${customerName}.`
  return getWhatsAppUrl(message)
}

/**
 * Abre WhatsApp directo al número del cliente (panel admin).
 * Limpia el teléfono dejando solo dígitos y agrega el código Argentina (54) si falta.
 */
export function getCustomerWhatsAppUrl(customerPhone: string, orderShortId: string): string {
  // Limpiar: solo dígitos
  const digits = customerPhone.replace(/\D/g, '')
  // Si ya empieza con 54 lo usamos tal cual, sino lo agregamos
  const phone = digits.startsWith('54') ? digits : `54${digits}`
  const message = encodeURIComponent(
    `Hola! Te contactamos de El Palomo 1950 por tu pedido #${orderShortId}. ¿Cómo estás?`
  )
  return `https://wa.me/${phone}?text=${message}`
}


export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '...' : str
}

export function getStockLabel(stock: number): { label: string; color: string } | null {
  if (stock === 0) return { label: 'Sin stock', color: 'text-gray-muted' }
  if (stock < 4) return { label: `Últimos ${stock}`, color: 'text-yellow-400' }
  return null
}
