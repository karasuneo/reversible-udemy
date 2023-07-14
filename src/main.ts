import express from "express";
import morgan from "morgan";
import "express-async-errors";
import mysql from "mysql2/promise";

const EMPTY = 0;
const DARK = 1;
const LIGHT = 2;

const INITIAL_BOARD = [
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, DARK, LIGHT, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, LIGHT, DARK, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
];

const PORT = 3000;

const app = express();

app.use(morgan("dev"));
app.use(express.static("static", { extensions: ["html"] }));

app.get("/api/hello", async (req, res) => {
  res.json({ message: "Hello Express" });
});

app.get("/api/error", async (req, res) => {
  throw new Error("Error!");
});

app.post("/api/games", async (req, res) => {
  const now = new Date();

  const conn = await connectMySQL();
  try {
    // DBとの通信開始
    await conn.beginTransaction();

    // gamesテーブルに今の時間を送ってデータを追加
    const gameInsertResult = await conn.execute<any>(
      "insert into games (started_at) values (?)",
      [now]
    );

    // ゲームIDを取得
    // 返り値としてResultSetHeader型が返ってくるため以下のように書く
    const gameId = gameInsertResult[0].insertId;

    // turnsテーブルにゲームIDとターン数、次の石の色、終了時間を送ってデータを追加
    const turnInsertResult = await conn.execute<any>(
      "insert into turns (game_id, turn_count, next_disc, end_at) values (?, ?, ?, ?)",
      [gameId, 0, DARK, now]
    );
    const turnId = turnInsertResult[0].insertId;

    // 二重配列の総数を取得
    const squareCount = INITIAL_BOARD.map((line) => line.length).reduce(
      (v1, v2) => v1 + v2,
      0
    );

    // インサートするSQL文を作成
    const squaresInsertSql =
      "insert into squares (turn_id, x, y, disc) values " +
      Array.from(Array(squareCount))
        .map(() => "(?, ?, ?, ?)")
        .join(", ");

    
    const squaresInsertValues: any[] = [];

    // squaresInsertValuesにturnId, x, y, discを追加
    INITIAL_BOARD.forEach((line, y) => {
      line.forEach((disc, x) => {
        squaresInsertValues.push(turnId);
        squaresInsertValues.push(x);
        squaresInsertValues.push(y);
        squaresInsertValues.push(disc);
      });
    });

    await conn.execute(squaresInsertSql, squaresInsertValues);

    await conn.commit();
  } finally {
    await conn.end();
  }

  res.status(201).end();
});

app.get("/api/games/latest/turns/:turnCount", async (req, res) => {
  const turnCount = parseInt(req.params.turnCount);

  const conn = await connectMySQL();
  try {
    const gameSelectResult = await conn.execute<any>(
      "select id, started_at from games order by id desc limit 1"
    );

    // 盤面の情報が二重配列で返ってくる
    const game = gameSelectResult[0][0];

    const turnSelectResult = await conn.execute<any>(
      "select id, game_id, turn_count, next_disc, end_at from turns where game_id = ? and turn_count = ?",
      [game.id, turnCount]
    );

    // 盤面の情報が二重配列で返ってくる
    const turn = turnSelectResult[0][0];

    const squaresSelectResult = await conn.execute<any[]>(
      "select id, turn_id x, y, disc from squares where turn_id = ?",
      [turn["id"]]
    );
    const squares = squaresSelectResult[0];
    const board = Array.from(Array(8)).map(() => Array.from(Array(8)));
    squares.forEach((s) => {
      board[s.y][s.x] = s.disc;
    });

    const responseBody = {
      turnCount,
      board,
      nextDisc: turn["next_disc"],
      // TODO 決着がついている場合、game_resultsテーブルから取得する
      winnerDisc: null,
    };
    res.json(responseBody);
  } finally {
    await conn.end();
  }
});

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

async function connectMySQL() {
  return await mysql.createConnection({
    host: "localhost",
    database: "reversi",
    user: "reversi",
    password: "password",
  });
}
