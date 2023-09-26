import './globals.css'
import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'

const inter = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Saigon Hieronta',
  description: 'Saigon hieronta palvelu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={inter.className}
      >
        <main className='flex justify-center items-center min-h-screen'>
          {children}
        </main>
      </body>
    </html>
  )
}
