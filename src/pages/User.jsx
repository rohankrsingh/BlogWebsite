import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Hash } from "lucide-react";
import { Avatar, Image } from "@heroui/react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import service from "@/appwrite/config";

export default function User() {
  const { username } = useParams();
  console.log(username);

  const [user, setUser] = useState([]);
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (username) {
        try {
          const profile = await service.getUsernames(username, "", 1);
          setUser(profile[0]);
          console.log(profile[0]);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser('');
        }
      }
    };
    fetchUserProfile();
  }, [username]);
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full h-32 bg-accent"></div>
      <Card className="relative -top-16 w-[600px]  rounded-xl shadow-lg p-6 overflow-visible">
        <div className="relative flex flex-col items-center">
          {typeof window !== "undefined" && (
            <Avatar showFallback name={user.name} src={user.avatar} className="relative size-32 -top-20 -mb-14" />
          )}
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-gray-400">{user.bio}</p>
          <div className="flex items-center gap-4 mt-2 text-gray-400">
            <div className="flex items-center gap-1">
              <MapPin size={16} /> <span>{user.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} /> <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Date not available'}</span>
            </div>
          </div>
          <a href="https://github.com/rohankrsinghH" target="_blank" rel="noopener noreferrer" className=" mt-2">
            {user.website}
          </a>
          <Button className="mt-4 ">Edit Profile</Button>
        </div>
      </Card>
      <Card className="w-[400px] p-4 mt-4">
        <CardContent className="flex flex-col gap-2">
          <p className="flex items-center gap-2 text-gray-400">
            <span>📄</span> 0 posts published
          </p>
          <p className="flex items-center gap-2 text-gray-400">
            <span>💬</span> 0 comments written
          </p>
          <p className="flex items-center gap-2 text-gray-400">
            <Hash size={16} /> 7 tags followed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
