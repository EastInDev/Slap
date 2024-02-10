'use client'

import Search from '@/features/layout/Search/Search'
import Logo from '../Logo/Logo'
import Profile from '@/features/layout/Profile/Profile'
import Icons from '@/features/layout/Icons/Icons'

const Header = () => {
  return (
    <header className="flex justify-between h-20">
      <Logo />
      <Search />
      <div className="flex align-middle">
        <Icons />
        <Profile />
      </div>
    </header>
  )
}

export default Header
