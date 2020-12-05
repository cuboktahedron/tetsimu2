import { ReplayStepType } from "stores/ReplayState";
import { Direction } from "types/core";
import {
  ReplayStepDrop,
  ReplayStepHardDrop,
  ReplayStepHold
} from "types/replay";

export const makeReplayHoldStep = (): ReplayStepHold => {
  return {
    type: ReplayStepType.Hold,
  };
};

export const makeReplayDropStep = (
  dir: Direction,
  col: number,
  row: number
): ReplayStepDrop => {
  return {
    type: ReplayStepType.Drop,
    dir,
    pos: {
      x: col,
      y: row,
    },
  };
};

export const makeReplayHardDropStep = (
  attackedCols?: number[]
): ReplayStepHardDrop => {
  const attacked = attackedCols
    ? {
        cols: attackedCols,
      }
    : undefined;

  return {
    type: ReplayStepType.HardDrop,
    attacked,
  };
};
