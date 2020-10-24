import {
  FieldCellValue,
  FieldState,
  HoldState,
  MAX_FIELD_HEIGHT,
  MAX_NEXTS_NUM,
  NextNote,
  Tetromino,
} from "types/core";
import NextGenerator from "utils/tetsimu/nextGenerator";
import { RandomNumberGenerator } from "utils/tetsimu/randomNumberGenerator";

export type EditState = {
  env: {
    isTouchDevice: boolean;
  };
  field: FieldState;
  hold: HoldState;
  nexts: {
    nextNotes: NextNote[];
  };
  tools: {
    nextBaseNo: number;
    selectedCellType: FieldCellValue;
    nextsPattern: string;
  };
  zoom: number;
};

export const initialEditState: EditState = ((): EditState => {
  const rng = new RandomNumberGenerator();
  const nexts: Tetromino[] = [];
  const nextGen = new NextGenerator(rng, []);
  const currentGenNext = nextGen.next();
  let lastGenNext = currentGenNext;

  for (let i = 0; i < MAX_NEXTS_NUM; i++) {
    lastGenNext = nextGen.next();
    nexts.push(lastGenNext.type);
  }

  const field = ((): FieldState => {
    const field = [];
    for (let y = 0; y < MAX_FIELD_HEIGHT; y++) {
      const row = new Array<Tetromino>(10);
      row.fill(Tetromino.NONE);
      field.push(row);
    }

    return field;
  })();

  const hold = {
    type: Tetromino.NONE,
    canHold: true,
  };

  const nextsInfo = {
    nextNotes: [],
  };

  const isTouchDevice = "ontouchstart" in window;
  return {
    env: {
      isTouchDevice,
    },
    field,
    hold,
    nexts: nextsInfo,
    tools: {
      nextBaseNo: 1,
      selectedCellType: FieldCellValue.I,
      nextsPattern: "[IJLOST]p6",
    },
    zoom: 1,
  };
})();
