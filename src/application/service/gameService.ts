import { connectMySQL } from "../../infrastructure/connection";
import { firstTurn } from "../../domain/model/turn/turn";
import { Game } from "../../domain/model/game/game";
import { GameMySQLRepository } from "../../infrastructure/repository/game/gameMySQLRepository";
import { TurnMySQLRepository } from "../../infrastructure/repository/turn/turnMySQLRepository";

const turnRepository = new TurnMySQLRepository();
const gameRepository = new GameMySQLRepository();

export class GameService {
  async startNewGame() {
    const now = new Date();

    const conn = await connectMySQL();
    try {
      await conn.beginTransaction();

      // ゲームを保存
      const game = await gameRepository.save(conn, new Game(undefined, now));
      if (!game.id) {
        throw new Error("Game id is undefined");
      }

      // ターンを生成
      const turn = firstTurn(game.id, now);

      // ターンを保存
      await turnRepository.save(conn, turn);

      await conn.commit();
    } finally {
      await conn.end();
    }
  }
}
