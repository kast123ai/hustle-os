import type { Difficulty } from '@/types'

export const XP_FOR_DIFFICULTY: Record<Difficulty, number> = {
  easy:   60,
  medium: 120,
  hard:   220,
}

// Level thresholds — xp needed to reach this level from level 1
export function xpForLevel(level: number): number {
  if (level <= 1) return 0
  if (level <= 5) return (level - 1) * 500
  if (level <= 10) return 2000 + (level - 5) * 1000
  if (level <= 20) return 7000 + (level - 10) * 2000
  if (level <= 50) return 27000 + (level - 20) * 5000
  return 177000 + (level - 50) * 10000
}

export function xpToNextLevel(level: number): number {
  return xpForLevel(level + 1) - xpForLevel(level)
}

export function levelFromXP(totalXP: number): { level: number; xpIntoLevel: number; xpNeeded: number } {
  let level = 1
  while (xpForLevel(level + 1) <= totalXP) level++
  const xpIntoLevel = totalXP - xpForLevel(level)
  const xpNeeded = xpForLevel(level + 1) - xpForLevel(level)
  return { level, xpIntoLevel, xpNeeded }
}

export function streakMultiplier(streak: number): number {
  if (streak >= 30) return 3.0
  if (streak >= 14) return 2.5
  if (streak >= 7)  return 2.0
  if (streak >= 3)  return 1.5
  return 1.0
}

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Street Hustler',
  5: 'Cold Caller',
  10: 'Deal Closer',
  15: 'Local Legend',
  20: 'Revenue Runner',
  25: 'Pipeline Pro',
  30: 'Six Figure Machine',
  40: 'Business Builder',
  50: 'Entrepreneur',
  75: 'Empire Mode',
  100: 'UNTOUCHABLE',
}

export function getLevelTitle(level: number): string {
  const keys = Object.keys(LEVEL_TITLES).map(Number).sort((a, b) => b - a)
  for (const k of keys) {
    if (level >= k) return LEVEL_TITLES[k]
  }
  return 'Street Hustler'
}
