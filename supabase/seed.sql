-- ============================================
-- EL PALOMO 1950 — SEED DATA (12 productos demo)
-- Ejecutar DESPUÉS de schema.sql
-- ============================================

-- Insertar productos con IDs fijos para imágenes deterministas
insert into products (id, name, description, price, category, images, featured) values

-- CAMISETAS (3)
(
  '11111111-0001-0001-0001-000000000001',
  'Camiseta Titular 2024 Puma',
  'Camiseta oficial de Independiente temporada 2024. Diseño titular en rojo y blanco. Tecnología DryCell para máxima comodidad. Material: 100% poliéster reciclado.',
  89999,
  'camisetas',
  array[
    'https://picsum.photos/seed/palomo1a/800/1000',
    'https://picsum.photos/seed/palomo1b/800/1000'
  ],
  true
),
(
  '11111111-0001-0001-0001-000000000002',
  'Camiseta Alternativa 2024 Puma',
  'Camiseta alternativa oficial temporada 2024. Color blanco con detalles rojos. Ideal para lucirla en los partidos de visitante.',
  89999,
  'camisetas',
  array[
    'https://picsum.photos/seed/palomo2a/800/1000',
    'https://picsum.photos/seed/palomo2b/800/1000'
  ],
  true
),
(
  '11111111-0001-0001-0001-000000000003',
  'Camiseta Tercera Verde 2024 Puma',
  'Edición especial tercera camiseta 2024. Color verde con escudo bordado. Edición limitada.',
  89999,
  'camisetas',
  array[
    'https://picsum.photos/seed/palomo3a/800/1000',
    'https://picsum.photos/seed/palomo3b/800/1000'
  ],
  true
),

-- BUZOS (3)
(
  '22222222-0002-0002-0002-000000000004',
  'Buzo con Capucha Kanji Rojo',
  'Buzo con capucha de la marca Kanji, colección Independiente. Rojo intenso con escudo bordado en el pecho. Interior de polar suave.',
  64999,
  'buzos',
  array[
    'https://picsum.photos/seed/palomo4a/800/1000',
    'https://picsum.photos/seed/palomo4b/800/1000'
  ],
  true
),
(
  '22222222-0002-0002-0002-000000000005',
  'Buzo Rompeviento Kanji Negro',
  'Rompevientos Kanji edición Independiente. Color negro con logo rojo. Bolsillos laterales con cierre. Ideal para días fríos.',
  72999,
  'buzos',
  array[
    'https://picsum.photos/seed/palomo5a/800/1000',
    'https://picsum.photos/seed/palomo5b/800/1000'
  ],
  true
),
(
  '22222222-0002-0002-0002-000000000006',
  'Buzo Training Puma Independiente',
  'Buzo de entrenamiento oficial Puma. Material deportivo de alta calidad con tecnología de absorción de humedad.',
  59999,
  'buzos',
  array[
    'https://picsum.photos/seed/palomo6a/800/1000',
    'https://picsum.photos/seed/palomo6b/800/1000'
  ],
  false
),

-- PANTALONES (3)
(
  '33333333-0003-0003-0003-000000000007',
  'Pantalón Training Puma Rojo',
  'Pantalón de entrenamiento oficial Puma. Cintura elástica con cordón. Bolsillos laterales. Color rojo con logos de Independiente.',
  44999,
  'pantalones',
  array[
    'https://picsum.photos/seed/palomo7a/800/1000',
    'https://picsum.photos/seed/palomo7b/800/1000'
  ],
  false
),
(
  '33333333-0003-0003-0003-000000000008',
  'Pantalón Arquero Kanji 2024',
  'Pantalón largo de arquero Kanji, temporada 2024. Acolchado en rodillas. Negro con detalles rojos. Protección y estilo.',
  49999,
  'pantalones',
  array[
    'https://picsum.photos/seed/palomo8a/800/1000',
    'https://picsum.photos/seed/palomo8b/800/1000'
  ],
  true
),
(
  '33333333-0003-0003-0003-000000000009',
  'Pantalón Buzo Kanji Negro',
  'Pantalón de buzo Kanji con puños. Color negro con escudo de Independiente bordado. Comodidad total para el día a día.',
  52999,
  'pantalones',
  array[
    'https://picsum.photos/seed/palomo9a/800/1000',
    'https://picsum.photos/seed/palomo9b/800/1000'
  ],
  false
),

