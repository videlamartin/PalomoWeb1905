# El Palomo 1950 — E-Commerce Oficial Independiente

Tienda online de indumentaria oficial del Club Atlético Independiente.  
**Puma · Kanji · Pago al recibir · Envíos a todo el país**

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 App Router + TypeScript estricto |
| Styling | TailwindCSS v3 · Bebas Neue · Barlow |
| Animaciones | Framer Motion |
| Estado | Zustand (carrito persistido en localStorage) |
| Forms | React Hook Form + Zod |
| Data fetching | TanStack Query + Supabase JS |
| Auth | Supabase Auth (panel admin) |
| Base de datos | PostgreSQL via Supabase |
| Deploy | Vercel (vercel.json incluido) |

---

## Requisitos

- **Node.js 18+**
- **Cuenta de Supabase** → [supabase.com](https://supabase.com) (gratuita)
- **Cuenta de Vercel** para deploy → [vercel.com](https://vercel.com) (gratuita)

---

## Setup de Supabase (paso a paso)

### 1. Crear el proyecto Supabase

1. Ir a [supabase.com](https://supabase.com) → **New Project**
2. Elegir nombre: `el-palomo-1950`
3. Región: **South America (São Paulo)**
4. Guardar la contraseña (no se puede recuperar)

### 2. Ejecutar el Schema

1. En el panel de Supabase → **SQL Editor** → **New Query**
2. Copiar el contenido de `supabase/schema.sql`
3. Hacer clic en **Run** ✓

### 3. Cargar los datos demo

1. En **SQL Editor** → **New Query**
2. Copiar el contenido de `supabase/seed.sql`
3. Hacer clic en **Run** ✓

### 4. Obtener las credenciales

En el panel de Supabase → **Settings** → **API**:

- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 5. Crear el usuario admin

En Supabase → **Authentication** → **Users** → **Add User**:
- Email: `admin@elpalomo.com` (o el que prefieras)
- Password: (tu contraseña segura)

---

## Variables de Entorno

Copiar `.env.local.example` a `.env.local` y completar con tus credenciales:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...tu-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJ...tu-service-role-key...
```

> ⚠️ Nunca subas `.env.local` al repositorio. Ya está en `.gitignore`.

---

## Correr en Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La app abre en **http://localhost:3000**

---

## Estructura del Proyecto

```
Palomo/
├── app/
│   ├── layout.tsx              # Root layout (fuentes, providers, navbar, footer)
│   ├── page.tsx                # Home
│   ├── hero-section.tsx        # Hero (Client Component con animaciones)
│   ├── globals.css             # Design system CSS
│   ├── catalogo/
│   │   ├── page.tsx            # Catálogo con filtros (Server Component)
│   │   └── loading.tsx         # Skeleton de carga
│   ├── producto/[id]/
│   │   ├── page.tsx            # Detalle del producto (Server Component)
│   │   ├── product-detail-client.tsx  # Interactividad (Client Component)
│   │   └── loading.tsx
│   ├── checkout/
│   │   └── page.tsx            # Formulario de compra
│   ├── confirmacion/[orderId]/
│   │   └── page.tsx            # Confirmación de pedido
│   ├── admin/
│   │   ├── layout.tsx          # Sidebar admin (protegido)
│   │   ├── login/page.tsx      # Login Supabase Auth
│   │   ├── dashboard/page.tsx  # Métricas del día
│   │   ├── productos/page.tsx  # CRUD de productos
│   │   └── ordenes/page.tsx    # Gestión de órdenes
│   └── api/
│       └── orders/route.ts     # POST: crear orden con verificación de stock
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Sticky con blur, carrito badge, mobile menu
│   │   └── Footer.tsx          # Links, WhatsApp, Instagram
│   ├── cart/
│   │   ├── CartDrawer.tsx      # Slide-in Framer Motion
│   │   └── CartIcon.tsx
│   ├── product/
│   │   ├── ProductCard.tsx     # Hover dual-image reveal
│   │   ├── ProductGrid.tsx     # Grid responsive
│   │   ├── ProductGallery.tsx  # Main + thumbnails
│   │   └── SizeSelector.tsx    # Con badges de stock
│   └── ui/
│       ├── Skeleton.tsx        # Loading skeletons
│       └── Badge.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client (SSR)
│   │   └── admin.ts            # Service role client
│   ├── utils.ts                # cn(), formatPrice(), getWhatsAppUrl()
│   └── validations.ts          # Schemas Zod
├── store/
│   └── cart.ts                 # Zustand cart (persistido)
├── types/
│   └── index.ts                # Tipos TypeScript completos
├── supabase/
│   ├── schema.sql              # Schema completo + RLS
│   └── seed.sql                # 12 productos demo
├── middleware.ts               # Protección de rutas /admin/*
├── .env.local.example          # Variables de entorno documentadas
├── vercel.json                 # Configuración Vercel (región gru1)
└── tailwind.config.ts          # Design system: colores, fuentes, animaciones
```

---

## Deploy en Vercel

### Opción 1: GitHub (recomendado)

1. Subir el código a GitHub
2. En Vercel → **New Project** → importar el repo
3. Agregar variables de entorno en **Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy automático ✓

### Opción 2: CLI

```bash
npm i -g vercel
vercel --prod
```

---

## Panel Admin

URL: `/admin/login`

Usar las credenciales del usuario creado en Supabase Auth.

---

## WhatsApp

Número configurado: **+54 9 11 2545-2488**

Para cambiarlo: editar `lib/utils.ts` → función `getWhatsAppUrl()`

---

## Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Rojo Independiente | `#CC0000` | CTAs, acentos, hover |
| Rojo oscuro | `#990000` | Hover de botones |
| Negro profundo | `#0A0A0A` | Background principal |
| Negro medio | `#111111` | Cards, inputs |
| Negro claro | `#1C1C1C` | Borders, elementos |

## Tipografías

| Fuente | Uso |
|--------|-----|
| **Bebas Neue** | Títulos, precios, CTAs |
| **Barlow Condensed** | Navbar, badges, labels |
| **Barlow** | Texto largo, descripciones |

---

*El Palomo 1950 — La mejor ropa del Rojo 🔴*
