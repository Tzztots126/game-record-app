'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import GameCard from './components/GameCard'
import StatsPanel from './components/StatsPanel'
import Image from 'next/image'
interface Game {
  id: string
  name: string
  coverImage: string
  tags: string[]
  status: string
  rating?: number
  playTime?: number
  createdAt: string
}

export default function Home() {
  const [games, setGames] = useState<Game[]>([])
  const [recentGames, setRecentGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games')
      const data = await response.json()
      setGames(data)
      setRecentGames(data.slice(0, 6))
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-[#462a75] border-4 border-[#1a0f2e]" />
          <div className="h-64 bg-[#462a75] border-4 border-[#1a0f2e]" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="relative bg-[#462a75] border-4 border-[#1a0f2e] shadow-[8px_8px_0px_#1a0f2e] p-8 mb-8 overflow-hidden">
        {/* Pixel decorations */}
        <div className="absolute top-4 left-4 w-4 h-4 bg-[#ff6b9d]" />
        <div className="absolute top-4 right-4 w-4 h-4 bg-[#4ecdc4]" />
        <div className="absolute bottom-4 left-4 w-4 h-4 bg-[#ffe66d]" />
        <div className="absolute bottom-4 right-4 w-4 h-4 bg-[#95e1d3]" />

        <div className="text-center relative z-10">
          <div className="flex justify-center gap-4 mb-4">
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}><Image src="/images/gamecontroller.png" alt="" width={80} height={80}/></span>
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🕹️</span>
            <span className="text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>👾</span>
          </div>
          <h1 className="font-pixel text-2xl sm:text-3xl text-white mb-4" style={{ textShadow: '4px 4px 0 #1a0f2e' }}>
            GAME<span className="text-[#4ecdc4]">TRACK</span>
          </h1>
          <p className="font-pixel-body text-xl text-[#b8a5d9]">
            A personal game tracking platform
          </p>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="mb-8">
        <StatsPanel games={games} />
      </div>

      {/* Recent Games */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Image src="/images/diamond.png" alt="" width={40} height={40}/>
            <h2 className="font-pixel text-lg text-white" style={{ textShadow: '3px 3px 0 #1a0f2e' }}>
              最近添加
            </h2>
          </div>
          <Link
            href="/games"
            className="pixel-btn"
          >
            VIEW ALL GAMES →
          </Link>
        </div>

        {recentGames.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recentGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#462a75] border-4 border-[#1a0f2e] shadow-[6px_6px_0px_#1a0f2e]">
            <div className="text-6xl mb-4">🎲</div>
            <p className="font-pixel text-xs text-[#b8a5d9] mb-6">
              No games recorded yet
            </p>
            <Link
              href="/games/add"
              className="pixel-btn pixel-btn-success"
            >
              ADD GAME
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/games/add"
          className="group bg-[#462a75] border-4 border-[#1a0f2e] shadow-[6px_6px_0px_#1a0f2e] p-6 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_#1a0f2e] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#4ecdc4] border-4 border-[#1a0f2e] flex items-center justify-center text-3xl">
              🎮
            </div>
            <div>
              <h3 className="font-pixel text-xs text-white mb-1" style={{ textShadow: '2px 2px 0 #1a0f2e' }}>
                ADD GAME RECORD
              </h3>
            </div>
          </div>
        </Link>
        <Link
          href="/games"
          className="group bg-[#462a75] border-4 border-[#1a0f2e] shadow-[6px_6px_0px_#1a0f2e] p-6 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_#1a0f2e] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#ff6b9d] border-4 border-[#1a0f2e] flex items-center justify-center text-3xl">
              📚
            </div>
            <div>
              <h3 className="font-pixel text-xs text-white mb-1" style={{ textShadow: '2px 2px 0 #1a0f2e' }}>
                VIEW ALL GAMES
              </h3>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
