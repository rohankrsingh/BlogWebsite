import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { ThumbsUp } from 'lucide-react';
import { Link } from '@heroui/link'; // Ensure Link is imported if using Next.js
import { Image } from '@heroui/react'; // Ensure Image is imported if using Next.js
import appwriteService from "../appwrite/config"


function BlogCards({ variant, postData, className }) {
    const [post] = useState(postData || {});

    const defaultImage = "/placeholder.svg"; // Default image path

    console.log(post);
    
    if (variant === 'featured') {
        return (
            <Card className={`bg-zinc-900 border-zinc-800 overflow-hidden ${className}`}>
                <Link to={`/post/${$id}`} className="block">
                    <Image
                        src={appwriteService.getFilePreview(post.featuredImage) || defaultImage}
                        alt={post.title || "Featured Post"}
                        width={800}
                        height={400}
                        className="w-full object-cover"
                    />
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <span className="text-emerald-500 text-sm font-medium">Features</span>
                            <h2 className="text-2xl font-bold leading-tight">
                                {post.title || "Untitled"}
                            </h2>
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
            <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
                <Link href="#" className="block">
                    <Image
                        src={appwriteService.getFilePreview(post.featuredImage) || defaultImage}
                        alt={post.title || "Grid Post"}
                        width={400}
                        height={300}
                        className="w-full object-cover"
                    />
                    <CardContent className="p-6">
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
    } else if (variant === 'compact') {
        return (
            <Link href={`/post/${post.$id}`} className="flex gap-4 group">
                <div className="flex-none">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-black font-bold">
                        {post.authorInitials || "?"}
                    </span>
                </div>
                <div className="flex-1 space-y-2">
                    <span className="text-emerald-500 text-sm font-medium">{post?.tags || "No Tags"}</span>
                    <h3 className="font-bold group-hover:text-emerald-500 transition-colors">{post.title || "Untitled"}</h3>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <span>{post.date || "Date not available"}</span>
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
                        className="rounded object-cover"
                    />
                </div>
            </Link>
        );
    }
    return <div>BlogCards</div>;
}

export default BlogCards;
