import { Skeleton } from '@/components/ui/Skeleton'

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-black-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          <Skeleton className="aspect-[4/5]" />
          <div className="flex flex-col gap-5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-10 w-36" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-2">
              {['S', 'M', 'L', 'XL'].map((s) => (
                <Skeleton key={s} className="h-10 w-14" />
              ))}
            </div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
