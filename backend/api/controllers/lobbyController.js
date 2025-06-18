import { leaveLobbyDB, joinLobbyDB, getLobbyDB, getOpenLobbies, getGameFilteredLobbies, getGameRegionFilteredLobbies, addLobbyDB, deleteLobbyDB } from "./dbController.js";
import { createSupabaseClient, parseAccessToken } from "../utils.js";

export async function getLobby(req, res) {
    const supabase = createSupabaseClient(parseAccessToken(req));
    const { id } = req.params;
    try {
        const lobby = await getLobbyDB(id, supabase);
        if (!lobby) {
            return res.status(404).json({ error: "Lobby not found" });
        }
        res.json(lobby);
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch lobby", details: error.message });
    }
}
/**
 * GET /lobbies
 * Returns a list of all open lobbies, optionally filtering by game and region.
 */
export async function getLobbies(req, res) {
    const supabase = createSupabaseClient(parseAccessToken(req));
    const { game, region } = req.query;
    let filteredLobbies = await getOpenLobbies(supabase);

    if (game) {
        filteredLobbies = await getGameFilteredLobbies(game, supabase);
    }
    else if (region && game) {
        filteredLobbies = await getGameRegionFilteredLobbies(game, region, supabase);
    }
    console.log("Filtered lobbies:", filteredLobbies);
    res.json(filteredLobbies);
}

export async function addLobby(req, res) {
    const supabase = createSupabaseClient(parseAccessToken(req));
    const { name, game, region, maxPlayers, status } = req.body;

    if (
    name === undefined || name === null ||
    game === undefined || game === null ||
    region === undefined || region === null ||
    maxPlayers === undefined || maxPlayers === null ||
    status === undefined || status === null
    ) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const newLobby = await addLobbyDB(name, game, region, maxPlayers, status, supabase);
        console.log("New lobby created:", newLobby);
        res.status(201).json({ message: "Lobby created successfully", lobby: newLobby });
    } catch (error) {
        return res.status(500).json({ error: "Failed to create lobby", details: error.message });
    }
}

export async function deleteLobby(req, res) {
    const supabase = createSupabaseClient(parseAccessToken(req));
    const { id } = req.params;
    try {
        const deletedLobby = await deleteLobbyDB(id, supabase);
        res.status(200).json({ message: "Lobby deleted successfully", lobby: deletedLobby });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to delete lobby", details: error.message });
    }
}

export async function joinLobby(req, res) {
    const supabase = createSupabaseClient(parseAccessToken(req));
    const { id } = req.params;
    try {
        await joinLobbyDB(id, supabase);
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to join lobby", details: error.message });
    }
}

export async function leaveLobby(req, res) {
    const supabase = createSupabaseClient(parseAccessToken(req));
    const { id } = req.params;
    try {
        await leaveLobbyDB(id, supabase);
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to leave lobby", details: error.message });
    }
}