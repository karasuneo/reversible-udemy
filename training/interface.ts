const STONE = 0;
const PAPER = 1;
const SCISSORS = 2;

interface HandGenerator {
  generate(): number;
}

class RandomGenerator implements HandGenerator {
  generate(): number {
    return Math.floor(Math.random() * 3);
  }

  generateArray(): Array<number> {
    return [];
  }
}

class Janken {
  play(handGenerator: HandGenerator) {
    const computerHand = handGenerator.generate();

    console.log(`computerHand = ${computerHand}`);

    // 勝敗判定など
  }
}

const janken = new Janken();

const generator = new RandomGenerator();
janken.play(generator);

class StoneHandGenerator implements HandGenerator {
  generate(): number {
    return STONE;
  }
}

const generator2 = new StoneHandGenerator();
janken.play(generator2);
