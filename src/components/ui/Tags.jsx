import React, { useState } from 'react';
import { Button } from '.';

function Tags({ tags, className }) {
    const [PostTags, setTags] = useState(tags ? tags : []);
    
    const colors = ['text-red-500', 'text-green-500', 'text-blue-500', 'text-yellow-500', 'text-purple-500'];

    const getRandomColorClass = () => {
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <>
            {tags.map((tag, index) => (
                <Button 
                    variant='ghost' 
                    key={index} 
                    className={className}
                >
                    <p>
                        <span className={getRandomColorClass()}>#</span>{tag}
                    </p>
                    
                </Button>
            ))}
        </>
    );
}

export default Tags;
