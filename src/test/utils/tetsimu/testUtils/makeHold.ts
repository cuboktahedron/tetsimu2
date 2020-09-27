import { HoldState, Tetromino } from "types/core";

export const makeHold = (type: Tetromino, canHold: boolean): HoldState => {
  return {
    canHold,
    type,
  };
};
