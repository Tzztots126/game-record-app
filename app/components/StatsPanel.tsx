'use client'

interface Game {
  status: string
  rating?: number
  playTime?: number
}

interface StatsPanelProps {
  games: Game[]
}

const statusIcons: Record<string, string> = {
  playing: '🎮',
  completed: '🏆',
  dropped: '💀',
  wishlist: '⭐',
}

export default function StatsPanel({ games }: StatsPanelProps) {
  const totalGames = games.length
  const statusCounts = games.reduce((acc, game) => {
    acc[game.status] = (acc[game.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const completedGames = games.filter(g => g.status === 'completed')
  const averageRating = completedGames.length > 0
    ? completedGames.reduce((sum, g) => sum + (g.rating || 0), 0) / completedGames.length
    : 0

  const totalPlayTime = games.reduce((sum, g) => sum + (g.playTime || 0), 0)

  const stats = [
    { label: 'TOTAL', value: totalGames, icon: '📦', color: 'bg-[#4ecdc4]' },
    { label: 'AVG RATE', value: averageRating > 0 ? averageRating.toFixed(1) : '-', icon: '⭐', color: 'bg-[#ffe66d]' },
    { label: 'HOURS', value: totalPlayTime > 0 ? Math.round(totalPlayTime) : '-', icon: '⏱️', color: 'bg-[#ff6b9d]' },
    { label: 'CLEARED', value: statusCounts['completed'] || 0, icon: '🏆', color: 'bg-[#95e1d3]' },
  ]

  return (
    <div className="bg-[#462a75] border-4 border-[#1a0f2e] shadow-[6px_6px_0px_#1a0f2e] p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="font-pixel text-sm text-white" style={{ textShadow: '3px 3px 0 #1a0f2e' }}>
          PLAYER STATS
        </h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="relative bg-[#1a0f2e] border-4 border-[#5d3d91] p-4 text-center group hover:border-[#ff6b9d] transition-colors"
          >
            <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#462a75] border-4 border-[#1a0f2e] flex items-center justify-center text-lg">
              {stat.icon}
            </div>
            <p className="font-pixel text-[10px] text-[#b8a5d9] mb-2">{stat.label}</p>
            <p className={`font-pixel text-xl ${stat.color.replace('bg-', 'text-')}`} style={{ textShadow: '2px 2px 0 #1a0f2e' }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Status Breakdown */}
      <div className="bg-[#1a0f2e] border-4 border-[#5d3d91] p-4">
        <p className="font-pixel text-[10px] text-[#b8a5d9] mb-4">STATUS BREAKDOWN</p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(statusIcons).map(([status, icon]) => {
            const count = statusCounts[status] || 0
            if (count === 0) return null
            const colors: Record<string, string> = {
              playing: 'bg-[#4ecdc4]',
              completed: 'bg-[#95e1d3]',
              dropped: 'bg-[#ff6b9d]',
              wishlist: 'bg-[#ffe66d]',
            }
            return (
              <div
                key={status}
                className={`flex items-center gap-2 px-3 py-2 ${colors[status]} border-4 border-[#1a0f2e]`}
              >
                <span className="text-lg">{icon}</span>
                <span className="font-pixel text-xs text-[#1a0f2e]">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Decorative pixels */}
      <div className="flex gap-2 mt-4 justify-center">
        {['#ff6b9d', '#4ecdc4', '#ffe66d', '#95e1d3'].map((color, i) => (
          <div
            key={i}
            className="w-4 h-4 border-2 border-[#1a0f2e]"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  )
}
