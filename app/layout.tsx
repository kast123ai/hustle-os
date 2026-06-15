import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '@/context/AppContext'
import { Shell } from '@/components/Shell'

export const metadata: Metadata = {
  title: 'Hustle OS — Daily Mission',
  description: 'Your discipline coach for real-world money-making',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <Shell>{children}</Shell>
        </AppProvider>
      </body>
    </html>
  )
}
