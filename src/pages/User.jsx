import { Button } from "@/components/ui/button";
import { addToast, Card } from "@heroui/react";
import { MapPin, Calendar, Hash, ThumbsUp } from "lucide-react";
import { Avatar, ScrollShadow } from "@heroui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import service from "@/appwrite/config";
import { useSelector } from "react-redux";
import Loader from "@/components/Loader";
import BlogCards from "@/components/BlogCards";
import { Query } from "appwrite";
import { Separator } from "@/components/ui";

function UserProfile({ name, avatar, bio, location, createdAt, website, isAuthor }) {
  const navigate = useNavigate();
  const renderInfo = (icon, value, fallback) => value ? (
    <div className="flex items-center gap-1">
      {icon} <span>{value}</span>
    </div>
  ) : (
    null
  );

  const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : null;

  return (
    <Card className="w-full mt-16 rounded-xl shadow-lg p-6 overflow-visible">
      <div className="min-w-[800px] flex flex-col items-center max-md:min-w-full">
        {avatar && typeof window !== "undefined" && (
          <Avatar
            showFallback
            name={name}
            src={avatar}
            alt={name}
            className="relative size-32 -top-20 -mb-14 ring-8 ring-accent"
          />
        )}

        <h2 className="text-2xl font-semibold mt-4">{name}</h2>

        {bio && <p className="max-w-96 text-default-600 mt-2">{bio}</p>}

        <div className="flex items-center gap-4 mt-2 text-default-600">
          {renderInfo(<MapPin size={16} />, location)}
          {renderInfo(<Calendar size={16} />, formattedDate)}
        </div>

        {website && website !== "#" && (
          <a href={website} target="_blank" rel="noopener noreferrer" className="mt-2 text-accent hover:underline">
            {website}
          </a>
        )}

        {isAuthor && (
          <Button className="mt-4" onClick={() => navigate('../settings/profile')}>
            Edit Profile
          </Button>
        )}
      </div>
    </Card>
  );
}

function UserStats({ liked }) {
  return (
    <Card className="w-full flex flex-row items-center justify-between p-6">
      <p className="flex items-center gap-2 text-default-600">
        <ThumbsUp /> {liked?.length} posts liked
      </p>
      <p className="flex items-center gap-2 text-default-600">
        <span>💬</span> 0 comments written
      </p>
      <p className="flex items-center gap-2 text-default-600">
        <Hash size={16} /> 7 tags followed
      </p>
    </Card>
  );
}

function LikedPosts({ liked }) {
  return (
    <div>
      <h3 className="text-xl font-semibold my-4">Posts Liked</h3>
      <ScrollShadow orientation="horizontal" className="max-h-[50vh] w-full columns-2  max-md:columns-1 max-sm:columns-xs">
        {liked && liked.length > 0 ? (
          liked.map((post) => (
            <div className="col-span-1">
              <BlogCards variant="list" postData={post} />
            </div>
          ))
        ) : (
          <p>No posts liked yet.</p>
        )}
      </ScrollShadow>
    </div>
  );
}

function UserPosts({ posts }) {
  return (
    <div>
      <h3 className="text-xl font-semibold my-4">Posts written</h3>
      <ScrollShadow orientation="horizontal" className="max-h-[50vh] w-full columns-2  max-md:columns-1 max-sm:columns-xs">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div className="col-span-1">
              <BlogCards variant="list" postData={post} />
            </div>
          ))
        ) : (
          <p>You haven't written any posts yet.</p>
        )}
      </ScrollShadow>
    </div>
  );
}

export default function User() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [likedPosts, setLikedPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState(null);
  const currentUserId = useSelector((state) => state.auth.userData?.$id);
  const isAuthor = user && currentUserId ? user.userId === currentUserId : false;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (username) {
        try {
          const profile = await service.getUsernames(username, "", 1);
          setUser(profile[0]);

        } catch (error) {
          console.error("Error fetching user profile:", error);
          setError("Error fetching user profile");
        }
      }
    };
    fetchUserProfile();
  }, [username]);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      if (user && user.liked?.length > 0) {
        try {
          const posts = await service.getLikedPost(user.liked);
          setLikedPosts(posts.documents);
          console.log(posts);

        } catch (error) {
          console.error("Error fetching liked posts:", error);
          setError("Error fetching liked posts");
        }
      }
    };

    const fetchUserPosts = async () => {
      if (user) {
        try {
          const query = [
            Query.equal("userId", user.userId),
            Query.orderDesc("$createdAt"),
          ];
          const posts = await service.getPosts(query);
          setUserPosts(posts.documents);
          console.log(posts.documents);
          
        } catch (error) {
          console.error("Error fetching user posts:", error);
          setError("Error fetching user posts");
        }
      }
      };
      
      if (user) {
        fetchUserPosts();
        fetchLikedPosts();
      }

      if (error) {
        addToast({
          title: "Error",
          message: error,
          type: "error",
        });
      }
    }, [user]);

  if (!user) {

    return <Loader />;
  }

  const { name, avatar, bio, location, createdAt, website, liked } = user;
  console.log(user);
  return (
    <div className="min-h-screen relative flex flex-col items-center">
      <div className="w-full h-32 bg-accent absolute z-0"></div>
      <div className="min-h-screen max-w-[1200px] flex flex-col gap-4 p-4 mx-auto z-10 max-sm:p-2">
        <UserProfile
          name={name}
          avatar={avatar}
          bio={bio}
          location={location}
          createdAt={createdAt}
          website={website}
          isAuthor={isAuthor}
        />
        <UserStats liked={liked} />
        <LikedPosts liked={likedPosts} />
        <Separator />
        <UserPosts posts={userPosts} />
      </div>
    </div>
  );
}
