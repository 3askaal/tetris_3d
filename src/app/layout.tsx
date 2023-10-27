import type { Metadata } from 'next'
import ReactGA from 'react-ga4'
import { Inter } from 'next/font/google'
import './globals.css';

import 'reset-css/reset.css'

const inter = Inter({ subsets: ['latin'] })

ReactGA.initialize('G-NF6H1LMC3H', {
  testMode: process.env.NODE_ENV !== 'production'
})

export const metadata: Metadata = {
  title: 'Tetris 3D'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
