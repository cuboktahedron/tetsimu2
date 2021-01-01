import {
  FieldState,
  HoldState,
  MAX_FIELD_HEIGHT,
  MAX_FIELD_WIDTH,
  ReplayStep,
  ReplayStepDrop,
  ReplayStepHardDrop,
  ReplayStepHold,
  ReplayStepType,
  Tetromino,
} from "types/core";
import BitWriter from "utils/bitWriter";
import RadixConverter from "utils/radixConverter";

export class SerializeError extends Error {}

export const StepType = {
  Drop: 0,
  Hold: 1,
  DropWithAttacked: 2,
  EndOfStep: 15,
} as const;

export type StepType = typeof StepType[keyof typeof StepType];

const radixConverter = new RadixConverter(64);

export const serializeField = (field: FieldState): string => {
  const writer = new BitWriter();
  let isHeadFound = false;

  for (let row = MAX_FIELD_HEIGHT - 1; row >= 0; row--) {
    for (let col = 0; col < MAX_FIELD_WIDTH; col++) {
      if (isHeadFound) {
        writer.write(4, field[row][col]);
      } else if (field[row][col] !== 0) {
        writer.write(4, field[row][col]);
        isHeadFound = true;
      }
    }
  }

  const remainder = writer.length % 8;
  writer.write(remainder, (1 << remainder) - 1);
  return bytesToBase64(writer.data);
};

export const serializeNexts = (nexts: Tetromino[]): string => {
  const writer = new BitWriter();

  for (let i = 0; i < nexts.length; i++) {
    writer.write(3, nexts[i]);
  }

  const length = writer.length;
  if (length % 8 !== 0) {
    writer.write(3, 0);
  }

  return bytesToBase64(writer.data);
};

export const serializeHold = (hold: HoldState): string => {
  let value = hold.type << 1;
  value += hold.canHold ? 0 : 1;

  return radixConverter.convertFromDecimal(value);
};

export const serializeSteps = (steps: ReplayStep[]) => {
  const writer = new BitWriter();
  if (steps.length === 0) {
    return "";
  }

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    switch (step.type) {
      case ReplayStepType.Hold:
        serializeHoldStep(step, writer);
        break;
      case ReplayStepType.Drop:
        serializeDropStep(step, steps[i + 1] as ReplayStepHardDrop, writer);
        i++;
        break;
      case ReplayStepType.HardDrop:
        throw new SerializeError("DropStep must be before HardDropStep");
    }
  }

  writer.write(4, StepType.EndOfStep);
  return bytesToBase64(writer.data);
};

const serializeHoldStep = (_step: ReplayStepHold, writer: BitWriter) => {
  writer.write(4, StepType.Hold);
};

const serializeDropStep = (
  step: ReplayStepDrop,
  hardDropStep: ReplayStepHardDrop,
  writer: BitWriter
) => {
  if (hardDropStep.attacked) {
    throw new SerializeError("Not supported yet");
  } else {
    writer.write(4, StepType.Drop);
  }

  // drop point
  writer.write(8, step.pos.y * MAX_FIELD_WIDTH + step.pos.x);
  writer.write(2, step.dir);

  // spin type
  writer.write(2, step.spinType);
};

const bytesToBase64 = (data: Uint8Array): string => {
  return btoa(String.fromCharCode(...data))
    .replace(/\+/g, ".")
    .replace(/\//g, "-")
    .replace(/=/g, "_");
};
