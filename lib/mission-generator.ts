import type { DailyMission, Task, CoachBriefing } from '@/types'
import { TASK_LIBRARY } from './tasks'

// Day-of-week task type mix — always includes the "uncomfortable" action
const DAY_MIX: Record<number, { types: string[]; count: number }> = {
  0: { types: ['door', 'online', 'online', 'skill'],                count: 4 }, // Sunday
  1: { types: ['phone', 'phone', 'online', 'skill', 'online'],      count: 5 }, // Monday
  2: { types: ['door', 'door', 'phone', 'skill'],                   count: 4 }, // Tuesday
  3: { types: ['phone', 'online', 'online', 'skill', 'phone'],      count: 5 }, // Wednesday
  4: { types: ['door', 'phone', 'online', 'skill', 'phone'],        count: 5 }, // Thursday
  5: { types: ['door', 'door', 'online', 'phone', 'skill'],         count: 5 }, // Friday
  6: { types: ['door', 'door', 'door', 'online', 'skill', 'phone'], count: 6 }, // Saturday — peak
}

const BRIEFINGS: CoachBriefing[] = [
  {
    greeting: 'Let\'s get after it.',
    focus: 'New business outreach — every door is a yes waiting to happen.',
    main_goal: 'Book 1 paid job or close 1 new client before the day ends.',
    push: 'Knock on 20 doors before 2pm. No excuses.',
    quote: '"You miss 100% of the shots you don\'t take." — Wayne Gretzky',
  },
  {
    greeting: 'Money doesn\'t make itself.',
    focus: 'Phone outreach and follow-ups — revenue lives in the pipeline.',
    main_goal: 'Make 20 outreach contacts and log every response.',
    push: 'The phone feels heavy because you\'re afraid. Pick it up anyway.',
    quote: '"Success is the sum of small efforts repeated day in and day out." — Robert Collier',
  },
  {
    greeting: 'Your competition isn\'t doing this right now.',
    focus: 'Build your online presence and collect leads while others sleep.',
    main_goal: 'Send 20 DMs and build a list of 30 prospects for tomorrow.',
    push: 'One focused hour online today can pay you next week.',
    quote: '"The secret of getting ahead is getting started." — Mark Twain',
  },
  {
    greeting: 'Today is a money day. Treat it that way.',
    focus: 'Local hustle — your neighborhood is full of people who need your help.',
    main_goal: 'Generate at least 3 real quotes or proposals today.',
    push: 'Drive to a neighborhood you\'ve never knocked and spend 2 hours there.',
    quote: '"Action is the foundational key to all success." — Pablo Picasso',
  },
  {
    greeting: 'Skills compound. Let\'s sharpen the blade today.',
    focus: 'Skill-building day + 2 income actions — don\'t let learning become an excuse.',
    main_goal: 'Learn something that makes your next pitch 10% better.',
    push: 'Practice your pitch until it feels boring. That\'s when it works.',
    quote: '"An investment in knowledge pays the best interest." — Benjamin Franklin',
  },
  {
    greeting: 'Full send. No half measures today.',
    focus: 'High-volume outreach — more contacts = more chances = more money.',
    main_goal: 'Touch 30+ potential clients across phone, door, and online channels.',
    push: 'Feel uncomfortable? Good. That\'s the feeling of growth.',
    quote: '"The harder I work, the luckier I get." — Samuel Goldwyn',
  },
  {
    greeting: 'Real money comes from real action. Let\'s move.',
    focus: 'Close existing leads + generate new ones. Pipeline and conversion.',
    main_goal: 'Follow up on every open lead AND generate 5 fresh contacts.',
    push: 'That one person you\'ve been putting off calling — call them first.',
    quote: '"Do not wait to strike till the iron is hot, but make it hot by striking." — W.B. Yeats',
  },
]

function seededPick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length]
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = ((seed * (i + 1) * 2654435761) >>> 0) % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function generateMission(date: string): DailyMission {
  const d = new Date(date + 'T12:00:00')
  const dow = d.getDay()
  const seed = parseInt(date.replace(/-/g, ''), 10)
  const mix = DAY_MIX[dow] ?? DAY_MIX[1]

  const selected: Task[] = []
  const usedTypes: Record<string, number> = {}

  for (const type of mix.types) {
    const pool = TASK_LIBRARY.filter(
      t => t.type === type && !selected.find(s => s.id === t.id)
    )
    if (pool.length === 0) continue
    const shuffled = seededShuffle(pool, seed + (usedTypes[type] ?? 0) * 31)
    selected.push(shuffled[0])
    usedTypes[type] = (usedTypes[type] ?? 0) + 1
  }

  const briefing = seededPick(BRIEFINGS, seed)

  return {
    date,
    tasks: selected,
    completed_ids: [],
    money_logged: 0,
    briefing,
  }
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}
