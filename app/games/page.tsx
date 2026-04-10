'use client'

import { useEffect, useState } from 'react'
import GameCard from '../components/GameCard'
import FilterBar from '../components/FilterBar'
import StatsPanel from '../components/StatsPanel'

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

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [filteredGames, setFilteredGames] = useState<Game[]>([])
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('createdAt-desc')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGames()
  }, [])

  useEffect(() => {
    applyFilterAndSort()
  }, [games, filter, sort])

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games')
      const data = await response.json()
      setGames(data)
    } catch (error) {
      console.error('Error fetching games:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilterAndSort = () => {
    let result = [...games]

    if (filter !== 'all') {
      result = result.filter(game => game.status === filter)
    }

    const [sortBy, order] = sort.split('-')
    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'rating':
          comparison = (a.rating || 0) - (b.rating || 0)
          break
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        default:
          comparison = 0
      }
      return order === 'desc' ? -comparison : comparison
    })

    setFilteredGames(result)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-[#462a75] border-4 border-[#1a0f2e]" />
          <div className="h-12 bg-[#462a75] border-4 border-[#1a0f2e]" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-[#462a75] border-4 border-[#1a0f2e]" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-4xl">🎯</span>
        <div>
          <h1 className="font-pixel text-xl text-white" style={{ textShadow: '3px 3px 0 #1a0f2e' }}>
            GAME LIBRARY
          </h1>
          <p className="font-pixel text-[10px] text-[#b8a5d9]">
            TOTAL {filteredGames.length} GAMES
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <StatsPanel games={games} />
      </div>

      {/* Filter Bar */}
      <div className="mb-6">
        <FilterBar
          currentFilter={filter}
          onFilterChange={setFilter}
          currentSort={sort}
          onSortChange={setSort}
        />
      </div>

      {/* Games Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredGames.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#462a75] border-4 border-[#1a0f2e] shadow-[6px_6px_0px_#1a0f2e]">
          <div className="text-6xl mb-4">🔍</div>
          <p className="font-pixel text-xs text-[#b8a5d9] mb-2">NO GAMES FOUND</p>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="pixel-btn"
            >
              CLEAR FILTERS
            </button>
          )}
        </div>
      )}
    </div>
  )
}
