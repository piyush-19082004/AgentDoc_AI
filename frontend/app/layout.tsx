import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'AgentDoc AI',
  description: 'Autonomous Multi-Agent AI Document Generator'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0f172a] text-white antialiased">
        {children}
      </body>
    </html>
  )
}
