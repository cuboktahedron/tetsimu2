import { Direction } from "types/core";

export const Shape = {
  [Direction.Up]: [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
  ],

  [Direction.Left]: [
    { x: 0, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 1 },
  ],

  [Direction.Down]: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: -1, y: -1 },
  ],

  [Direction.Right]: [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: -1 },
  ],
} as const;
