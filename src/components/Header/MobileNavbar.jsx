import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ThemeTogle } from "../ui/ThemeTogle";
import { LogoutBtn } from "..";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    useDisclosure,
    Menu,
} from "@heroui/react";
import { MenuIcon, X } from "lucide-react";

function MobileNavbar({ navItems, className }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const authStatus = useSelector((state) => state.auth.status)
    const navigate = useNavigate()
    return (
        <>
            <Button onPress={onOpen} isIconOnly disableRipple disableAnimation variant='' className={className}><MenuIcon /></Button>
            <Drawer isOpen={isOpen} size={'xs'} onOpenChange={onOpenChange}
                closeButton={<Button isIconOnly disableRipple disableAnimation variant=''><X/></Button>}
            >
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">Drawer Title</DrawerHeader>
                            <DrawerBody>
                                {navItems.map((item, index) => item.active ? (
                                    <span key={index}>
                                        <Button key={item.key} variant={item.variant} onClick={() => navigate(item.slug)}>
                                            {item.name}
                                        </Button>
                                    </span>


                                ) : null
                                )}
                                {
                                    authStatus && (<LogoutBtn />)
                                }

                                <Button isIconOnly disableRipple disableAnimation variant='' >
                                    <ThemeTogle />
                                </Button>
                            </DrawerBody>
                            <DrawerFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Action
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    );
}

export default MobileNavbar