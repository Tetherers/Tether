"use client";

import type React from 'react';


import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner";

import { supabase } from "@/lib/utils";

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
        router.push('/lobby');
        setIsLoading(false);
    }

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    }


    return (
        <Card className="w-full bg-brand-primary border-brand-tertiary">
            <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
                <img src="/TetherLogo.png" alt="Tether Logo" className="w-12 h-12" />
                <CardTitle className="text-4xl text-brand-secondary">Tether</CardTitle>
            </div>
            <CardDescription>Connect with gamers and find your perfect squad</CardDescription>
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
                    <Button
                        type="submit"
                        className="w-full bg-brand-secondary transition-all duration-300 text-white"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>
                    </form>
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