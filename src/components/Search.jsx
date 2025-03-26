import React, { useState, useRef, useEffect } from 'react';
import { Query } from "appwrite";
import service from '../appwrite/config.js';
import { SearchIcon } from 'lucide-react';
import { Input, Button, Modal, ModalContent, ModalHeader, ModalFooter, useDisclosure, ModalBody } from '@heroui/react';
import { Card } from './ui/card.jsx';
import BlogCards from './BlogCards.jsx';
import { Separator } from './ui/separator.jsx';


function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const inputRef = useRef(null);
  const searchTimeout = useRef(null);

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

  const onClose = () => {
    onOpenChange(false);
  };

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      handleSearch();
    }, 300);
  }, [query]);

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
        <ModalContent className='p-4 bg-background/60 backdrop-blur-2xl backdrop-opacity-60'>
          <ModalHeader className="flex flex-col">
            <Input
              ref={inputRef}
              classNames={{
                base: "max-w-[800px] h-10",
                mainWrapper: "h-full",
                input: "text-medium",
                inputWrapper: "h-full font-normal text-default-500 bg-default-100/40 dark:bg-default-100/40",
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
          <ModalBody className="flex flex-col p-4">
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
              <h2>No results found</h2>
            )}
          </ModalBody>



          <ModalFooter>
            <Button color="danger" variant="shadow" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Search;
