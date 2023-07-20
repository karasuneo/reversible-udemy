import mysql from "mysql2/promise";
import { SquareRecord } from "./squareRecord";

export class SquareGateway {
  async findForTurnId(
    conn: mysql.Connection,
    turnId: number
  ): Promise<Array<SquareRecord>> {
    const squaresSelectResult = await conn.execute<any>(
      "select id, turn_id, x, y, disc from squares where turn_id = ?",
      [turnId]
    );
    const records = squaresSelectResult[0];

    return records.map((r: { [x: string]: number }) => {
      return new SquareRecord(r["id"], r["turn_id"], r["x"], r["y"], r["disc"]);
    });
  }

  async insertAll(
    conn: mysql.Connection,
    turnId: number,
    board: Array<Array<number>>
  ) {
    // 二重配列の総数を取得
    const squareCount = board
      .map((line) => line.length)
      .reduce((v1, v2) => v1 + v2, 0);

    // インサートするSQL文を作成
    const squaresInsertSql =
      "insert into squares (turn_id, x, y, disc) values " +
      Array.from(Array(squareCount))
        .map(() => "(?, ?, ?, ?)")
        .join(", ");

    const squaresInsertValues: any[] = [];

    // squaresInsertValuesにturnId, x, y, discを追加
    board.forEach((line, y) => {
      line.forEach((disc, x) => {
        squaresInsertValues.push(turnId);
        squaresInsertValues.push(x);
        squaresInsertValues.push(y);
        squaresInsertValues.push(disc);
      });
    });

    await conn.execute(squaresInsertSql, squaresInsertValues);
  }
}
