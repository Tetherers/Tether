import express from "express";
import { getLobby, getLobbies, addLobby, deleteLobby, joinLobby, leaveLobby } from "./controllers/lobbyController.js";
const router = express.Router();

router.get("/lobbies", getLobbies);
router.post("/lobbies", addLobby);
router.get("/lobby/:id", getLobby);
router.post("/lobby/:id/join", joinLobby);
router.post("/lobby/:id/leave", leaveLobby);
router.post("/lobby/:id/delete", deleteLobby);

export default router;