import React from 'react'
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
const accentColors = [
    'bg-orange-500', // Coral
    'bg-teal-500',   // Teal
    'bg-yellow-500', // Mustard Yellow
    'bg-purple-200', // Lavender
    'bg-blue-500',   // Electric Blue
    'bg-orange-700', // Burnt Orange
    'bg-gray-800',   // Charcoal Gray
    'bg-green-200',  // Mint Green
    'bg-red-600',    // Crimson Red
    'bg-yellow-400'  // Gold
];

function AccentSelector({ selectedColor, onSelect }) {

    return (
        <ScrollArea className="whitespace-nowrap py-2">
            <div className='w-max grid grid-rows-2 grid-flow-col gap-2'>
                {accentColors.map((color, index) => (
                    <div
                        key={index}
                        onClick={() => onSelect(color)}
                        className={`flex items-center justify-center size-16 cursor-pointer rounded-full border transition-all ease-linear duration-150 ${color}
                            ${selectedColor === color ? 'border-accent border-4 scale-90 bg-accent-foreground' : 'border-2'}`}
                        
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

export default AccentSelector