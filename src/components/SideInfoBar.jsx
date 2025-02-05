import React, { useEffect, useState } from "react";
import { ThumbsUp, Share, Ellipsis } from "lucide-react";
import appwriteService from "../appwrite/config";
import service from "../appwrite/config";
import { useSelector } from "react-redux";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

function SideInfoBar({ className, likes, isLiked, slug, onLikeUpdate }) {
    const [postLikes, setLikes] = useState(likes); // Manage like count locally
    const [liked, setLiked] = useState(isLiked); // Track the liked state
    const userData = useSelector((state) => state.auth.userData);
    const authStatus = useSelector((state) => state.auth.status); // Current logged-in user
    const [likedPosts, setLikedPosts] = useState([]); // Store liked posts

    useEffect(() => {
        // Sync local state when parent updates props
        setLikes(likes);
        setLiked(isLiked);
    }, [likes, isLiked]);

    const toggleLike = async () => {
        if (!userData || !authStatus) return; // Prevent action for unauthenticated users

        const newLikedStatus = !liked; // Toggle like status
        const updatedLikes = newLikedStatus
            ? [...postLikes, userData.$id] // Add user ID to likes
            : postLikes.filter((id) => id !== userData.$id); // Remove user ID 

        setLikes(updatedLikes);
        setLiked(newLikedStatus);
        onLikeUpdate(updatedLikes, newLikedStatus);

        const updatedLikedPosts = newLikedStatus
            ? [...likedPosts, slug] // Add post slug to liked posts
            : likedPosts.filter((s) => s !== slug); // Remove post slug
        setLikedPosts(updatedLikedPosts);
        const likesCount = updatedLikes.length;
        await appwriteService.updateLikedPost(userData.$id, updatedLikedPosts);
        await appwriteService.updatePostLikes(slug, updatedLikes, likesCount);
    };

    const handleShare = (platform) => {
        const postUrl = `${window.location.origin}/post/${slug}`;
        if (platform === "copy") {
            navigator.clipboard.writeText(postUrl);
            alert("Link copied to clipboard!");
        } else {
            const urls = {
                twitter: `https://twitter.com/intent/tweet?url=${postUrl}`,
                facebook: `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`,
            };
            window.open(urls[platform], "_blank");
        }
    };

    return (
        <aside className={`h-full pt-10 flex flex-col gap-4 items-center max-md:flex-row max-md:justify-around max-md:w-screen max-md:bg-primary-foreground max-md:p-0  ${className}`}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            className="h-14 flex flex-col items-center gap-2 text-primary dark:text-white max-md:flex-row"
                            onClick={toggleLike}
                        >
                            {liked ? <ThumbsUp className="fill-primary" /> : <ThumbsUp />}
                            <p>{postLikes.length}</p>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Like</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="h-14 flex flex-col items-center justify-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Share />
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>Share </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </button>

                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleShare("twitter")}>
                        Share on Twitter
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("facebook")}>
                        Share on Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("copy")}>
                        Copy Link
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>



            <DropdownMenu>
                <DropdownMenuTrigger asChild>

                    <button className="h-14 flex flex-col items-center justify-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Ellipsis />
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>More</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </button>

                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        {/* <strong>Author:</strong> {postInfo.author} */}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        {/* <strong>Date:</strong> {new Date(postInfo.date).toLocaleDateString()} */}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        {/* <strong>Reading Time:</strong> {postInfo.readingTime} mins */}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </aside>
    );
}

export default SideInfoBar;
