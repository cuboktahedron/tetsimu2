import { GarbageInfo } from "stores/SimuState";
import { MAX_NEXTS_NUM } from "types/core";
import { RandomNumberGenerator } from "../randomNumberGenerator";

const attacksSigma = [4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0];
const attacks = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5];
const stepsSigma = [4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5, 0];
const steps = [5, 5, 4, 4, 3, 3, 2, 2, 1, 1];

class GarbageGenerator {
  private garbages: GarbageInfo[];

  constructor(
    private rng: RandomNumberGenerator,
    private level: number,
    _garbages: GarbageInfo[]
  ) {
    this.garbages = _garbages.map((garbage) => ({ ...garbage }));
  }

  next(generatesGarbage: boolean): GarbageInfo[] {
    const garbage = this.garbages[0];
    if (garbage) {
      if (garbage.restStep < 0) {
        return this.garbages;
      } else if (garbage.restStep === 0) {
        this.garbages.shift();
      }
    }

    while (generatesGarbage && this.lackOfGarbages()) {
      const sigmaAttack = attacksSigma[Math.floor(this.level / 1000) % 10];
      const avgAttack = attacks[Math.floor(this.level / 100) % 10];
      const sigmaStep = stepsSigma[Math.floor((this.level / 10) % 10)];
      const avgStep = steps[this.level % 10];

      const amount = this.normalizeUntilSucceeded(sigmaAttack, avgAttack, 0);
      const restStep = this.normalizeUntilSucceeded(sigmaStep, avgStep, 1);

      this.garbages.push({
        amount,
        restStep,
      });
    }

    const garbage2 = this.garbages[0] as GarbageInfo;
    if (garbage2) {
      this.garbages.splice(0, 1, {
        amount: garbage2.amount,
        restStep: garbage2.restStep - 1,
      });
    }

    return this.garbages;
  }

  private lackOfGarbages() {
    const totalStep = this.garbages
      .map((garbage) => garbage.restStep)
      .concat(0)
      .reduce((sum, cur) => sum + cur);
    return totalStep <= MAX_NEXTS_NUM;
  }

  private normalizeUntilSucceeded(sigma: number, avg: number, min: number) {
    while (true) {
      const v = Math.round(this.normalize(sigma, avg));
      if (min <= v) {
        return v;
      }
    }
  }

  private normalize(sigma: number, avg: number) {
    const x = this.rng.random();
    const y = this.rng.random();
    const coefficient = Math.sqrt(-2 * Math.log(x));
    const radian = 2 * y * Math.PI;
    const z = coefficient * Math.cos(radian);
    return sigma * z + avg;
  }
}

export default GarbageGenerator;
