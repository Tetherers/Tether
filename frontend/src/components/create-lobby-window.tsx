"use client";
import { useRouter } from "next/navigation";

import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger,DialogFooter} from "@/components/ui/dialog"
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/utils";
import type { Game, Region } from "@/lib/utils";

export function CreateLobbyWindow() {
    const router = useRouter();
    const [games, setGames] = useState([] as Game[])
    const [regions, setRegions] = useState([] as Region[])
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        game: "",
        region: "",
        maxPlayers: "2",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        })
    }

    const handleGameChange = (value: string) => {
        setFormData({
        ...formData,
        game: value,
        })
    }

    const handleRegionChange = (value: string) => {
        setFormData({
        ...formData,
        region: value,
        })
    }

    const handleMaxPlayersChange = (value: string) => {
        setFormData({
        ...formData,
        maxPlayers: value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const { data } = await supabase.auth.getSession();
        const access_token = data.session?.access_token;
        if (access_token) {
            try {
                const response = await fetch('http://localhost:3001/api/lobbies', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        game: Number(formData.game),
                        region: Number(formData.region),
                        maxPlayers: Number(formData.maxPlayers),
                        status: 0,
                    }),
                });
                if (!response.ok) {
                    throw new Error('Backend request failed');
                }
            } catch (error) {
                toast.error('Failed to contact backend');
                return;
            }
        } else {
            toast.error('No session found. Please log in.');
            return;
        }
            toast("Lobby created",{
                description: "Your lobby has been created successfully.",
            })
            router.push(`/lobby`)
            setIsLoading(false)
        }

    useEffect(() => {
        const fetchRegions = async () => {
            const { data } = await supabase.auth.getSession();
            const access_token = data.session?.access_token;
            if (access_token) {
                try {
                    const response = await fetch('http://localhost:3001/api/regions', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${access_token}`,
                        },
                    });
                    if (!response.ok) {
                        throw new Error('Backend request failed');
                    }
                    const data = await response.json();
                    setRegions((data as any[]).map(item => ({
                        id: item.id,
                        name: item.name,
                        } as Region
                    ))
                        || []);
                } catch (error) {
                    toast.error('Failed to contact backend');
                }
            }
        }
        const fetchGames = async () => {
            const { data } = await supabase.auth.getSession();
            const access_token = data.session?.access_token;
            if (access_token) {
                try {
                    const response = await fetch('http://localhost:3001/api/games', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${access_token}`,
                        },
                    });
                    if (!response.ok) {
                        throw new Error('Backend request failed');
                    }
                    const data = await response.json();
                    setGames((data as any[]).map(item => ({
                        id: item.id,
                        name: item.name,
                        } as Game
                    ))
                        || []);
                } catch (error) {
                    toast.error('Failed to contact backend');
                }
            }
        }
        fetchGames();
        fetchRegions();
    }, []);

    return (
        <Dialog>
            <DialogTrigger >
                <Button className="bg-brand-secondary text-white"> Create Lobby </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create a New Lobby</DialogTitle>
                        <DialogDescription>
                            Set up your game lobby with the desired settings.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 pt-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Lobby Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Enter a name for your lobby"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="game">Game</Label>
                            <Select value={formData.game} onValueChange={handleGameChange} required>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="eg. Baldur's Gate 3" />
                                </SelectTrigger>
                                <SelectContent>
                                    {games.map((game) => (
                                        <SelectItem value={String(game.id)}> {game.name} </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="game">Region</Label>
                            <Select value={formData.region} onValueChange={handleRegionChange} required>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="eg. Asia" />
                                </SelectTrigger>
                                <SelectContent>
                                    {regions.map((region) => (
                                        <SelectItem value={String(region.id)}> {region.name} </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="game">Lobby Size</Label>
                            <Slider
                                defaultValue={[2]}
                                max={10}
                                min={2}
                                step={1}
                                value={[Number(formData.maxPlayers)]}
                                onValueChange={(value) => handleMaxPlayersChange(String(value[0]))}
                            />
                            <div>{formData.maxPlayers}</div>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <DialogFooter >
                            <Button type="submit" disabled={isLoading} >
                            {isLoading ? "Creating..." : "Create Lobby"}
                            </Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}