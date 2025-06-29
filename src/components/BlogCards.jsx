import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { CardContent } from './ui/card';
import { ThumbsUp } from 'lucide-react';
import { Link } from '@heroui/link';
import { Image } from '@heroui/react';
import { Card } from '@heroui/react';
import appwriteService from "../appwrite/config"
import Tags from './ui/Tags';
import PropTypes from 'prop-types';

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
                    <CardContent className="h-full p-6 col-span-1 max-sm:p-2">
                        <div className="space-y-4 h-full flex flex-col justify-between">
                            <div className='flec flex-col'>
                                <span className="text-accent text-sm font-medium">{post.tags[0]}</span>
                                <h2 className="text-3xl leading-tight max-sm:text-2xl">
                                    {post?.title || "Untitled"}
                                </h2>
                            </div>

                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={post.userProfile?.avatar || defaultImage} />
                                    <AvatarFallback>{post.userProfile?.name || "?"}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-zinc-400">{post.userProfile?.name || "Unknown Author"}</span>
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
            <Card className=" overflow-hidden ">
                <Link href={`/post/${post.$id}`} className={`flex flex-col items-start p-2 h-full ${className}`}>
                    <Image
                        src={appwriteService.getFilePreview(post.featuredImage) || defaultImage}
                        alt={post.title || "Grid Post"}
                        // width={400}
                        height={250}
                        removeWrapper
                        className="w-full object-cover rounded-small z-0"
                    />
                    <CardContent className="min-h-fit p-2">
                        <div className="h-full flex flex-col space-y-4">
                            <span className="text-accent text-sm font-medium">{post?.tags[0] || "No Tags"}</span>
                            <h3 className="text-2xl min-h-24 font-bold leading-tight line-clamp-3 max-sm:text-2xl">{post.title || "Untitled"}</h3>
                            <div className="flex items-center justify-between gap-2 place-items-end">
                                <div className='flex items-center'>
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={post.userProfile?.avatar || defaultImage} />
                                        <AvatarFallback>{post.userProfile?.name || post.userProfile?.name.split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase() || "?"}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-zinc-400">{post.userProfile?.name || "Unknown Author"}</span>
                                </div>

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
                    <span className="inline-flex mt-2 size-7 items-center justify-center rounded-full bg-accent text-black font-bold">
                        {index || "?"}
                    </span>
                </div>
                <div className="flex-1 space-y-2">
                    <span className="text-accent text-sm font-medium">{post?.tags[0] || "No Tags"}</span>
                    <h3 className="font-bold group-hover:text-accent transition-colors">{post.title || "Untitled"}</h3>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <span>{post.$createdAt ? new Date(post.$createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Date not available'}</span>
                        <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {post.likes?.length || 0}
                        </div>
                    </div>
                </div>
                <div className="flex-none w-24">
                    <Image
                        src={appwriteService.getFilePreview(post.featuredImage, 480, 480, undefined, 75) || defaultImage}
                        alt={post.title || "Compact Post"}
                        width={96}
                        height={96}
                        className="rounded object-cover z-0"
                    />
                </div>
            </Link>
        );
    }
    else if (variant == 'list') {
        return (
            <Link href={`/post/${post.$id}`} className="flex gap-4 group p-2">
                <div className="flex-1 space-y-2">
                    <h3 className="font-bold group-hover:text-accent transition-colors">{post.title || "Untitled"}</h3>
                    <div className='flex gap-2 flex-wrap'>
                        <Tags tags={post.tags} isSearchable={false} className='p-1 rounded-md h-auto' />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <span>{post.$createdAt ? new Date(post.$createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Date not available'}</span>
                        <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {post.likes?.length || 0}
                        </div>
                    </div>
                </div>
                <div className="flex-none w-24">
                    <Image
                        src={post ? appwriteService.getFilePreview(post.featuredImage) || defaultImage : ""}
                        alt={post.title || "Compact Post"}
                        width={96}
                        height={96}
                        className="rounded object-cover z-0"
                    />
                </div>
            </Link>
        )
    }
    else if (variant == 'main') {
        return (
            <Link href={`/post/${post.$id}`} className="">
                <Card className="border group hover:shadow-lg transition-shadow duration-300 ease-in-out">
                    <CardContent className="p-6 h-max flex justify-between w-full max-w-[1200px] gap-6 max-md:p-4 max-sm:flex-col max-sm:gap-4">
                        <div className="w-full flex flex-col justify-between space-y-2 order-2 max-sm:order-2">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-3xl h-max leading-snug font-bold group-hover:text-accent transition-colors tracking-wide max-sm:text-2xl line-clamp-2">
                                    {post.title || "Untitled"}
                                </h2>

                                <div className="flex flex-wrap gap-2">
                                    <Tags tags={post.tags} isSearchable={false} className="p-1 rounded-md h-auto" />
                                </div>

                                <p className="text-lg max-md:max-w-[86vw] text-default-600 text-justify text-balance line-clamp-3 max-sm:text-base">
                                    {post.content || "No description available"}
                                </p>
                            </div>


                            <div className="flex items-center justify-between gap-2 text-sm text-default-500">
                                <div className='flex items-center text-sm gap-2'>
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={post.userProfile?.avatar || defaultImage} />
                                        <AvatarFallback>{post.userProfile?.name || post.userProfile?.name.split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase() || "?"}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-zinc-400">{post.userProfile?.name || "Unknown Author"}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">

                                    {post.$createdAt
                                        ? new Date(post.$createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })
                                        : 'Date not available'}
                                    <h6 className='text-sm flex items-center'>
                                        <ThumbsUp className="h-4 w-4 mr-1" />
                                        {post.likes?.length || 0}
                                    </h6>
                                </div>

                            </div>
                        </div>

                        <div className="flex-none w-1/4 order-1 my-auto max-sm:w-full max-sm:order-1">
                            <Image
                                src={post ? appwriteService.getFilePreview(post.featuredImage) || defaultImage : ""}
                                alt={post.title || "Compact Post"}
                                className="rounded-small md:aspect-[5/4] aspect-video object-cover w-full h-full max-lg:aspect-[5/4] max-sm:aspect-[5/4] max-sm:w-full max-sm:h-full"
                            />
                        </div>
                    </CardContent>
                </Card>
            </Link>

        )
    }
    return <div>BlogCards</div>;
}

BlogCards.propTypes = {
    variant: PropTypes.oneOf(['featured', 'compact', 'grid', 'list', 'main']).isRequired,
    postData: PropTypes.object.isRequired,
    index: PropTypes.number,
    className: PropTypes.string,
};

export default BlogCards;
