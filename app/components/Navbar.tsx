'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: '首页', icon: '/images/home.png' },
    { href: '/games', label: '游戏库', icon: '/images/library.png' },
    { href: '/games/add', label: '添加游戏', icon: '/images/controller.png' },
  ]

  return (
    <nav className="sticky top-0 z-40 bg-[#462A75]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-[#ff6b9d] border-4 border-[#2d1b4e] shadow-[4px_4px_0px_#2d1b4e] flex items-center justify-center text-2xl group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[2px_2px_0px_#2d1b4e] transition-all">
                G
              </div>
            </div>
            <span className="font-pixel text-lg text-white hidden sm:block" style={{ textShadow: '3px 3px 0 #2d1b4e' }}>
              GAME<span className="text-[#4ecdc4]">TRACK</span>
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-2 sm:gap-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-3 font-pixel text-xs transition-all ${
                    isActive
                      ? 'bg-[#ff6b9d] text-[#1a0f2e] border-4 border-[#1a0f2e] shadow-[4px_4px_0px_#1a0f2e]'
                      : 'bg-[#462a75] text-white border-4 border-[#1a0f2e] shadow-[4px_4px_0px_#1a0f2e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1a0f2e]'
                  }`}
                >
                  <Image src={item.icon} alt="" width={20} height={20} className="mr-2 inline-block" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