-- ACCESORIOS (3)
(
  '44444444-0004-0004-0004-000000000010',
  'Gorra Kanji Independiente Roja',
  'Gorra snapback Kanji oficial de Independiente. Bordado del escudo en el frente. Talla única regulable. Color rojo.',
  24999,
  'accesorios',
  array[
    'https://picsum.photos/seed/palomo10a/800/1000',
    'https://picsum.photos/seed/palomo10b/800/1000'
  ],
  true
),
(
  '44444444-0004-0004-0004-000000000011',
  'Bufanda Oficial Independiente',
  'Bufanda oficial de Independiente. Tejido acrílico suave. Colores rojo y blanco con escudo y "El Rojo" bordados. 140cm de largo.',
  18999,
  'accesorios',
  array[
    'https://picsum.photos/seed/palomo11a/800/1000',
    'https://picsum.photos/seed/palomo11b/800/1000'
  ],
  false
),
(
  '44444444-0004-0004-0004-000000000012',
  'Medias Puma Independiente',
  'Medias oficiales Puma de Independiente. Pack x2. Algodón con refuerzo en talón y puntera. Rojo con franjas blancas.',
  9999,
  'accesorios',
  array[
    'https://picsum.photos/seed/palomo12a/800/1000',
    'https://picsum.photos/seed/palomo12b/800/1000'
  ],
  false
);

-- Stock por talle para cada producto
-- Camiseta Titular 2024
insert into product_sizes (product_id, size, stock) values
('11111111-0001-0001-0001-000000000001', 'S', 8),
('11111111-0001-0001-0001-000000000001', 'M', 12),
('11111111-0001-0001-0001-000000000001', 'L', 10),
('11111111-0001-0001-0001-000000000001', 'XL', 5);

-- Camiseta Alternativa
insert into product_sizes (product_id, size, stock) values
('11111111-0001-0001-0001-000000000002', 'S', 3),
('11111111-0001-0001-0001-000000000002', 'M', 9),
('11111111-0001-0001-0001-000000000002', 'L', 7),
('11111111-0001-0001-0001-000000000002', 'XL', 4);

-- Camiseta Tercera Verde
insert into product_sizes (product_id, size, stock) values
('11111111-0001-0001-0001-000000000003', 'S', 5),
('11111111-0001-0001-0001-000000000003', 'M', 6),
('11111111-0001-0001-0001-000000000003', 'L', 3),
('11111111-0001-0001-0001-000000000003', 'XL', 2);

-- Buzo Capucha Kanji Rojo
insert into product_sizes (product_id, size, stock) values
('22222222-0002-0002-0002-000000000004', 'S', 7),
('22222222-0002-0002-0002-000000000004', 'M', 11),
('22222222-0002-0002-0002-000000000004', 'L', 8),
('22222222-0002-0002-0002-000000000004', 'XL', 6),
('22222222-0002-0002-0002-000000000004', 'XXL', 3);

-- Buzo Rompeviento Kanji
insert into product_sizes (product_id, size, stock) values
('22222222-0002-0002-0002-000000000005', 'S', 4),
('22222222-0002-0002-0002-000000000005', 'M', 8),
('22222222-0002-0002-0002-000000000005', 'L', 9),
('22222222-0002-0002-0002-000000000005', 'XL', 5);

-- Buzo Training Puma
insert into product_sizes (product_id, size, stock) values
('22222222-0002-0002-0002-000000000006', 'S', 6),
('22222222-0002-0002-0002-000000000006', 'M', 10),
('22222222-0002-0002-0002-000000000006', 'L', 12),
('22222222-0002-0002-0002-000000000006', 'XL', 7);

-- Pantalón Training Puma Rojo
insert into product_sizes (product_id, size, stock) values
('33333333-0003-0003-0003-000000000007', 'S', 5),
('33333333-0003-0003-0003-000000000007', 'M', 9),
('33333333-0003-0003-0003-000000000007', 'L', 8),
('33333333-0003-0003-0003-000000000007', 'XL', 4);

-- Pantalón Arquero Kanji
insert into product_sizes (product_id, size, stock) values
('33333333-0003-0003-0003-000000000008', 'S', 3),
('33333333-0003-0003-0003-000000000008', 'M', 7),
('33333333-0003-0003-0003-000000000008', 'L', 6),
('33333333-0003-0003-0003-000000000008', 'XL', 4);

-- Pantalón Buzo Kanji Negro
insert into product_sizes (product_id, size, stock) values
('33333333-0003-0003-0003-000000000009', 'S', 8),
('33333333-0003-0003-0003-000000000009', 'M', 11),
('33333333-0003-0003-0003-000000000009', 'L', 9),
('33333333-0003-0003-0003-000000000009', 'XL', 6);

-- Gorra Kanji
insert into product_sizes (product_id, size, stock) values
('44444444-0004-0004-0004-000000000010', 'S', 15),
('44444444-0004-0004-0004-000000000010', 'M', 15),
('44444444-0004-0004-0004-000000000010', 'L', 15),
('44444444-0004-0004-0004-000000000010', 'XL', 10);

-- Bufanda
insert into product_sizes (product_id, size, stock) values
('44444444-0004-0004-0004-000000000011', 'S', 20),
('44444444-0004-0004-0004-000000000011', 'M', 20),
('44444444-0004-0004-0004-000000000011', 'L', 15);

-- Medias Puma
insert into product_sizes (product_id, size, stock) values
('44444444-0004-0004-0004-000000000012', 'S', 25),
('44444444-0004-0004-0004-000000000012', 'M', 30),
('44444444-0004-0004-0004-000000000012', 'L', 25),
('44444444-0004-0004-0004-000000000012', 'XL', 20);
