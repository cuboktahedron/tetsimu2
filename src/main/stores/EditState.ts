import {
  FieldCellValue,
  FieldState,
  HoldState,
  NextNote
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
    selectedCellType: FieldCellValue;
    nextsPattern: string;
  };
  zoom: number;
};
