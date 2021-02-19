import { GarbageInfo } from "stores/SimuState";

export const makeGarbage = (
  restStep: number,
  amount: number,
  offset?: number
): GarbageInfo => {
  return {
    amount,
    restStep,
    offset: offset ?? 0,
  };
};
