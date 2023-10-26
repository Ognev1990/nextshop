import { cn } from '@/lib/utils'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NavBar from '@/components/NavBar'
import Providers from '@/components/Providers'
import { Toaster } from "@/components/ui/toaster"

import "react-loading-skeleton/dist/skeleton.css"
import "simplebar-react/dist/simplebar.min.css"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next test shop',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='light'>
      <Providers>
        <body 
          className={cn('min-h-screen font-sans antialiased grainy', inter.className)}>
            <Toaster/>
            <NavBar/>
            {children}
        </body>
      </Providers>
    </html>
  )
}
