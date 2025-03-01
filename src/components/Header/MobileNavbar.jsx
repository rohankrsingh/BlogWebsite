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
} from "@heroui/react";
import { MenuIcon, X } from "lucide-react";
import AvatarCard from '../AvatarCard';
import AvatarDropdown from '../AvatarDropdown';

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
                                        <AvatarDropdown variant="minimal" />
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
