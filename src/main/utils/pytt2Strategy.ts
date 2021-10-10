import { AttackType, SpinType } from "types/core";
import { SimulationStrategyBase } from "./SimulationStrategyBase";

const attackTable = {
  [AttackType.Single]: 0,
  [AttackType.Double]: 1,
  [AttackType.Triple]: 2,
  [AttackType.Tetris]: 4,
  [AttackType.Tsm]: 0,
  [AttackType.Tsdm]: 1,
  [AttackType.Tss]: 2,
  [AttackType.Tsd]: 4,
  [AttackType.Tst]: 6,
  [AttackType.BtbTetris]: 5,
  [AttackType.BtbTsm]: 1,
  [AttackType.BtbTsdm]: 2,
  [AttackType.BtbTss]: 3,
  [AttackType.BtbTsd]: 5,
  [AttackType.BtbTst]: 7,
  [AttackType.PerfectClear]: 10,
};

const renTable = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 5];

export class Pytt2Strategy extends SimulationStrategyBase {
  get attackTable() {
    return attackTable;
  }

  get renTable() {
    return renTable;
  }

  calculateAttack(
    erasedLine: number,
    spinType: SpinType,
    ren: number,
    isBtb: boolean,
    isPerfectClear: boolean
  ): {
    attack: number;
    attackTypes: AttackType[];
  } {
    const attackTypes = this.decideAttackTypes(
      erasedLine,
      spinType,
      isBtb,
      isPerfectClear
    );

    return {
      attack: this.calculateAttackBy(attackTypes, ren),
      attackTypes,
    };
  }

  calculateAttackBy(attackTypes: AttackType[], ren: number): number {
    if (attackTypes.includes(AttackType.PerfectClear)) {
      return this.attackTable[AttackType.PerfectClear];
    } else {
      const attackElements = attackTypes.map((type: AttackType) => {
        return this.attackTable[type];
      });

      if (ren >= 0) {
        attackElements.push(
          this.renTable[Math.min(ren, this.renTable.length - 1)]
        );
      }

      return attackElements.reduce((acc, cur) => acc + cur, 0);
    }
  }

  decideAttackTypes(
    erasedLine: number,
    spinType: SpinType,
    isBtb: boolean,
    isPerfectClear: boolean
  ): AttackType[] {
    const attackTypes: AttackType[] = [];

    if (erasedLine === 0) {
      return attackTypes;
    }

    if (isPerfectClear) {
      attackTypes.push(AttackType.PerfectClear);
    }

    if (spinType === SpinType.Mini) {
      if (isBtb) {
        if (erasedLine === 1) {
          attackTypes.push(AttackType.BtbTsm);
        } else if (erasedLine === 2) {
          attackTypes.push(AttackType.BtbTsdm);
        }
      } else {
        if (erasedLine === 1) {
          attackTypes.push(AttackType.Tsm);
        } else if (erasedLine === 2) {
          attackTypes.push(AttackType.Tsdm);
        }
      }
    } else if (spinType === SpinType.Spin) {
      if (isBtb) {
        if (erasedLine === 1) {
          attackTypes.push(AttackType.BtbTss);
        } else if (erasedLine === 2) {
          attackTypes.push(AttackType.BtbTsd);
        } else if (erasedLine === 3) {
          attackTypes.push(AttackType.BtbTst);
        }
      } else {
        if (erasedLine === 1) {
          attackTypes.push(AttackType.Tss);
        } else if (erasedLine === 2) {
          attackTypes.push(AttackType.Tsd);
        } else if (erasedLine === 3) {
          attackTypes.push(AttackType.Tst);
        }
      }
    } else {
      if (erasedLine === 1) {
        attackTypes.push(AttackType.Single);
      } else if (erasedLine === 2) {
        attackTypes.push(AttackType.Double);
      } else if (erasedLine === 3) {
        attackTypes.push(AttackType.Triple);
      } else if (erasedLine >= 4) {
        if (isBtb) {
          attackTypes.push(AttackType.BtbTetris);
        } else {
          attackTypes.push(AttackType.Tetris);
        }
      }
    }

    return attackTypes;
  }
}
