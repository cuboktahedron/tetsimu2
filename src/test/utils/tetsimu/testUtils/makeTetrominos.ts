import { Tetromino } from "types/core";

export const makeTetrominos = (types: string): Tetromino[] => {
  const nextTypes = types.split("").map((type) => {
    switch (type) {
      case "I":
        return Tetromino.I;
      case "J":
        return Tetromino.J;
      case "L":
        return Tetromino.L;
      case "O":
        return Tetromino.O;
      case "S":
        return Tetromino.S;
      case "T":
        return Tetromino.T;
      case "Z":
        return Tetromino.Z;
      default:
        throw new Error(`Specified invalid letter of field tetromino(${type})`);
    }
  });

  return nextTypes;
};
