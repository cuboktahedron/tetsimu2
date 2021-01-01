import { Shape as TetrominoShapeI, Srs as TetrominoSrsI } from "./tetrominoI";
import { Shape as TetrominoShapeJ } from "./tetrominoJ";
import { Shape as TetrominoShapeL } from "./tetrominoL";
import { Shape as TetrominoShapeO } from "./tetrominoO";
import { Shape as TetrominoShapeS } from "./tetrominoS";
import { Shape as TetrominoShapeT } from "./tetrominoT";
import { Shape as TetrominoShapeZ } from "./tetrominoZ";
import { Tetromino, Direction } from "types/core";

export const TetrominoShape = {
  [Tetromino.I]: TetrominoShapeI,
  [Tetromino.J]: TetrominoShapeJ,
  [Tetromino.L]: TetrominoShapeL,
  [Tetromino.O]: TetrominoShapeO,
  [Tetromino.S]: TetrominoShapeS,
  [Tetromino.T]: TetrominoShapeT,
  [Tetromino.Z]: TetrominoShapeZ,
} as const;

const StandardSrs = {
  left: {
    [Direction.Up]: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: -2 },
      { x: 1, y: -2 },
    ],
    [Direction.Left]: [
      { x: -1, y: 0 },
      { x: -1, y: -1 },
      { x: 0, y: 2 },
      { x: -1, y: 2 },
    ],
    [Direction.Down]: [
      { x: -1, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: -2 },
      { x: -1, y: -2 },
    ],
    [Direction.Right]: [
      { x: 1, y: 0 },
      { x: 1, y: -1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
  },
  right: {
    [Direction.Up]: [
      { x: -1, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: -2 },
      { x: -1, y: -2 },
    ],
    [Direction.Left]: [
      { x: -1, y: 0 },
      { x: -1, y: -1 },
      { x: 0, y: 2 },
      { x: -1, y: 2 },
    ],
    [Direction.Down]: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: -2 },
      { x: 1, y: -2 },
    ],
    [Direction.Right]: [
      { x: 1, y: 0 },
      { x: 1, y: -1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
  },
} as const;

export const TetrominoSrss = {
  [Tetromino.I]: TetrominoSrsI,
  [Tetromino.J]: StandardSrs,
  [Tetromino.L]: StandardSrs,
  [Tetromino.O]: StandardSrs,
  [Tetromino.S]: StandardSrs,
  [Tetromino.T]: StandardSrs,
  [Tetromino.Z]: StandardSrs,
} as const;
