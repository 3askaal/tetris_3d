"use client";

import type { Metadata } from 'next'
import ReactGA from 'react-ga4'
import { ThemeProvider, theme as DEFAULT_THEME } from '3oilerplate'
import { Inter } from 'next/font/google'
import { LOCAL_THEME } from '../style/theme';
import './globals.css';

import 'reset-css/reset.css'
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ['latin'] })

ReactGA.initialize('G-NF6H1LMC3H', {
  testMode: process.env.NODE_ENV === 'development'
})

const NonSSRWrapper = ({ children }: any) => (
  <>{children}</>
)

const DynamicWrapper = dynamic(() => Promise.resolve(NonSSRWrapper), {
  ssr: false
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          theme={{
            ...DEFAULT_THEME,
            ...LOCAL_THEME
          }}
        >
          <DynamicWrapper>
            {children}
          </DynamicWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
