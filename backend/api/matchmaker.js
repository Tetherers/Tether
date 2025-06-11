const regions = [ 'NA', 'EU', 'ASIA', 'AFRICA', 'OCEANIA' ];
const lobbySize = [ 'SOLO', 'DUO', 'TRIO', 'SQUAD' ];
const gameIDs = [ 'GAME1', 'GAME2', 'GAME3', 'GAME4' ];

export interface MatchmakerRequest {
  region: string;
  lobbySize: string;
  gameID: string;
}

// Example: Find or Create Lobby
function joinLobbyOrMatchmake(user, game, region) {
    // 1. Look for an open lobby for the same game and region
    let lobby = findLobby({ game, region, isOpen: true });

    if (lobby) {
        // Add user to existing lobby
        addUserToLobby(user, lobby);
    } else {
        // Create a new lobby and add user
        lobby = createLobby({ game, region, host: user });
        addUserToLobby(user, lobby);
    }
    // Remove user from any waiting queues
    removeFromQueue(user, game, region);

    // Now the user is in the chatroom for that lobby
    enterChatroom(user, lobby);
}