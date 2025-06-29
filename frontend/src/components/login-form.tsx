"use client";

import type React from 'react';


import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner";

import { supabase } from "@/lib/utils";
import { set } from 'date-fns';

export function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    // Login form state
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    // Register form state
    const [registerData, setRegisterData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errorMessage, setErrorMessage] = useState("");

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({
        ...loginData,
        [e.target.name]: e.target.value,
        })
    }

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterData({
        ...registerData,
        [e.target.name]: e.target.value,
        })
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const auth_response = await supabase.auth.signInWithPassword({
            email: loginData.email,
            password: loginData.password,
        });
        if (auth_response.error) {
            setErrorMessage(auth_response.error.message);
            loginData.password = "";
            setIsLoading(false);
        } else {
            toast("Welcome Back to Tether", {
                description:"Get Ready to Squad up and Load up",
                duration: 5000
            })
            router.push('/lobby');
            setIsLoading(false);
        }       
    }

    const handleDiscordLogin = async () => {
        setIsLoading(true);
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'discord',
            options: {
                redirectTo: `http://localhost:3000/lobby`,
            }
        })
    }

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const {data, error} = await supabase.auth.signUp({
            email: registerData.email,
            password: registerData.password,
            options: {
                data: {
                    username: registerData.username,
                }
            }
        })
        if (error) {
            setErrorMessage(error.message);
            registerData.password = "";
            registerData.confirmPassword = "";
            setIsLoading(false);
        } else {
            toast("Account has been created", {
                description:"Please check your email for confirmation and log in.",
                duration: 5000
            })
            router.push('/');
            setIsLoading(false);
        }       
    }


    return (
        <Card className="w-full bg-brand-primary border-brand-tertiary">
            <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
                <img src="/TetherLogo.png" alt="Tether Logo" className="w-12 h-12" />
                <CardTitle className="text-4xl text-brand-secondary">Tether</CardTitle>
            </div>
            <CardDescription>Squad up and Load up</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="login">
                <TabsList className="grid w-full grid-cols-2 bg-brand-secondary">
                    <TabsTrigger value="login" className="data-[state=active]:bg-brand-secondary">
                    Login
                    </TabsTrigger>
                    <TabsTrigger value="register" className="data-[state=active]:bg-brand-secondary">
                    Register
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-200">
                        Email
                        </Label>
                        <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        required
                        value={loginData.email}
                        onChange={handleLoginChange}
                        className="bg-brand-secondary border-brand-tertiary text-white placeholder:text-gray-400 focus:border-brand-tertiary"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-gray-200">
                            Password
                        </Label>
                        <Button variant="link" size="sm" className="px-0 font-normal h-auto text-tether-accent">
                            Forgot password?
                        </Button>
                        </div>
                        <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className="bg-brand-secondary border-brand-tertiary text-white placeholder:text-gray-400 focus:border-brand-tertiary"
                        />
                    </div>
                    <div className='flex justify-center'><p className="text-red-500 text-sm">{errorMessage}</p></div>
                    <Button
                        type="submit"
                        className="w-full bg-brand-secondary transition-all duration-300 text-white"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>
                    </form>
                    <Separator className='my-4' />
                    <Button
                        onClick={handleDiscordLogin}
                        className="w-full bg-brand-secondary transition-all duration-300 text-white"
                        disabled={isLoading}
                    >
                        <svg role="img" className="fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Discord</title><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
                        {isLoading ? "Logging in with Discord..." : "Login with Discord"}
                    </Button>
                </TabsContent>
                <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-gray-200">
                        Username
                        </Label>
                        <Input
                        id="username"
                        name="username"
                        placeholder="your_username"
                        required
                        value={registerData.username}
                        onChange={handleRegisterChange}
                        className="bg-brand-secondary border-brand-tertiary text-white placeholder:text-gray-400 focus:border-brand-tertiary"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="register-email" className="text-gray-200">
                        Email
                        </Label>
                        <Input
                        id="register-email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        required
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        className="bg-brand-secondary border-brand-tertiary text-white placeholder:text-gray-400 focus:border-brand-tertiary"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="register-password" className="text-gray-200">
                        Password
                        </Label>
                        <Input
                        id="register-password"
                        name="password"
                        type="password"
                        required
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        className="bg-brand-secondary border-brand-tertiary text-white placeholder:text-gray-400 focus:border-brand-tertiary"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-gray-200">
                        Confirm Password
                        </Label>
                        <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type="password"
                        required
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        className="bg-brand-secondary border-brand-tertiary text-white placeholder:text-gray-400 focus:border-brand-tertiary"
                        />
                    </div>
                    <div className='flex justify-center'><p className="text-red-500 text-sm">{errorMessage}</p></div>
                    <Button
                        type="submit"
                        className="w-full bg-brand-secondary transition-all duration-300 text-white hover:bg-brand-tertiary"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating account..." : "Create account"}
                    </Button>
                    </form>
                </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}