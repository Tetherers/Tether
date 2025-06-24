"use client";

import { PageHeader } from "@/components/header";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/utils";
import type { Lobby } from "@/lib/utils";
import type { User } from "@/lib/utils";

export default function RoomPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true)
    const [lobby, setLobby] = useState<Lobby|null>(null);
    const [isUserInLobby, setIsUserInLobby] = useState(false);
    const [isUserOwner, setIsUserOwner] = useState(false);
    const fetchRoomData = async () => {
            setIsLoading(true);
            const { data } = await supabase.auth.getSession();
            const access_token = data.session?.access_token;
            if (access_token) {
                try {
                    const response = await fetch(`http://localhost:3001/api/lobby/${params.id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${access_token}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch room data');
                    }
                    const data = await response.json();
                    console.log('Fetched room data:', data);
                    setLobby({
                        id: data.id,
                        game: {
                            id: data.game.id,
                            name: data.game.name,
                        },
                        players: {
                            current : data.current_players,
                            max : data.max_players,
                            list : data.lobby_users,
                        },
                        status: data.status,
                        created_at: data.created_at,
                        name: data.name,
                        region: {
                            id: data.region.id,
                            name: data.region.name,
                        },
                        ownerID: data.owner,
                    } as Lobby);
                    console.log('Room data:', lobby);
                    setIsLoading(false);
                } catch (error) {
                    console.error('Failed to fetch room data:', error);
                }
        }           
    }
    useEffect(() => {
        if (lobby) {
            async function checkIfUserIsInLobby(lobby: Lobby): Promise<boolean> {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    return false; // User is not authenticated
                }
                return lobby.players.list.some(player => player.id === user.id);
            }
            async function checkIfUserIsOwner(lobby: Lobby): Promise<boolean> {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    return false; // User is not authenticated
                }
                return lobby.ownerID === user.id;
            }
            checkIfUserIsInLobby(lobby).then(setIsUserInLobby);
            checkIfUserIsOwner(lobby).then(setIsUserOwner);
        }
    }, [lobby]);
    useEffect( () => {
    fetchRoomData();
    }, [params.id]);

    async function handleJoinLobby() {
        const { data } = await supabase.auth.getSession();
        const access_token = data.session?.access_token;
        if (access_token) {
            try {
                const response = await fetch(`http://localhost:3001/api/lobby/${params.id}/join`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.details);
                }
                console.log('Joined lobby:', data);
                await fetchRoomData(); // Refresh room data after joining
            } catch (error) {
                toast('Failed to join lobby', {
                    description:  error instanceof Error ? error.message : 'An unexpected error occurred',
                    duration: 5000,
                }
                )
            }
        }
    }

    async function handleDeleteLobby() {
        const { data } = await supabase.auth.getSession();
        const access_token = data.session?.access_token;
        if (access_token) {
            try {
                const response = await fetch(`http://localhost:3001/api/lobby/${params.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.details || 'Failed to delete lobby');
                }
                console.log('Lobby deleted successfully');
                router.push('/lobby'); // Redirect to lobby list after deletion
            } catch (error) {
                toast('Failed to delete lobby', {
                    description:  error instanceof Error ? error.message : 'An unexpected error occurred',
                    duration: 5000,
                }
                )
            }
        }
    }
    return (
        <main className="min-h-screen bg-gray-900">
            <PageHeader />
            <p>{params.id}</p>
            {isUserInLobby !== null && (
            isUserInLobby
                ? <p>You are in this lobby.</p>
                : <Button className="bg-brand-secondary text-white" onClick={() => handleJoinLobby()}> Join Lobby </Button>
            )}
            {isUserOwner !== null && (
            isUserOwner
                ? <Button className="bg-brand-secondary text-white" onClick={() => handleDeleteLobby()}> Delete Lobby </Button>
                : null
            )}
            
            {isLoading ? (
            <p>Loading...</p>
        ) : lobby ? (
            <div>
                <p>Lobby Name: {lobby.name}</p>
                <p>Game Name: {lobby.game.name}</p>
                {(
                    lobby.players.list.map(player => (
                        <p>{player.username}</p>
                    ))
                )}
                {/* Render other lobby details here */}
            </div>
        ) : (
            <p>Lobby not found.</p>
        )}
            
        </main>
    )
}