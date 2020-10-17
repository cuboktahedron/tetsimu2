import {
  Action,
  FieldCellValue,
  FieldState,
  HoldState,
  NextNote,
  Tetromino,
} from "types/core";

export const EditActionsType = {
  ChangeHold: "edit/changeHold",
  ChangeNextsPattern: "edit/changeNextsPattern",
  ChangeToolCellValue: "edit/changeToolCellValue",
  ChangeZoom: "edit/changeZoom",
  Clear: "edit/clear",
} as const;

export type EditActions =
  | ChangeHoldAction
  | ChangeNextsPatternAction
  | ChangeToolCellValueAction
  | ChangeZoomAction
  | ClearEditAction;

export type ChangeHoldAction = {
  type: typeof EditActionsType.ChangeHold;
  payload:
    | {
        hold: {
          canHold: boolean;
          type: Tetromino;
        };
        succeeded: true;
      }
    | {
        succeeded: false;
      };
} & Action;

export type ChangeNextsPatternAction = {
  type: typeof EditActionsType.ChangeNextsPattern;
  payload: {
    nextNotes: NextNote[];
    nextsPattern: string;
  };
} & Action;

export type ChangeToolCellValueAction = {
  type: typeof EditActionsType.ChangeToolCellValue;
  payload: {
    cellValue: FieldCellValue;
  };
} & Action;

export type ChangeZoomAction = {
  type: typeof EditActionsType.ChangeZoom;
  payload: {
    zoom: number;
  };
} & Action;

export type ClearEditAction = {
  type: typeof EditActionsType.Clear;
  payload: {
    field: FieldState;
    hold: HoldState;
    nexts: {
      nextNotes: NextNote[];
    };
    tools: {
      nextsPattern: string;
    };
  };
} & Action;
