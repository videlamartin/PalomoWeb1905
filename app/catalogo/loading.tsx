import { ProductGridSkeleton } from '@/components/ui/Skeleton'

export default function CatalogoLoading() {
  return (
    <div className="min-h-screen bg-black-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="h-px w-8 bg-red-primary mb-4" />
          <div className="h-12 w-48 shimmer-bg" />
        </div>
        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="lg:w-56 flex-shrink-0 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 shimmer-bg" />
            ))}
          </aside>
          <div className="flex-1">
            <ProductGridSkeleton count={12} />
          </div>
        </div>
      </div>
    </div>
  )
}
