export async function getLobbyDB(lobbyId, client) {
    const {data, error} = await client
        .from('lobby')
        .select('id, name, owner, game: game (id, name), region: region (id, name), current_players, max_players, status, created_at, lobby_users ( users (id, username))')
        .eq('id', lobbyId)
        .single();
    if (error) {
        console.error("Error fetching open lobbies:", error);
        return [];
    } else {
        return data;
    }
}

export async function getOpenLobbies(client) {
    const {data, error} = await client
        .from('lobby')
        .select('id, name, game: game (id, name), region: region (id, name), current_players, max_players, status, created_at')
        .eq('status', 0) // Assuming 0 means open
        .order('created_at', { ascending: false });
    if (error) {
        console.error("Error fetching open lobbies:", error);
        return [];
    } else {
        return data;
    }
}

export async function getGameFilteredLobbies(game, client) {
    const {data, error} = await client
        .from('lobby')
        .select('id, name, game: game (id, name), region: region (id, name), current_players, max_players, status, created_at')
        .eq('game', game)
        .order('created_at', { ascending: false });
    if (error) {
        console.error("Error fetching game filtered lobbies:", error);
        return [];
    } else {
        return data;
    }
}

export async function getGameRegionFilteredLobbies(game, region, client) {
    const {data, error} = await client
        .from('lobby')
        .select('id, name, game: game (id, name), region: region (id, name), current_players, max_players, status, created_at')
        .eq('game', game)
        .eq('region', region)
        .order('created_at', { ascending: false });
    if (error) {
        console.error("Error fetching game and region filtered lobbies:", error);
        return [];
    } else {
        return data;
    }
}

export async function addLobbyDB(name, game, region, maxPlayers, status, client) {
    const { data: { user }, error: userError } = await client.auth.getUser();
    const {data, error} = await client
        .from('lobby')
        .insert([
            { name, game, region, current_players: 0, max_players: maxPlayers, status, owner:user.id }
        ])
        .select('*');
    if (error) {
        console.error("Error creating lobby:", error);
        throw error;
    } else {
        return data;
    }
}

export async function deleteLobbyDB(lobbyId, client) {
    const {data, error} = await client
        .from('lobby')
        .delete()
        .eq('id', lobbyId)
        .select('*');
    if (error || data.length === 0) {
        throw new Error(error ? error.message : "You are not the owner of this lobby or it does not exist.");
    } else {
        return data;
    }
}

export async function joinLobbyDB(lobbyId, client) {
    const { data: { user }, error: userError } = await client.auth.getUser();
    if (userError) {
        console.error("Error getting user:", userError);
        throw userError;
    }
    if (!user) {
        throw new Error("No authenticated user found.");
    }
    const { data, error } = await client.rpc('join_lobby', {
    lobby_id_in: lobbyId,  
    user_id_in: user.id    
    });

    if (error) {
        throw new Error (error.message);
    } else {
    console.log('Success: Joined Lobby', lobbyId);
    }
}

export async function leaveLobbyDB(lobbyId, client) {
    const { data: { user }, error: userError } = await client.auth.getUser();
    if (userError) {
        console.error("Error getting user:", userError);
        throw userError;
    }
    if (!user) {
        throw new Error("No authenticated user found.");
    }
    const { data, error } = await client.rpc('leave_lobby', {
        lobby_id_in: lobbyId,
        user_id_in: user.id
    });

    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('Success: Left Lobby', lobbyId);
    }
}

export async function getGamesDB(client) {
    const {data, error} = await client
        .from('game')
        .select('id, name')
    if (error) {
        console.error("Error fetching games:", error);
        return [];
    } else {
        return data;
    }
}

export async function getRegionsDB(client) {
    const {data, error} = await client
        .from('region')
        .select('id, name')
    if (error) {
        console.error("Error fetching regions:", error);
        return [];
    } else {
        return data;
    }
}