'use client'

import { useState, useRef, ChangeEvent } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  label: string
  multiple?: boolean
  maxFiles?: number
  onChange: (files: File[]) => void
  previewUrls?: string[]
  onRemovePreview?: (index: number) => void
}

export default function ImageUpload({
  label,
  multiple = false,
  maxFiles = 10,
  onChange,
  previewUrls = [],
  onRemovePreview,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [previewList, setPreviewList] = useState<string[]>([])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files))
    }
  }

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    const limitedFiles = multiple ? imageFiles.slice(0, maxFiles) : imageFiles.slice(0, 1)

    const newPreviews = limitedFiles.map(file => URL.createObjectURL(file))
    setPreviewList(prev => multiple ? [...prev, ...newPreviews].slice(0, maxFiles) : newPreviews)

    onChange(limitedFiles)
  }

  const handleRemove = (index: number) => {
    if (index < previewUrls.length) {
      onRemovePreview?.(index)
    } else {
      const adjustedIndex = index - previewUrls.length
      setPreviewList(prev => prev.filter((_, i) => i !== adjustedIndex))
    }
  }

  const allPreviews = [...previewUrls, ...previewList]

  return (
    <div className="space-y-3">
      <label className="block font-pixel text-[10px] text-[#b8a5d9]">
        {label}
        {multiple && <span className="text-[#ff6b9d] ml-2">(MAX {maxFiles} FILES)</span>}
      </label>

      <div
        className={`relative bg-[#1a0f2e] border-4 border-dashed p-8 transition-all ${
          dragActive
            ? 'border-[#4ecdc4] bg-[#4ecdc4]/10'
            : 'border-[#5d3d91] hover:border-[#ff6b9d]'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />

        {allPreviews.length === 0 ? (
          <div className="text-center">
            <div className="text-5xl mb-4">🎨</div>
            <p className="font-pixel text-xs text-[#b8a5d9] mb-2">
              DRAG IMAGE HERE TO UPLOAD
            </p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="pixel-btn"
            >
              SELECT IMAGE
            </button>
            <p className="font-pixel text-[10px] text-[#5d3d91] mt-3">
              SUPPORT JPG PNG WebP · MAX 5MB
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {allPreviews.map((url, index) => (
              <div key={index} className="relative aspect-square bg-[#2d1b4e] border-4 border-[#5d3d91] group">
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-[#ff6b9d] border-4 border-[#1a0f2e] text-[#1a0f2e] font-pixel text-xs flex items-center justify-center hover:bg-[#ff8fab] transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
            {multiple && allPreviews.length < maxFiles && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="aspect-square bg-[#462a75] border-4 border-dashed border-[#5d3d91] flex items-center justify-center hover:border-[#4ecdc4] hover:bg-[#4ecdc4]/10 transition-colors"
              >
                <span className="text-3xl text-[#4ecdc4]">+</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
