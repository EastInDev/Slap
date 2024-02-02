import { IBM_Plex_Sans_KR } from 'next/font/google'
import '@/app/globals.css'
import Providers from '@/features/home/Providers/Providers'
import Intro from '@/features/home/Intro/Intro'
import Header from '@/components/home/Header/Header'

const ibmPlexSansKR = IBM_Plex_Sans_KR({ subsets: ['latin'], weight: '400' })

export const metadata = {
  title: 'Slap',
  description: 'Slap!!!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${ibmPlexSansKR.className} p-5`}>
        <Intro />
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
