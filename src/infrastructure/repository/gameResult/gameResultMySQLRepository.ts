import mysql from "mysql2/promise";
import { GameResultGateway } from "./gameResultGateway";
import { GameResult } from "../../../domain/model/gameResult/gameResult";
import { toWinnerDisc } from "../../../domain/model/gameResult/winnerDisc";
import { GamaResultRepository } from "../../../domain/model/gameResult/gameResultRepository";

const gameResultGateway = new GameResultGateway();

export class GamaResultMySQLRepository implements GamaResultRepository {
  async findForGameId(
    conn: mysql.Connection,
    gameId: number
  ): Promise<GameResult | undefined> {
    const gameResultRecord = await gameResultGateway.findForGameId(
      conn,
      gameId
    );

    if (!gameResultRecord) {
      return undefined;
    }

    return new GameResult(
      gameResultRecord.gameId,
      toWinnerDisc(gameResultRecord.winnerDisc),
      gameResultRecord.endAt
    );
  }

  async save(conn: mysql.Connection, gameResult: GameResult): Promise<void> {
    await gameResultGateway.insert(
      conn,
      gameResult.gameId,
      gameResult.winnerDisc,
      gameResult.endAt
    );
  }
}
