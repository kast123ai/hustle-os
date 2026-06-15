'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import { getLevelTitle, levelFromXP, streakMultiplier } from '@/lib/xp'

const NAV = [
  { href: '/',         label: 'Today',    icon: '⚡', sub: 'Daily Mission' },
  { href: '/calendar', label: 'Calendar', icon: '📅', sub: 'Mission Log' },
  { href: '/stats',    label: 'Stats',    icon: '📊', sub: 'XP & Levels' },
  { href: '/money',    label: 'Money',    icon: '💰', sub: 'Income Tracker' },
]

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const { stats, mission } = useApp()
  const { xpIntoLevel, xpNeeded } = levelFromXP(stats.xp)
  const pct = xpNeeded > 0 ? Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100)) : 100
  const mult = streakMultiplier(stats.streak)
  const doneToday = mission.completed_ids.length
  const totalToday = mission.tasks.length

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: 220, zIndex: 50,
        background: 'rgba(8,8,18,0.97)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
        backdropFilter: 'blur(12px)',
      }}>

        {/* Brand */}
        <div style={{ padding: '22px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 17, fontWeight: 900, color: '#E8E8F8', letterSpacing: '-0.5px', marginBottom: 2 }}>
            Hustle OS
          </div>
          <div style={{ fontSize: 9.5, color: '#4A4A7A', fontWeight: 700, letterSpacing: '1.5px' }}>
            DISCIPLINE COACH
          </div>
        </div>

        {/* Operator card */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {/* Level badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 900, color: '#A855F7', fontFamily: 'monospace',
            }}>
              {stats.level}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#E8E8F8' }}>
                {getLevelTitle(stats.level)}
              </div>
              <div style={{ fontSize: 9.5, color: '#4A4A7A', marginTop: 1 }}>
                Level {stats.level}
              </div>
            </div>
          </div>

          {/* XP bar */}
          <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden', marginBottom: 4 }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: 'linear-gradient(90deg, #6D28D9, #A855F7)',
              borderRadius: 99, transition: 'width 0.8s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 9.5, color: '#A855F7', fontFamily: 'monospace', fontWeight: 700 }}>
              {stats.xp.toLocaleString()} XP
            </span>
            <span style={{ fontSize: 9.5, color: '#3A3A5A' }}>
              {pct}% to {stats.level + 1}
            </span>
          </div>
        </div>

        {/* Today's progress mini */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: 9, color: '#4A4A7A', fontWeight: 700, letterSpacing: '1.5px', marginBottom: 8 }}>
            TODAY'S MISSION
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 11.5, color: doneToday === totalToday && totalToday > 0 ? '#10B981' : '#9090B8', fontWeight: 600 }}>
              {doneToday === totalToday && totalToday > 0 ? '🏆 Complete!' : `${doneToday} of ${totalToday} done`}
            </span>
            <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#4A4A7A' }}>
              {totalToday > 0 ? Math.round((doneToday / totalToday) * 100) : 0}%
            </span>
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${totalToday > 0 ? Math.round((doneToday / totalToday) * 100) : 0}%`,
              background: doneToday === totalToday && totalToday > 0
                ? 'linear-gradient(90deg, #10B981, #34D399)'
                : 'linear-gradient(90deg, #6D28D9, #A855F7)',
              borderRadius: 99, transition: 'width 0.4s ease',
            }} />
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '10px 10px' }}>
          {NAV.map(n => {
            const active = path === n.href
            return (
              <Link key={n.href} href={n.href} style={{
                display: 'flex', alignItems: 'center', gap: 11,
                padding: '10px 12px', borderRadius: 11, marginBottom: 2,
                background: active ? 'rgba(124,58,237,0.12)' : 'transparent',
                border: `1px solid ${active ? 'rgba(124,58,237,0.25)' : 'transparent'}`,
                transition: 'all 0.15s', textDecoration: 'none',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)' }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <span style={{ fontSize: 16, lineHeight: 1, flexShrink: 0 }}>{n.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? '#E8E8F8' : '#7070A0', transition: 'color 0.15s' }}>
                    {n.label}
                  </div>
                  <div style={{ fontSize: 9.5, color: active ? '#5A5A9A' : '#3A3A5A', marginTop: 0.5 }}>
                    {n.sub}
                  </div>
                </div>
                {active && (
                  <div style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: '50%', background: '#A855F7', boxShadow: '0 0 6px #A855F7' }} />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom stats */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {/* Streak */}
          {stats.streak > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
              padding: '8px 12px', borderRadius: 10,
              background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)',
            }}>
              <span style={{ fontSize: 14 }}>🔥</span>
              <div>
                <div style={{
                  fontSize: 13, fontWeight: 800, color: '#F97316',
                  fontFamily: 'monospace',
                  animation: 'streakPulse 2s ease-in-out infinite',
                }}>
                  {stats.streak} day streak
                </div>
                {mult > 1 && (
                  <div style={{ fontSize: 9.5, color: '#7A4A2A', fontWeight: 600 }}>
                    {mult}x XP multiplier active
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Money made */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: '#3A3A5A', fontWeight: 600 }}>Total Earned</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#10B981', fontFamily: 'monospace' }}>
              ${stats.total_money.toLocaleString()}
            </span>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Top header bar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 40,
          background: 'rgba(6,6,15,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
          {/* XP progress line */}
          <div style={{ height: 2, background: 'rgba(255,255,255,0.04)' }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: 'linear-gradient(90deg, #6D28D9, #A855F7)',
              transition: 'width 0.8s ease',
            }} />
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 28px', height: 52,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#6060A0' }}>
              {NAV.find(n => n.href === path)?.label ?? 'Hustle OS'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {stats.streak > 1 && (
                <span style={{ fontSize: 11.5, color: '#F97316', fontWeight: 700 }}>
                  🔥 {stats.streak}
                </span>
              )}
              <span style={{
                fontSize: 12, fontWeight: 800, color: '#A855F7',
                fontFamily: 'monospace',
              }}>
                {stats.xp.toLocaleString()} XP
              </span>
            </div>
          </div>
        </header>

        {/* Page */}
        <main style={{ flex: 1, maxWidth: 720, width: '100%', padding: '0 0 40px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
