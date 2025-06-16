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
    website: z.string().url().optional().or(z.literal('')),
    location: z.string().optional(),
});

export default function Profile() {
    const [selectedAvatar, setSelectedAvatar] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const logedinUser = useSelector((state) => state.auth.userData);

    // Prevent error if user is not loaded
    if (!logedinUser) {
        return <Loader />;
    }

    const form = useForm({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            username: "",
            avatar: "",
            name: "",
            email: logedinUser.email || "",
            bio: "",
            website: "",
            location: "",
        },
    });

    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            const details = await service.getUserProfile(logedinUser.$id);
            if (details) {
                setUserProfile({
                    avatar: details.avatar || "",
                    name: details.name || "",
                    username: details.username || logedinUser.email || "",
                    bio: details.bio || "",
                    website: details.website || "",
                    location: details.location || "",
                });
                setSelectedAvatar(details.avatar);
            }
        } catch (error) {
            const errorMessage = error.message.includes("Document with the requested ID could not be found")
                ? "User profile not found. Please create one."
                : "Failed to fetch user profile.";
            setError(errorMessage);
            setUserProfile({
                avatar: "",
                name: "",
                username: "",
                bio: "",
                website: "",
                location: "",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [logedinUser.$id, logedinUser.email]);

    useEffect(() => {
        if (userProfile) {
            form.reset({
                avatar: userProfile.avatar || "",
                name: userProfile.name || "",
                username: userProfile.username || "",
                email: userProfile.email || logedinUser.email || "",
                bio: userProfile.bio || "",
                website: userProfile.website || "",
                location: userProfile.location || "",
            });
        }
    }, [userProfile, form]);

    const onSubmit = async (data) => {
        setLoading(true);
        setError("");
        try {
            const existingUsername = await service.getUsernames(data.username);
            if (existingUsername && existingUsername.length > 0 && existingUsername[0].$id !== logedinUser.$id) {
                throw new Error("Username already exists.");
            }
            await authService.updateAccountName(data.name);
            const updatedData = {
                ...data,
                userId: logedinUser.$id,
                avatar: selectedAvatar,
                bio: data.bio.trim() || null,
                website: data.website.trim() || null,
                location: data.location.trim() || null,
            };
            await service.updateUserProfile(
                updatedData.userId,
                updatedData.username,
                updatedData.name,
                updatedData.email,
                updatedData.bio,
                updatedData.location,
                updatedData.avatar,
                updatedData.website
            );
            addToast({
                type: "Profile",
                description: "Profile updated successfully.",
                color: "success",
            });
        } catch (err) {
            setError(err.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const createUserProfile = async () => {
        setLoading(true);
        try {
            const userData = await service.createUserProfile(
                logedinUser.$id,
                logedinUser.name,
                logedinUser.$createdAt,
                logedinUser.email
            );
            if (userData) {
                setUserProfile(userData);
                addToast({
                    title: "Profile created successfully.",
                    color: "success",
                });
            }
        } catch (error) {
            setError("Failed to create profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <Card className="max-w-2xl mx-auto space-y-8 p-8">
                    {error && <p className="text-red-500">{error}</p>}
                    {!userProfile ? (
                        <div className="text-center">
                            <p className="text-gray-600">No profile found. Please create one.</p>
                            <Button onClick={createUserProfile} className="mt-4">
                                Create Profile
                            </Button>
                        </div>
                    ) : (
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
                                        {/* Name Field */}
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
                                        {/* Username Field */}
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
                                        {/* Email Field */}
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
                                        {/* Bio Field */}
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
                                        {/* Website Field */}
                                        <FormField
                                            control={form.control}
                                            name="website"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Website URL</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="https://example.com" {...field} className="lowercase" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {/* Location Field */}
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
                    )}
                </Card>
            )}
        </>
    );
}
