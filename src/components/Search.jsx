import React, { useState, useRef, useEffect } from 'react';
import { Query } from "appwrite";
import service from '../appwrite/config.js';
import { SearchIcon } from 'lucide-react';
import { Input, Button } from '@heroui/react';
import { Card } from './ui/card.jsx';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure
} from "@heroui/modal";
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

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <Button onPress={onOpen} variant='light' isIconOnly radius='full' className='text-default-600 ring-1 ring-default-200 shadow-sm'><SearchIcon size={20} /></Button>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                scrollBehavior={"inside"}
                closeButton={<></>}
                size='2xl'
                backdrop="blur"
                classNames={{
                    backdrop: "  backdrop-blur-sm",
                }} >
                <ModalContent className='bg-background/60 backdrop-blur-2xl backdrop-opacity-60'>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <Input
                                    ref={inputRef}
                                    classNames={{
                                        base: "max-w-[800px]  h-10",
                                        mainWrapper: "h-full ",
                                        input: "text-medium",
                                        inputWrapper: "h-full px-4 font-normal text-default-500 bg-default-100/40 dark:bg-default-100/40",
                                    }}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Type to search..."
                                    size="md"
                                    startContent={<SearchIcon size={18} />}
                                    type="search"
                                />
                            </ModalHeader>
                            <ModalBody >
                                {results.length > 0 && (
                                    <Card className="bg-default-100/40 dark:bg-default-100/40">
                                        <div className='max-w-[800px] w-full'>
                                            {results.map((result) => (
                                                <div key={result.$id} className="p-2 ">
                                                    {result.title}
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
    
}

export default Search;
