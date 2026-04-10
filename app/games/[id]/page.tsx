'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Lightbox from '../../components/Lightbox'

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
  createdAt: string
}

const statusConfig: Record<string, { label: string; className: string; icon: string }> = {
  playing: { label: 'PLAYING', className: 'bg-[#4ecdc4] text-[#1a0f2e]', icon: '🕹️' },
  completed: { label: 'COMPLETED', className: 'bg-[#95e1d3] text-[#1a0f2e]', icon: '🏆' },
  dropped: { label: 'DROPPED', className: 'bg-[#ff6b9d] text-[#1a0f2e]', icon: '💀' },
  wishlist: { label: 'WISHLIST', className: 'bg-[#ffe66d] text-[#1a0f2e]', icon: '⭐' },
}

export default function GameDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState('')
  const [lightboxAlt, setLightboxAlt] = useState('')

  useEffect(() => {
    if (params.id) {
      fetchGame()
    }
  }, [params.id])

  const fetchGame = async () => {
    try {
      const response = await fetch(`/api/games/${params.id}`)
      if (!response.ok) {
        throw new Error('Game not found')
      }
      const data = await response.json()
      setGame(data)
    } catch (error) {
      console.error('Error fetching game:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/games/${params.id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        router.push('/games')
      }
    } catch (error) {
      console.error('Error deleting game:', error)
    }
  }

  const openLightbox = (src: string, alt: string) => {
    setLightboxSrc(src)
    setLightboxAlt(alt)
    setLightboxOpen(true)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-[#462a75] border-4 border-[#1a0f2e]" />
          <div className="h-32 bg-[#462a75] border-4 border-[#1a0f2e]" />
        </div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

  const status = statusConfig[game.status]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/games" className="font-pixel text-[10px] text-[#b8a5d9] hover:text-[#4ecdc4] transition-colors">
          ← RETURN TO GAME LIBRARY
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Cover Image - Clickable */}
        <div
          className="relative w-full md:w-64 aspect-[3/4] flex-shrink-0 cursor-pointer group"
          onClick={() => openLightbox(game.coverImage, game.name)}
        >
          <div className="absolute inset-0 bg-[#1a0f2e] border-4 border-[#1a0f2e] translate-x-2 translate-y-2" />
          <div className="relative w-full h-full border-4 border-[#1a0f2e] overflow-hidden">
            <Image
              src={game.coverImage}
              alt={game.name}
              fill
              className="object-cover transition-opacity group-hover:opacity-80"
              priority
            />
            {/* Zoom icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-14 h-14 bg-[#ff6b9d] border-4 border-[#1a0f2e] shadow-[4px_4px_0px_#1a0f2e] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#1a0f2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="font-game-name text-3xl text-white" style={{ textShadow: '4px 4px 0 #1a0f2e' }}>
              {game.name}
            </h1>
            <div className="flex gap-2">
              <Link
                href={`/games/${game.id}/edit`}
                className="pixel-btn pixel-btn-secondary"
              >
                EDIT
              </Link>
              {!deleteConfirm ? (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="pixel-btn pixel-btn-danger"
                >
                  DELETE
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    className="pixel-btn"
                  >
                    CONFIRM
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="pixel-btn pixel-btn-secondary"
                  >
                    CANCEL
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 font-pixel text-[10px] border-4 border-[#1a0f2e] mb-6 ${status.className}`}>
            <span>{status.icon}</span>
            <span>{status.label}</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {game.rating && (
              <div className="bg-[#1a0f2e] border-4 border-[#5d3d91] p-4 text-center">
                <p className="font-pixel text-[8px] text-[#b8a5d9] mb-2">RATING</p>
                <p className="font-pixel text-lg text-[#ffe66d]" style={{ textShadow: '2px 2px 0 #1a0f2e' }}>
                  ★ {game.rating}/10
                </p>
              </div>
            )}
            {game.playTime && (
              <div className="bg-[#1a0f2e] border-4 border-[#5d3d91] p-4 text-center">
                <p className="font-pixel text-[8px] text-[#b8a5d9] mb-2">PLAY TIME</p>
                <p className="font-pixel text-lg text-[#4ecdc4]" style={{ textShadow: '2px 2px 0 #1a0f2e' }}>
                  {game.playTime}h
                </p>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {game.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-2 bg-[#1a0f2e] text-[#4ecdc4] font-pixel text-[10px] border-4 border-[#5d3d91]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Comment */}
      {game.comment && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📝</span>
            <h2 className="font-pixel text-sm text-white" style={{ textShadow: '3px 3px 0 #1a0f2e' }}>
              COMMENT
            </h2>
          </div>
          <div className="bg-[#462a75] border-4 border-[#1a0f2e] shadow-[6px_6px_0px_#1a0f2e] p-6">
            <p className="font-pixel-body text-xl text-[#b8a5d9] leading-relaxed whitespace-pre-wrap">
              {game.comment}
            </p>
          </div>
        </div>
      )}

      {/* Screenshots - Clickable */}
      {game.screenshots.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📸</span>
            <h2 className="font-pixel text-sm text-white" style={{ textShadow: '3px 3px 0 #1a0f2e' }}>
              SCREENSHOTS
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {game.screenshots.map((screenshot, index) => (
              <div
                key={index}
                className="relative aspect-video cursor-pointer group"
                onClick={() => openLightbox(screenshot, `${game.name} screenshot ${index + 1}`)}
              >
                <div className="absolute inset-0 bg-[#1a0f2e] translate-x-2 translate-y-2" />
                <div className="relative w-full h-full border-4 border-[#1a0f2e] overflow-hidden">
                  <Image
                    src={screenshot}
                    alt={`${game.name} screenshot ${index + 1}`}
                    fill
                    className="object-cover transition-opacity group-hover:opacity-80"
                  />
                  {/* Zoom icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-[#ff6b9d] border-4 border-[#1a0f2e] shadow-[4px_4px_0px_#1a0f2e] flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#1a0f2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        src={lightboxSrc}
        alt={lightboxAlt}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  )
}