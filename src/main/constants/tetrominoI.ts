import { Direction } from "types/core";

export const Shape = {
  [Direction.UP]: [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ],

  [Direction.LEFT]: [
    { x: 0, y: -1 },
    { x: 0, y: -2 },
    { x: 0, y: 0 },
    { x: 0, y: 1 },
  ],

  [Direction.DOWN]: [
    { x: 1, y: -1 },
    { x: 2, y: -1 },
    { x: 0, y: -1 },
    { x: -1, y: -1 },
  ],

  [Direction.RIGHT]: [
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 1, y: -1 },
    { x: 1, y: -2 },
  ],
} as const;

export const Srs = {
  left: {
    [Direction.UP]: [
      { x: -1, y: 0 },
      { x: 2, y: 0 },
      { x: -1, y: 2 },
      { x: 2, y: -1 },
    ],
    [Direction.LEFT]: [
      { x: 1, y: 0 },
      { x: -2, y: 0 },
      { x: -2, y: -1 },
      { x: 1, y: 2 },
    ],
    [Direction.DOWN]: [
      { x: 1, y: 0 },
      { x: -2, y: 0 },
      { x: 1, y: -2 },
      { x: -2, y: 1 },
    ],
    [Direction.RIGHT]: [
      { x: 2, y: 0 },
      { x: -1, y: 0 },
      { x: 2, y: 1 },
      { x: -1, y: -2 },
    ],
  },
  right: {
    [Direction.UP]: [
      { x: -2, y: 0 },
      { x: 1, y: 0 },
      { x: -2, y: -1 },
      { x: 1, y: 2 },
    ],
    [Direction.LEFT]: [
      { x: -2, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: -2 },
      { x: -2, y: 1 },
    ],
    [Direction.DOWN]: [
      { x: 2, y: 0 },
      { x: -1, y: 0 },
      { x: 2, y: 1 },
      { x: -1, y: -2 },
    ],
    [Direction.RIGHT]: [
      { x: -1, y: 0 },
      { x: 2, y: 0 },
      { x: -1, y: 2 },
      { x: 2, y: -1 },
    ],
  },
} as const;
