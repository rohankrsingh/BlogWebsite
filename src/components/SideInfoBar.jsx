import { useEffect, useState } from "react";
import { ThumbsUp, Share, Ellipsis, Calendar, User, Copy, Edit } from "lucide-react";
import appwriteService from "../appwrite/config";
import service from "../appwrite/config";
import { useSelector } from "react-redux";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { addToast, Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";

function SideInfoBar({ className, likes, isLiked, slug, onLikeUpdate, postAuthor, postAuthorId }) {
    const [postLikes, setLikes] = useState(likes);
    const [liked, setLiked] = useState(isLiked);
    const userData = useSelector((state) => state.auth.userData);
    const authStatus = useSelector((state) => state.auth.status);
    const [likedPosts, setLikedPosts] = useState([]);
    const [ postAuthorName ] = useState(postAuthor || "Unknown Author");
    const navigate = useNavigate();

    useEffect(() => {
        setLikes(likes);
        setLiked(isLiked);
    }, [likes, isLiked]);
    useEffect(() => {
        const fetchLikedPosts = async () => {
            if (authStatus && userData) {
                try {
                    const posts = await service.getUserProfile(userData.$id, "liked");

                    setLikedPosts(posts.liked || []);
                } catch (error) {
                    console.error("Error fetching liked posts:", error);
                }
            }
        };
        fetchLikedPosts();
    }, [authStatus, userData]);

    const toggleLike = async () => {
        if (!userData || !authStatus) return;

        const newLikedStatus = !liked;
        const updatedLikes = newLikedStatus
            ? [...postLikes, userData.$id]
            : postLikes.filter((id) => id !== userData.$id);

        setLikes(updatedLikes);
        setLiked(newLikedStatus);
        onLikeUpdate(updatedLikes, newLikedStatus);

        const updatedLikedPosts = newLikedStatus
            ? Array.from(new Set([...likedPosts, slug])) // Ensure no duplicates
            : likedPosts.filter((s) => s !== slug);
        setLikedPosts(updatedLikedPosts);

        try {
            const likesCount = updatedLikes.length;
            await appwriteService.updateLikedPost(userData.$id, updatedLikedPosts);
            await appwriteService.updatePostLikes(slug, updatedLikes, likesCount);
        } catch (error) {
            console.error("Error updating like status:", error);
        }
    };

    const handleShare = (platform) => {
        const postUrl = `${window.location.origin}/post/${slug}`;
        if (platform === "copy") {
            navigator.clipboard.writeText(postUrl);
            addToast({
                title: "Link Copied",
                description: "The post link has been copied to your clipboard.",
                color: "success",
            });
        } else {
            const urls = {
                twitter: `https://twitter.com/intent/tweet?url=${postUrl}`,
                facebook: `https://www.facebook.com/sharer/sharer.php?u=${postUrl}`,
            };
            window.open(urls[platform], "_blank");
        }
    };

    // Handlers for dropdown actions
    const handleViewAuthorProfile = () => {
        if (postAuthorId) navigate(`/profile/${postAuthorId}`);
    };

    return (
        <aside className={`h-full pt-10 flex flex-col gap-4 items-center max-md:flex-row max-md:justify-around max-md:w-screen max-md:bg-primary-foreground max-md:p-0  ${className}`}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="icon"
                            className="h-14 flex flex-col items-center gap-2 text-primary dark:text-white max-md:flex-row"
                            onPress={toggleLike}
                        >
                            {liked ? <ThumbsUp className="fill-primary" /> : <ThumbsUp />}
                            <p>{postLikes.length}</p>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Like</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="icon" className="h-14 flex flex-col items-center justify-center">
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
                    </Button>

                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleShare("twitter")}>
                        Share on Twitter
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare("facebook")}>
                        Share on Facebook
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu >
                <DropdownMenuTrigger asChild>
                    <Button variant="icon" className="size-10 flex flex-col items-center justify-center">
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
                    </Button>
                </DropdownMenuTrigger>
                {/* three dot menu */}
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Published {new Date().toLocaleDateString()}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2" onClick={handleViewAuthorProfile}>
                        <User className="h-4 w-4" />
                        <span>Author: {postAuthorName}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleShare("copy")}> 
                        <Copy className="h-4 w-4" />
                        <span>Copy Link</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </aside>
    );
}

export default SideInfoBar;
