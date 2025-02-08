import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import {  CardContent } from './ui/card';
import { ThumbsUp } from 'lucide-react';
import { Link } from '@heroui/link'; // Ensure Link is imported if using Next.js
import { Image } from '@heroui/react';
import { Card } from '@heroui/react';
import appwriteService from "../appwrite/config"

function BlogCards({ variant, postData, index, className }) {
    const [post] = useState(postData || {});

    const defaultImage = "/placeholder.svg";

    if (variant === 'featured') {
        return (
            <Card className={`h-full overflow-hidden  ${className}`}>
                <Link href={`/post/${post.$id}`} className="p-2 grid grid-cols-2 h-[inherit] items-start 
                max-md:grid-cols-1">
                    <Image
                        src={post.featuredImage ? appwriteService.getFilePreview(post.featuredImage) : defaultImage}
                        alt={post.title || "Featured Post"}
                        width={800}
                        // height={410}
                        removeWrapper
                        className="w-full h-full  col-span-1 object-cover z-0 rounded-small"
                    />
                    <CardContent className="p-6 col-span-1">
                        <div className="space-y-4">
                            <div className='flec flex-col '>
                                <span className="text-emerald-500 text-sm font-medium">Features</span>
                                <h2 className="text-3xl leading-tight">
                                    {post?.title || "Untitled"}
                                </h2>
                            </div>

                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={post.authorImage || defaultImage} />
                                    <AvatarFallback>{post.authorInitials || "?"}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-zinc-400">{post.authorName || "Unknown Author"}</span>
                                <div className="flex items-center text-zinc-400 text-sm">
                                    <ThumbsUp className="h-4 w-4 mr-1" />{post.likes?.length || 0}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Link>
            </Card>
        );
    } else if (variant === 'compact') {
        return (
            <Card className=" overflow-hidden">
                <Link href={`/post/${post.$id}`} className="flex flex-col items-start p-2">
                    <Image
                        src={appwriteService.getFilePreview(post.featuredImage) || defaultImage}
                        alt={post.title || "Grid Post"}
                        // width={400}
                        height={250}
                        removeWrapper
                        className="w-full object-cover rounded-small z-0"
                    />
                    <CardContent className="p-2">
                        <div className="space-y-4">
                            <span className="text-emerald-500 text-sm font-medium">{post?.tags[0] || "No Tags"}</span>
                            <h3 className="text-xl font-bold leading-tight">{post.title || "Untitled"}</h3>
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={post.authorImage || defaultImage} />
                                    <AvatarFallback>{post.authorInitials || "?"}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-zinc-400">{post.authorName || "Unknown Author"}</span>
                                <div className="flex items-center text-zinc-400 text-sm">
                                    <ThumbsUp className="h-4 w-4 mr-1" />{post.likes?.length || 0}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Link>
            </Card>
        );
    } else if (variant === 'grid') {
        return (
            <Link href={`/post/${post.$id}`} className="flex gap-4 group">
                <div className="flex-none self-start">
                    <span className="inline-flex mt-2 size-7 items-center justify-center rounded-full bg-emerald-500 text-black font-bold">
                        {index || "?"}
                    </span>
                </div>
                <div className="flex-1 space-y-2">
                    <span className="text-emerald-500 text-sm font-medium">{post?.tags[0] || "No Tags"}</span>
                    <h3 className="font-bold group-hover:text-emerald-500 transition-colors">{post.title || "Untitled"}</h3>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <span>{post.$createdAt ? new Date(post.$createdAt).toLocaleDateString() : "Date not available"}</span>
                        <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {post.likes?.length || 0}
                        </div>
                    </div>
                </div>
                <div className="flex-none w-24">
                    <Image
                        src={appwriteService.getFilePreview(post.featuredImage) || defaultImage}
                        alt={post.title || "Compact Post"}
                        width={96}
                        height={96}
                        className="rounded object-cover z-0"
                    />
                </div>
            </Link>
        );
    }
    return <div>BlogCards</div>;
}

export default BlogCards;
