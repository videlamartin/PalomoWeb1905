import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { orderApiSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 1. Validate body
    const parsed = orderApiSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { items, ...orderData } = parsed.data
    const supabase = createAdminClient()

    // 2. Verify stock for each item
    for (const item of items) {
      const { data: sizeData, error } = await supabase
        .from('product_sizes')
        .select('stock')
        .eq('product_id', item.product_id)
        .eq('size', item.size)
        .single()

      if (error || !sizeData) {
        return NextResponse.json(
          { error: `Talle ${item.size} no disponible para "${item.product_name}"` },
          { status: 400 }
        )
      }

      if (sizeData.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Stock insuficiente para "${item.product_name}" talle ${item.size}. Disponible: ${sizeData.stock}`,
          },
          { status: 400 }
        )
      }
    }

    // 3. Calculate total
    const total = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

    // 4. Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        shipping_address: orderData.shipping_address,
        shipping_city: orderData.shipping_city,
        shipping_province: orderData.shipping_province,
        notes: orderData.notes,
        total,
        status: 'pendiente',
      })
      .select('id')
      .single()

    if (orderError || !order) {
      console.error('Order creation error:', orderError)
      return NextResponse.json({ error: 'Error al crear el pedido' }, { status: 500 })
    }

    // 5. Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      size: item.size,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

    if (itemsError) {
      console.error('Order items error:', itemsError)
      // Rollback order
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json({ error: 'Error al guardar los items del pedido' }, { status: 500 })
    }

    // 6. Decrement stock
    for (const item of items) {
      const { error: stockError } = await supabase.rpc('decrement_stock', {
        p_product_id: item.product_id,
        p_size: item.size,
        p_quantity: item.quantity,
      })

      if (stockError) {
        // Fallback: manual update
        await supabase
          .from('product_sizes')
          .update({
            stock: supabase.rpc('decrement_stock', {
              p_product_id: item.product_id,
              p_size: item.size,
              p_quantity: item.quantity,
            }),
          })
          .eq('product_id', item.product_id)
          .eq('size', item.size)
      }
    }

    return NextResponse.json({ orderId: order.id, success: true }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/orders:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
