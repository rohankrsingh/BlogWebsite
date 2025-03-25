import React, { useEffect, useState } from 'react';
import appwriteService from "../appwrite/config";
import { Container } from '../components';
import BlogCards from '../components/BlogCards';
import { Query } from 'appwrite';
import { Separator } from '../components/ui';
import { motion } from 'framer-motion';
import Loader from '@/components/Loader';

function Home() {
    const [posts, setPosts] = useState({
        latest: [],
        featured: [],
    });
    const [loading, setLoading] = useState(true);

    const latestQuery = [
        Query.orderDesc('$createdAt'),
        Query.limit(10),
    ];

    const featuredQuery = [
        Query.orderDesc('likesCount'),
        Query.limit(3),
    ];

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const latest = await appwriteService.getPosts(latestQuery);
                const featured = await appwriteService.getPosts(featuredQuery);
                setPosts({
                    latest: latest ? latest.documents : [],
                    featured: featured ? featured.documents : [],
                });
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);
    console.log(posts.featured);
    if (loading) {
        return <Loader />;
    }

    if (posts.latest.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Login to read posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >
            <div className="w-full min-h-screen h-max">
                <div className="container h-max mx-auto px-4 py-8">
                    <div className="h-min grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-2 gap-6">
                        <div className="grid space-y-6 col-span-7 row-span-1 max-md:order-1">
                            {
                                posts.featured.slice(0, 1).map((post, index) => (
                                    <div key={index} className='h-full'>
                                        <BlogCards postData={post} variant='featured' />
                                    </div>
                                ))
                            }
                        </div>

                        <div className="space-y-6 col-span-5 row-span-2 max-md:col-span-7 max-md:order-3">
                            <h2 className="text-2xl font-bold">Latest</h2>
                            <div className="space-y-6">
                                {
                                    posts.latest.map((post, index) => (
                                        <div key={index}>
                                            <BlogCards postData={post} variant='grid' index={index + 1} />
                                            {index < posts.latest.length - 1 && (
                                                <Separator orientation="horizontal" className="my-2" />
                                            )}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] col-span-7 row-span-1 gap-4 max-sm:grid-cols-1 max-md:order-2">
                            {
                                posts.latest.slice(1, 3).map((post, index) => (
                                    <div key={index} className='col-span-1'>
                                        <BlogCards postData={post} variant='compact' />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default Home;
