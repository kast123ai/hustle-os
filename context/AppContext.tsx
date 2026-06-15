'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { UserStats, DailyMission, HistoryEntry } from '@/types'
import { generateMission, todayStr } from '@/lib/mission-generator'
import { levelFromXP, streakMultiplier } from '@/lib/xp'

const STATS_KEY   = 'ho_stats'
const MISSION_KEY = 'ho_mission'
const HISTORY_KEY = 'ho_history'

interface AppContextType {
  stats: UserStats
  mission: DailyMission
  history: HistoryEntry[]
  completeTask: (taskId: string) => void
  uncompleteTask: (taskId: string) => void
  logMoney: (amount: number) => void
  resetDay: () => void
}

const DEFAULT_STATS: UserStats = {
  level: 1,
  xp: 0,
  streak: 0,
  longest_streak: 0,
  last_active: '',
  total_tasks: 0,
  total_money: 0,
  missions_completed: 0,
}

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function saveJSON(key: string, val: unknown) {
  localStorage.setItem(key, JSON.stringify(val))
}

function computeStreak(stats: UserStats, today: string): UserStats {
  const last = stats.last_active
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yStr = yesterday.toISOString().slice(0, 10)

  if (last === today) return stats
  if (last === yStr) {
    const streak = stats.streak + 1
    return { ...stats, streak, longest_streak: Math.max(streak, stats.longest_streak), last_active: today }
  }
  return { ...stats, streak: 1, last_active: today }
}

const Ctx = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const today = todayStr()
  const [stats,   setStats]   = useState<UserStats>(DEFAULT_STATS)
  const [mission, setMission] = useState<DailyMission>(() => generateMission(today))
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [ready, setReady]     = useState(false)

  useEffect(() => {
    const storedStats   = loadJSON<UserStats>(STATS_KEY, DEFAULT_STATS)
    const storedHistory = loadJSON<HistoryEntry[]>(HISTORY_KEY, [])
    let storedMission   = loadJSON<DailyMission | null>(MISSION_KEY, null)

    // Generate fresh mission if date changed
    if (!storedMission || storedMission.date !== today) {
      storedMission = generateMission(today)
    }

    // Streak logic
    const updatedStats = computeStreak(storedStats, today)

    setStats(updatedStats)
    setMission(storedMission)
    setHistory(storedHistory)
    saveJSON(STATS_KEY, updatedStats)
    saveJSON(MISSION_KEY, storedMission)
    setReady(true)
  }, [today])

  const completeTask = useCallback((taskId: string) => {
    setMission(prev => {
      if (prev.completed_ids.includes(taskId)) return prev
      const task = prev.tasks.find(t => t.id === taskId)
      if (!task) return prev
      const next = { ...prev, completed_ids: [...prev.completed_ids, taskId] }
      saveJSON(MISSION_KEY, next)

      // Update stats
      const mult = streakMultiplier(stats.streak)
      const earnedXP = Math.round(task.xp * mult)
      setStats(s => {
        const totalXP = s.xp + earnedXP
        const { level } = levelFromXP(totalXP)
        const updated: UserStats = {
          ...s,
          xp: totalXP,
          level,
          total_tasks: s.total_tasks + 1,
        }
        saveJSON(STATS_KEY, updated)
        return updated
      })

      // Check if mission complete
      const allDone = next.tasks.every(t => next.completed_ids.includes(t.id))
      if (allDone) {
        setStats(s => {
          const updated = { ...s, missions_completed: s.missions_completed + 1 }
          saveJSON(STATS_KEY, updated)

          // Update history
          setHistory(h => {
            const existing = h.find(e => e.date === today)
            const entry: HistoryEntry = {
              date: today,
              tasks_done: next.completed_ids.length,
              tasks_total: next.tasks.length,
              xp_earned: next.tasks.reduce((sum, t) => sum + t.xp, 0),
              money_logged: next.money_logged,
            }
            const newH = existing
              ? h.map(e => e.date === today ? entry : e)
              : [entry, ...h].slice(0, 90)
            saveJSON(HISTORY_KEY, newH)
            return newH
          })
          return updated
        })
      }

      return next
    })
  }, [stats.streak, today])

  const uncompleteTask = useCallback((taskId: string) => {
    setMission(prev => {
      const task = prev.tasks.find(t => t.id === taskId)
      if (!task) return prev
      const next = { ...prev, completed_ids: prev.completed_ids.filter(id => id !== taskId) }
      saveJSON(MISSION_KEY, next)
      setStats(s => {
        const updated = { ...s, xp: Math.max(0, s.xp - task.xp), total_tasks: Math.max(0, s.total_tasks - 1) }
        const { level } = levelFromXP(updated.xp)
        const final = { ...updated, level }
        saveJSON(STATS_KEY, final)
        return final
      })
      return next
    })
  }, [])

  const logMoney = useCallback((amount: number) => {
    setMission(prev => {
      const next = { ...prev, money_logged: prev.money_logged + amount }
      saveJSON(MISSION_KEY, next)
      return next
    })
    setStats(s => {
      const updated = { ...s, total_money: s.total_money + amount }
      saveJSON(STATS_KEY, updated)
      return updated
    })
  }, [])

  const resetDay = useCallback(() => {
    const fresh = generateMission(today)
    setMission(fresh)
    saveJSON(MISSION_KEY, fresh)
  }, [today])

  if (!ready) return null

  return (
    <Ctx.Provider value={{ stats, mission, history, completeTask, uncompleteTask, logMoney, resetDay }}>
      {children}
    </Ctx.Provider>
  )
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
