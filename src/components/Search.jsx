import React, { useState, useRef, useEffect } from 'react';
import { Query } from "appwrite";
import service from '../appwrite/config.js';
import { SearchIcon } from 'lucide-react';
import { Card, Input } from '@heroui/react';

function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const inputRef = useRef(null);


    const handleSearch = async () => {
        if (query) {
            const response = await service.getPosts([
                Query.or([Query.search("title", query), Query.contains('tags', [query])])
            ]);
            console.log(response);
            setResults(response.documents);
        } else {
            setResults([]);
        }
    };

    return (
        <div className='w-full max-w-[800px] relative backdrop-blur-3xl shadow'>
            <Input
                ref={inputRef}
                classNames={{
                    base: "max-w-[800px]  ",
                    mainWrapper: "h-full ",
                    input: "text-medium ",
                    inputWrapper: "h-full px-4 font-normal text-default-500 bg-default-300/20 dark:bg-default-400/20 rounded-full",
                }}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Type to search..."
                size="sm"
                startContent={<SearchIcon size={18} />}
                type="search"
            />
            {results.length > 0 && (
                <Card  className="absolute w-full z-10 mt-2 bg-white/60 backdrop-blur-3xl dark:bg-black/70 shadow-2xl">
                    <div className='max-w-[800px] w-full'>
                        {results.map((result) => (
                            <div key={result.$id} className="p-2 hover:bg-gray-100">
                                {result.title}
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}

export default Search;
