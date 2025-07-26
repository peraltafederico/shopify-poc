import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shopify Next.js Store',
  description: 'A modern e-commerce store built with Next.js and Shopify',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="border-b">
          <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold">Shopify Store</a>
            <div className="flex items-center space-x-6">
              <a href="/" className="hover:text-gray-600">Products</a>
              <a href="/reviews" className="hover:text-gray-600">Reviews</a>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}