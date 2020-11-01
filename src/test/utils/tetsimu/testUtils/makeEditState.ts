import merge from "deepmerge";
import { EditState } from "stores/EditState";
import {
  FieldCellValue,
  FieldState,
  HoldState,
  NextNote,
  Tetromino,
} from "types/core";

export const makeEditState = (state: {
  env?: {
    isTouchDevice: boolean;
  };
  field?: FieldState;
  hold?: HoldState;
  nexts?: {
    nextNotes: NextNote[];
  };
  tools?: {
    nextBaseNo: number;
    selectedCellValues: FieldCellValue[];
    nextsPattern: string;
  };
  zoom?: number;
}): EditState => {
  return merge(
    {
      env: {
        isTouchDevice: false,
      },
      field: [],
      hold: {
        canHold: false,
        type: Tetromino.NONE,
      },
      nexts: {
        nextNotes: [],
      },
      tools: {
        nextBaseNo: 1,
        selectedCellValues: [FieldCellValue.NONE],
        nextsPattern: "",
      },
      zoom: 0,
    },
    state
  );
};
