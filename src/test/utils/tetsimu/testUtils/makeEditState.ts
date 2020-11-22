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
    isCellValueMultiSelection: boolean;
    nextBaseNo: number;
    nextsPattern: string;
    noOfCycle: number;
    selectedCellValues: FieldCellValue[];
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
        isCellValueMultiSelection: false,
        nextBaseNo: 1,
        nextsPattern: "",
        noOfCycle: 1,
        selectedCellValues: [FieldCellValue.NONE],
      },
      zoom: 0,
    },
    state
  );
};
