import { AttackType, SpinType } from "types/core";

export abstract class SimulationStrategyBase {
  abstract calculateAttack(
    erasedLine: number,
    spinType: SpinType,
    ren: number,
    isBtb: boolean,
    isPerfectClear: boolean
  ): {
    attack: number;
    attackTypes: AttackType[];
  };

  abstract calculateAttackBy(attackTypes: AttackType[], ren: number): number;
}

export const SimulatorStrategyType = {
  Pytt2: "pytt2",
  Pytt2V132: "pytt2v132",
} as const;

export type SimulatorStrategyType =
  typeof SimulatorStrategyType[keyof typeof SimulatorStrategyType];
