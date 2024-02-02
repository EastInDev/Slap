import Search from '@/features/home/Search/Search'
import Logo from '../Logo/Logo'
import Profile from '@/features/home/Profile/Profile'

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
