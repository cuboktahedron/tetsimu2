import { GarbageInfo } from "stores/SimuState";
import { MAX_NEXTS_NUM } from "types/core";
import { RandomNumberGenerator } from "../randomNumberGenerator";

const fibs = [1, 1, 2, 3, 5, 8, 13];

export type GarbageGenerationFactor = {
  a1: number;
  a2: number;
  b1: number;
  b2: number;
};

class GarbageGenerator {
  private garbages: GarbageInfo[];

  constructor(
    private rng: RandomNumberGenerator,
    private factors: GarbageGenerationFactor,
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
      const amount = this.generateAmount();
      const restStep = this.generateRestStep();

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

  generateAmount(): number {
    const maxAttack = (() => {
      const attack = Math.floor(this.factors.a1 / 10);
      const attackMod = this.factors.a1 % 10;
      if (this.rng.random() * 10 <= attackMod) {
        return attack + 1;
      } else {
        return attack;
      }
    })();

    const probableHit = this.factors.a2 / 100;
    const probableNotHit = 1 - probableHit;
    let value = maxAttack;
    let loopNum = 0;
    while (value > 0) {
      let probable: number;
      if (fibs[loopNum]) {
        probable = 1 - Math.pow(probableNotHit, fibs[loopNum]);
      } else {
        probable = 1 - Math.pow(probableNotHit, fibs.slice(-1)[0]);
      }

      if (this.rng.random() <= probable) {
        return value;
      }

      value--;
      loopNum++;
    }

    return 0;
  }

  generateRestStep(): number {
    const minStep = (() => {
      const step = Math.floor(this.factors.b1 / 10);
      const stepMod = this.factors.b1 % 10;
      if (this.rng.random() * 10 <= stepMod) {
        return step + 1;
      } else {
        return step;
      }
    })();

    const maxStep = 14;
    const probableHit = this.factors.b2 / 100;
    const probableNotHit = 1 - probableHit;
    let value = minStep;
    let loopNum = 0;
    while (value < maxStep) {
      let probable: number;
      if (fibs[loopNum]) {
        probable = 1 - Math.pow(probableNotHit, fibs[loopNum]);
      } else {
        probable = 1 - Math.pow(probableNotHit, fibs.slice(-1)[0]);
      }

      if (this.rng.random() <= probable) {
        if (value === 0) {
          return 1;
        } else {
          return value;
        }
      }

      value++;
      loopNum++;
    }

    return maxStep;
  }
}

export default GarbageGenerator;
