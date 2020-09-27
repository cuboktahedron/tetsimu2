import { Direction, Tetromino, ActiveTetromino } from "types/core";

export const makeCurrent = (
  direction: Direction,
  x: number,
  y: number,
  type: Tetromino
): ActiveTetromino => {
  return {
    direction,
    pos: {
      x,
      y,
    },
    type,
  };
};
