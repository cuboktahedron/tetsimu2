import { FieldState, FieldCellValue, MAX_FIELD_HEIGHT } from "types/core";

const emptyField = new Array(MAX_FIELD_HEIGHT).fill("NNNNNNNNNN");

export const makeField = (...field: string[]): FieldState => {
  const fullField: string[] = emptyField.concat(field).slice(field.length).reverse();

  return fullField.map((row) => {
    return row.split("").map((col) => {
      switch (col) {
        case "I":
          return FieldCellValue.I;
        case "J":
          return FieldCellValue.J;
        case "L":
          return FieldCellValue.L;
        case "O":
          return FieldCellValue.O;
        case "S":
          return FieldCellValue.S;
        case "T":
          return FieldCellValue.T;
        case "Z":
          return FieldCellValue.Z;
        case "G":
          return FieldCellValue.GARBAGE;
        case "N":
          return FieldCellValue.NONE;
        case "W":
          return FieldCellValue.WALL;
        default:
          throw new Error(`Specified invalid letter of field cell(${col})`);
      }
    });
  });
};
