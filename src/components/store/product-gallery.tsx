"use client";

import * as React from "react";
import Image from "next/image";

export interface ProductGalleryProps {
  images: Array<{
    id: string;
    url: string;
    altText?: string | null;
  }>;
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const fallbackList =
    images.length > 0
      ? images
      : [{ id: "default", url: "https://placehold.co/600x600/png?text=Product", altText: title }];

  const currentImage = fallbackList[selectedIndex] || fallbackList[0];

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails */}
      {fallbackList.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin">
          {fallbackList.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                selectedIndex === idx
                  ? "border-brand-600 shadow-md ring-2 ring-brand-500/20"
                  : "border-slate-100 hover:border-slate-300 dark:border-slate-800"
              }`}
            >
              <Image
                src={img.url}
                alt={img.altText || `${title} - صورة ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image View */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex-1 dark:bg-slate-800 dark:border-slate-800 shadow-sm">
        <Image
          src={currentImage.url}
          alt={currentImage.altText || title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-300"
        />
      </div>
    </div>
  );
}
