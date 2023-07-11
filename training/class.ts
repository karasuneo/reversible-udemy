class Fraction {
  constructor(private _numerator: number, private _denominator: number) {}


  add(other: Fraction): Fraction {
    return new Fraction(
      this._numerator * other._denominator + other._numerator * this._denominator,
      this._denominator * other._denominator
    );
  }
  toString(): string {
    return `${this._numerator}/${this._denominator}`;
  }

  get numerator(): number {
    return this._numerator;
  }

  get denominator(): number {
    return this._denominator;
  }
}

const f1 = new Fraction(1, 2);
console.log(f1.numerator);
console.log(f1.denominator);

const f2 = new Fraction(3, 4);
console.log(f2.toString());

const result = f1.add(f2);
console.log(result.toString());