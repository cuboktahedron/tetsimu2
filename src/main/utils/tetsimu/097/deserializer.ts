import {
  Direction,
  FieldCellValue,
  FieldState,
  MAX_FIELD_HEIGHT,
  MAX_FIELD_WIDTH,
  ReplayStep,
  ReplayStepType,
  SpinType,
  Tetromino,
} from "types/core";
import RadixConverter from "utils/radixConverter";
import { deserializeHold as deserliazeHold201 } from "../deserializer";

const radixConverter = new RadixConverter(64);

export const deserializeField = (dataString: string): FieldState => {
  dataString = dataString || "";

  const lackOfCharacterNum = MAX_FIELD_HEIGHT * 7 - dataString.length;
  for (let i = 0; i < lackOfCharacterNum; i++) {
    dataString = "0" + dataString;
  }

  const types: FieldState = [];
  for (let i = MAX_FIELD_HEIGHT - 1; i >= 0; i--) {
    types[i] = [];

    let lineValue = radixConverter.convertToDecimal(dataString.substring(0, 7));
    dataString = dataString.substring(7);

    for (let j = MAX_FIELD_WIDTH - 1; j >= 0; j--) {
      let modValue = lineValue % (1 << 4);
      if (modValue === 9) {
        // This is uncompatible point between 0.97 and 2.x
        types[i][j] = FieldCellValue.Garbage;
      } else {
        types[i][j] = modValue as FieldCellValue;
      }
      lineValue = (lineValue - modValue) / (1 << 4);
    }
  }

  return types;
};

export const deserializeNexts = (dataString: string): Tetromino[] => {
  const types: Tetromino[] = [];

  for (let i = 0, len = dataString.length; i < len; i++) {
    let value = radixConverter.convertToDecimal(dataString[i]);
    types.push((value >> 3) as Tetromino);
    types.push((value & 0b111) as Tetromino);
  }

  if (types.length > 0 && types[types.length - 1] === Tetromino.None) {
    types.pop();
  }

  return types;
};

const StepType097 = {
  None: "0",
  HardDrop: "1",
  SoftDrop: "2",
  Hold: "3",
} as const;

const shiftBit = (value: number, shiftNum: number): number => {
  if (shiftNum >= 0) {
    while (shiftNum > 0) {
      value *= 2;
      shiftNum--;
    }
  } else {
    while (shiftNum < 0) {
      value /= 2;
      shiftNum++;
    }
  }

  return value;
};

export const deserializeSteps = (dataString: string): ReplayStep[] => {
  const steps: ReplayStep[] = [];

  while (dataString.length > 0) {
    let value = radixConverter.convertToDecimal(dataString.substring(0, 9));
    dataString = dataString.substring(9);
    let restBit = 52;

    while (restBit > 0) {
      const stepType = String(shiftBit(value, -(restBit - 4)) & 0xf);
      if (stepType === StepType097.Hold) {
        deserialize4HoldStep(steps);
        restBit -= 4;
      } else if (stepType === StepType097.HardDrop) {
        deserialize4HardDrop(value, restBit, steps);
        restBit -= 10;
      } else if (stepType === StepType097.SoftDrop) {
        deserialize4SoftDrop(value, restBit, steps);
        restBit -= 15;
      } else if (stepType === StepType097.None) {
        break;
      }
    }
  }

  return steps;
};

const deserialize4HoldStep = (steps: ReplayStep[]) => {
  steps.push({
    type: ReplayStepType.Hold,
  });
};

const deserialize4HardDrop = (
  value: number,
  restBit: number,
  steps: ReplayStep[]
) => {
  var shiftedValue = shiftBit(value, -(restBit - 10)) & 0x3ff;
  const posX = ((shiftedValue >> 2) & 0xf) - 1;
  const dir = (shiftedValue & 0b0011) as Direction;

  steps.push({
    type: ReplayStepType.HardDrop097,
    posX,
    dir,
  });
};

const deserialize4SoftDrop = (
  value: number,
  restBit: number,
  steps: ReplayStep[]
) => {
  var shiftedValue = shiftBit(value, -(restBit - 15)) & 0x7ff;
  const pos = ((shiftedValue >> 3) & 0xff) - 1;
  const dir = ((shiftedValue >> 1) & 0b11) as Direction;

  // This is uncompatible point between 0.97 and 2.x
  const spinType = (shiftedValue & 0b1) === 1 ? SpinType.Spin : SpinType.None;

  steps.push({
    type: ReplayStepType.Drop,
    dir,
    pos: {
      x: pos % MAX_FIELD_WIDTH,
      y: Math.floor(pos / MAX_FIELD_WIDTH),
    },
    spinType,
  });
  steps.push({
    type: ReplayStepType.HardDrop,
  });
};

export const deserializeHold = deserliazeHold201;
