import { Disc } from "./disc";
import { Move } from "./move";

export class Board {
  constructor(public _discs: Disc[][]) {}

  place(move: Move): Board {
    // TODO 盤面におけるかどうかの判定

    // 盤面をコピーする
    // フィールドの変更は危険な行為であるためコピーを作成
    const newDiscs = this._discs.map((line) => {
      return line.map((disc) => {
        return disc;
      });
    });

    // 石を置く
    newDiscs[move.point.y][move.point.x] = move.disc;

    // ひっくり返す

    return new Board(newDiscs);
  }

  get discs() {
    return this._discs;
  }
}

const E = Disc.Empty;
const D = Disc.Dark;
const L = Disc.Light;

const INITIAL_DISCS = [
  [E, E, E, E, E, E, E, E],
  [E, E, E, E, E, E, E, E],
  [E, E, E, E, E, E, E, E],
  [E, E, E, D, L, E, E, E],
  [E, E, E, L, D, E, E, E],
  [E, E, E, E, E, E, E, E],
  [E, E, E, E, E, E, E, E],
  [E, E, E, E, E, E, E, E],
];

// Boardクラスにのみ関心を持たせたいため、この形にした
export const initialBoard = new Board(INITIAL_DISCS);
