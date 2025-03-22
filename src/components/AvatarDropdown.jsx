import { useEffect, useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, DropdownSection } from '@heroui/react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AvatarCard from './AvatarCard'
import service from '@/appwrite/config'
import LogoutBtn from './Header/LogoutBtn';

function AvatarDropdown({ variant }) {
    const navigate = useNavigate();
    const userId = useSelector((state) => state.auth.userData?.$id || null);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (userId) {
                try {
                    const profile = await service.getUserProfile(userId, 'username');
                    setUserName(profile.username);
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    setUserName('');
                }
            }
        };
        fetchUserProfile();
    }, [userId]);

    return (
        <Dropdown className='dropdown-list'>
            <DropdownTrigger>
                <div>
                    <AvatarCard userId={userId} variant={variant} />
                </div>
            </DropdownTrigger>
            <DropdownMenu className="w-72 font-openSans flex !p-0">
                <DropdownSection showDivider className='m-0'>
                    <DropdownItem
                        description="See how your profile looks to others"
                        onPress={() => navigate(`/${userName}`)}>
                        Dashboard
                    </DropdownItem>
                </DropdownSection>
                <DropdownSection className='list-none list-outside m-0'>
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
                    <DropdownItem classNames={{
                        base: "pointer-events-none",
                    }}>
                        <LogoutBtn />
                    </DropdownItem>
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    )
}

export default AvatarDropdown;
