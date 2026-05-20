'use server'

import { createClient } from '@supabase/supabase-js'
import type { Order } from '@/types'

export async function trackOrder(orderId: string, email: string) {
  if (!orderId || !email) {
    throw new Error('Debes ingresar el número de orden y tu email.')
  }

  // Usamos el Service Role Key para bypassear las reglas RLS de la tabla orders
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  if (!supabaseServiceKey) {
    throw new Error('Error de configuración del servidor')
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const cleanId = orderId.replace('#', '').trim().toLowerCase()
    const cleanEmail = email.trim().toLowerCase()

    // Buscamos todas las órdenes de este email (ignorando mayúsculas)
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .ilike('customer_email', cleanEmail)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching order:', error)
      throw new Error('Orden no encontrada.')
    }

    if (!orders || orders.length === 0) {
      throw new Error('No se encontraron órdenes para este email.')
    }

    // Filtramos en memoria por el ID ingresado (los usuarios ven solo los primeros 8 caracteres)
    const matchedOrder = orders.find(o => o.id.toLowerCase().startsWith(cleanId))

    if (!matchedOrder) {
      throw new Error('Orden no encontrada con ese número.')
    }

    return matchedOrder as Order
  } catch (error) {
    if (error instanceof Error) throw error
    throw new Error('Ocurrió un error al buscar la orden.')
  }
}
