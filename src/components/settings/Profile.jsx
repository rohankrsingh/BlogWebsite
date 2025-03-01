import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { addToast, Card } from "@heroui/react";
import { Input } from "../ui";
import { Textarea } from "../ui";
import { Separator } from "../ui";
import AvatarSelector from "./AvatarSelector";
import service from "@/appwrite/config";
import authService from "@/appwrite/auth";
import { useSelector } from "react-redux";
import Loader from "../Loader";

const profileFormSchema = z.object({
    username: z.string().min(2, "Username must be at least 2 characters.").max(36, "Username must not be more than 36 characters."),
    name: z.string().min(2, "Name must be at least 2 characters."),
    email: z.string().email("Please enter a valid email address."),
    bio: z.string().max(100).optional(),
    website: z.string().url().optional(),
    location: z.string().optional(),
});

export default function Profile() {
    const [selectedAvatar, setSelectedAvatar] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const userId = useSelector((state) => state.auth.userData.$id);
    const userEmail = useSelector((state) => state.auth.userData.email);

    const form = useForm({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            username: "",
            avatar: "",
            name: "",
            email: userEmail || "",
            bio: "",
            website: "",
            location: "",
        },
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                const details = await service.getUserProfile(userId);
                if (details) {
                    setUserProfile({
                        avatar: details.avatar || "",
                        name: details.name || "",
                        username: details.username || userEmail || "",
                        bio: details.bio || "",
                        website: details.website || "",
                        location: details.location || "",
                    });
                    setSelectedAvatar(details.avatar);
                }
            } catch {
                setError("Failed to fetch user profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchUserProfile();
    }, [userId, userEmail]);

    useEffect(() => {
        if (userProfile) {
            form.reset(userProfile);
        }
    }, [userProfile, form]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const existingUsername = await service.getUsernames(data.username);
            if (existingUsername && existingUsername.length > 0 && existingUsername[0].$id !== userId) {
                setError("Username already exists.");
                addToast({
                    title: "Error",
                    description: "Username already exists.",
                    color: "danger"
                })
                return;
            }
            await authService.updateAccountName(data.name);
            data.userId = userId;
            data.avatar = selectedAvatar;
            data.bio = data.bio.trim() === "" ? null : data.bio;
            data.website = data.website.trim() === "" ? null : data.website;
            data.location = data.location.trim() === "" ? null : data.location;
            await service.updateUserProfile(data.userId, data.username, data.name, data.email, data.bio, data.location, data.avatar, data.website);
            addToast({
                title: "Profile updated successfully.",
                color: "success",
                
            })
        } catch (err) {
            setError("Failed to update profile.");
            console.log(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? <Loader /> : (
                <Card className="max-w-2xl mx-auto space-y-8 p-8">
                    {error && <p className="text-red-500">{error}</p>}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-semibold">Avatar</h2>
                                <div className="grid gap-4">
                                    <AvatarSelector selectedAvatar={selectedAvatar} onSelect={setSelectedAvatar} />
                                </div>
                                <Separator />
                                <h2 className="text-2xl font-semibold">User</h2>
                                <div className="grid gap-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Your name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Your username" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        disabled
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="email@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold">Basic</h2>
                                <div className="grid gap-4">
                                    <FormField
                                        control={form.control}
                                        name="bio"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bio</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="A short bio about yourself" className="resize-none" {...field} />
                                                </FormControl>
                                                <FormDescription>Brief description for your profile.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="website"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Website URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://example.com" {...field} className='lowercase' />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Location</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="City, Country" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full">
                                Save Profile Information
                            </Button>
                        </form>
                    </Form>
                </Card>
            )}
        </>
    );
}
