import { NextNote, Tetromino } from "types/core";

export const tetrominoToType = (tetromino: Tetromino): string => {
  switch (tetromino) {
    case Tetromino.I:
      return "I";
    case Tetromino.J:
      return "J";
    case Tetromino.O:
      return "O";
    case Tetromino.L:
      return "L";
    case Tetromino.S:
      return "S";
    case Tetromino.T:
      return "T";
    case Tetromino.Z:
      return "Z";
    case Tetromino.None:
      return "";
  }
};

export const makeFullNextNote = (): NextNote => {
  return {
    candidates: [
      Tetromino.I,
      Tetromino.J,
      Tetromino.L,
      Tetromino.O,
      Tetromino.S,
      Tetromino.T,
      Tetromino.Z,
    ],
    take: 7,
  };
};
