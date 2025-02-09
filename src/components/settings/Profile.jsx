import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
    Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Card, Image } from "@heroui/react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import avatarList from "./avatarList"
import AvatarSelector from "./AvatarSelector"
// import { Facebook, Twitter, Github } from "lucide-react"

const profileFormSchema = z.object({
    avatar: z.string().url().optional(),
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    bio: z.string().max(160).optional(),
    website: z.string().url().optional(),
    location: z.string().optional(),
})

export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [selectedAvatar, setSelectedAvatar] = useState("");
    const [error, setError] = useState("")
    const form = useForm({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            avatar: "",
            name: "",
            email: "",
            bio: "",
            website: "",
            location: "",
        },
    })

    useEffect(() => {
        console.log(selectedAvatar);

    }, [selectedAvatar])
    function onSubmit(data) {
        console.log(data)
    }

    return (
        <Card className="max-w-2xl mx-auto space-y-8 p-8">


            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Avatar</h2>
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
                                            <Input placeholder="https://example.com" {...field} />
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
    )
}

