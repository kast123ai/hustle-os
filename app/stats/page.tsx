'use client'

import { useApp } from '@/context/AppContext'
import { getLevelTitle, levelFromXP, xpToNextLevel, streakMultiplier } from '@/lib/xp'
import { TASK_TYPE_META } from '@/lib/tasks'

const LEVELS_DISPLAY = [
  { level: 1,  title: 'Street Hustler',    color: '#6B6B90' },
  { level: 5,  title: 'Cold Caller',       color: '#3B82F6' },
  { level: 10, title: 'Deal Closer',       color: '#10B981' },
  { level: 15, title: 'Local Legend',      color: '#FBBF24' },
  { level: 20, title: 'Revenue Runner',    color: '#F97316' },
  { level: 30, title: 'Six Figure Machine',color: '#EF4444' },
  { level: 50, title: 'Entrepreneur',      color: '#A855F7' },
  { level: 100,title: 'UNTOUCHABLE',       color: '#FFD700' },
]

export default function StatsPage() {
  const { stats, history } = useApp()
  const { xpIntoLevel, xpNeeded } = levelFromXP(stats.xp)
  const pct = xpNeeded > 0 ? Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100)) : 100
  const mult = streakMultiplier(stats.streak)
  const xpToNext = xpToNextLevel(stats.level)
  const title = getLevelTitle(stats.level)

  const recent30 = history.slice(0, 30)
  const totalDone = recent30.reduce((s, h) => s + h.tasks_done, 0)
  const totalPossible = recent30.reduce((s, h) => s + h.tasks_total, 0)
  const completionRate = totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0

  const taskTypeCounts: Record<string, number> = { phone: 0, door: 0, online: 0, skill: 0 }
  history.forEach(h => {
    // We can't easily derive type counts from history, so just show from total tasks
  })

  return (
    <div style={{ padding: '16px' }}>

      {/* Level card */}
      <div style={{
        borderRadius: 20, overflow: 'hidden', marginBottom: 16,
        background: 'linear-gradient(135deg, rgba(109,40,217,0.2) 0%, rgba(6,6,15,0.98) 70%)',
        border: '1px solid rgba(124,58,237,0.3)',
        boxShadow: '0 8px 40px rgba(109,40,217,0.15)',
      }}>
        <div style={{ padding: '24px 20px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 9.5, color: '#7C3AED', fontWeight: 700, letterSpacing: '2px', marginBottom: 6 }}>
                CURRENT RANK
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#E8E8F8', letterSpacing: '-0.5px', lineHeight: 1 }}>
                Level {stats.level}
              </div>
              <div style={{ fontSize: 14, color: '#A855F7', fontWeight: 700, marginTop: 4 }}>{title}</div>
            </div>

            {/* Hex avatar */}
            <div style={{ position: 'relative' }}>
              <svg width="64" height="72" viewBox="0 0 64 72">
                <polygon points="32,4 60,20 60,52 32,68 4,52 4,20"
                  fill="rgba(109,40,217,0.15)" stroke="rgba(124,58,237,0.6)" strokeWidth="1.5" />
                <text x="32" y="44" textAnchor="middle" fill="#A855F7" fontSize="22" fontWeight="900" fontFamily="system-ui">
                  {stats.level}
                </text>
              </svg>
            </div>
          </div>

          {/* XP bar */}
          <div style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: '#7090B8' }}>{xpIntoLevel.toLocaleString()} XP</span>
              <span style={{ fontSize: 11, color: '#7090B8' }}>{xpNeeded.toLocaleString()} XP needed</span>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${pct}%`,
                background: 'linear-gradient(90deg, #6D28D9, #A855F7)',
                borderRadius: 99, transition: 'width 1s ease',
                animation: 'xpFill 1s ease both',
              }} />
            </div>
            <div style={{ fontSize: 10, color: '#4A4A7A', textAlign: 'right', marginTop: 4 }}>
              {pct}% to Level {stats.level + 1}
            </div>
          </div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 99,
            background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)',
          }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#A855F7', fontFamily: 'monospace' }}>
              {stats.xp.toLocaleString()} TOTAL XP
            </span>
          </div>
        </div>
      </div>

      {/* Core stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Current Streak', value: `${stats.streak}`, unit: 'days', color: '#F97316', icon: '🔥', sub: `Longest: ${stats.longest_streak}d` },
          { label: 'XP Multiplier', value: `${mult}x`, unit: '', color: '#FBBF24', icon: '⚡', sub: mult > 1 ? 'Streak bonus active' : '3+ days for bonus' },
          { label: 'Tasks Done', value: stats.total_tasks.toString(), unit: '', color: '#10B981', icon: '✅', sub: `${completionRate}% completion rate` },
          { label: 'Money Made', value: stats.total_money > 0 ? `$${stats.total_money.toLocaleString()}` : '$0', unit: '', color: '#10B981', icon: '💵', sub: 'Total logged' },
        ].map(c => (
          <div key={c.label} style={{
            padding: '16px', borderRadius: 16,
            background: 'rgba(12,12,30,0.9)', border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 9.5, color: '#4A4A7A', fontWeight: 700, letterSpacing: '1px' }}>{c.label.toUpperCase()}</span>
              <span style={{ fontSize: 14 }}>{c.icon}</span>
            </div>
            <div style={{
              fontSize: 26, fontWeight: 900, color: c.color,
              fontFamily: 'monospace', letterSpacing: '-0.5px', lineHeight: 1, marginBottom: 4,
            }}>
              {c.value}
              {c.unit && <span style={{ fontSize: 12, color: '#4A4A7A', marginLeft: 4 }}>{c.unit}</span>}
            </div>
            <div style={{ fontSize: 10.5, color: '#4A4A7A' }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Missions completed */}
      <div style={{
        padding: '16px', borderRadius: 16, marginBottom: 16,
        background: 'rgba(12,12,30,0.9)', border: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{ fontSize: 28 }}>🏆</div>
        <div>
          <div style={{ fontSize: 9.5, color: '#4A4A7A', fontWeight: 700, letterSpacing: '1px', marginBottom: 4 }}>MISSIONS COMPLETED</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#FBBF24', fontFamily: 'monospace', lineHeight: 1 }}>
            {stats.missions_completed}
          </div>
          <div style={{ fontSize: 10.5, color: '#4A4A7A', marginTop: 2 }}>Full-day completions</div>
        </div>
      </div>

      {/* Level roadmap */}
      <div style={{ fontSize: 10, color: '#4A4A7A', fontWeight: 700, letterSpacing: '1.5px', marginBottom: 12 }}>
        LEVEL ROADMAP
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
        {LEVELS_DISPLAY.map(l => {
          const reached = stats.level >= l.level
          const current = stats.level === l.level || (stats.level > l.level && stats.level < (LEVELS_DISPLAY[LEVELS_DISPLAY.indexOf(l) + 1]?.level ?? 999))
          return (
            <div key={l.level} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12,
              background: current ? `${l.color}10` : 'rgba(12,12,30,0.6)',
              border: `1px solid ${current ? `${l.color}40` : 'rgba(255,255,255,0.05)'}`,
              opacity: reached ? 1 : 0.4,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: reached ? `${l.color}20` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${reached ? l.color : 'rgba(255,255,255,0.08)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 900, color: reached ? l.color : '#3A3A5A',
                fontFamily: 'monospace',
              }}>
                {l.level}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: reached ? '#E8E8F8' : '#4A4A7A' }}>{l.title}</div>
                {current && (
                  <div style={{ fontSize: 10, color: l.color, fontWeight: 600, marginTop: 1 }}>← YOU ARE HERE</div>
                )}
              </div>
              {reached && !current && <span style={{ fontSize: 12, color: l.color }}>✓</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
