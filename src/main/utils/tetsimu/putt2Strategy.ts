import { AttackType, SpinType } from "types/core";

const attackTable = {
  none: 0,
  single: 0,
  double: 1,
  triple: 2,
  tetris: 4,
  tsm: 0,
  tsdm: 1,
  tss: 2,
  tsd: 4,
  tst: 6,
  btbTetris: 5,
  btbTsm: 1,
  btbTsdm: 2,
  btbTss: 3,
  btbTsd: 5,
  btbTst: 7,
  pc: 10,
  ren: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 5],
};

export class Pytt2Strategy {
  calculateAttack(
    erasedLine: number,
    spinType: SpinType,
    ren: number,
    isBtb: boolean,
    isPerfectClear: boolean
  ) {
    const attackTypes = this.decideAttackTypes(
      erasedLine,
      spinType,
      isBtb,
      isPerfectClear
    );

    if (attackTypes.includes("pc")) {
      return attackTable.pc;
    } else {
      return attackTypes
        .map((type: AttackType) => {
          if (type === "ren") {
            return attackTable.ren[Math.min(ren, attackTable.ren.length - 1)];
          } else {
            return attackTable[type];
          }
        })
        .reduce((acc, cur) => acc + cur, 0);
    }
  }

  private decideAttackTypes(
    erasedLine: number,
    spinType: SpinType,
    isBtb: boolean,
    isPerfectClear: boolean
  ): AttackType[] {
    const attackTypes: AttackType[] = [];

    if (erasedLine === 0) {
      attackTypes.push("none");
      return attackTypes;
    }

    if (isPerfectClear) {
      attackTypes.push("pc");
    }

    if (erasedLine > 0) {
      attackTypes.push("ren");
    }

    if (spinType === SpinType.Mini) {
      if (isBtb) {
        if (erasedLine === 1) {
          attackTypes.push("btbTsm");
        } else if (erasedLine === 2) {
          attackTypes.push("btbTsdm");
        }
      } else {
        if (erasedLine === 1) {
          attackTypes.push("tsm");
        } else if (erasedLine === 2) {
          attackTypes.push("tsdm");
        }
      }
    } else if (spinType === SpinType.Spin) {
      if (isBtb) {
        if (erasedLine === 1) {
          attackTypes.push("btbTss");
        } else if (erasedLine === 2) {
          attackTypes.push("btbTsd");
        } else if (erasedLine === 3) {
          attackTypes.push("btbTst");
        }
      } else {
        if (erasedLine === 1) {
          attackTypes.push("tss");
        } else if (erasedLine === 2) {
          attackTypes.push("tsd");
        } else if (erasedLine === 3) {
          attackTypes.push("tst");
        }
      }
    } else {
      if (erasedLine === 1) {
        attackTypes.push("single");
      } else if (erasedLine === 2) {
        attackTypes.push("double");
      } else if (erasedLine === 3) {
        attackTypes.push("triple");
      } else if (erasedLine >= 4) {
        if (isBtb) {
          attackTypes.push("btbTetris");
        } else {
          attackTypes.push("tetris");
        }
      }
    }

    return attackTypes;
  }
}
