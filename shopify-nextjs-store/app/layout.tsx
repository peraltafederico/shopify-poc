import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'NatureNest - Adventure Awaits',
  description: 'Discover your perfect adventure with our curated collection of nature-inspired gear',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-stone-50">
        <Sidebar />
        <Topbar />
        <main className="ml-0 md:ml-64 mt-20 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}