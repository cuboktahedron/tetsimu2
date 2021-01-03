import {
  Direction,
  ReplayStepDrop,
  ReplayStepHardDrop,
  ReplayStepHold,
  ReplayStepType,
  SpinType,
} from "types/core";

export const makeReplayHoldStep = (): ReplayStepHold => {
  return {
    type: ReplayStepType.Hold,
  };
};

export const makeReplayDropStep = (
  dir: Direction,
  col: number,
  row: number,
  spinType?: SpinType
): ReplayStepDrop => {
  return {
    type: ReplayStepType.Drop,
    dir,
    pos: {
      x: col,
      y: row,
    },
    spinType: spinType ?? SpinType.None,
  };
};

export const makeReplayHardDropStep = (
  attackedCols?: number[]
): ReplayStepHardDrop => {
  if (attackedCols) {
    return {
      type: ReplayStepType.HardDrop,
      attacked: {
        cols: attackedCols,
      },
    };
  } else {
    return {
      type: ReplayStepType.HardDrop,
    };
  }
};
