'use client'

import Link from 'next/link'
import Image from 'next/image'

interface Game {
  id: string
  name: string
  coverImage: string
  tags: string[]
  status: string
  rating?: number
  playTime?: number
}

interface GameCardProps {
  game: Game
}

const statusConfig: Record<string, { label: string; className: string }> = {
  playing: { label: 'PLAYING', className: 'bg-[#4ecdc4] text-[#1a0f2e]' },
  completed: { label: 'CLEARED', className: 'bg-[#95e1d3] text-[#1a0f2e]' },
  dropped: { label: 'DROPPED', className: 'bg-[#ff6b9d] text-[#1a0f2e]' },
  wishlist: { label: 'WISHLIST', className: 'bg-[#ffe66d] text-[#1a0f2e]' },
}

export default function GameCard({ game }: GameCardProps) {
  const status = statusConfig[game.status]

  return (
    <Link href={`/games/${game.id}`}>
      <div className="group relative bg-[#462a75] border-4 border-[#1a0f2e] shadow-[6px_6px_0px_#1a0f2e] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_#1a0f2e] overflow-hidden">
        {/* Top highlight line for pixel effect */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[rgba(255,255,255,0.1)] z-10" />

        {/* Cover Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#1a0f2e]">
          <Image
            src={game.coverImage}
            alt={game.name}
            fill
            className="object-cover transition-all duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
          {/* Scanline overlay on hover */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>

        {/* Status Badge */}
        <div className={`absolute top-3 right-0 px-3 py-1 font-pixel text-[8px] border-l-4 border-b-4 border-[#1a0f2e] ${status.className}`}>
          {status.label}
        </div>

        {/* Content */}
        <div className="p-4 bg-[#462a75]">
          <h3 className="font-game-name text-lg text-white mb-3 leading-relaxed" style={{ textShadow: '2px 2px 0 #1a0f2e' }}>
            {game.name}
          </h3>

          {/* Rating with pixel stars */}
          {game.rating && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#ffe66d] text-lg">★</span>
              <span className="font-pixel text-xs text-[#ffe66d]" style={{ textShadow: '2px 2px 0 #1a0f2e' }}>
                {game.rating}/10
              </span>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {game.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-[#1a0f2e] text-[#b8a5d9] font-game-name text-[12px] border-2 border-[#5d3d91]"
              >
                {tag.toUpperCase()}
              </span>
            ))}
            {game.tags.length > 2 && (
              <span className="text-[#ff6b9d] font-game-name text-[12px]">+{game.tags.length - 2}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
