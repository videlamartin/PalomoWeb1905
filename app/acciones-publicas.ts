'use server'

import { createClient } from '@supabase/supabase-js'
import type { Order } from '@/types'

export async function trackOrder(orderId: string, email: string): Promise<{ error: string } | { data: Order }> {
  if (!orderId || !email) {
    return { error: 'Debes ingresar el número de orden y tu email.' }
  }

  // Usamos el Service Role Key para bypassear las reglas RLS de la tabla orders
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  if (!supabaseServiceKey) {
    return { error: 'Error de configuración del servidor' }
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    const cleanId = orderId.replace('#', '').trim().toLowerCase()
    const cleanEmail = email.trim().toLowerCase()

    // Buscamos todas las órdenes de este email (ignorando mayúsculas)
    const { data: orders, error: dbError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .ilike('customer_email', cleanEmail)
      .order('created_at', { ascending: false })

    if (dbError) {
      console.error('Error fetching order:', dbError)
      return { error: 'Ocurrió un error en la base de datos.' }
    }

    if (!orders || orders.length === 0) {
      return { error: 'No se encontraron órdenes para este email.' }
    }

    // Filtramos en memoria por el ID ingresado (los usuarios ven solo los primeros 8 caracteres)
    const matchedOrder = orders.find(o => o.id.toLowerCase().startsWith(cleanId))

    if (!matchedOrder) {
      return { error: 'El email coincide con pedidos anteriores, pero el número de orden no existe.' }
    }

    return { data: matchedOrder as Order }
  } catch (error) {
    return { error: 'Ocurrió un error inesperado al buscar la orden.' }
  }
}
