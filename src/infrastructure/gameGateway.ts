import mysql from "mysql2/promise";
import { GameRecord } from "./gameRecord";

export class GameGateway {
  async findLatest(conn: mysql.Connection): Promise<GameRecord | undefined> {
    const gameSelectResult = await conn.execute<any>(
      "select id, started_at from games order by id desc limit 1"
    );

    // 盤面の情報が二重配列で返ってくる
    const record = gameSelectResult[0][0];

    if (!record) {
      return undefined;
    }

    return new GameRecord(record["id"], record["started_at"]);
  }

  // gamesテーブルに今の時間を送ってデータを追加
  async insert(conn: mysql.Connection, startedAt: Date): Promise<GameRecord> {
    const gameInsertResult = await conn.execute<any>(
        "insert into games (started_at) values (?)",
        [startedAt]
      );
  
      // ゲームIDを取得
      // 返り値としてResultSetHeader型が返ってくるため以下のように書く
      const gameId = gameInsertResult[0].insertId;

      return new GameRecord(gameId, startedAt);
  }
}
