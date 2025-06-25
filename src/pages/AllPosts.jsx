import { useState, useEffect } from 'react';
import { Container, PostCard } from '../components';
import appwriteService from "../appwrite/config";
import { Query } from 'appwrite';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Loader from '@/components/Loader';
import BlogCards from '@/components/BlogCards';

function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const postsPerPage = 4;

    const fetchPosts = async (page) => {
        setLoading(true);
        const offset = (page - 1) * postsPerPage;
        const queries = [
            Query.equal("status", "active"),
            Query.limit(postsPerPage),
            Query.offset(offset),
        ];

        try {
            const response = await appwriteService.getPosts(queries);
            const total = await appwriteService.getPosts([Query.equal("status", "active"), Query.select(["$id"])]);
            if (response) {
                setPosts(response.documents);
                
                setTotalPages(Math.ceil(total.total / postsPerPage));
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        setCurrentPage(page);
    };

    return (
        <div className="w-full py-8 ">
            <Container>
                {loading ? (
                    <Loader />
                ) : posts.length === 0 ? (
                    <div className="text-center w-full py-10 text-gray-600 text-lg">
                        No posts found.
                    </div>
                ) : (
                    <div className="flex flex-col p-6 min-h-[80vh] max-md:px-4">
                        {posts.map((post) => (
                            <div key={post.$id} className="w-full  mb-4 flex justify-center">
                                <BlogCards postData={post} variant='main' />
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-4 flex justify-center">
                    <Pagination>
                        <PaginationContent className="flex list-none gap-2">
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                />
                            </PaginationItem>
                            {[...Array(totalPages)].map((_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        onClick={() => handlePageChange(index + 1)}
                                        isActive={currentPage === index + 1}
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </Container>
        </div>
    );
}

export default AllPosts;
