"use client";

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';

export function PageHeader() {
    const router = useRouter();

    const handleLogout = () => {
        router.push('/');
    }

    return (
        <header className='flex items-center w-full bg-brand-primary text-brand-secondary justify-between h-16 '>
            <div className='flex items-center gap-2'>
                <img src="/TetherLogo.png" alt="Tether Logo" className="w-12 h-12" />
                <Link href="/lobby" className='text-2xl font-bold'>Tether
                </Link>
            </div>
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-10 w-10 rounded-full pr-10">
                            <Avatar className="h-10 w-10">
                            <AvatarImage src="/placeholder-user.jpg" alt="@username" />
                            <AvatarFallback>GG</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">GamerGuru</p>
                        <p className="text-xs leading-none text-muted-foreground">gamer@example.com</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        {/* <User className="mr-2 h-4 w-4" /> */}
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        {/* <Settings className="mr-2 h-4 w-4" /> */}
                        <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                        {/* <LogOut className="mr-2 h-4 w-4" /> */}
                        <span>Log out</span>
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}