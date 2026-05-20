'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { deleteProduct, upsertProduct } from '../../actions'
import { formatPrice } from '@/lib/utils'
import { CATEGORY_LABELS } from '@/types'
import type { Product, ProductCategory } from '@/types'

interface ProductosClientProps {
  initialProducts: Product[]
}

export function ProductosClient({ initialProducts }: ProductosClientProps) {
  const products = initialProducts
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const editId = searchParams.get('edit')
    if (editId) {
      const productToEdit = products.find(p => p.id === editId)
      if (productToEdit) {
        setEditProduct(productToEdit)
        setShowModal(true)
      }
    }
  }, [searchParams, products])

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      await deleteProduct(id)
      setDeleteConfirm(null)
    } catch (err) {
      console.error(err)
      alert('Error al eliminar el producto')
    } finally {
      setIsDeleting(false)
    }
  }

  const totalStock = (product: Product) =>
    (product.product_sizes ?? []).reduce((s, ps) => s + ps.stock, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl text-white uppercase tracking-wider">Productos</h1>
          <p className="font-condensed text-xs text-gray-muted uppercase tracking-wider mt-1">
            {products.length} productos en total
          </p>
        </div>
        <button
          onClick={() => { setEditProduct(null); setShowModal(true) }}
          className="btn-primary px-4 lg:px-6 py-2 lg:py-3 text-xs"
          id="new-product-btn"
        >
          + Nuevo
        </button>
      </div>

      {/* ── MOBILE: Cards ── */}
      <div className="lg:hidden space-y-3">
        {products.length === 0 ? (
          <div className="admin-card py-10 text-center font-condensed text-xs text-gray-muted uppercase">
            No hay productos. Creá el primero.
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="admin-card space-y-3">
              {/* Nombre + categoría */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-condensed text-sm text-white uppercase tracking-wide">{product.name}</p>
                  <span className="badge badge-category mt-1">{CATEGORY_LABELS[product.category]}</span>
                </div>
                {product.featured && (
                  <span className="font-condensed text-xs text-red-primary flex-shrink-0">★ Destacado</span>
                )}
              </div>
              {/* Precio + stock */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="font-display text-lg text-white">{formatPrice(product.price)}</span>
                <span className={`font-condensed text-sm ${totalStock(product) < 5 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {totalStock(product)} uds.
                </span>
              </div>
              {/* Acciones */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => { setEditProduct(product); setShowModal(true) }}
                  className="flex-1 font-condensed text-xs text-gray-accent hover:text-white uppercase tracking-wider py-2 border border-white/10 hover:border-white/30 transition-colors"
                >
                  Editar
                </button>
                {deleteConfirm === product.id ? (
                  <div className="flex gap-1 flex-1">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="btn-danger text-[10px] px-2 py-1 flex-1"
                      disabled={isDeleting}
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="font-condensed text-[10px] text-gray-muted hover:text-white uppercase tracking-wider px-2 py-1 border border-white/10 flex-1"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(product.id)}
                    className="btn-danger text-xs px-3 py-2"
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── DESKTOP: Table ── */}
      <div className="hidden lg:block admin-card overflow-x-auto">
        <table className="w-full" aria-label="Lista de productos">
          <thead>
            <tr className="border-b border-white/5">
              {['Nombre', 'Categoría', 'Precio', 'Stock total', 'Destacado', 'Acciones'].map((h) => (
                <th key={h} className="pb-3 text-left font-condensed text-xs text-gray-muted uppercase tracking-wider pr-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center font-condensed text-xs text-gray-muted uppercase">
                  No hay productos. Creá el primero.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="admin-table-row">
                  <td className="py-3 pr-4">
                    <p className="font-condensed text-sm text-white uppercase tracking-wide">{product.name}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="badge badge-category">{CATEGORY_LABELS[product.category]}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-display text-base text-white">{formatPrice(product.price)}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`font-condensed text-sm ${totalStock(product) < 5 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {totalStock(product)} unidades
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`font-condensed text-xs uppercase ${product.featured ? 'text-red-primary' : 'text-gray-muted'}`}>
                      {product.featured ? '★ Sí' : 'No'}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditProduct(product); setShowModal(true) }}
                        className="font-condensed text-xs text-gray-accent hover:text-white uppercase tracking-wider transition-colors px-3 py-1.5 border border-white/10 hover:border-white/30"
                      >
                        Editar
                      </button>
                      {deleteConfirm === product.id ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="btn-danger text-[10px] px-2 py-1"
                            disabled={isDeleting}
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="font-condensed text-[10px] text-gray-muted hover:text-white uppercase tracking-wider px-2 py-1 border border-white/10"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="btn-danger text-xs px-3 py-1.5"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Product Modal */}
      {showModal && (
        <ProductModal
          product={editProduct}
          onClose={() => setShowModal(false)}
          onSuccess={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

interface ProductModalProps {
  product: Product | null
  onClose: () => void
  onSuccess: () => void
}

function ProductModal({ product, onClose, onSuccess }: ProductModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    category: product?.category ?? 'camisetas' as ProductCategory,
    featured: product?.featured ?? false,
    images: product?.images?.join('\n') ?? '',
  })

  const [hasSizes, setHasSizes] = useState<boolean>(() => {
    if (product) {
      return !product.product_sizes?.some(ps => ps.size === 'U')
    }
    return true
  })

  const [sizes, setSizes] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0, U: 0 }
    if (product?.product_sizes) {
      product.product_sizes.forEach(ps => {
        initial[ps.size] = ps.stock
      })
    }
    return initial
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const data = {
        id: product?.id,
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price),
        category: form.category,
        featured: form.featured,
        images: form.images.split('\n').map((l) => l.trim()).filter(Boolean),
        sizes: hasSizes 
          ? Object.entries(sizes).filter(([size]) => size !== 'U').map(([size, stock]) => ({ size, stock }))
          : [{ size: 'U', stock: sizes['U'] || 0 }]
      }

      await upsertProduct(data)
      onSuccess()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-black-800 border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <h2 className="font-display text-2xl text-white uppercase tracking-wider">
            {product ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button onClick={onClose} className="text-gray-muted hover:text-white transition-colors" aria-label="Cerrar">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label-field">Nombre *</label>
            <input
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label-field">Descripción</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Precio ARS *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="input-field"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label-field">Categoría *</label>
              <select
                className="input-field"
                value={form.category}
                onChange={(e) => {
                  const newCat = e.target.value as ProductCategory;
                  setForm({ ...form, category: newCat });
                  if (!product) {
                    setHasSizes(newCat !== 'accesorios');
                  }
                }}
              >
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label-field">URLs de imágenes (una por línea)</label>
            <textarea
              className="input-field resize-none font-condensed text-xs"
              rows={3}
              value={form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
              placeholder="https://picsum.photos/seed/producto1/800/1000"
            />
          </div>

          <div className="flex items-center gap-3 mb-4 mt-2">
            <input
              type="checkbox"
              id="hasSizes"
              className="w-4 h-4 accent-red-500 bg-transparent border border-white/20"
              checked={hasSizes}
              onChange={(e) => setHasSizes(e.target.checked)}
            />
            <label htmlFor="hasSizes" className="font-condensed text-sm text-gray-accent uppercase tracking-widest cursor-pointer select-none">
              El producto tiene varios talles (XS a XXL)
            </label>
          </div>

          <div>
            {hasSizes ? (
              <>
                <label className="label-field mb-2 block">Stock por talle</label>
                <div className="grid grid-cols-3 gap-3">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <div key={size} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2">
                      <span className="font-display text-sm text-white w-8">{size}</span>
                      <input
                        type="number"
                        min="0"
                        className="w-full bg-transparent border-b border-white/20 text-white font-condensed text-center focus:outline-none focus:border-red-primary"
                        value={sizes[size]}
                        onChange={(e) => setSizes({ ...sizes, [size]: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <label className="label-field mb-2 block">Stock Disponible (Talle Único)</label>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 w-full sm:w-1/2">
                  <span className="font-display text-sm text-white w-8">U</span>
                  <input
                    type="number"
                    min="0"
                    className="w-full bg-transparent border-b border-white/20 text-white font-condensed text-center focus:outline-none focus:border-red-primary"
                    value={sizes['U']}
                    onChange={(e) => setSizes({ ...sizes, U: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured-check"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4 accent-red-500"
            />
            <label htmlFor="featured-check" className="font-condensed text-sm text-gray-accent uppercase tracking-wider">
              Producto destacado
            </label>
          </div>

          {error && (
            <p className="font-condensed text-xs text-red-400">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isLoading} className="btn-primary flex-1 py-3 text-xs">
              {isLoading ? 'Guardando...' : product ? 'Guardar cambios' : 'Crear producto'}
            </button>
            <button type="button" onClick={onClose} className="btn-secondary px-6 py-3 text-xs">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
