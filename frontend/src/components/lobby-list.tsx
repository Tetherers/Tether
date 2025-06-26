"use client";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Car, Clock, Filter, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

import { supabase } from "@/lib/utils";
import type { Lobby } from "@/lib/utils";
import { formatNiceString } from "@/lib/utils";
import { CreateLobbyWindow } from "@/components/create-lobby-window";

const getStatus = (lobby: Lobby) => {
    const status = lobby.status;
    const currentPlayers = lobby.players.current;
    const maxPlayers = lobby.players.max;
    if (status === 0 && currentPlayers < maxPlayers) {
        return "open";
    } else {
        return "full";
    }
    
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "open":
            return "bg-green-500/20 text-green-500 hover:bg-green-500/30"
        case "full":
            return "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
        default:
            return "bg-gray-500/20 text-gray-500 hover:bg-gray-500/30"
    }
}

export function LobbyList() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [lobbies, setLobbies] = useState([] as Lobby[])
    const fetchLobbies = async () => {
        setIsLoading(true)
        const { data } = await supabase.auth.getSession();
        const access_token = data.session?.access_token;
        if (access_token) {
            try {
                // Example GET request to your backend
                const response = await fetch('http://localhost:3001/api/lobbies', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Backend request failed');
                }
                const data = await response.json();
                setLobbies((data as any[]).map(item => ({
                    id: item.id,
                    game: {
                        id: item.game.id,
                        name: item.game.name,
                    },
                    players: {
                        current: item.current_players,
                        max: item.max_players,
                    },
                    status: item.status,
                    created_at: item.created_at,
                    name: item.name,
                    region: {
                        id: item.region.id,
                        name: item.region.name,
                    }
                    } as Lobby
                ))
                    || []);
                setIsLoading(false);
                // Optionally handle response data here
            } catch (error) {
                toast("Error fetching lobbies: ", {
                    description: error instanceof Error ? error.message : "Unknown error",
                    duration: 5000,
                }
                )
            }
        }
    }  
    useEffect(() => {
        fetchLobbies()
    }, []);

    const visitLobby = (lobbyId: string) => {
        router.push(`/room/${lobbyId}`);
    }
    return (
        <div className="w-full">
            <Tabs defaultValue="all-lobbies" className="p-4" >
                <div className="flex flex-row justify-between items-center">
                    <TabsList className="bg-brand-secondary">
                        <TabsTrigger value="all-lobbies" className="text-l "> All Lobbies </TabsTrigger>
                        <TabsTrigger value="my-lobbies" className="text-l "> My Lobbies </TabsTrigger>
                    </TabsList>
                    <div className="flex gap-2">
                        <Button className="bg-brand-secondary text-white hover:bg-brand-secondary/80" onClick={() => fetchLobbies()}> Refresh Lobbies </Button>
                        <CreateLobbyWindow />
                    </div>
                </div>
                <TabsContent value="all-lobbies" className="pt-4">
                    { isLoading ? (
                        Array(3)
                        .fill(0)
                        .map((_, i) => (
                            <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-48" />
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-24" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-9 w-full" />
                            </CardFooter>
                            </Card>
                        )))
                        : (
                            lobbies.map((lobby) => (
                                <Card key={lobby.id} className="mb-4"> 
                                    <CardHeader >
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-xl font-bold">{lobby.name}</CardTitle>
                                            <Badge className={getStatusColor(getStatus(lobby))}>{formatNiceString(getStatus(lobby))}</Badge>
                                        </div>
                                    </CardHeader>
                                    <div className="px-7 flex flex-col gap-4">
                                        <CardDescription className="text-sm text-muted-foreground">{lobby.game.name} - {lobby.region.name}</CardDescription>
                                        <div className="flex items-center justify-between">
                                            <CardDescription className="text-sm ">
                                                <Users className="inline mr-1" />
                                                {lobby.players.current}/{lobby.players.max} players
                                            </CardDescription>
                                            <CardDescription className="text-sm">
                                                <Clock className="inline mr-1" />
                                                {formatDistanceToNow(new Date(lobby.created_at))} ago
                                            </CardDescription>
                                        </div>
                                        <Button className=" text-white hover:bg-brand-secondary/80 bg-brand-secondary" onClick={()=>visitLobby(lobby.id)}> View This Lobby </Button>
                                    </div>
                                </Card>
                            ))
                        )
                    }
                </TabsContent>
            </Tabs>
        </div>
    )
}