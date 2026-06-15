'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { getLevelTitle, levelFromXP } from '@/lib/xp'

const NAV = [
  { href: '/',          label: 'Today',    icon: '⚡' },
  { href: '/calendar',  label: 'Calendar', icon: '📅' },
  { href: '/stats',     label: 'Stats',    icon: '📊' },
  { href: '/money',     label: 'Money',    icon: '💰' },
]

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const { stats } = useApp()
  const { xpIntoLevel, xpNeeded } = levelFromXP(stats.xp)
  const pct = xpNeeded > 0 ? Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100)) : 100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* Top bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(6,6,15,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* XP bar - very top */}
        <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #6D28D9, #A855F7)',
            transition: 'width 0.8s ease',
          }} />
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px', height: 56,
          maxWidth: 680, margin: '0 auto', width: '100%',
        }}>
          {/* Brand */}
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#E8E8F8', letterSpacing: '-0.3px' }}>
              Hustle OS
            </div>
            <div style={{ fontSize: 9.5, color: '#4A4A7A', letterSpacing: '1px', fontWeight: 600 }}>
              LVL {stats.level} · {getLevelTitle(stats.level).toUpperCase()}
            </div>
          </div>

          {/* Streak */}
          {stats.streak > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', borderRadius: 99,
              background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)',
            }}>
              <span style={{ fontSize: 13 }}>🔥</span>
              <span style={{
                fontSize: 12, fontWeight: 800, color: '#F97316',
                fontFamily: 'monospace',
                animation: 'streakPulse 2s ease-in-out infinite',
              }}>
                {stats.streak}
              </span>
              <span style={{ fontSize: 10, color: '#7A4A2A', fontWeight: 600 }}>STREAK</span>
            </div>
          )}

          {/* XP */}
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: 13, fontWeight: 800, color: '#A855F7',
              fontFamily: 'monospace', letterSpacing: '-0.5px',
            }}>
              {stats.xp.toLocaleString()} XP
            </div>
            <div style={{ fontSize: 9.5, color: '#4A4A7A', letterSpacing: '0.5px' }}>
              {xpIntoLevel}/{xpNeeded} to next
            </div>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main style={{ flex: 1, maxWidth: 680, width: '100%', margin: '0 auto', padding: '0 0 80px' }}>
        {children}
      </main>

      {/* Bottom nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(6,6,15,0.97)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '8px 0 max(8px, env(safe-area-inset-bottom))',
        zIndex: 100,
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-around',
          maxWidth: 680, margin: '0 auto',
        }}>
          {NAV.map(n => {
            const active = path === n.href
            return (
              <Link key={n.href} href={n.href} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                padding: '4px 20px', borderRadius: 12,
                background: active ? 'rgba(124,58,237,0.12)' : 'none',
                transition: 'background 0.15s',
              }}>
                <span style={{ fontSize: 18, lineHeight: 1 }}>{n.icon}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.3px',
                  color: active ? '#A855F7' : '#4A4A7A',
                  transition: 'color 0.15s',
                }}>{n.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
