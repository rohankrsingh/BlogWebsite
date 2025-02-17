import React, { useState, useEffect } from "react";
import { Card } from "@heroui/react";
import { CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Globe, MapPin, Calendar } from "lucide-react";
import service from "@/appwrite/config";

const AvatarCard = ({ userId, variant = "default" }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await service.getUserProfile(userId);
        if (response) {
          setUser(response);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <Card
      className={`p-4 transition-all duration-300 text-primary 
        max-md:p-2
        ${variant === "minimal"
          ? ""
          : variant === "detailed"
            ? ""
            : ""
        }`}
    >
      <CardContent className="p-0">
        <div className="flex flex-col items-center">
          <div className="w-full flex items-center gap-1">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{user.name}</h2>
          </div>

          <div className="w-full flex-1 px-2">



            {variant !== "minimal" && (
              <p className="text-sm text-default-600 mt-2">{user.bio}</p>
            )}
            {variant === "detailed" && (
              <div className="mt-4 text-sm text-default-600 space-y-2">
                <p className="flex items-center gap-2 uppercase text-default-500 text-xs">Location</p>
                <p className="flex items-center gap-2"><MapPin size={14} /> {user.location}</p>
                <p className="flex items-center gap-2 uppercase text-default-500 text-xs">Joined</p>
                <p className="flex items-center gap-2"><Calendar size={14} /> {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvatarCard;
