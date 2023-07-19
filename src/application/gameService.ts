import { GameGateway } from "../dataaccess/gameGateway";
import { SquareGateway } from "../dataaccess/squareGateway";
import { connectMySQL } from "../dataaccess/connection";
import { TurnRepository } from "../domain/turnRepository";
import { firstTurn } from "../domain/turn";

const gameGateway = new GameGateway();

const turnRepository = new TurnRepository();

export class GameService {
  async startNewGame() {
    const now = new Date();

    const conn = await connectMySQL();
    try {
      await conn.beginTransaction();

      // ゲームを保存
      const gameRecord = await gameGateway.insert(conn, now);

      // ターンを生成
      const turn = firstTurn(gameRecord.id, now);

      // ターンを保存
      await turnRepository.save(conn, turn);

      await conn.commit();
    } finally {
      await conn.end();
    }
  }
}
