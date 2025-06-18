import { createSupabaseClient, parseAccessToken } from "../utils.js";
import { getGamesDB, getRegionsDB } from "./dbController.js";

export async function getGames(req, res) {
    const supabase = createSupabaseClient(parseAccessToken(req));
    try {
        let gamesData = await getGamesDB(supabase);
        res.json(gamesData);
    }
    catch (error) {
        console.error("Error fetching games:", error);
        return res.status(500).json({ error: "Failed to fetch games", details: error.message });
    }
}

export async function getRegions(req, res) {
    const supabase = createSupabaseClient(parseAccessToken(req));
    try {
        let regionsData = await getRegionsDB(supabase);
        console.log("Regions data fetched successfully:", regionsData);
        res.json(regionsData);
    }
    catch (error) {
        console.error("Error fetching regions:", error);
        return res.status(500).json({ error: "Failed to fetch regions", details: error.message });
    }
}