import Search from '@/features/layout/Search/Search'
import Logo from '../Logo/Logo'
import Profile from '@/features/layout/Profile/Profile'

const Header = () => {
  return (
    <header className="flex justify-between h-18">
      <Logo />
      <Search />
      <Profile />
    </header>
  )
}

export default Header
