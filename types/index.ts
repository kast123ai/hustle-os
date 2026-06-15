export type TaskType = 'phone' | 'door' | 'online' | 'skill'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Task {
  id: string
  title: string
  subtitle: string
  type: TaskType
  difficulty: Difficulty
  minutes: number
  money_impact: string
  money_max: number
  xp: number
  tip?: string
}

export interface DailyMission {
  date: string
  tasks: Task[]
  completed_ids: string[]
  money_logged: number
  briefing: CoachBriefing
}

export interface CoachBriefing {
  greeting: string
  focus: string
  main_goal: string
  push: string
  quote: string
}

export interface UserStats {
  level: number
  xp: number
  streak: number
  longest_streak: number
  last_active: string
  total_tasks: number
  total_money: number
  missions_completed: number
}

export interface HistoryEntry {
  date: string
  tasks_done: number
  tasks_total: number
  xp_earned: number
  money_logged: number
}
