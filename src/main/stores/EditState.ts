import {
  FieldCellValue,
  FieldState,
  HoldState,
  MAX_FIELD_HEIGHT,
  MAX_FIELD_WIDTH,
  NextNote,
  Tetromino,
} from "types/core";

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
    isCellValueMultiSelection: boolean;
    nextBaseNo: number;
    nextsPattern: string;
    noOfCycle: number;
    selectedCellValues: FieldCellValue[];
  };
  zoom: number;
};

export const initialEditState: EditState = ((): EditState => {
  const field = ((): FieldState => {
    const field = [];
    for (let y = 0; y < MAX_FIELD_HEIGHT; y++) {
      const row = new Array<Tetromino>(MAX_FIELD_WIDTH);
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
      isCellValueMultiSelection: false,
      nextBaseNo: 1,
      nextsPattern: "[IJLOST]p6",
      noOfCycle: 1,
      selectedCellValues: [FieldCellValue.I],
    },
    zoom: 1,
  };
})();
