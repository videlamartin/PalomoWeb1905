import { z } from 'zod'

export const checkoutSchema = z.object({
  customer_name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'Nombre demasiado largo'),
  customer_email: z
    .string()
    .email('Email inválido'),
  customer_phone: z
    .string()
    .min(8, 'Teléfono inválido')
    .max(20, 'Teléfono demasiado largo')
    .regex(/^[\d\s\+\-\(\)]+$/, 'Solo números, espacios y + - ()'),
  shipping_address: z
    .string()
    .min(5, 'Dirección inválida')
    .max(200, 'Dirección demasiado larga'),
  shipping_city: z
    .string()
    .min(2, 'Ciudad inválida')
    .max(100, 'Ciudad demasiado larga'),
  shipping_province: z
    .string()
    .min(2, 'Seleccioná una provincia'),
  notes: z
    .string()
    .max(500, 'Máximo 500 caracteres')
    .optional(),
})

export type CheckoutSchema = z.infer<typeof checkoutSchema>

export const orderApiSchema = z.object({
  customer_name: z.string().min(3),
  customer_email: z.string().email(),
  customer_phone: z.string().min(8),
  shipping_address: z.string().min(5),
  shipping_city: z.string().min(2),
  shipping_province: z.string().min(2),
  notes: z.string().optional(),
  items: z.array(z.object({
    product_id: z.string().uuid(),
    size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
    quantity: z.number().int().positive().max(10),
    unit_price: z.number().positive(),
    product_name: z.string(),
  })).min(1, 'El carrito está vacío'),
})

export type OrderApiSchema = z.infer<typeof orderApiSchema>

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

export type LoginSchema = z.infer<typeof loginSchema>
