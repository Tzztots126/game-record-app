'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '../../../components/ImageUpload'

const statusOptions = [
  { value: 'playing', label: 'PLAYING NOW', icon: '🕹️' },
  { value: 'completed', label: 'COMPLETED', icon: '🏆' },
  { value: 'dropped', label: 'DROPPED', icon: '💀' },
  { value: 'wishlist', label: 'WISH LIST', icon: '⭐' },
]

interface Game {
  id: string
  name: string
  coverImage: string
  tags: string[]
  comment?: string
  screenshots: string[]
  status: string
  rating?: number
  playTime?: number
}

export default function EditGamePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [game, setGame] = useState<Game | null>(null)
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
  const [existingScreenshots, setExistingScreenshots] = useState<string[]>([])

  useEffect(() => {
    if (params.id) {
      fetchGame()
    }
  }, [params.id])

  const fetchGame = async () => {
    try {
      const response = await fetch(`/api/games/${params.id}`)
      if (!response.ok) throw new Error('Game not found')
      const data = await response.json()
      setGame(data)
      setFormData({
        name: data.name,
        comment: data.comment || '',
        tags: data.tags.join(', '),
        status: data.status,
        rating: data.rating?.toString() || '',
        playTime: data.playTime?.toString() || '',
      })
      setExistingScreenshots(data.screenshots)
    } catch (error) {
      console.error('Error fetching game:', error)
    } finally {
      setFetching(false)
    }
  }

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
      data.append('existingScreenshots', JSON.stringify(existingScreenshots))

      if (coverImage[0]) {
        data.append('coverImage', coverImage[0])
      }

      screenshots.forEach((file) => {
        data.append('screenshots', file)
      })

      const response = await fetch(`/api/games/${params.id}`, {
        method: 'PUT',
        body: data,
      })

      if (response.ok) {
        router.push(`/games/${params.id}`)
      } else {
        alert('更新游戏失败')
      }
    } catch (error) {
      console.error('Error updating game:', error)
      alert('更新游戏失败')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRemoveScreenshot = (index: number) => {
    setExistingScreenshots(prev => prev.filter((_, i) => i !== index))
  }

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#462a75] border-4 border-[#1a0f2e] w-1/4" />
          <div className="h-96 bg-[#462a75] border-4 border-[#1a0f2e]" />
        </div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16 bg-[#462a75] border-4 border-[#1a0f2e] shadow-[6px_6px_0px_#1a0f2e]">
          <div className="text-6xl mb-4">❓</div>
          <p className="font-pixel text-xs text-[#b8a5d9] mb-4">GAME NOT FOUND</p>
          <Link href="/games" className="pixel-btn">
            RETURN TO GAME LIBRARY
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href={`/games/${params.id}`} className="font-pixel text-[10px] text-[#b8a5d9] hover:text-[#4ecdc4] transition-colors">
          ← RETURN TO GAME DETAILS
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-4xl">✏️</span>
        <h1 className="font-pixel text-xl text-white" style={{ textShadow: '3px 3px 0 #1a0f2e' }}>
          EDIT GAME RECORD
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#462a75] border-4 border-[#1a0f2e] shadow-[6px_6px_0px_#1a0f2e] p-6 space-y-6">
          <div>
            <label className="block font-pixel text-[10px] text-[#b8a5d9] mb-2">
              GAME NAME *
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

          <div>
            <label className="block font-pixel text-[10px] text-[#b8a5d9] mb-2">
              RATING (OUT OF 10)
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

          <div>
            <label className="block font-pixel text-[10px] text-[#b8a5d9] mb-2">
              CURRENT COVER
            </label>
            <div className="relative w-32 aspect-[3/4] border-4 border-[#1a0f2e] mb-4">
              <img src={game.coverImage} alt={game.name} className="object-cover w-full h-full" />
            </div>
            <ImageUpload
              label="CHANGE COVER IMAGE (LEAVE BLANK TO KEEP CURRENT)"
              onChange={setCoverImage}
            />
          </div>

          <ImageUpload
            label="SCREENSHOTS"
            multiple
            maxFiles={10}
            onChange={setScreenshots}
            previewUrls={existingScreenshots}
            onRemovePreview={handleRemoveScreenshot}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 pixel-btn disabled:opacity-50"
          >
            {loading ? 'SAV...' : 'SAVE CHANGES'}
          </button>
          <Link
            href={`/games/${params.id}`}
            className="pixel-btn pixel-btn-secondary"
          >
            CANCEL
          </Link>
        </div>
      </form>
    </div>
  )
}