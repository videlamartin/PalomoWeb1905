-- ============================================
-- EL PALOMO 1950 — SUPABASE SCHEMA
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================

-- 1. ENUMS
create type product_category as enum ('camisetas', 'buzos', 'pantalones', 'accesorios');
create type product_size as enum ('XS', 'S', 'M', 'L', 'XL', 'XXL');
create type order_status as enum ('pendiente', 'preparando', 'enviado', 'entregado', 'cancelado');

-- 2. PRODUCTS
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  category product_category not null,
  images text[] default '{}',
  featured boolean default false,
  created_at timestamptz default now()
);

-- 3. PRODUCT SIZES (stock por talle)
create table product_sizes (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade not null,
  size product_size not null,
  stock integer not null default 0 check (stock >= 0),
  unique(product_id, size)
);

-- 4. ORDERS
create table orders (
  id uuid default gen_random_uuid() primary key,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address text not null,
  shipping_city text not null,
  shipping_province text not null,
  total numeric(10,2) not null check (total >= 0),
  status order_status default 'pendiente',
  notes text,
  created_at timestamptz default now()
);

-- 5. ORDER ITEMS
create table order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  size product_size not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0)
);

-- 6. STORED PROCEDURE: decrement stock
create or replace function decrement_stock(
  p_product_id uuid,
  p_size product_size,
  p_quantity integer
) returns void as $$
begin
  update product_sizes
  set stock = stock - p_quantity
  where product_id = p_product_id
    and size = p_size
    and stock >= p_quantity;

  if not found then
    raise exception 'Stock insuficiente para el producto % talle %', p_product_id, p_size;
  end if;
end;
$$ language plpgsql security definer;

-- 7. INDEXES
create index idx_products_category on products(category);
create index idx_products_featured on products(featured) where featured = true;
create index idx_product_sizes_product_id on product_sizes(product_id);
create index idx_orders_status on orders(status);
create index idx_orders_created_at on orders(created_at desc);
create index idx_order_items_order_id on order_items(order_id);

-- 8. ROW LEVEL SECURITY
alter table products enable row level security;
alter table product_sizes enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Products: lectura pública, escritura solo usuarios autenticados (admin)
create policy "Productos: lectura pública"
  on products for select using (true);

create policy "Productos: escritura solo admin"
  on products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Product sizes: lectura pública
create policy "Product sizes: lectura pública"
  on product_sizes for select using (true);

create policy "Product sizes: escritura solo admin"
  on product_sizes for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Orders: insert público (cualquiera puede crear una orden), read solo admin
create policy "Orders: insert público"
  on orders for insert with check (true);

create policy "Orders: lectura solo admin"
  on orders for select
  using (auth.role() = 'authenticated');

create policy "Orders: update solo admin"
  on orders for update
  using (auth.role() = 'authenticated');

-- Order items: insert público, lectura solo admin
create policy "Order items: insert público"
  on order_items for insert with check (true);

create policy "Order items: lectura solo admin"
  on order_items for select
  using (auth.role() = 'authenticated');
