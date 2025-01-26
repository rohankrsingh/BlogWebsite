import React, { useEffect, useState } from 'react'
import { ThumbsUp, Share, Eclipse } from 'lucide-react';
import { Button } from './ui';
import appwriteService from "../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function SideInfoBar({
    className,
    likesCount = 0,
    isLiked,
    slug,

}) {

    const [likeCount, setLikeCount] = useState(likesCount); // Manage like count locally
    const [liked, setLiked] = useState(isLiked); // Track the liked state
    const userData = useSelector((state) => state.auth.userData);
    const navigate = useNavigate();

    // useEffect(() => {

    // }, [likesCount, isLiked])

    const toggleLike = () => {

        const newLikedStatus = !liked;
        const newLikeCount = newLikedStatus ? likeCount + 1 : likeCount - 1;

        if (newLikedStatus) {
            appwriteService.addLikedPost(slug, userData.$id);
            appwriteService.addPostLikes(slug, userData.$id);
        } else {
            appwriteService.removeLikedPost(slug, userData.$id);
            appwriteService.removePostLikes(slug, userData.$id);
        }

        setLiked(newLikedStatus); // Update local liked state
        setLikeCount(newLikeCount);

    }

    return (
        <aside className={`h-full pt-10 flex flex-col gap-4 items-center ${className}`}>
            <button className={`h-14 flex flex-col items-center gap-2`} onClick={toggleLike}>
                <ThumbsUp className='' fill={isLiked ? 'black' : 'gray'}/>
                <p>{likesCount}</p>
            </button>

            <button className='h-14 flex flex-col items-center justify-center'>
                <Share />
            </button>

            <button className='h-14 flex flex-col items-center justify-center'>
                <Eclipse />
            </button>



        </aside>
    )
}

export default SideInfoBar