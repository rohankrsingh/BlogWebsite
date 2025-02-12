import avatarList from './avatarList';
import { Image } from "@heroui/react";
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

const AvatarSelector = ({ selectedAvatar, onSelect }) => {
    
    return (
        <ScrollArea className="whitespace-nowrap py-2">
            <div className='w-max flex'>
                {avatarList.map((avatar, index) => (
                    <div
                        key={index}
                        onClick={() => onSelect(avatar)}
                        className={`flex items-center justify-center size-16 cursor-pointer rounded-full border transition-all ease-linear duration-150  ${selectedAvatar === avatar ? 'border-accent border-4 scale-90 bg-accent-foreground' : 'border' }`}
                    >
                        <Image src={avatar} removeWrapper
                            alt={`Avatar ${index}`} className="w-16 h-16 rounded-full z-0" />
                    </div>
                ))}
            </div>

            <ScrollBar data-orientation="horizontal" orientation="horizontal" />
        </ScrollArea>
    );
};

export default AvatarSelector;
