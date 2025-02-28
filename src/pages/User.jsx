import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Hash } from "lucide-react";
import { Image } from "@heroui/react";
import { useParams } from "react-router-dom";

export default function User({userId}) {
    const username = useParams();

  return (
    <div className="min-h-screen flex flex-col items-center pt-16">
      <div className="w-full h-32 bg-accent"></div>
      <Card className="relative -top-16 w-[600px]  rounded-xl shadow-lg p-6">
        <div className="flex flex-col items-center">
          {typeof window !== "undefined" && (
            <Image
              src="/profile-avatar.png" // Ensure this path is correct
              width={80}
              height={80}
              alt="Profile Avatar"
              className="rounded-full border-4 border-black -mt-12"
            />
          )}
          <h2 className="text-2xl font-semibold mt-2">Name</h2>
          <p className="text-gray-400">Bio</p>
          <div className="flex items-center gap-4 mt-2 text-gray-400">
            <div className="flex items-center gap-1">
              <MapPin size={16} /> <span>Location</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} /> <span>Joined on Jan 16, 2025</span>
            </div>
          </div>
          <a href="https://github.com/rohankrsinghH" target="_blank" rel="noopener noreferrer" className=" mt-2">
            Website
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
