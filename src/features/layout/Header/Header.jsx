'use client'

import Search from '@/features/layout/Search/Search'
import Logo from '../Logo/Logo'
import Profile from '@/features/layout/Profile/Profile'
import { Bell, PlusSquare } from 'lucide-react'
import AddPost from '@/features/post/AddPost/AddPost'

const Header = () => {
  return (
    <header className="flex justify-between h-20">
      <Logo />
      <Search />
      <div className="flex align-middle">
        <button
          className="flex mt-4 mr-6 cursor-pointer"
          onClick={() => document.getElementById('my_modal_1').showModal()}
        >
          <PlusSquare />
        </button>
        <Bell className="mt-4 mr-5 cursor-pointer" />
        <Profile />
      </div>
      <AddPost />
    </header>
  )
}

export default Header
