"use client";

import { PageHeader } from "@/components/header";
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
                    console.log('Room data:', data);
                } catch (error) {
                    console.error('Failed to fetch room data:', error);
                }
        }           
    }
    fetchRoomData();
});
    return (
        <main className="min-h-screen">
            <PageHeader />
            <p>{params.id}</p>
        </main>
    )
}