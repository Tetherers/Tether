"use client";

import { PageHeader } from "@/components/header";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/utils";
import type { Lobby } from "@/lib/utils";

export default function RoomPage({ params }: { params: { id: string } }) {
    const [isLoading, setIsLoading] = useState(true)
    const [lobby, setLobby] = useState<Lobby|null>(null);
    useEffect( () => {
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
                        }
                    } as Lobby);
                    console.log('Room data:', lobby);
                    setIsLoading(false);
                } catch (error) {
                    console.error('Failed to fetch room data:', error);
                }
        }           
    }
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
                if (!response.ok) {
                    throw new Error('Failed to join lobby');
                }
                const data = await response.json();
                console.log('Joined lobby:', data);
            } catch (error) {
                console.error('Failed to join lobby:', error);
            }
        }
    }
    return (
        <main className="min-h-screen bg-gray-900">
            <PageHeader />
            <p>{params.id}</p>
            <Button className="bg-brand-secondary text-white" onClick={() => handleJoinLobby()}> Join Lobby </Button>
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