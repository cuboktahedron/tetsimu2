import {
  Direction,
  FieldCellValue,
  FieldState,
  HoldState,
  MAX_FIELD_HEIGHT,
  MAX_FIELD_WIDTH,
  ReplayStep,
  ReplayStepType,
  SpinType,
  Tetromino,
} from "types/core";
import BitReader from "utils/bitReader";
import RadixConverter from "utils/radixConverter";
import { StepType } from "./serializer";

export class DeserializeError extends Error {}

const radixConverter = new RadixConverter(64);

export const deserializeField = (dataString: string): FieldState => {
  const data = base64ToBytesbytes(dataString);
  const reader = new BitReader(data);
  const fieldCellValues: FieldCellValue[] = [];

  while (!reader.eof) {
    const value = reader.read(4);
    if (value <= FieldCellValue.Garbage) {
      fieldCellValues.push(value as FieldCellValue);
    } else {
      break;
    }
  }

  const lackOfCellNums =
    MAX_FIELD_HEIGHT * MAX_FIELD_WIDTH - fieldCellValues.length;
  const allFieldCellValues = new Array(lackOfCellNums)
    .fill(FieldCellValue.None)
    .concat(fieldCellValues);

  const field: FieldState = [...new Array(MAX_FIELD_HEIGHT)]
    .map((_, i) =>
      allFieldCellValues.slice(i * MAX_FIELD_WIDTH, (i + 1) * MAX_FIELD_WIDTH)
    )
    .reverse();

  return field;
};

export const deserializeNexts = (dataString: string): Tetromino[] => {
  const data = base64ToBytesbytes(dataString);
  const reader = new BitReader(data);
  const nexts: Tetromino[] = [];

  while (!reader.eof) {
    const value = reader.read(3);
    if (value !== Tetromino.None) {
      nexts.push(value as Tetromino);
    } else {
      break;
    }
  }

  return nexts;
};

export const deserializeHold = (dataString: string): HoldState => {
  const value = radixConverter.convertToDecimal(dataString);
  const type = ((value & 0b1110) >> 1) as Tetromino;
  const canHold = (value & 1) === 0;

  return {
    type,
    canHold,
  };
};

export const deserializeSteps = (dataString: string): ReplayStep[] => {
  const data = base64ToBytesbytes(dataString);
  const reader = new BitReader(data);
  const steps: ReplayStep[] = [];

  while (!reader.eof) {
    const stepType = reader.read(4) as StepType;

    if (stepType === StepType.EndOfStep) {
      break;
    }

    switch (stepType) {
      case StepType.Drop:
        deserializeDropStep(reader, steps);
        break;
      case StepType.DropWithAttacked:
        throw new DeserializeError("Not supported yet");
      case StepType.Hold:
        deserializeHoldStep(steps);
        break;
    }
  }

  return steps;
};

const deserializeHoldStep = (steps: ReplayStep[]) => {
  steps.push({
    type: ReplayStepType.Hold,
  });
};

const deserializeDropStep = (reader: BitReader, steps: ReplayStep[]) => {
  const posValue = reader.read(8);
  const x = posValue % MAX_FIELD_WIDTH;
  const y = Math.floor(posValue / MAX_FIELD_WIDTH);
  const dir = reader.read(2) as Direction;
  const spinType = reader.read(2) as SpinType;

  steps.push({
    type: ReplayStepType.Drop,
    dir,
    pos: {
      x,
      y,
    },
    spinType,
  });

  steps.push({
    type: ReplayStepType.HardDrop,
  });
};

const base64ToBytesbytes = (data: string): Uint8Array => {
  const base64Data = data
    .replace(/\./g, "+")
    .replace(/\-/g, "/")
    .replace(/_/g, "=");

  const bs = atob(base64Data);
  const len = bs.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = bs.charCodeAt(i);
  }

  return bytes;
};
