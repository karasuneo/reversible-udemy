import express from "express";
import morgan from "morgan";
import "express-async-errors";
import mysql from "mysql2/promise";
import { GameGateway } from "./infrastructure/gameGateway";
import { TurnGateway } from "./infrastructure/turnGateway";
import { MoveGateway } from "./infrastructure/moveGateway";
import { SquareGateway } from "./infrastructure/squareGateway";
import { gameRouter } from "./presentation/gameRouter";
import { turnRouter } from "./presentation/turnRouter";

const PORT = 3000;

const app = express();

app.use(morgan("dev"));
app.use(express.static("static", { extensions: ["html"] }));
app.use(express.json());

const gameGateway = new GameGateway();
const turnGateway = new TurnGateway();
const moveGateway = new MoveGateway();
const squareGateway = new SquareGateway();

app.use(gameRouter);
app.use(turnRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Reversi application started: http://localhost:${PORT}`);
});

function errorHandler(
  err: any,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  console.error(`Unexpected error occurred`, err);
  res.status(500).send({ message: "Unexpected error" });
}
