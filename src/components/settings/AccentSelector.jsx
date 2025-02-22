import React from 'react';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

const accentColors = [
    '0 72.2% 50.6%',
    '173.4 80.4% 40%',
    '258.3 89.5% 66.3%',
    '238.7 83.5% 66.7%',
    '188.7 94.5% 42.7%',
    '198.6 88.7% 48.4%',
    '215.4 16.3% 46.9%',
    '160.1 84.1% 39.4%',  
    '142.1 70.6% 45.3%',
    '349.7 89.2% 60.2%',
    '83.7 80.5% 44.3%'
];

function AccentSelector({ selectedColor, onSelect }) {
    const getBackgroundColor = (color) => {
        if (color.includes(' ')) {
            return `hsl(${color})`;
        }
        return `bg-${color}`;
    };

    return (
        <ScrollArea className="whitespace-nowrap py-2">
            <div className='w-max grid grid-rows-2 grid-flow-col gap-2'>
                {accentColors.map((color, index) => (
                    <div
                        key={index}
                        onClick={() => onSelect(color)}
                        className={`flex items-center justify-center size-16 cursor-pointer rounded-full border transition-all ease-linear duration-150
                            ${selectedColor === color ? 'border-accent border-4 scale-90 bg-accent-foreground' : 'border-2'}`}
                        style={{
                            backgroundColor: `hsl(${color})`, // Apply color dynamically
                        }}
                    >
                        {/* Optionally, you can include a checkmark or icon for selected color */}
                        {selectedColor === color && (
                            <span className="text-white font-bold">✓</span>
                        )}
                    </div>
                ))}
            </div>

            <ScrollBar data-orientation="horizontal" orientation="horizontal" />
        </ScrollArea>
    );
}

export default AccentSelector;
