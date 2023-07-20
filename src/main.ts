import express from "express";
import morgan from "morgan";
import "express-async-errors";
import { GameGateway } from "./infrastructure/gameGateway";
import { TurnGateway } from "./infrastructure/turnGateway";
import { MoveGateway } from "./infrastructure/moveGateway";
import { SquareGateway } from "./infrastructure/squareGateway";
import { gameRouter } from "./presentation/gameRouter";
import { turnRouter } from "./presentation/turnRouter";
import { DomainError } from "./domain/error/domainError";
import { ApplicationError } from "./application/error/applicationError";

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
  if (err instanceof DomainError) {
    res.status(400).send({ type: err.type, message: err.message });
    return;
  }

  if (err instanceof ApplicationError) {
    switch (err.type) {
      case "LatestGameNotFound":
        res.status(404).send({ type: err.type, message: err.message });
        return;
    }
  }

  console.error(`Unexpected error occurred`, err);
  res.status(500).send({ message: "Unexpected error" });
}
