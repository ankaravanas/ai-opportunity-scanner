import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Opportunity Scanner | Liberators AI',
  description: 'Ανακαλύψτε τις AI ευκαιρίες της εταιρείας σας. Αναλύστε το website σας και λάβετε personalized προτάσεις αυτοματοποίησης.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="el">
      <body className="min-h-screen bg-bg-main antialiased">
        {children}
      </body>
    </html>
  )
}
