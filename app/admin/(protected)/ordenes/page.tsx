import { createClient } from '@/lib/supabase/server'
import type { Order } from '@/types'
import { OrdenesClient } from './ordenes-client'

async function getOrders(): Promise<Order[]> {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    return (data as Order[]) ?? []
  } catch {
    return []
  }
}

export default async function AdminOrdenesPage() {
  const orders = await getOrders()
  return <OrdenesClient initialOrders={orders} />
}
