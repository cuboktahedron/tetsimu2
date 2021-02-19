import { ReplayState } from "stores/ReplayState";
import {
  AttackType,
  PlayStats,
  ReplayStep,
  ReplayStepHardDrop,
  ReplayStepType,
} from "types/core";
import { Pytt2Strategy } from "utils/tetsimu/putt2Strategy";
import { ReplayConductor } from "utils/tetsimu/replay/replayConductor";

export const getReplayConductor = (state: ReplayState) => {
  return new ReplayConductor(state);
};

export const canForward = (state: ReplayState) => {
  return state.step < state.replaySteps.length;
};

export const canBackward = (state: ReplayState) => {
  return state.step > 0;
};

export const getNextAttacks = (state: ReplayState): number[] => {
  const attacks = state.garbages.flatMap((garbage) => {
    if (garbage.restStep === 0) {
      return [];
  }

    const attacks: number[] = new Array(garbage.restStep - 1).fill(0);
    attacks.push(garbage.amount - garbage.offset);
    return attacks;
  });

  if (attacks.length < state.replayInfo.nextNum) {
    const extras: number[] = new Array(
      state.replayInfo.nextNum - attacks.length
    ).fill(0);

    return attacks.concat(extras);
  } else {
    return attacks.slice(0, state.replayInfo.nextNum);
  }
};

export const getUrgentAttack = (state: ReplayState): number | null => {
  const garbage = state.garbages[0];
  if (garbage && garbage.restStep === 0 && garbage.amount > 0) {
    return garbage.amount - garbage.offset;
  } else {
    return null;
    }
};

export const getStats = (state: ReplayState): PlayStats => {
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

  const garbage = getGarbage(0, state.replaySteps);
  stats.garbages.push(garbage);

  const storategy = new Pytt2Strategy();
  for (let step = 0; step <= state.step; step++) {
    const history = state.histories[step];

    const prevReplayStep = state.replaySteps[step - 1];
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

    const garbage = getGarbage(step, state.replaySteps);
    stats.garbages.push(garbage);

    if (stats.maxRen < history.ren) {
      stats.maxRen = history.ren;
    }
  }

  stats.lines = lines;
  stats.drops = state.replaySteps
    .slice(0, state.step)
    .filter((replayStep) => replayStep.type === ReplayStepType.HardDrop).length;
  stats.totalHold = state.replaySteps
    .slice(0, state.step)
    .filter((replayStep) => replayStep.type === ReplayStepType.Hold).length;

  return stats;
};

const isBtb = (type: AttackType) => {
  return AttackType.BtbTetris <= type && type <= AttackType.BtbTst;
};

const getGarbage = (step: number, replaySteps: ReplayStep[]): number => {
  let nextHardDropStep: ReplayStepHardDrop | null = null;
  for (let i = step; i < replaySteps.length; i++) {
    if (replaySteps[i] && replaySteps[i].type === ReplayStepType.HardDrop) {
      nextHardDropStep = replaySteps[i] as ReplayStepHardDrop;
      break;
    }
  }

  if (
    nextHardDropStep &&
    nextHardDropStep.attacked &&
    nextHardDropStep.attacked.line > 0
  ) {
    return nextHardDropStep.attacked.line;
  } else {
    return 0;
  }
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
