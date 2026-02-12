import type { Metadata } from 'next'
// import font frm next fonts
import {Rubik_Distressed} from 'next/font/google'
import './src/styles/globals.scss'

const rubikDistressed = Rubik_Distressed({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-rubik-distressed',
})

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
    <html lang="en" className={`${rubikDistressed.variable} font-sans`}>
      <body>{children}</body>
    </html>
  )
}