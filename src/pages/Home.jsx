import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHomePosts } from '../store/postSlice';
import { Container } from '../components';
import BlogCards from '../components/BlogCards';
import { Separator } from '../components/ui';
import { motion } from 'framer-motion';
import Loader from '@/components/Loader';
import { Button, Tabs, Tab } from '@heroui/react';

function Home() {
    const dispatch = useDispatch();
    const { homePosts, status } = useSelector((state) => state.posts);
    const [selectedTag, setSelectedTag] = useState("");

    const topTags = useMemo(() => {
        if (!homePosts?.tagsPosts) return [];
        const tagCount = {};
        homePosts.tagsPosts.forEach(post => {
            (post.tags || []).forEach(tag => {
                tagCount[tag] = (tagCount[tag] || 0) + 1;
            });
        });
        return Object.entries(tagCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([tag]) => tag);
    }, [homePosts]);

    useEffect(() => {
        if (!homePosts) {
            dispatch(fetchHomePosts());
        }
    }, [dispatch, homePosts]);

    // Set selectedTag to first tag when topTags change and selectedTag is not in topTags
    useEffect(() => {
        if (topTags.length > 0 && !topTags.includes(selectedTag)) {
            setSelectedTag(topTags[0]);
        }
    }, [topTags, selectedTag]);

    if (status === 'loading' || !homePosts) {
        return <Loader />;
    }

    if (homePosts.latest.length === 0) {
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
                <div className="container h-max mx-auto px-4 py-8 space-y-12">
                    <div className="h-min grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-2 gap-6  max-sm:gap-4">
                        <div className="grid space-y-6 col-span-7 row-span-1 max-md:order-1">
                            {
                                homePosts.featured.slice(0, 1).map((post, index) => (
                                    <div key={index} className='h-full'>
                                        <BlogCards postData={post} variant='featured' />
                                    </div>
                                ))
                            }
                        </div>

                        <div className="space-y-6 col-span-5 row-span-2 max-md:col-span-7 max-md:order-3 max-sm:py-6">
                            <h2 className="text-2xl font-bold">Latest</h2>
                            <div className="space-y-6">
                                {
                                    homePosts.latest.map((post, index) => (
                                        <div key={index}>
                                            <BlogCards postData={post} variant='grid' index={index + 1} />
                                            {index < homePosts.latest.length - 1 && (
                                                <Separator orientation="horizontal" className="my-4" />
                                            )}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] col-span-7 row-span-1 gap-6 max-sm:grid-cols-1 max-md:order-2">
                            {
                                homePosts.latest.slice(1, 3).map((post, index) => (
                                    <div key={index} className='col-span-1'>
                                        <BlogCards postData={post} variant='compact' />
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className="h-min grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-2 gap-6  max-sm:gap-4">
                        <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] col-span-7 row-span-1 gap-6 max-sm:grid-cols-1">
                            {
                                homePosts.latest.slice(0, 2).map((post, index) => (
                                    <div key={index} className='h-full'>
                                        <BlogCards postData={post} variant='compact' />
                                    </div>
                                ))
                            }
                        </div>
                        {/* Popular Tags section */}
                        <div className="space-y-6 col-span-5 row-span-2 max-md:col-span-7 max-md:order-3 max-sm:py-6">
                            <h2 className="text-2xl font-bold">Popular Tags</h2>
                            <div className="mb-6 sm:mb-4">
                                {topTags.length === 0 ? (
                                    <span className="text-gray-500">No tags found</span>
                                ) : (
                                    <Tabs
                                        classNames={{
                                            tabContent: "group-data-[selected=true]:text-accent",
                                        }}
                                        aria-label="Popular Tags"
                                        selectedKey={selectedTag}
                                        onSelectionChange={setSelectedTag}
                                        className="w-full"
                                        radius="full"
                                        fullWidth
                                    >
                                        {topTags.map(tag => (
                                            <Tab key={tag} title={`#${tag}`} className="">
                                                <div className="space-y-4 sm:space-y-6">
                                                    {homePosts.tagsPosts
                                                        .filter(post => post.tags && post.tags.includes(tag))
                                                        .map((post, index) => (
                                                            <div key={post.$id || index} className="mb-2 last:mb-0">
                                                                <BlogCards postData={post} variant="list" index={index + 1} />
                                                                <Separator orientation="horizontal" className="my-3 sm:my-4" />
                                                            </div>
                                                        ))}
                                                    {homePosts.tagsPosts.filter(post => post.tags && post.tags.includes(tag)).length === 0 && (
                                                        <div className="text-gray-500">No posts found for this tag.</div>
                                                    )}
                                                </div>
                                            </Tab>
                                        ))}
                                    </Tabs>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] col-span-7 row-span-1 gap-6 max-sm:grid-cols-1 max-md:order-2">
                            {
                                homePosts.latest.slice(1, 3).map((post, index) => (
                                    <div key={index} className='col-span-1'>
                                        <BlogCards postData={post} variant='compact' />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    {/* Editor's Picks section */}
                    <div className="w-full my-8 space-y-8">
                        <h2 className="text-2xl font-bold mb-4">Editor&apos;s Picks</h2>
                        <div className="space-y-6">
                            {homePosts.editor_pick.length > 0 ? (
                                <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {homePosts.editor_pick
                                        .filter(post => post.editor_pick === true)
                                        .slice(0, 4)
                                        .map((post, index) => (
                                            <BlogCards
                                                key={post.$id || index}
                                                postData={post}
                                                variant="compact"
                                                index={index + 1}
                                                className="col-span-1"
                                            />
                                        ))}
                                </div>
                            ) : (
                                <div className="text-gray-500">No editor&apos;s picks found.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default Home;
