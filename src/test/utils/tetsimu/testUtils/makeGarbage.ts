import { GarbageInfo } from "stores/SimuState";

export const makeGarbage = (restStep: number, amount: number): GarbageInfo => {
  return {
    restStep,
    amount,
  };
};
