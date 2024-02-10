import { IBM_Plex_Sans_KR } from 'next/font/google'
import '@/app/globals.css'
import Providers from '@/features/layout/Providers/Providers'
import Intro from '@/features/layout/Intro/Intro'
import Header from '@/components/layout/Header/Header'
import SideNav from '@/features/layout/SideNav/SideNav'

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
          <div className="flex">
            <SideNav />
            <div className="container w-3/4">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
