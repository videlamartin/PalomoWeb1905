'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const displayImages = images.length > 0 ? images : [`https://picsum.photos/seed/palomo/800/1000`]

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto no-scrollbar">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative flex-shrink-0 w-16 h-20 md:w-20 md:h-24 overflow-hidden border-2 transition-all duration-200 ${
                i === selectedIndex
                  ? 'border-red-primary'
                  : 'border-white/10 hover:border-white/30'
              }`}
              aria-label={`Ver imagen ${i + 1} de ${productName}`}
            >
              <Image
                src={img}
                alt={`${productName} - imagen ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="relative flex-1 aspect-[4/5] bg-black-700 overflow-hidden">
        <Image
          key={selectedIndex}
          src={displayImages[selectedIndex]}
          alt={`${productName} - imagen principal`}
          fill
          className="object-cover transition-all duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  )
}
