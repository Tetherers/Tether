"use client";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Clock, Filter, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function LobbyList() {
    return (
        <div className="w-full">
            <Tabs defaultValue="all-lobbies" className="" >
                <TabsList className="bg-brand-tertiary">
                    <TabsTrigger value="all-lobbies" > All Lobbies </TabsTrigger>
                    <TabsTrigger value="my-lobbies"> My Lobbies </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    )
}