import React, { useState } from 'react';
import { Query } from "appwrite";
import service from '../appwrite/config.js';
import { Heading2, SearchIcon } from 'lucide-react';
import { Input, Button } from '@heroui/react';
import { Card } from './ui/card.jsx';
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
        <>
            <Button
                onPress={onOpen}
                variant='light'
                isIconOnly
                radius='full'
                className='text-default-600 ring-1 ring-default-200 shadow-sm'
            >
                <SearchIcon size={20} />
            </Button>

            <Modal
                isOpen={isOpen}
                onOpenChange={onClose}
                scrollBehavior="inside"
                closeButton={<></>}
                size='2xl'
                backdrop="blur"
                placement='center'
                classNames={{
                    backdrop: "backdrop-blur-sm",
                }}
            >
                <ModalContent className='bg-background/60 backdrop-blur-2xl backdrop-opacity-60'>
                    <ModalHeader className="flex flex-col gap-1">
                        <Input
                            ref={inputRef}
                            classNames={{
                                base: "max-w-[800px] h-10",
                                mainWrapper: "h-full",
                                input: "text-medium",
                                inputWrapper: "h-full px-4 font-normal text-default-500 bg-default-100/40 dark:bg-default-100/40",
                            }}
                            onChange={(e) => setQuery(e.target.value)}
                            value={query}
                            placeholder="Type to search..."
                            size="md"
                            startContent={<SearchIcon size={18} />}
                            type="search"
                            aria-label="Search"
                        />
                    </ModalHeader>

                    {results.length > 0 ? (
        <>
            <h2>Search results</h2>
            <Card className="bg-default-100/40 dark:bg-default-100/40">
                <div className='max-w-[800px] w-full'>
                    {results.map((result, index) => (
                        <div key={index} className="p-2">
                            <BlogCards variant='list' postData={result} />
                            {index < results.length - 1 && <Separator className='mt-3 px-2' />}
                        </div>
                    ))}
                </div>
            </Card>
        </>
    ) : (
        <h2>No results found</h2> // Optional message when no results are found
    )}

                    <ModalFooter>
                        <Button color="danger" variant="shadow" onPress={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
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
