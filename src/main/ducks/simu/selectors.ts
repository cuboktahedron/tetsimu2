import { SimuState } from "stores/SimuState";
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
