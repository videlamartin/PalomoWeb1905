'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { OrderStatus, ProductCategory } from '@/types'

// --- ÓRDENES ---

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = createClient()
  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
  
  if (error) {
    console.error('Error updating order status:', error)
    throw new Error('No se pudo actualizar el estado de la orden')
  }

  // Refrescar la página para reflejar el cambio si hubiera datos cacheados
  revalidatePath('/admin/ordenes')
}

// --- PRODUCTOS ---

export async function deleteProduct(productId: string) {
  const supabase = createClient()
  const { error } = await supabase.from('products').delete().eq('id', productId)

  if (error) {
    console.error('Error deleting product:', error)
    throw new Error('No se pudo eliminar el producto')
  }

  revalidatePath('/admin/productos')
}

interface ProductData {
  id?: string
  name: string
  description: string | null
  price: number
  category: ProductCategory
  featured: boolean
  images: string[]
}

export async function upsertProduct(data: ProductData) {
  const supabase = createClient()
  const { id, ...productData } = data

  if (id) {
    // Editar existente
    const { error } = await supabase.from('products').update(productData).eq('id', id)
    if (error) throw new Error('Error al actualizar el producto')
  } else {
    // Crear nuevo
    const { error } = await supabase.from('products').insert(productData)
    if (error) throw new Error('Error al crear el producto')
  }

  revalidatePath('/admin/productos')
}
