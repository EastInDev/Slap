import { Inter } from 'next/font/google'
import '@/app/globals.css'
import Providers from '@/features/home/Providers/Providers'
import Intro from '@/features/home/Intro/Intro'
import Header from '@/components/home/Header/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Slap',
  description: 'Slap!!!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Intro />
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
