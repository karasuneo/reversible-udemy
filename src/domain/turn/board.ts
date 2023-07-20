import { Disc } from "./disc";
import { Move } from "./move";
import { Point } from "./point";

export class Board {
  constructor(public _discs: Disc[][]) {}

  place(move: Move): Board {
    // TODO 盤面におけるかどうかの判定

    // 空のマス目ではない場合、置くことができない
    if (this._discs[move.point.y][move.point.x] !== Disc.Empty) {
      throw new Error("Invalid point");
    }

    // ひっくり返せる点をリストアップ
    const flipPoint = this.listFlipPoints();

    // ひっくり返せる点がない場合、置くことができない
    if (flipPoint.length === 0) {
      throw new Error("Flip points is empty");
    }

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

  private listFlipPoints(): Point[] {
    return [new Point(0, 0)];
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
