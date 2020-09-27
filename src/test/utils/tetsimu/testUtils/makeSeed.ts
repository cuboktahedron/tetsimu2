import { RandomNumberGenerator } from "utils/tetsimu/randomNumberGenerator";

export const makeSeed = (seed?: number): number => {
  if (seed !== undefined) {
    return seed;
  }

  return new RandomNumberGenerator().seed;
};
