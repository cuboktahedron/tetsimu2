import { ActiveTetromino, Direction, SpinType, Tetromino } from "types/core";

export const makeCurrent = (
  direction: Direction,
  x: number,
  y: number,
  type: Tetromino,
  spinType?: SpinType
): ActiveTetromino => {
  return {
    direction,
    pos: {
      x,
      y,
    },
    spinType: spinType ?? SpinType.None,
    type,
  };
};
