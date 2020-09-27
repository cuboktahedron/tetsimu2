import MersenneTwister from "mersenne-twister";

export class RandomNumberGenerator {
  private gen: MersenneTwister;
  private _seed: number;

  constructor(initialSeed?: number) {
    this.gen = new MersenneTwister();
    if (!initialSeed) {
      initialSeed = Math.trunc(this.gen.random() * 100_000_000);
    }

    if (initialSeed < 0 || initialSeed >= 100_000_000) {
      throw new Error("RNG seed must be between 0 and 99,999,999");
    }

    this.gen.init_seed(initialSeed);
    this._seed = initialSeed;
  }

  random(): number {
    const randomNumber = this.gen.random();
    this._seed = Math.trunc(randomNumber * 100_000_000);
    return randomNumber;
  }

  get seed(): number {
    return this._seed;
  }
}
