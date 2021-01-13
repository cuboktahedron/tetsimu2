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

export const getNextAttacks = (state: SimuState): number[] => {
  const attacks = state.garbages.flatMap((garbage) => {
    if (garbage.restStep === 0) {
      return [];
    }

    const attacks: number[] = new Array(garbage.restStep - 1).fill(0);
    attacks.push(garbage.amount);
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
    return garbage.amount;
  } else {
    return null;
  }
};
