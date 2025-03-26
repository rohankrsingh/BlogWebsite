import { Button } from "@/components/ui/button";
import { Card } from "@heroui/react";
import { MapPin, Calendar, Hash, ThumbsUp } from "lucide-react";
import { Avatar, ScrollShadow  } from "@heroui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import service from "@/appwrite/config";
import { useSelector } from "react-redux";
import Loader from "@/components/Loader";

export default function User() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const currentUserId = useSelector((state) => state.auth.userData?.$id);
  const isAuthor = user && currentUserId ? user.userId === currentUserId : false;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (username) {
        try {
          const profile = await service.getUsernames(username, "", 1);
          setUser(profile[0]);
          console.log(profile);
          
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser(null);
        }
      }
    };
    fetchUserProfile();
  }, [username]);

  if (!user) {
    return <Loader />
  }

  const { name, avatar, bio, location, createdAt, website, liked } = user;

  return (
    <div className="min-h-screen relative flex flex-col items-center ">
      <div className="w-full h-32 bg-accent absolute z-0"></div>
      <div className="min-h-screen max-w-[1200px] flex flex-col gap-4 p-4 mx-auto z-10 max-sm:p-2">
        <Card className="w-full mt-16 rounded-xl shadow-lg p-6 overflow-visible ">
          <div className="min-w-[800px] flex flex-col items-center max-md:min-w-full">
            {typeof window !== "undefined" && (
              <Avatar showFallback name={name} src={avatar} className="relative size-32 -top-20 -mb-14 ring-8 ring-accent" />
            )}
            <h2 className="text-2xl font-semibold">{name}</h2>
            <p className="max-w-96 text-default-600">{bio}</p>
            <div className="flex items-center gap-4 mt-2 text-default-600">
              <div className="flex items-center gap-1">
                <MapPin size={16} /> <span>{location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} /> <span>{createdAt ? new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Date not available'}</span>
              </div>
            </div>
            <a href={website} target="_blank" rel="noopener noreferrer" className="mt-2">
              {website}
            </a>
            {isAuthor && (
              <Button className="mt-4" onClick={() => navigate('../settings/profile')}>Edit Profile</Button>
            )}
          </div>
        </Card>
        <Card className="w-full flex flex-row items-center justify-between p-6">
          <p className="flex items-center gap-2 text-default-600">
            <ThumbsUp/> {liked?.length} posts liked
          </p>
          <p className="flex items-center gap-2 text-default-600">
            <span>💬</span> 0 comments written
          </p>
          <p className="flex items-center gap-2 text-default-600">
            <Hash size={16} /> 7 tags followed
          </p>
        </Card>
        <div className="">
          <ScrollShadow className="max-h-[100vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mt-4">Posts Liked</h3>
            {liked && liked.length > 0 ? (
              liked.map((post) => (
                <div key={post.id} className="p-4 border-b">
                  <h4 className="font-bold">{post.title}</h4>
                  <p>{post.content}</p>
                </div>
              ))
            ) : (
              <p>No posts liked yet.</p>
            )}
          </ScrollShadow>
        </div>
      </div>
    </div>
  );
}
