'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'

const INCOME_STREAMS = [
  { id: 'junk',    icon: '🚛', label: 'Junk Removal',      color: '#F97316', target: 2000 },
  { id: 'land',    icon: '🌿', label: 'Landscaping',       color: '#10B981', target: 1500 },
  { id: 'clean',   icon: '🧹', label: 'Cleaning',          color: '#3B82F6', target: 1500 },
  { id: 'ai',      icon: '🤖', label: 'AI Agency',         color: '#A855F7', target: 3000 },
  { id: 'invest',  icon: '📈', label: 'Investing',         color: '#FBBF24', target: 500  },
  { id: 'other',   icon: '💼', label: 'Other',             color: '#6B6B90', target: 500  },
]

const INVEST_TIPS = [
  { title: 'Start small, stay consistent', body: 'Even $50/week into an index ETF (VFV, XEQT) compounds to $1M+ over a career. Time in market beats timing the market.' },
  { title: 'The Rule of 72', body: 'Divide 72 by your annual return to get years to double. At 8% return: 72 ÷ 8 = 9 years. At 12%: 6 years.' },
  { title: 'Wealthsimple for beginners', body: 'Open a TFSA. Buy XEQT or VEQT for diversified exposure. Set auto-invest on every payday and ignore the noise.' },
  { title: 'Stock checklist before buying', body: '1. Earnings growing YoY? 2. Debt manageable? 3. Why is it going up? 4. Where is my stop-loss? If you can\'t answer all 4 — don\'t buy.' },
  { title: 'Trade less, earn more', body: 'Overtrading costs returns. Most active traders underperform a simple ETF. Execute fewer, better trades.' },
  { title: 'Dividend income machine', body: 'REITs and dividend ETFs pay you every month. Reinvest dividends (DRIP) to accelerate compounding. Think like a business owner.' },
]

