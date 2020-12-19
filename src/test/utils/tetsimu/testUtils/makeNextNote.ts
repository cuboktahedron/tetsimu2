import { Tetromino } from "types/core";
import NextNotesInterpreter from "utils/tetsimu/nextNotesInterpreter";

const interpreter = new NextNotesInterpreter();

export const makeNextNotes = (pattern: string) => {
  return interpreter.interpret(pattern);
};

export const makeNextNote = (types: string, take: number) => {
  const candidates = types.split("").map((type) => {
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

  return {
    candidates,
    take,
  };
};
