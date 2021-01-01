import { Direction } from "types/core";

export const Shape = {
  [Direction.Up]: [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ],

  [Direction.Left]: [
    { x: 0, y: -1 },
    { x: 0, y: -2 },
    { x: 0, y: 0 },
    { x: 0, y: 1 },
  ],

  [Direction.Down]: [
    { x: 1, y: -1 },
    { x: 2, y: -1 },
    { x: 0, y: -1 },
    { x: -1, y: -1 },
  ],

  [Direction.Right]: [
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 1, y: -1 },
    { x: 1, y: -2 },
  ],
} as const;

export const Srs = {
  left: {
    [Direction.Up]: [
      { x: -1, y: 0 },
      { x: 2, y: 0 },
      { x: -1, y: 2 },
      { x: 2, y: -1 },
    ],
    [Direction.Left]: [
      { x: 1, y: 0 },
      { x: -2, y: 0 },
      { x: -2, y: -1 },
      { x: 1, y: 2 },
    ],
    [Direction.Down]: [
      { x: 1, y: 0 },
      { x: -2, y: 0 },
      { x: 1, y: -2 },
      { x: -2, y: 1 },
    ],
    [Direction.Right]: [
      { x: 2, y: 0 },
      { x: -1, y: 0 },
      { x: 2, y: 1 },
      { x: -1, y: -2 },
    ],
  },
  right: {
    [Direction.Up]: [
      { x: -2, y: 0 },
      { x: 1, y: 0 },
      { x: -2, y: -1 },
      { x: 1, y: 2 },
    ],
    [Direction.Left]: [
      { x: -2, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: -2 },
      { x: -2, y: 1 },
    ],
    [Direction.Down]: [
      { x: 2, y: 0 },
      { x: -1, y: 0 },
      { x: 2, y: 1 },
      { x: -1, y: -2 },
    ],
    [Direction.Right]: [
      { x: -1, y: 0 },
      { x: 2, y: 0 },
      { x: -1, y: 2 },
      { x: 2, y: -1 },
    ],
  },
} as const;
