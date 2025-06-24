import express from "express";
import { getLobby, getLobbies, addLobby, deleteLobby, joinLobby, leaveLobby } from "./controllers/lobbyController.js";
import { getGames, getRegions } from "./controllers/dataController.js";

const router = express.Router();

router.get("/lobbies", getLobbies);
router.post("/lobbies", addLobby);
router.get("/lobby/:id", getLobby);
router.post("/lobby/:id/join", joinLobby);
router.post("/lobby/:id/leave", leaveLobby);
router.delete("/lobby/:id", deleteLobby);

router.get("/games", getGames);

router.get("/regions", getRegions);

export default router;