import { Direction, Tetromino } from "types/core";
import { SettleStep } from "types/simu";

export const makeSettleStep = (
  dir: Direction,
  x: number,
  y: number,
  type: Tetromino
): SettleStep => {
  return {
    dir,
    pos: {
      x,
      y,
    },
    type,
  };
};
