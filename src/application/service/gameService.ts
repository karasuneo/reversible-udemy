import { connectMySQL } from "../../infrastructure/connection";
import { firstTurn } from "../../domain/model/turn/turn";
import { Game } from "../../domain/model/game/game";
import { GameRepository } from "../../domain/model/game/gameRepository";
import { TurnRepository } from "../../domain/model/turn/turnRepository";

export class GameService {
  constructor(
    private _gameRepository: GameRepository,
    private _turnRepository: TurnRepository
  ) {}
  async startNewGame() {
    const now = new Date();

    const conn = await connectMySQL();
    try {
      await conn.beginTransaction();

      // ゲームを保存
      const game = await this._gameRepository.save(conn, new Game(undefined, now));
      if (!game.id) {
        throw new Error("Game id is undefined");
      }

      // ターンを生成
      const turn = firstTurn(game.id, now);

      // ターンを保存
      await this._turnRepository.save(conn, turn);

      await conn.commit();
    } finally {
      await conn.end();
    }
  }
}
