import { GameGateway } from "../dataaccess/gameGateway";
import { TurnGateway } from "../dataaccess/turnGateway";
import { SquareGateway } from "../dataaccess/squareGateway";
import { MoveGateway } from "../dataaccess/moveGateway";
import { connectMySQL } from "../dataaccess/connection";
import { DARK, LIGHT } from "../application/constants";
import { Turn } from "../domain/turn";
import { Board } from "../domain/borad";
import { toDisc } from "../domain/disc";
import { Point } from "../domain/point";
import { TurnRepository } from "../domain/turnRepository";

const gameGateway = new GameGateway();
const turnRepository = new TurnRepository();

class FindLatestGameTurnByTurnCountOutput {
  constructor(
    private _turnCount: number,
    private _board: number[][],
    private _nextDisc: number | undefined,
    private _winnerDisc: number | undefined
  ) {}

  get turnCount() {
    return this._turnCount;
  }

  get board() {
    return this._board;
  }

  get nextDisc() {
    return this._nextDisc;
  }

  get winnerDisc() {
    return this._winnerDisc;
  }
}

export class TurnService {
  async findLatestGameTurnByTurnCount(
    turnCount: number
  ): Promise<FindLatestGameTurnByTurnCountOutput> {
    const conn = await connectMySQL();
    try {
      const gameRecord = await gameGateway.findLatest(conn);
      if (!gameRecord) {
        throw new Error("Latest Game not found");
      }

      const turn = await turnRepository.findForGameIdAndTurnCount(
        conn,
        gameRecord.id,
        turnCount
      );

      return new FindLatestGameTurnByTurnCountOutput(
        turnCount,
        turn.board.discs,
        turn.nextDisc,
        undefined
      );
    } finally {
      await conn.end();
    }
  }

  async registerTurn(turnCount: number, disc: number, x: number, y: number) {
    const conn = await connectMySQL();
    try {
      // 1つ前のターンの情報を取得
      // 最新のゲームを取得
      const gameRecord = await gameGateway.findLatest(conn);
      if (!gameRecord) {
        throw new Error("Latest Game not found");
      }

      // ターンを取得
      const previousTurnCount = turnCount - 1;
      // ターンに関するドメインモデルで扱う単位をリポジトリで一気に読み書き
      const previousTurn = await turnRepository.findForGameIdAndTurnCount(
        conn,
        gameRecord.id,
        previousTurnCount
      );

      // 石を置く
      const newTurn = previousTurn.placeNext(toDisc(disc), new Point(x, y));

      // ターンを保存する
      // テーブルを意識しない
      await turnRepository.save(conn, newTurn);

      await conn.commit();
    } finally {
      await conn.end();
    }
  }
}
