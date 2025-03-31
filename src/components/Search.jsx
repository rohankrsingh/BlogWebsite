import React, { useState, useEffect, useRef } from 'react';
import { Query } from "appwrite";
import service from '../appwrite/config.js';
import { SearchIcon } from 'lucide-react';
import { Input, Button, Modal, ModalContent, ModalHeader, ModalFooter, useDisclosure, ModalBody } from '@heroui/react';
import { Card } from './ui/card.jsx';
import BlogCards from './BlogCards.jsx';
import { Separator } from './ui/separator.jsx';

function Search({ externalQuery }) {
  const [query, setQuery] = useState(externalQuery || "");
  const [results, setResults] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const searchTimeout = useRef(null);

  useEffect(() => {
    if (externalQuery) {
      setQuery(externalQuery);
      handleSearch(externalQuery);
      onOpenChange(true);
    }
  }, [externalQuery]);

  const handleSearch = async (searchQuery) => {
    if (searchQuery) {
      const response = await service.getPosts([
        Query.or([Query.search("title", searchQuery), Query.contains('tags', [searchQuery])])
      ]);
      setResults(response.documents);
    } else {
      setResults([]);
    }
  };

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      handleSearch(query);
    }, 300);
  }, [query]);

  return (
    <>
      {externalQuery ? null : <Button
        onPress={onOpen}
        variant="light"
        isIconOnly
        radius="full"
        className="text-default-600 ring-1 ring-default-200 shadow-sm"
      >
        <SearchIcon size={20} />
      </Button>}


      <Modal isOpen={isOpen} onOpenChange={() => onOpenChange(false)} size="2xl" backdrop="blur">
        <ModalContent className="p-4 bg-background/60 backdrop-blur-2xl">
          <ModalHeader>
            <Input
              className="max-w-[800px] h-10"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              placeholder="Type to search..."
              startContent={<SearchIcon size={18} />}
              type="search"
            />
          </ModalHeader>
          <ModalBody>
            {results.length > 0 ? (
              <Card className="bg-default-100/40">
                <div className="max-w-[800px] w-full">
                  {results.map((result, index) => (
                    <div key={index} className="p-2">
                      <BlogCards variant="list" postData={result} />
                      {index < results.length - 1 && <Separator className="mt-3 px-2" />}
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <h2>No results found</h2>
            )}
          </ModalBody>

          <ModalFooter>
            <Button color="danger" onClick={() => onOpenChange(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Search;
