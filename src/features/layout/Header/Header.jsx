'use client'

import Search from '@/features/layout/Search/Search'
import Logo from '../Logo/Logo'
import Profile from '@/features/layout/Profile/Profile'
import Icons from '@/features/layout/Icons/Icons'

const Header = () => {
  return (
    <header className="fixed bg-nautral z-10 top-0 left-0 w-full flex justify-between h-20 p-5">
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
