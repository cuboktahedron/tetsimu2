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

export const makeReplayHardDropStep = (attacked?: {
  cols: number[];
  line: number;
}): ReplayStepHardDrop => {
  if (attacked) {
    return {
      type: ReplayStepType.HardDrop,
      attacked,
    };
  } else {
    return {
      type: ReplayStepType.HardDrop,
    };
  }
};
