import { SimuState } from "stores/SimuState";
import { AttackType, PlayStats, ReplayStepType } from "types/core";
import { Pytt2Strategy } from "utils/tetsimu/putt2Strategy";
import { SimuConductor } from "utils/tetsimu/simu/simuConductor";

export const getSimuConductor = (state: SimuState) => {
  return new SimuConductor(state);
};

export const canUndo = (state: SimuState) => {
  return state.step > 0;
};

export const canRedo = (state: SimuState) => {
  return state.step < state.histories.length - 1;
};

export const getNextAttacks = (state: SimuState): number[] => {
  const attacks = state.garbages.flatMap((garbage) => {
    if (garbage.restStep === 0) {
      return [];
    }

    const attacks: number[] = new Array(garbage.restStep - 1).fill(0);
    attacks.push(garbage.amount - garbage.offset);
    return attacks;
  });

  if (attacks.length < state.config.nextNum) {
    const extras: number[] = new Array(
      state.config.nextNum - attacks.length
    ).fill(0);

    return attacks.concat(extras);
  } else {
    return attacks.slice(0, state.config.nextNum);
  }
};

export const getUrgentAttack = (state: SimuState): number | null => {
  const garbage = state.garbages[0];
  if (garbage && garbage.restStep === 0 && garbage.amount > 0) {
    return garbage.amount - garbage.offset;
  } else {
    return null;
  }
};

export const getStats = (state: SimuState): PlayStats => {
  const stats: PlayStats = {
    [AttackType.Single]: 0,
    [AttackType.Double]: 0,
    [AttackType.Triple]: 0,
    [AttackType.Tetris]: 0,
    [AttackType.Tsm]: 0,
    [AttackType.Tsdm]: 0,
    [AttackType.Tss]: 0,
    [AttackType.Tsd]: 0,
    [AttackType.Tst]: 0,
    [AttackType.BtbTetris]: 0,
    [AttackType.BtbTsm]: 0,
    [AttackType.BtbTsdm]: 0,
    [AttackType.BtbTss]: 0,
    [AttackType.BtbTsd]: 0,
    [AttackType.BtbTst]: 0,
    [AttackType.PerfectClear]: 0,
    attacks: [0],
    drops: 0,
    garbages: [],
    lines: 0,
    maxRen: 0,
    totalBtb: 0,
    totalHold: 0,
  };
  let lines = 0;

  if (
    state.histories[0].garbages[0] &&
    state.histories[0].garbages[0].restStep === 0
  ) {
    stats.garbages.push(state.histories[0].garbages[0].amount);
  } else {
    stats.garbages.push(0);
  }

  const storategy = new Pytt2Strategy();
  for (let step = 0; step <= state.step; step++) {
    const history = state.histories[step];

    const prevReplayStep = state.replaySteps[history.replayStep - 1];
    if (!prevReplayStep || prevReplayStep.type !== ReplayStepType.HardDrop) {
      continue;
    }

    if (history.attackTypes.some((type) => isBtb(type))) {
      stats.totalBtb++;
    }

    history.attackTypes.forEach((type) => {
      stats[type]++;

      if (type === AttackType.PerfectClear) {
        return;
      }

      lines += attackTypeToLine[type];
    });

    const attack = storategy.calculateAttackBy(
      history.attackTypes,
      history.ren
    );

    stats.attacks.push(attack);

    if (history.garbages[0] && history.garbages[0].restStep === 0) {
      stats.garbages.push(history.garbages[0].amount);
    } else {
      stats.garbages.push(0);
    }

    if (stats.maxRen < history.ren) {
      stats.maxRen = history.ren;
    }
  }

  stats.lines = lines;
  stats.drops = state.replaySteps
    .slice(0, state.replayStep)
    .filter((replayStep) => replayStep.type === ReplayStepType.HardDrop).length;
  stats.totalHold = state.replaySteps
    .slice(0, state.replayStep)
    .filter((replayStep) => replayStep.type === ReplayStepType.Hold).length;

  return stats;
};

const isBtb = (type: AttackType) => {
  return AttackType.BtbTetris <= type && type <= AttackType.BtbTst;
};

const attackTypeToLine: { [key in AttackType]: number } = {
  [AttackType.Single]: 1,
  [AttackType.Double]: 2,
  [AttackType.Triple]: 3,
  [AttackType.Tetris]: 4,
  [AttackType.Tsm]: 1,
  [AttackType.Tsdm]: 2,
  [AttackType.Tss]: 1,
  [AttackType.Tsd]: 2,
  [AttackType.Tst]: 3,
  [AttackType.BtbTetris]: 4,
  [AttackType.BtbTsm]: 1,
  [AttackType.BtbTsdm]: 2,
  [AttackType.BtbTss]: 1,
  [AttackType.BtbTsd]: 2,
  [AttackType.BtbTst]: 3,
  [AttackType.PerfectClear]: 0, // not used
};
