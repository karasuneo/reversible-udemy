import mysql from "mysql2/promise";
import { GameResult } from "./gameResult";

export interface GamaResultRepository {
  findForGameId(conn: mysql.Connection, gameId: number);
  save(conn: mysql.Connection, gameResult: GameResult): Promise<void>;
}
