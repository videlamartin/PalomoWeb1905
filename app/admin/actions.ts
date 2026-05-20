'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { OrderStatus, ProductCategory } from '@/types'

// --- ÓRDENES ---

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = createClient()
  
  const { data: order } = await supabase
    .from('orders')
    .select('status, order_items(*)')
    .eq('id', orderId)
    .single()
    
  if (!order) throw new Error('Orden no encontrada')
  
  const currentStatus = order.status
  const newStatus = status
  
  if (currentStatus !== newStatus) {
    const takesStock = (s: string) => s !== 'pendiente' && s !== 'cancelado'
    const currentlyTakesStock = takesStock(currentStatus)
    const willTakeStock = takesStock(newStatus)
    
    if (!currentlyTakesStock && willTakeStock) {
      // Decrement stock (restar)
      for (const item of order.order_items) {
        await supabase.rpc('decrement_stock', {
          p_product_id: item.product_id,
          p_size: item.size,
          p_quantity: item.quantity
        })
      }
    } else if (currentlyTakesStock && !willTakeStock) {
      // Increment stock (sumar pasando negativo)
      for (const item of order.order_items) {
        await supabase.rpc('decrement_stock', {
          p_product_id: item.product_id,
          p_size: item.size,
          p_quantity: -item.quantity
        })
      }
    }

    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    
    if (error) {
      console.error('Error updating order status:', error)
      throw new Error('No se pudo actualizar el estado de la orden')
    }
  }

  // Refrescar la página para reflejar el cambio si hubiera datos cacheados
  revalidatePath('/admin/ordenes')
  revalidatePath('/admin/dashboard')
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
  sizes: { size: string; stock: number }[]
}

export async function upsertProduct(data: ProductData) {
  const supabase = createClient()
  const { id, sizes, ...productData } = data

  let productId = id

  if (productId) {
    // Editar existente
    const { error } = await supabase.from('products').update(productData).eq('id', productId)
    if (error) throw new Error('Error al actualizar el producto')
  } else {
    // Crear nuevo
    const { data: newProduct, error } = await supabase.from('products').insert(productData).select('id').single()
    if (error) throw new Error('Error al crear el producto')
    productId = newProduct.id
  }

  // Actualizar talles
  if (sizes && sizes.length > 0) {
    const sizesToUpsert = sizes.map(s => ({
      product_id: productId,
      size: s.size,
      stock: s.stock
    }))
    
    const { error: sizesError } = await supabase.from('product_sizes').upsert(sizesToUpsert, { onConflict: 'product_id, size' })
    if (sizesError) {
      console.error('Error upserting sizes:', sizesError)
      throw new Error('Error al guardar el stock de los talles')
    }
  }

  revalidatePath('/admin/productos')
  revalidatePath('/admin/dashboard')
}

// --- SESIÓN ---

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

