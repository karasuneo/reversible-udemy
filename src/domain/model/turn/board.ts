import { DomainError } from "../../error/domainError";
import { Disc, isOppositeDisc } from "./disc";
import { Move } from "./move";
import { Point } from "./point";

export class Board {
  private _walledDiscs: Disc[][];

  constructor(public _discs: Disc[][]) {
    this._walledDiscs = this.wallDiscs();
  }

  place(move: Move): Board {
    // 空のマス目ではない場合、置くことができない
    if (this._discs[move.point.y][move.point.x] !== Disc.Empty) {
      throw new DomainError(
        "SelectedPointIsNotDisc",
        "Selected point is not disc"
      );
    }

    // ひっくり返せる点をリストアップ
    const flipPoints = this.listFlipPoints(move);

    // ひっくり返せる点がない場合、置くことができない
    if (flipPoints.length === 0) {
      throw new DomainError("FlipPointIsNotEmpty", "Flip points is empty");
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
    flipPoints.forEach((p) => {
      newDiscs[p.y][p.x] = move.disc;
    });

    return new Board(newDiscs);
  }

  private listFlipPoints(move: Move): Point[] {
    const flipPoints: Point[] = [];

    const walledX = move.point.x + 1;
    const walledY = move.point.y + 1;

    const checkFlipPoints = (xMove: number, yMove: number) => {
      const flipCandidate: Point[] = [];

      // 一つ動いた位置から開始
      let cursorX = walledX + xMove;
      let cursorY = walledY + yMove;

      // 手と逆の石がある間、一つずつ見ていく
      while (isOppositeDisc(move.disc, this._walledDiscs[cursorY][cursorX])) {
        // 番兵を考慮して-1する
        flipCandidate.push(new Point(cursorX - 1, cursorY - 1));
        cursorX += xMove;
        cursorY += yMove;

        // 次が手と同じ色の石なら、ひっくり返す石が確定
        if (move.disc === this._walledDiscs[cursorY][cursorX]) {
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

  existValidMove(disc: Disc): boolean {
    for (let y = 0; y < this._discs.length; y++) {
      const line = this._discs[y];

      for (let x = 0; x < line.length; x++) {
        const discOnBoard = line[x];

        // 空ではない点は無視
        if (discOnBoard !== Disc.Empty) {
          continue;
        }

        const move = new Move(disc, new Point(x, y));
        const flipPoints = this.listFlipPoints(move);

        // ひっくり返せる点がある場合、置ける場所がある
        if (flipPoints.length !== 0) {
          return true;
        }
      }
    }

    return false;
  }

  count(disc: Disc): number {
    // Discに対して列を回して、列に対してフィルターをかけ、各店が指定された石になっているかチェックして、それらを合計している
    return this._discs
      .map((line) => {
        return line.filter((discOnBoard) => discOnBoard === disc).length;
      })
      .reduce((v1, v2) => v1 + v2, 0);
  }

  private wallDiscs(): Disc[][] {
    const walled: Disc[][] = [];

    // 10個DiscWallが入った配列を作成
    const topAndBottomWall = Array(this._discs[0].length + 2).fill(Disc.Wall);

    walled.push(topAndBottomWall);

    this._discs.forEach((line) => {
      const walledLine = [Disc.Wall, ...line, Disc.Wall];
      walled.push(walledLine);
    });

    // 一番上の10個DiscWallを追加
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
