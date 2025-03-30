import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import { Logo } from "./index"
import { useDispatch } from "react-redux"
import authService from "../appwrite/auth"
import { useForm } from "react-hook-form"
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

const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .max(64, "Password must not exceed 64 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&#]/, "Password must contain at least one special character (@$!%*?&#)"),

})

function LoginComponent() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [error, setError] = useState("")
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });


    const login = async (data) => {
        setError("")
        try {
            const session = await authService.login(data)
            if (session) {
                const userData = await authService.getCurrentUser()
                if (userData) dispatch(authLogin(userData));
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div
            className='flex items-center justify-center'
        >
            <Card className="shadow-2xl bg-opacity-50">
                <CardHeader>
                    <CardTitle className="font-normal text-4xl">Login</CardTitle>
                    {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                </CardHeader>
                <CardContent className="space-y-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(login)} className="space-y-6">
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
                            <Button type="submit" className="w-full rounded-3xl h-10" >Log in</Button>
                        </form>
                    </Form>
                    <Separator className="flex items-center justify-center"> <h4 className='font-light backdrop-blur-3xl'>Or</h4> </Separator>
                    <div className="flex items-center justify-center">
                        <Button className='w-1/2 h-10 rounded-3xl' onClick={async () => {
                            try {
                                await authService.loginGoogle();
                                console.log("Logged in successfully!");
                            } catch (error) {
                                console.error("Error logging in:", error);
                            }
                        }}> Google</Button>
                    </div>
                    <CardFooter>
                        <p className="mt-2 text-center font-light ">
                            Don't have an account? Create One. &nbsp;
                            <Link
                                to="/signup"
                                className="font-normal text-primary transition-all duration-200 hover:underline"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </CardFooter>

                </CardContent>

            </Card>


        </div>
    )
}

export default LoginComponent