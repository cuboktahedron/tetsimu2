import { ReplayState } from "stores/ReplayState";
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
