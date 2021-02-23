import {
  FieldCellValue,
  FieldState,
  MAX_FIELD_HEIGHT,
  MAX_FIELD_WIDTH,
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

export const deserializeHold = deserliazeHold201;
