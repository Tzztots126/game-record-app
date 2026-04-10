'use client'

import { useState, useRef, useEffect } from 'react'

interface FilterBarProps {
  currentFilter: string
  onFilterChange: (filter: string) => void
  currentSort: string
  onSortChange: (sort: string) => void
}

const statusFilters = [
  { value: 'all', label: 'ALL', icon: '🎮' },
  { value: 'playing', label: 'PLAYING', icon: '🕹️' },
  { value: 'completed', label: 'COMPLETED', icon: '🏆' },
  { value: 'dropped', label: 'DROPPED', icon: '💀' },
  { value: 'wishlist', label: 'WISHLIST', icon: '⭐' },
]

const sortOptions = [
  { value: 'createdAt-desc', label: 'NEWEST FIRST' },
  { value: 'createdAt-asc', label: 'OLDEST FIRST' },
  { value: 'rating-desc', label: 'HIGHEST RATING' },
  { value: 'rating-asc', label: 'LOWEST RATING' },
  { value: 'name-asc', label: 'A-Z' },
  { value: 'name-desc', label: 'Z-A' },
]

export default function FilterBar({
  currentFilter,
  onFilterChange,
  currentSort,
  onSortChange,
}: FilterBarProps) {
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentSortLabel = sortOptions.find(opt => opt.value === currentSort)?.label || 'SORT'

  return (
    <div className="bg-[#462a75] border-4 border-[#1a0f2e] shadow-[6px_6px_0px_#1a0f2e] p-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={`flex items-center gap-2 px-4 py-3 font-pixel text-[10px] transition-all border-4 ${
                currentFilter === filter.value
                  ? 'bg-[#ff6b9d] text-[#1a0f2e] border-[#1a0f2e] shadow-[4px_4px_0px_#1a0f2e] translate-x-[2px] translate-y-[2px]'
                  : 'bg-[#1a0f2e] text-white border-[#5d3d91] shadow-[4px_4px_0px_#1a0f2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1a0f2e]'
              }`}
            >
              <span>{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Custom Sort Dropdown */}
        <div className="flex items-center gap-3" ref={dropdownRef}>
          <span className="font-pixel text-[10px] text-[#b8a5d9]">SORT:</span>
          <div className="relative">
            {/* Trigger Button */}
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className={`flex items-center gap-3 bg-[#1a0f2e] text-white font-pixel text-[10px] px-4 py-3 border-4 transition-all ${
                sortDropdownOpen
                  ? 'border-[#ff6b9d] shadow-[2px_2px_0px_#1a0f2e] translate-x-[2px] translate-y-[2px]'
                  : 'border-[#5d3d91] shadow-[4px_4px_0px_#1a0f2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1a0f2e]'
              }`}
            >
              <span>{currentSortLabel}</span>
              <span className={`text-[#4ecdc4] transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {/* Dropdown Menu */}
            {sortDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 bg-[#1a0f2e] border-4 border-[#5d3d91] shadow-[6px_6px_0px_#1a0f2e] z-50 min-w-[180px]">
                {/* Decorative top line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-[rgba(255,255,255,0.1)]" />

                {sortOptions.map((option, index) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onSortChange(option.value)
                      setSortDropdownOpen(false)
                    }}
                    className={`w-full text-left px-4 py-3 font-pixel text-[10px] transition-colors flex items-center gap-2 ${
                      currentSort === option.value
                        ? 'bg-[#ff6b9d] text-[#1a0f2e]'
                        : 'text-white hover:bg-[#462a75]'
                    } ${index !== sortOptions.length - 1 ? 'border-b-4 border-[#5d3d91]' : ''}`}
                  >
                    {currentSort === option.value && (
                      <span className="text-[#1a0f2e]">▶</span>
                    )}
                    {currentSort !== option.value && (
                      <span className="opacity-0">▶</span>
                    )}
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
