'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '../../components/ImageUpload'

const statusOptions = [
  { value: 'playing', label: 'PLAYING NOW', icon: '🕹️' },
  { value: 'completed', label: 'COMPLETED', icon: '🏆' },
  { value: 'dropped', label: 'DROPPED', icon: '💀' },
  { value: 'wishlist', label: 'WISH LIST', icon: '⭐' },
]

export default function AddGamePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    comment: '',
    tags: '',
    status: 'playing',
    rating: '',
    playTime: '',
  })
  const [coverImage, setCoverImage] = useState<File[]>([])
  const [screenshots, setScreenshots] = useState<File[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('comment', formData.comment)
      data.append('tags', formData.tags)
      data.append('status', formData.status)
      data.append('rating', formData.rating)
      data.append('playTime', formData.playTime)

      if (coverImage[0]) {
        data.append('coverImage', coverImage[0])
      }

      screenshots.forEach((file) => {
        data.append('screenshots', file)
      })

      const response = await fetch('/api/games', {
        method: 'POST',
        body: data,
      })

      if (response.ok) {
        const game = await response.json()
        router.push(`/games/${game.id}`)
      } else {
        alert('ADD GAME FAILED')
      }
    } catch (error) {
      console.error('Error adding game:', error)
      alert('ADD GAME FAILED')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/games" className="font-pixel text-[10px] text-[#b8a5d9] hover:text-[#4ecdc4] transition-colors">
          ← RETURN TO GAME LIBRARY
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-4xl">✨</span>
        <h1 className="font-pixel text-xl text-white" style={{ textShadow: '3px 3px 0 #1a0f2e' }}>
          ADD GAME
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#462a75] border-4 border-[#1a0f2e] shadow-[6px_6px_0px_#1a0f2e] p-6 space-y-6">
          {/* Game Name */}
          <div>
            <label className="block font-pixel text-[10px] text-[#b8a5d9] mb-2">
              GAME NAME
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="pixel-input w-full"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block font-pixel text-[10px] text-[#b8a5d9] mb-2">
              GAME STATUS
            </label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: option.value }))}
                  className={`flex items-center gap-2 px-4 py-3 font-pixel text-[10px] border-4 transition-all ${
                    formData.status === option.value
                      ? 'bg-[#ff6b9d] text-[#1a0f2e] border-[#1a0f2e] shadow-[4px_4px_0px_#1a0f2e]'
                      : 'bg-[#1a0f2e] text-white border-[#5d3d91] shadow-[4px_4px_0px_#1a0f2e] hover:translate-x-[2px] hover:translate-y-[2px]'
                  }`}
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block font-pixel text-[10px] text-[#b8a5d9] mb-2">
              RATING (1-10)
            </label>
            <div className="flex items-center gap-4 bg-[#1a0f2e] border-4 border-[#5d3d91] p-4">
              <input
                type="range"
                name="rating"
                min="1"
                max="10"
                value={formData.rating || ''}
                onChange={handleChange}
                className="flex-1 accent-[#ffe66d]"
              />
              <span className="font-pixel text-xl text-[#ffe66d]" style={{ textShadow: '2px 2px 0 #1a0f2e' }}>
                {formData.rating || '-'}/10
              </span>
            </div>
          </div>

          {/* Play Time */}
          <div>
            <label className="block font-pixel text-[10px] text-[#b8a5d9] mb-2">
              PLAY TIME (HOURS)
            </label>
            <input
              type="number"
              name="playTime"
              step="0.1"
              value={formData.playTime}
              onChange={handleChange}
              className="pixel-input w-full"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block font-pixel text-[10px] text-[#b8a5d9] mb-2">
              TAGS
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="pixel-input w-full"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block font-pixel text-[10px] text-[#b8a5d9] mb-2">
              COMMENT
            </label>
            <textarea
              name="comment"
              rows={4}
              value={formData.comment}
              onChange={handleChange}
              className="pixel-input w-full resize-none"
            />
          </div>

          {/* Cover Image */}
          <ImageUpload
            label="COVER IMAGE"
            onChange={setCoverImage}
          />

          {/* Screenshots */}
          <ImageUpload
            label="SCREENSHOTS"
            multiple
            maxFiles={10}
            onChange={setScreenshots}
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 pixel-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'SAV...' : 'SAVE'}
          </button>
          <Link
            href="/games"
            className="pixel-btn pixel-btn-secondary"
          >
            CANCEL
          </Link>
        </div>
      </form>
    </div>
  )
}
