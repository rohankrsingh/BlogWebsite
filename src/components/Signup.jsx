import { useState } from 'react'
import authService from '../appwrite/auth'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/authSlice'
import { Logo } from './index.js'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
    CardTitle,
} from './ui/card'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Separator } from './ui/separator'
import service from '@/appwrite/config'

const formSchema = z.object({
    username: z.string()
    .min(2, "Username must be atleast 2 characters.")
    .max(36, "Username must not be more than 36 characters"),
    name: z.string().min(1, "Fullname is required").max(50),
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .max(64, "Password must not exceed 64 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&#]/, "Password must contain at least one special character (@$!%*?&#)"),

})
function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            name: "",
            email: "",
            password: "",
        },
    });

    const create = async (data) => {
        setError("");
        try {
            const usernames = await service.getUsernames(data.username);
            if (usernames.length === 0) { 
                const userData = await authService.createAccount(data);
                if (userData) {
                    const currentUser = await authService.getCurrentUser();
                    if (currentUser) {
                        dispatch(login(currentUser));
                        navigate("/");
                    }
                }
            } else {
                setError("Username already exists");
            }
        } catch (error) {
            setError(error.message);
        }
    };
    

    return (
        <div className="mx-auto flex items-center justify-center">
            <Card className="w-96 !shadow-none !border-none max-md:bg-opacity-85 max-sm:w-auto">
                <CardHeader>
                    <CardTitle className="font-normal text-4xl">Sign Up</CardTitle>
                    {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                </CardHeader>
                <CardContent className="space-y-8 ">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(create)} className="space-y-6">
                        <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your Full Username" {...field} />
                                        </FormControl>

                                        <FormMessage {...form.error} />
                                    </FormItem>


                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your Full Name" {...field} />
                                        </FormControl>

                                        <FormMessage {...form.error} />
                                    </FormItem>


                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your email" {...field} />
                                        </FormControl>

                                        <FormMessage {...form.error} />
                                    </FormItem>


                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter your password" {...field} />
                                        </FormControl>

                                        <FormMessage {...form.error} />
                                    </FormItem>


                                )}
                            />
                            <Button type="submit" className="w-full rounded-3xl h-12" >Sign up</Button>
                        </form>
                    </Form>
                    <Separator className="flex items-center justify-center"> <h4 className='font-light backdrop-blur-3xl'>Or</h4> </Separator>
                    <div className="flex items-center justify-center">
                        <Button className='w-1/2 h-10 rounded-3xl' onClick={async () => {
                            try {
                                const session = await authService.loginGoogle();
                                if (session) {
                                    const userData = await authService.getCurrentUser();
                                    if (userData) {
                                        const existingProfile = await service.getUserProfile(userData.$id);
                                        if (!existingProfile) {
                                            await service.createUserProfile(userData.$id, userData.name, userData.$createdAt, userData.email);
                                        }
                                        dispatch(login(userData));
                                        navigate("/");
                                    }
                                }
                            } catch (error) {
                                console.error("Error logging in:", error);
                            }
                        }}> Google</Button>
                    </div>
                    <CardFooter>
                        <p className="mt-2 text-center font-light ">
                            Already have an account?&nbsp;
                            <Link
                                to="/login"
                                className="font-normal text-primary transition-all duration-200 hover:underline"
                            >
                                Sign In
                            </Link>
                        </p>
                    </CardFooter>

                </CardContent>

            </Card>

        </div>
    )
}

export default Signup