'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

const defaultMenu = [
  { title: '홈', href: '/' },
  { title: '인기 Slap!', href: '/popular' },
  { title: '최신 Slap', href: '/latest' },
]

const authMenu = [
  { title: '내가 쓴 Slap!', href: '/my' },
  { title: '내가 쓴 댓글', href: '/my' },
  { title: '내가 좋아요한 Slap', href: '/my' },
  { title: '즐겨찾기', href: '/my' },
  { title: '내가 투표한 Slap', href: '/my' },
]

const SlapMenu = () => {
  return (
    <ul className="menu w-56">
      {defaultMenu.map((menu, index) => (
        <li key={index}>
          <Link href={menu.href}>{menu.title}</Link>
        </li>
      ))}
    </ul>
  )
}

const MyMenu = () => {
  return (
    <ul className="menu w-56">
      {authMenu.map((menu, index) => (
        <li key={index}>
          <Link href={menu.href}>{menu.title}</Link>
        </li>
      ))}
    </ul>
  )
}

const SideNav = () => {
  const { data: session } = useSession()

  return (
    <div className="w-1/4 border-r-2 h-full">
      <SlapMenu />
      <div className="divider"></div>
      {session ? <MyMenu /> : null}
    </div>
  )
}

export default SideNav
