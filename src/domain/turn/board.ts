import { Disc, isOppositeDisc } from "./disc";
import { Move } from "./move";
import { Point } from "./point";

export class Board {
  private _walledDiscs: Disc[][];

  constructor(public _discs: Disc[][]) {
    this._walledDiscs = this.wallDiscs();
  }

  place(move: Move): Board {
    // TODO 盤面におけるかどうかの判定

    // 空のマス目ではない場合、置くことができない
    if (this._discs[move.point.y][move.point.x] !== Disc.Empty) {
      throw new Error("Invalid point");
    }

    // ひっくり返せる点をリストアップ
    const flipPoint = this.listFlipPoints(move);

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

  private listFlipPoints(move: Move): Point[] {
    const flipPoints: Point[] = [];

    const walledX = move.point.x + 1;
    const walledY = move.point.y + 1;

    const checkFlipPoints = (xMove: number, yMove: number) => {
      const flipCandidate: Point[] = [];

      // 一つ動いた位置から開始
      let cusorX = walledX + xMove;
      let cusorY = walledY + yMove;

      // 手と逆の石がある間、一つずつ見ていく
      while (isOppositeDisc(move.disc, this._walledDiscs[cusorY][cusorX])) {
        // 番兵を考慮して-1する
        flipCandidate.push(new Point(cusorX - 1, cusorY - 1));
        cusorX += xMove;
        cusorY += yMove;

        // 次の手が同じ色の石なら、ひっくり返す意思が確定
        if (move.disc === this._walledDiscs[cusorY][cusorX]) {
          flipPoints.push(...flipCandidate);
          break;
        }
      }
    };

    // 上
    checkFlipPoints(0, -1);
    // 左上
    checkFlipPoints(-1, -1);
    // 左
    checkFlipPoints(-1, 0);
    // 左下
    checkFlipPoints(-1, 1);
    // 下
    checkFlipPoints(0, 1);
    // 右下
    checkFlipPoints(1, 1);
    // 右
    checkFlipPoints(1, 0);
    // 右上
    checkFlipPoints(1, -1);

    return flipPoints;
  }

  private wallDiscs(): Disc[][] {
    const walled: Disc[][] = [];

    // 10個DiscWallが入った配列を作成
    const topAndBottomWall = Array(this._discs[0].length + 2).fill(Disc.Wall);

    //
    this._discs.forEach((line) => {
      const walledLine = [Disc.Wall, ...line, Disc.Wall];
      walled.push(walledLine);
    });

    // 一番上の10個DiscWallを追加
    walled.push(topAndBottomWall);

    // 一番下を追加
    walled.push(topAndBottomWall);

    return walled;
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
