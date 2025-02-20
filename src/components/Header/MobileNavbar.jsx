import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ThemeTogle } from "../ui/ThemeTogle";
import { Logo, LogoutBtn } from "..";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    useDisclosure,
    DropdownSection,
    DropdownTrigger,
    Dropdown,
} from "@heroui/react";
import { MenuIcon, X } from "lucide-react";
import AvatarCard from '../AvatarCard';
import { DropdownMenu, DropdownItem } from "@heroui/react"


function MobileNavbar({ navItems, className }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const authStatus = useSelector((state) => state.auth.status)
    const userId = useSelector((state) => state.auth.userData?.$id);
    
    const navigate = useNavigate()
    return (
        <>
            <Button onPress={onOpen} isIconOnly variant='light' className={className}><MenuIcon size={24} /></Button>
            <Drawer isOpen={isOpen} size={'xs'} onOpenChange={onOpenChange}
                closeButton={<Button isIconOnly variant='light'><X size={24} /></Button>}
                className='z-50 '
            >
                <DrawerContent >
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap- border-b pb-2 px-6">
                                <Logo />
                            </DrawerHeader>
                            <DrawerBody className="px-4 py-2 flex flex-col gap-3">
                                {navItems.map((item, index) => item.active ? (
                                    <Button key={index} variant={item.variant} className="justify-start w-full text-default-800 text-md font-medium" onPress={() => navigate(item.slug)}>
                                        {item.name}
                                    </Button>
                                ) : null)}

                                {authStatus && (
                                    <div className="mt-2 flex flex-col gap-3">
                                        <LogoutBtn className="w-full" />
                                        <Dropdown className='dropdown-list'>
                                            <DropdownTrigger>
                                                <Button variant="bordered" className='h-full w-full p-0'>
                                                    <AvatarCard userId={userId} variant="minimal" />
                                                </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu className="w-72 font-openSans flex !p-0">
                                                <DropdownSection className='list-none list-outside '>
                                                    
                                                        <DropdownItem
                                                            description="Change your information"
                                                            onPress={() => navigate('settings/profile')}>
                                                            Profile
                                                        </DropdownItem>
                                                        <DropdownItem
                                                            description="Personalize your experience"
                                                            onPress={() => navigate('settings/customization')}>
                                                            Customization
                                                        </DropdownItem>
                                                        <DropdownItem
                                                            description="Manage your account"
                                                            onPress={() => navigate('settings/account')}>
                                                            Account
                                                        </DropdownItem>
                                                    
                                                </DropdownSection>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </div>
                                )}

                                <ThemeTogle className="mt-2" />
                            </DrawerBody>
                            <DrawerFooter className="border-t px-4 py-3">
                                <Button color="danger" variant="light" className="w-full" onPress={onClose}>
                                    Close
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    );
}

export default MobileNavbar;
