import React, { useState } from 'react';
import { Query } from "appwrite";
import service from '../appwrite/config.js';
import { SearchIcon } from 'lucide-react';
import { Input } from '@heroui/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = async () => {
    if (query) {
      const response = await service.getPosts([
        Query.or([Query.search("title", query), Query.contains('tags', [query])])

      ]);
      console.log(response);
      setResults(response.documents);


    }
  };

  return (
    <Popover className='flex' >
      <PopoverTrigger asChild>
        <SearchIcon />
      </PopoverTrigger>
      <PopoverContent className="" sideOffset="">
        <Input
          classNames={{
            base: "max-w-full  h-10",
            mainWrapper: "h-full",
            input: "text-medium",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Type to search..."
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
        />
        {results?.map((result) => (
          <div key={result.$id}>{result.title}</div>
        ))}
      </PopoverContent>

    </Popover>
  );
}

export default Search;
