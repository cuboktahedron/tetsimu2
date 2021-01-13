import { ReplayState } from "stores/ReplayState";
import { ReplayStepType } from "types/core";
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
  const attacks: number[] = [];
  const steps = state.replaySteps.slice(state.step);

  for (let step of steps) {
    if (attacks.length > state.replayInfo.nextNum) {
      break;
    }
    if (step.type === ReplayStepType.HardDrop) {
      attacks.push(step.attacked?.line ?? 0);
    }
  }

  attacks.shift();

  if (attacks.length < state.replayInfo.nextNum) {
    const extras: number[] = new Array(
      state.replayInfo.nextNum - attacks.length
    ).fill(0);

    return attacks.concat(extras);
  } else {
    return attacks;
  }
};

export const getUrgentAttack = (state: ReplayState): number | null => {
  const steps = state.replaySteps.slice(state.step);

  for (let step of steps) {
    if (step.type === ReplayStepType.HardDrop) {
      return step.attacked?.line ?? null;
    }
  }

  return null;
};
