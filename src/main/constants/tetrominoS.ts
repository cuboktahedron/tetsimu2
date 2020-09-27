import { Direction } from "types/core";

export const Shape = {
  [Direction.UP]: [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ],

  [Direction.LEFT]: [
    { x: 0, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
  ],

  [Direction.DOWN]: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: -1 },
  ],

  [Direction.RIGHT]: [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 1, y: -1 },
  ],
} as const;
