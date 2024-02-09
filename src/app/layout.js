import { IBM_Plex_Sans_KR } from 'next/font/google'
import '@/app/globals.css'
import Providers from '@/features/layout/Providers/Providers'
import Intro from '@/features/layout/Intro/Intro'
import Header from '@/features/layout/Header/Header'
import SideNav from '@/features/layout/SideNav/SideNav'

const ibmPlexSansKR = IBM_Plex_Sans_KR({ subsets: ['latin'], weight: '400' })

export const metadata = {
  title: 'Slap',
  description: 'Slap!!!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${ibmPlexSansKR.className} min-h-dvh`}>
        <Intro />
        <Providers>
          <Header />
          <div className="h-[calc(100dvh-100px)]">
            <SideNav />
            <div className="container w-[calc(80dvw-24px)] p-6 ml-[20dvw] mt-[100px]">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
