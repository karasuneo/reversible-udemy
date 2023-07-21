import mysql from "mysql2/promise";
import { GameResult } from "./gameResult";
import { GameResultGateway } from "../../../infrastructure/repository/gameResult/gameResultGateway";

export interface GamaResultRepository {
  findForGameId(conn: mysql.Connection, gameId: number);
  save(conn: mysql.Connection, gameResult: GameResult): Promise<void>;
}
