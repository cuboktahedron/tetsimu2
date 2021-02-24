import {
  Direction,
  ReplayStepDrop,
  ReplayStepHardDrop,
  ReplayStepHardDrop097,
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

export const makeReplayHardDrop097Step = (
  dir: Direction,
  posX: number
): ReplayStepHardDrop097 => {
  return {
    type: ReplayStepType.HardDrop097,
    dir,
    posX,
  };
};
