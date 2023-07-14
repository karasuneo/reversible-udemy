export class GameRecord {
  constructor(private _id: number, private _startAt: Date) {}

  get id() {
    return this._id;
  }
}
