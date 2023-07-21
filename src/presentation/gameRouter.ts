import express from "express";
import { GameService } from "../application/service/gameService";
import { TurnMySQLRepository } from "../infrastructure/repository/turn/turnMySQLRepository";
import { GameMySQLRepository } from "../infrastructure/repository/game/gameMySQLRepository";

export const gameRouter = express.Router();

const gameService = new GameService(
  new GameMySQLRepository(),
  new TurnMySQLRepository(),
);

gameRouter.post("/api/games", async (req, res) => {
  await gameService.startNewGame();

  res.status(201).end();
});
