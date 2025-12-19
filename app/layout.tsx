import type { Metadata } from 'next'
import './src/styles/globals.scss'

export const metadata: Metadata = {
  title: 'Portfolio | Frontend Developer',
  description: 'Professional portfolio showcasing modern web development projects',
  keywords: 'frontend developer, web development, React, Next.js, TypeScript',
  authors: [{ name: 'Portfolio' }],
  openGraph: {
    title: 'Portfolio | Frontend Developer',
    description: 'Professional portfolio showcasing modern web development projects',
    type: 'website',
  },
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}