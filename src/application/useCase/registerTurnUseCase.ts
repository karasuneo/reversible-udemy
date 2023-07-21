import { connectMySQL } from "../../infrastructure/connection";
import { Disc } from "../../domain/model/turn/disc";
import { Point } from "../../domain/model/turn/point";
import { ApplicationError } from "../error/applicationError";
import { GameResult } from "../../domain/model/gameResult/gameResult";
import { TurnRepository } from '../../domain/model/turn/turnRepository';
import { GameRepository } from "../../domain/model/game/gameRepository";
import { GamaResultRepository } from "../../domain/model/gameResult/gameResultRepository";

export class RegisterTurnUseCase {
    constructor(
        private _turnRepository: TurnRepository,
        private _gameRepository: GameRepository,
        private _gamaResultRepository: GamaResultRepository
      ) {}
    
    
    async run(turnCount: number, disc: Disc, point: Point) {
        const conn = await connectMySQL();
        try {
          // 1つ前のターンの情報を取得
          // 最新のゲームを取得
          const game = await this._gameRepository.findLatest(conn);
          if (!game) {
            throw new ApplicationError(
              "LatestGameNotFound",
              "Latest Game not found"
            );
          }
          if (!game.id) {
            throw new Error("Game id is undefined");
          }
    
          // ターンを取得
          const previousTurnCount = turnCount - 1;
          // ターンに関するドメインモデルで扱う単位をリポジトリで一気に読み書き
          const previousTurn = await this._turnRepository.findForGameIdAndTurnCount(
            conn,
            game.id,
            previousTurnCount
          );
    
          // 石を置く
          const newTurn = previousTurn.placeNext(disc, point);
    
          // ターンを保存する
          // テーブルを意識しない
          await this._turnRepository.save(conn, newTurn);
    
          // 勝敗が決した場合、対戦結果を保存
          if (newTurn.gameEnded()) {
            const winnerDisc = newTurn.winnerDisc();
            const gameResult = new GameResult(game.id, winnerDisc, newTurn.endAt);
            await this._gamaResultRepository.save(conn, gameResult);
            // 対戦結果を保存
          }
    
          await conn.commit();
        } finally {
          await conn.end();
        }
      }
}