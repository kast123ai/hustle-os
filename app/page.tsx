'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { TASK_TYPE_META } from '@/lib/tasks'
import { streakMultiplier } from '@/lib/xp'
import type { Task } from '@/types'

const DIFF_COLOR: Record<string, string> = {
  easy:   '#10B981',
  medium: '#FBBF24',
  hard:   '#EF4444',
}

function TaskCard({ task, done, onToggle }: { task: Task; done: boolean; onToggle: () => void }) {
  const meta = TASK_TYPE_META[task.type]
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{
      borderRadius: 16, overflow: 'hidden',
      border: `1px solid ${done ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.07)'}`,
      background: done ? 'rgba(16,185,129,0.04)' : 'rgba(12,12,30,0.9)',
      transition: 'all 0.2s ease',
      animation: 'fadeUp 0.3s ease both',
    }}>
      {/* Color bar */}
      <div style={{ height: 3, background: done ? '#10B981' : meta.color }} />

      <div style={{ padding: '14px 16px' }}>
        {/* Row 1: checkbox + title + type badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          {/* Checkbox */}
          <button
            onClick={onToggle}
            style={{
              width: 26, height: 26, borderRadius: 8, flexShrink: 0,
              border: `2px solid ${done ? '#10B981' : 'rgba(255,255,255,0.15)'}`,
              background: done ? '#10B981' : 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 900, color: '#fff',
              transition: 'all 0.2s',
              animation: done ? 'greenPop 0.35s ease' : 'none',
              marginTop: 1,
            }}
          >
            {done ? '✓' : ''}
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Title */}
            <div style={{
              fontSize: 14, fontWeight: 700, color: done ? '#5A5A7A' : '#E8E8F8',
              marginBottom: 3, lineHeight: 1.3,
              textDecoration: done ? 'line-through' : 'none',
              transition: 'color 0.2s',
            }}>
              {task.title}
            </div>
            {/* Subtitle */}
            <div style={{ fontSize: 12, color: '#6B6B90', marginBottom: 8, lineHeight: 1.4 }}>
              {task.subtitle}
            </div>

            {/* Meta row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              {/* Type badge */}
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99,
                background: `${meta.color}15`, border: `1px solid ${meta.color}35`,
                color: meta.color, letterSpacing: '0.3px',
              }}>
                {meta.icon} {meta.label}
              </span>

              {/* Difficulty */}
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99,
                background: `${DIFF_COLOR[task.difficulty]}12`,
                border: `1px solid ${DIFF_COLOR[task.difficulty]}30`,
                color: DIFF_COLOR[task.difficulty],
              }}>
                {task.difficulty.toUpperCase()}
              </span>

              {/* Time */}
              <span style={{ fontSize: 10.5, color: '#5A5A7A' }}>
                ⏱ {task.minutes < 60 ? `${task.minutes}m` : `${(task.minutes / 60).toFixed(1)}h`}
              </span>

              {/* Money */}
              <span style={{ fontSize: 10.5, color: '#10B981', fontWeight: 600 }}>
                💵 {task.money_impact}
              </span>

              {/* XP */}
              <span style={{
                fontSize: 10, fontWeight: 800, color: '#A855F7',
                fontFamily: 'monospace',
              }}>
                +{task.xp} XP
              </span>
            </div>
          </div>
        </div>

        {/* Tip toggle */}
        {task.tip && (
          <>
            <button
              onClick={() => setExpanded(e => !e)}
              style={{
                marginTop: 10, marginLeft: 38,
                fontSize: 10.5, color: '#4A4A7A', background: 'none', border: 'none',
                cursor: 'pointer', padding: 0, fontWeight: 600,
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#8B5CF6')}
              onMouseLeave={e => (e.currentTarget.style.color = '#4A4A7A')}
            >
              {expanded ? '▲ Hide tip' : '▼ Show tip'}
            </button>
            {expanded && (
              <div style={{
                marginTop: 8, marginLeft: 38,
                padding: '10px 12px', borderRadius: 10,
                background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)',
                fontSize: 12, color: '#9090B8', lineHeight: 1.6,
                animation: 'fadeUp 0.2s ease',
              }}>
                💡 {task.tip}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function TodayPage() {
  const { mission, stats, completeTask, uncompleteTask } = useApp()
  const [showMoney, setShowMoney] = useState(false)
  const [moneyInput, setMoneyInput] = useState('')
  const { logMoney } = useApp()

  const done    = mission.completed_ids
  const total   = mission.tasks.length
  const doneCount = done.length
  const pct     = total > 0 ? Math.round((doneCount / total) * 100) : 0
  const allDone = doneCount === total
  const mult    = streakMultiplier(stats.streak)
  const today   = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  function handleMoney() {
    const amt = parseFloat(moneyInput.replace(/[^0-9.]/g, ''))
    if (amt > 0) {
      logMoney(amt)
      setMoneyInput('')
      setShowMoney(false)
    }
  }

  return (
    <div style={{ padding: '0 16px 16px' }}>

      {/* ── COACH BRIEFING ───────────────────────────────── */}
      <div style={{
        margin: '16px 0',
        borderRadius: 18, overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(109,40,217,0.15) 0%, rgba(6,6,15,0.95) 60%)',
        border: '1px solid rgba(124,58,237,0.25)',
        boxShadow: '0 4px 32px rgba(109,40,217,0.1)',
      }}>
        <div style={{ padding: '18px 18px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 9.5, color: '#7C3AED', fontWeight: 700, letterSpacing: '2px', marginBottom: 4 }}>
                AI COACH — {today.toUpperCase()}
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#E8E8F8', letterSpacing: '-0.3px' }}>
                {mission.briefing.greeting}
              </div>
            </div>
            {mult > 1 && (
              <div style={{
                padding: '4px 10px', borderRadius: 99,
                background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)',
                fontSize: 11, fontWeight: 800, color: '#F97316',
                animation: 'badgePop 0.4s ease',
              }}>
                {mult}x XP
              </div>
            )}
          </div>

          {[
            { label: 'TODAY\'S FOCUS', text: mission.briefing.focus, color: '#A78BFA' },
            { label: 'MAIN GOAL', text: mission.briefing.main_goal, color: '#10B981' },
          ].map(r => (
            <div key={r.label} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 9, color: r.color, fontWeight: 700, letterSpacing: '1.5px', marginBottom: 3 }}>
                {r.label}
              </div>
              <div style={{ fontSize: 12.5, color: '#C0C0D8', lineHeight: 1.5 }}>{r.text}</div>
            </div>
          ))}

          {/* Uncomfortable action — red alert */}
          <div style={{
            marginTop: 12, padding: '10px 12px', borderRadius: 12,
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
          }}>
            <div style={{ fontSize: 9, color: '#EF4444', fontWeight: 700, letterSpacing: '1.5px', marginBottom: 3 }}>
              🔥 MUST DO TODAY
            </div>
            <div style={{ fontSize: 12.5, color: '#FCA5A5', fontWeight: 600, lineHeight: 1.5 }}>
              {mission.briefing.push}
            </div>
          </div>

          {/* Quote */}
          <div style={{ marginTop: 12, fontSize: 11, color: '#4A4A7A', fontStyle: 'italic', lineHeight: 1.5 }}>
            {mission.briefing.quote}
          </div>
        </div>
      </div>

      {/* ── MISSION PROGRESS ─────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#4A4A7A', letterSpacing: '1.5px' }}>
            {allDone ? '🏆 MISSION COMPLETE' : `DAILY MISSION — ${doneCount}/${total} TASKS`}
          </div>
          {mission.money_logged > 0 && (
            <div style={{ fontSize: 11, color: '#10B981', marginTop: 2, fontWeight: 700 }}>
              💵 ${mission.money_logged.toLocaleString()} logged today
            </div>
          )}
        </div>
        <button
          onClick={() => setShowMoney(s => !s)}
          style={{
            padding: '6px 12px', borderRadius: 99,
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
            fontSize: 11, color: '#10B981', fontWeight: 700, cursor: 'pointer',
          }}
        >
          + Log Money
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99, marginBottom: 4, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: allDone
            ? 'linear-gradient(90deg, #10B981, #34D399)'
            : 'linear-gradient(90deg, #6D28D9, #A855F7)',
          borderRadius: 99, transition: 'width 0.5s ease',
        }} />
      </div>
      <div style={{ fontSize: 10, color: '#4A4A7A', textAlign: 'right', marginBottom: 16, fontFamily: 'monospace' }}>
        {pct}%
      </div>

      {/* Money logger */}
      {showMoney && (
        <div style={{
          marginBottom: 16, padding: '14px', borderRadius: 14,
          background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)',
          animation: 'fadeUp 0.2s ease',
        }}>
          <div style={{ fontSize: 11, color: '#10B981', fontWeight: 700, marginBottom: 8 }}>
            Log money earned today
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              autoFocus
              value={moneyInput}
              onChange={e => setMoneyInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleMoney()}
              placeholder="$0.00"
              style={{
                flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: 10, padding: '10px 14px', fontSize: 16, color: '#E8E8F8',
                outline: 'none', fontFamily: 'monospace', fontWeight: 700,
              }}
            />
            <button
              onClick={handleMoney}
              style={{
                padding: '10px 18px', borderRadius: 10, border: 'none',
                background: '#10B981', color: '#fff', fontWeight: 800, cursor: 'pointer',
                fontSize: 13,
              }}
            >
              Log
            </button>
          </div>
        </div>
      )}

      {/* ── TASK LIST ────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {mission.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            done={done.includes(task.id)}
            onToggle={() =>
              done.includes(task.id) ? uncompleteTask(task.id) : completeTask(task.id)
            }
          />
        ))}
      </div>

      {/* ── ALL DONE CELEBRATION ─────────────────────────── */}
      {allDone && (
        <div style={{
          marginTop: 24, padding: '24px 20px', borderRadius: 18, textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,6,15,0.95))',
          border: '1px solid rgba(16,185,129,0.3)',
          animation: 'fadeUp 0.4s ease',
        }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🏆</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#10B981', marginBottom: 4 }}>
            Mission Complete!
          </div>
          <div style={{ fontSize: 13, color: '#6B9090' }}>
            Streak: {stats.streak} days. Keep it going tomorrow.
          </div>
        </div>
      )}
    </div>
  )
}
