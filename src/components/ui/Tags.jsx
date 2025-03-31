import React, { useState } from 'react'; // import useState
import { Button } from '.';
import Search from '../Search';

function Tags({ tags, className, isSearchable = true }) {
    const [searchable, setIsSearchable] = useState(isSearchable);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [currentTag, setCurrentTag] = useState('');

    const colors = ['text-red-500', 'text-green-500', 'text-blue-500', 'text-yellow-500', 'text-purple-500'];

    const getRandomColorClass = () => colors[Math.floor(Math.random() * colors.length)];

    if (!tags || tags.length === 0) return null;

    const onSearch = (tag) => {
        setCurrentTag(tag);
        setIsSearchOpen(true);
    };

    return (
        <>
            {tags.slice(0, 5).map((tag, index) => (
                <Button
                    {...searchable ? { onClick: () => onSearch(tag) } : {}}
                    variant="ghost"
                    key={index}
                    className={className}
                >
                    <p>
                        <span className={getRandomColorClass()}>#</span>{tag}
                    </p>
                </Button>
            ))}

            {searchable ? (<>
                {isSearchOpen && (
                    <Search
                        externalQuery={currentTag}
                        isOpen={isSearchOpen}
                        onOpenChange={setIsSearchOpen}
                    />
                )}
            </>) : null}

        </>
    );
}

export default Tags;

