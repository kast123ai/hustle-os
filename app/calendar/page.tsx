'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { generateMission } from '@/lib/mission-generator'

function dateRange(start: Date, days: number): string[] {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    return d.toISOString().slice(0, 10)
  })
}

export default function CalendarPage() {
  const { mission, history } = useApp()
  const today = new Date().toISOString().slice(0, 10)
  const [weekOffset, setWeekOffset] = useState(0)

  // Week start (Monday)
  const now = new Date()
  now.setDate(now.getDate() + weekOffset * 7)
  const dayOfWeek = (now.getDay() + 6) % 7 // 0=Mon
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - dayOfWeek)

  const days = dateRange(weekStart, 7)
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  function getMissionPct(date: string): { pct: number; tasks: number } {
    if (date === today) {
      const total = mission.tasks.length
      const done = mission.completed_ids.length
      return { pct: total > 0 ? Math.round((done / total) * 100) : 0, tasks: total }
    }
    const entry = history.find(h => h.date === date)
    if (!entry) return { pct: 0, tasks: 0 }
    return {
      pct: entry.tasks_total > 0 ? Math.round((entry.tasks_done / entry.tasks_total) * 100) : 0,
      tasks: entry.tasks_total,
    }
  }

  const weekXP = days.reduce((sum, d) => {
    if (d === today) return sum + mission.tasks.filter(t => mission.completed_ids.includes(t.id)).reduce((s, t) => s + t.xp, 0)
    const entry = history.find(h => h.date === d)
    return sum + (entry?.xp_earned ?? 0)
  }, 0)

  const weekMoney = days.reduce((sum, d) => {
    if (d === today) return sum + mission.money_logged
    const entry = history.find(h => h.date === d)
    return sum + (entry?.money_logged ?? 0)
  }, 0)

  return (
    <div style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button
          onClick={() => setWeekOffset(w => w - 1)}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 14px', color: '#9090B8', cursor: 'pointer', fontSize: 14 }}
        >←</button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: '#4A4A7A', fontWeight: 700, letterSpacing: '1.5px' }}>MISSION CALENDAR</div>
          <div style={{ fontSize: 13, color: '#E8E8F8', fontWeight: 700, marginTop: 2 }}>
            {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
            {days[6] ? new Date(days[6]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
          </div>
        </div>
        <button
          onClick={() => setWeekOffset(w => w + 1)}
          disabled={weekOffset >= 0}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 14px', color: weekOffset >= 0 ? '#2A2A4A' : '#9090B8', cursor: weekOffset >= 0 ? 'not-allowed' : 'pointer', fontSize: 14 }}
        >→</button>
      </div>

      {/* Week XP + Money */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Week XP', value: `${weekXP.toLocaleString()} XP`, color: '#A855F7' },
          { label: 'Week Earnings', value: weekMoney > 0 ? `$${weekMoney.toLocaleString()}` : '—', color: '#10B981' },
        ].map(c => (
          <div key={c.label} style={{
            padding: '14px', borderRadius: 14,
            background: 'rgba(12,12,30,0.9)', border: '1px solid rgba(255,255,255,0.07)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 9.5, color: '#4A4A7A', fontWeight: 700, letterSpacing: '1px', marginBottom: 4 }}>{c.label.toUpperCase()}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: c.color, fontFamily: 'monospace', letterSpacing: '-0.5px' }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* 7-day grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 24 }}>
        {days.map((date, i) => {
          const { pct, tasks } = getMissionPct(date)
          const isToday = date === today
          const isPast = date < today
          const isFuture = date > today
          const dayNum = new Date(date + 'T12:00:00').getDate()

          const ring = pct === 100
            ? '#10B981'
            : pct > 0
            ? '#A855F7'
            : isPast
            ? '#2A2A3A'
            : isToday
            ? '#7C3AED'
            : '#1A1A2E'

          return (
            <div key={date} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
            }}>
              <div style={{ fontSize: 9.5, color: isToday ? '#A855F7' : '#4A4A7A', fontWeight: 700, letterSpacing: '0.5px' }}>
                {dayLabels[i]}
              </div>

              {/* Circle */}
              <div style={{
                width: 38, height: 38, borderRadius: '50%', position: 'relative',
                background: isToday ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.03)',
                border: `2px solid ${ring}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isToday ? '0 0 12px rgba(124,58,237,0.3)' : 'none',
              }}>
                <span style={{
                  fontSize: 13, fontWeight: 800,
                  color: isToday ? '#A855F7' : isFuture ? '#2A2A4A' : pct > 0 ? '#E8E8F8' : '#3A3A5A',
                }}>
                  {dayNum}
                </span>
                {pct === 100 && (
                  <span style={{ position: 'absolute', top: -5, right: -5, fontSize: 11 }}>✅</span>
                )}
              </div>

              {/* Pct */}
              {tasks > 0 && (
                <div style={{ fontSize: 9, color: pct === 100 ? '#10B981' : pct > 0 ? '#A855F7' : '#3A3A5A', fontWeight: 700 }}>
                  {pct}%
                </div>
              )}
              {isFuture && tasks === 0 && (
                <div style={{ fontSize: 9, color: '#2A2A4A' }}>—</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Daily breakdown */}
      <div style={{ fontSize: 10, color: '#4A4A7A', fontWeight: 700, letterSpacing: '1.5px', marginBottom: 12 }}>
        DAILY BREAKDOWN
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {days.filter(d => d <= today).reverse().map(date => {
          const isToday = date === today
          const { pct, tasks } = getMissionPct(date)
          const entry = history.find(h => h.date === date)
          const m = isToday ? mission : null
          const label = isToday ? 'Today' : new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
          const xpEarned = isToday
            ? mission.tasks.filter(t => mission.completed_ids.includes(t.id)).reduce((s, t) => s + t.xp, 0)
            : (entry?.xp_earned ?? 0)
          const moneyLogged = isToday ? mission.money_logged : (entry?.money_logged ?? 0)

          const tasksPreview = isToday
            ? mission.tasks
            : tasks > 0
            ? generateMission(date).tasks
            : []

          return (
            <div key={date} style={{
              borderRadius: 14, overflow: 'hidden',
              border: `1px solid ${isToday ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.06)'}`,
              background: isToday ? 'rgba(124,58,237,0.04)' : 'rgba(12,12,30,0.8)',
            }}>
              <div style={{ height: 2, background: pct === 100 ? '#10B981' : pct > 0 ? '#7C3AED' : '#1A1A2E' }} />
              <div style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: isToday ? '#A78BFA' : '#E8E8F8' }}>{label}</div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {moneyLogged > 0 && (
                      <span style={{ fontSize: 10.5, color: '#10B981', fontWeight: 700 }}>💵 ${moneyLogged}</span>
                    )}
                    {xpEarned > 0 && (
                      <span style={{ fontSize: 10.5, color: '#A855F7', fontWeight: 700, fontFamily: 'monospace' }}>+{xpEarned} XP</span>
                    )}
                    <span style={{ fontSize: 11, fontWeight: 700, color: pct === 100 ? '#10B981' : '#9090B8' }}>{pct}%</span>
                  </div>
                </div>

                {/* Mini task list */}
                {tasksPreview.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {tasksPreview.map(t => {
                      const done = isToday
                        ? mission.completed_ids.includes(t.id)
                        : entry ? entry.tasks_done >= tasksPreview.indexOf(t) + 1 : false
                      return (
                        <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <span style={{ fontSize: 9, color: done ? '#10B981' : '#3A3A5A' }}>
                            {done ? '●' : '○'}
                          </span>
                          <span style={{
                            fontSize: 11.5, color: done ? '#5A5A7A' : '#9090B8',
                            textDecoration: done ? 'line-through' : 'none',
                          }}>
                            {t.title}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
