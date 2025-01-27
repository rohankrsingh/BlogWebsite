import React, { useEffect, useState } from 'react';
import { ThumbsUp, Share, Eclipse } from 'lucide-react';
import appwriteService from "../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function SideInfoBar({ className, likes, isLiked, slug }) {
    const [postLikes, setLikes] = useState(likes); // Manage like count locally
    const [liked, setLiked] = useState(isLiked); // Track the liked state
    const userData = useSelector((state) => state.auth.userData);
    const navigate = useNavigate();

    useEffect(() => {
        setLikes(likes);
        setLiked(isLiked);
    }, [likes, isLiked]);

    const toggleLike = () => {
        const newLikedStatus = !liked;
        setLiked(newLikedStatus);

        setLikes((prevLikes) => {
            const updatedLikes = newLikedStatus
                ? [...prevLikes, userData.$id] // Add user to likes
                : prevLikes.filter((id) => id !== userData.$id); // Remove user from likes

            // Call the Appwrite service with the updated likes
            appwriteService.updatePostLikes(slug, updatedLikes);
            return updatedLikes;
        });
    };

    return (
        <aside className={`h-full pt-10 flex flex-col gap-4 items-center ${className}`}>
            <button className="h-14 flex flex-col items-center gap-2" onClick={toggleLike}>
                <ThumbsUp className="" fill={liked ? 'black' : ''} />
                <p>{postLikes.length}</p>
            </button>

            <button className="h-14 flex flex-col items-center justify-center">
                <Share />
            </button>

            <button className="h-14 flex flex-col items-center justify-center">
                <Eclipse />
            </button>
        </aside>
    );
}

export default SideInfoBar;
