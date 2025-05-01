import React from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from "@heroui/react";
import { Button } from "../ui";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@heroui/navbar";

import { Logo, LogoutBtn } from '../index';
import { ThemeTogle } from '../ui/ThemeTogle';
import AvatarDropdown from '../AvatarDropdown';
import Search from '../Search';
import { Menu, MenuIcon, X } from "lucide-react";

export default function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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
      variant: "ghost"
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
  ];

  return (
    <Navbar
      onMenuOpenChange={(isOpen) => setIsMenuOpen(isOpen)}
      isMenuOpen={isMenuOpen}
      isBordered
      maxWidth="full"
      classNames={{
        base: "bg-background/30 backdrop-blur-xl shadow-sm border-b border-default-200",
        wrapper: "px-4 py-2",
        menu: "",
        item: "text-default-600 hover:bg-default-100/50 hover:text-default-600 focus-visible:ring-2 focus-visible:ring-default-600 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-200 ease-in-out",

      }}
    >
      <NavbarContent className="p-0" justify="start">
        <NavbarBrand>
          <Logo className="text-xl" />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        {navItems.map((item, index) =>
          item.active ? (
            <NavbarItem key={index} isActive={item.variant === "primary"}>
              <Button
                variant={item.variant || "flat"}
                onClick={() => {
                  navigate(item.slug);
                  setIsMenuOpen(false);
                }}
                as={Link}

              >
                {item.name}
              </Button>
            </NavbarItem>
          ) : null
        )}
        {/* <LogoutBtn /> */}
        <div className="flex items-center gap-2 w-auto">
          <Search />
          {authStatus && <AvatarDropdown variant='default' />}
          <ThemeTogle />
        </div>
      </NavbarContent>

      <div className="flex items-center gap-2 w-auto sm:hidden">
        <Search className="ring-0 !bg-transparent  focus-visible:ring-0" />
        <NavbarMenuToggle
          isOpen={isMenuOpen}
          onChange={(isOpen) => setIsMenuOpen(isOpen)}
          icon={isMenuOpen ? <X /> : <MenuIcon />}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
      </div>



      <NavbarMenu isOpen={isMenuOpen} className="sm:hidden h-full gap-6 py-6">
        {navItems.map((item, index) =>
          item.active ? (
            <NavbarMenuItem key={`${item.name}-${index}`} className="w-full list-none">
              <Button
                className="w-full text-left justify-start text-lg font-poppins"
                href={item.slug}
                variant={item.variant || "flat"}
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate(item.slug);
                }}
              >
                {item.name}
              </Button>
            </NavbarMenuItem>
          ) : null
        )}
        <NavbarMenuItem className=" list-none justify-center w-full">
          {authStatus && <AvatarDropdown variant='minimal' />}

        </NavbarMenuItem>
        <NavbarMenuItem className="relative top-96 place-self-end flex space-x-4 gap- list-none justify-center w-full">
          <LogoutBtn className='text-lg rounded-full' />
          <ThemeTogle />
        </NavbarMenuItem>

      </NavbarMenu>
    </Navbar>
  );
}
