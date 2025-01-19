import React from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ThemeTogle } from '../ui/ThemeTogle'
import { Button, Card } from '../ui'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()

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
    <header className='w-full fixed z-10 backdrop-blur-3xl 	shadow'>
      <Card className='flex bg-white/60 justify-between items-center p-4 border-none rounded-none  ,
      dark:bg-black/70 '>
        <Logo className="text-xl"/>
        <nav className='flex justify-evenly items-center border-none space-x-4'>
          {navItems.map((item) => item.active ? (
             
              <Button key={item.key} variant={item.variant} onClick={() => navigate(item.slug)}>
                  {item.name}
              </Button>
            
          ) : null
          )}
          {
            authStatus && (<LogoutBtn/>)
          }
          
          <Button variant="icon">
            <ThemeTogle/>
          </Button>
        </nav>
      </Card>

      {/* <Container>
        <nav className='flex'>
          <div className='mr-4'>
            <Link to='/'>
              <Logo width='70px' />

            </Link>
          </div>
          <ul className='flex ml-auto'>
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
                  >{item.name}</button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
          <ThemeTogle />
        </nav>
      </Container> */}
    </header>
  )
}

export default Header