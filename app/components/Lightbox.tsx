'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'

interface LightboxProps {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}

export default function Lightbox({ src, alt, isOpen, onClose }: LightboxProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a0f2e]/95 cursor-pointer"
      onClick={onClose}
    >
      {/* Pixel border frame */}
      <div className="absolute inset-4 border-8 border-[#462a75] pointer-events-none" />
      <div className="absolute inset-6 border-4 border-[#5d3d91] pointer-events-none" />

      {/* Close button */}
      <button
        className="absolute top-8 right-8 z-50 w-12 h-12 bg-[#ff6b9d] border-4 border-[#1a0f2e] shadow-[4px_4px_0px_#1a0f2e] text-[#1a0f2e] font-pixel text-xl flex items-center justify-center hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1a0f2e] transition-all"
        onClick={onClose}
      >
        ×
      </button>

      {/* Image container */}
      <div
        className="relative w-full h-full flex items-center justify-center p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain p-8"
          sizes="100vw"
          priority
        />
      </div>

      {/* Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-pixel text-[10px] text-[#b8a5d9] bg-[#1a0f2e] border-4 border-[#5d3d91] px-4 py-2">
        CLICK HERE OR PRESS ESC
      </div>
    </div>
  )
}
