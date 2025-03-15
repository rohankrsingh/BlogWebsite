import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, DropdownSection } from '@heroui/react'
import { Logo, LogoutBtn } from '../index'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ThemeTogle } from '../ui/ThemeTogle'
import { Button, Card } from '../ui'
import MobileNavbar from './MobileNavbar'
import AvatarCard from '../AvatarCard'
import AvatarDropdown from '../AvatarDropdown'
import Search from '../Search'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const userId = useSelector((state) => state.auth.userData?.$id || null);
  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true,
      variant: "primary"
    },

    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
      variant: "primary"
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
      variant: "secondary"
    },

    {
      name: "Sign Up",
      slug: "/signup",
      active: !authStatus,
      variant: "secondary"
    },
    {
      name: "Log In",
      slug: "/login",
      active: !authStatus,
      variant: ""
    },


  ]

  return (
    <header className='w-full sticky top-0 z-20 backdrop-blur-3xl shadow '>
      <Card className='flex bg-white/60 justify-between items-center px-4 py-3 border-none rounded-none max-md:py-2 ,
      dark:bg-black/70 '>
        <Logo className="text-xl" />
        
        <nav className='flex justify-evenly items-center border-none space-x-4
        max-md:hidden'>
          {navItems.map((item, index) => item.active ? (
            <span key={index}>
              <Button key={item.key} variant={item.variant} onClick={() => navigate(item.slug)}>
                {item.name}
              </Button>
            </span>
          ) : null
          )}
          <Search />
          {
            authStatus && (<>
              <AvatarDropdown variant={'default'} />
            </>)
          }
          <ThemeTogle />
        </nav>

        <MobileNavbar navItems={navItems} className='hidden max-md:flex' />

      </Card>

    </header>
  )
}

export default Header