export default function MoneyPage() {
  const { stats, history, mission } = useApp()
  const [activeStream, setActiveStream] = useState<string | null>(null)

  const today = new Date().toISOString().slice(0, 10)
  const last30 = history.slice(0, 30)
  const totalMoneyHistory = last30.reduce((s, h) => s + h.money_logged, 0)
  const totalMoney = stats.total_money

  // Trend: last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const ds = d.toISOString().slice(0, 10)
    const entry = history.find(h => h.date === ds)
    const money = ds === today ? mission.money_logged : (entry?.money_logged ?? 0)
    return { date: ds, money }
  }).reverse()

  const weekEarnings = last7.reduce((s, d) => s + d.money, 0)
  const maxDay = Math.max(...last7.map(d => d.money), 1)

  return (
    <div style={{ padding: '16px' }}>

      {/* Total earnings hero */}
      <div style={{
        borderRadius: 20, overflow: 'hidden', marginBottom: 16,
        background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,6,15,0.98) 70%)',
        border: '1px solid rgba(16,185,129,0.25)',
        padding: '24px 20px',
      }}>
        <div style={{ fontSize: 9.5, color: '#10B981', fontWeight: 700, letterSpacing: '2px', marginBottom: 8 }}>
          TOTAL INCOME LOGGED
        </div>
        <div style={{
          fontSize: 44, fontWeight: 900, color: '#10B981',
          fontFamily: 'monospace', letterSpacing: '-2px', lineHeight: 1, marginBottom: 4,
        }}>
          ${totalMoney.toLocaleString()}
        </div>
        <div style={{ fontSize: 12, color: '#6B9090' }}>
          Across all income streams tracked in Hustle OS
        </div>
      </div>

      {/* Last 7 days chart */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: '#4A4A7A', fontWeight: 700, letterSpacing: '1.5px' }}>LAST 7 DAYS</div>
          <div style={{ fontSize: 12, color: '#10B981', fontWeight: 700 }}>
            ${weekEarnings.toLocaleString()} this week
          </div>
        </div>
        <div style={{
          background: 'rgba(12,12,30,0.9)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, padding: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
            {last7.map(d => {
              const h = maxDay > 0 ? Math.max(4, Math.round((d.money / maxDay) * 80)) : 4
              const isToday = d.date === today
              const dayLabel = new Date(d.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })
              return (
                <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  {d.money > 0 && (
                    <div style={{ fontSize: 8, color: '#10B981', fontWeight: 700 }}>${d.money}</div>
                  )}
                  <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{
                      width: '100%', height: h,
                      background: isToday
                        ? 'linear-gradient(to top, #10B981, #34D399)'
                        : d.money > 0
                        ? 'rgba(16,185,129,0.4)'
                        : 'rgba(255,255,255,0.05)',
                      borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease',
                    }} />
                  </div>
                  <div style={{ fontSize: 8.5, color: isToday ? '#10B981' : '#4A4A7A', fontWeight: isToday ? 700 : 400 }}>
                    {dayLabel}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Income streams */}
      <div style={{ fontSize: 10, color: '#4A4A7A', fontWeight: 700, letterSpacing: '1.5px', marginBottom: 12 }}>
        INCOME STREAMS
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {INCOME_STREAMS.map(s => {
          const pct = Math.min(100, Math.round((totalMoney / s.target) * 100))
          const isActive = activeStream === s.id
          return (
            <div key={s.id}>
              <button
                onClick={() => setActiveStream(isActive ? null : s.id)}
                style={{
                  width: '100%', borderRadius: 14, overflow: 'hidden',
                  border: `1px solid ${isActive ? `${s.color}40` : 'rgba(255,255,255,0.07)'}`,
                  background: isActive ? `${s.color}08` : 'rgba(12,12,30,0.9)',
                  padding: '14px', cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 18 }}>{s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#E8E8F8' }}>{s.label}</div>
                    <div style={{ fontSize: 10, color: '#4A4A7A', marginTop: 1 }}>
                      Monthly target: ${s.target.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: s.color }}>
                    {pct}%
                  </div>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${pct}%`,
                    background: `linear-gradient(90deg, ${s.color}, ${s.color}88)`,
                    borderRadius: 99, transition: 'width 0.6s ease',
                  }} />
                </div>
              </button>
            </div>
          )
        })}
      </div>

      {/* Investing section */}
      <div style={{
        borderRadius: 16, overflow: 'hidden', marginBottom: 16,
        border: '1px solid rgba(251,191,36,0.2)',
        background: 'rgba(251,191,36,0.04)',
      }}>
        <div style={{ height: 3, background: '#FBBF24' }} />
        <div style={{ padding: '16px' }}>
          <div style={{ fontSize: 10, color: '#FBBF24', fontWeight: 700, letterSpacing: '1.5px', marginBottom: 12 }}>
            📈 INVESTING KNOWLEDGE HUB
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {INVEST_TIPS.map(tip => (
              <div key={tip.title} style={{
                padding: '12px', borderRadius: 12,
                background: 'rgba(12,12,30,0.8)', border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#E8E8F8', marginBottom: 4 }}>{tip.title}</div>
                <div style={{ fontSize: 11.5, color: '#7070A0', lineHeight: 1.6 }}>{tip.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly income math */}
      <div style={{
        borderRadius: 16, padding: '16px',
        background: 'rgba(12,12,30,0.9)', border: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{ fontSize: 10, color: '#4A4A7A', fontWeight: 700, letterSpacing: '1.5px', marginBottom: 14 }}>
          🧮 THE MATH — YOUR MONTHLY POTENTIAL
        </div>
        {[
          { activity: '5 junk removal jobs',     rate: '× $300 avg', total: '$1,500' },
          { activity: '4 landscaping clients',   rate: '× $200/mo',  total: '$800/mo' },
          { activity: '2 AI agency clients',     rate: '× $850/mo',  total: '$1,700/mo' },
          { activity: '5 cleaning clients',      rate: '× $150/mo',  total: '$750/mo' },
          { activity: 'Monthly ETF dividend',    rate: '× $0.10/share', total: 'Compounds' },
        ].map(r => (
          <div key={r.activity} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingBottom: 10, marginBottom: 10,
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}>
            <div>
              <div style={{ fontSize: 12.5, color: '#C0C0D8' }}>{r.activity}</div>
              <div style={{ fontSize: 10.5, color: '#4A4A7A', fontFamily: 'monospace' }}>{r.rate}</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#10B981', fontFamily: 'monospace' }}>{r.total}</div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#E8E8F8' }}>Combined monthly</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#FBBF24', fontFamily: 'monospace' }}>$4,750+</span>
        </div>
      </div>
    </div>
  )
}
