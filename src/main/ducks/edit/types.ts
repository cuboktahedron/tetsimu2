import {
  Action,
  FieldCellValue,
  FieldState,
  HoldState,
  NextNote,
  Tetromino,
} from "types/core";

export const EditActionsType = {
  BuildUpField: "edit/buildUpField",
  ChangeField: "edit/changeField",
  ChangeHold: "edit/changeHold",
  ChangeNext: "edit/changeNext",
  ChangeNextBaseNo: "edit/changeNextBaseNo",
  ChangeNextsPattern: "edit/changeNextsPattern",
  ChangeNoOfCycle: "edit/changeNoOfCycle",
  ChangeToolCellValues: "edit/changeToolCellValues",
  ChangeZoom: "edit/changeZoom",
  Clear: "edit/clear",
} as const;

export type EditActions =
  | ChangeFieldAction
  | ChangeHoldAction
  | ChangeNextAction
  | ChangeNextBaseNoAction
  | ChangeNextsPatternAction
  | ChangeNoOfCycleAction
  | ChangeToolCellValueAction
  | ChangeZoomAction
  | ClearEditAction
  | BuildUpFieldAction;

export type ChangeFieldAction = {
  type: typeof EditActionsType.ChangeField;
  payload:
    | {
        field: FieldState;
        succeeded: true;
      }
    | {
        succeeded: false;
      };
} & Action;

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

export type ChangeNextAction = {
  type: typeof EditActionsType.ChangeNext;
  payload:
    | {
        nextNotes: NextNote[];
        nextsPattern: string;
        succeeded: true;
      }
    | {
        succeeded: false;
      };
} & Action;

export type ChangeNextBaseNoAction = {
  type: typeof EditActionsType.ChangeNextBaseNo;
  payload: {
    nextBaseNo: number;
  };
} & Action;

export type ChangeNextsPatternAction = {
  type: typeof EditActionsType.ChangeNextsPattern;
  payload: {
    nextNotes: NextNote[];
    nextsPattern: string;
  };
} & Action;

export type ChangeNoOfCycleAction = {
  type: typeof EditActionsType.ChangeNoOfCycle;
  payload: {
    noOfCycle: number;
  };
} & Action;


export type ChangeToolCellValueAction = {
  type: typeof EditActionsType.ChangeToolCellValues;
  payload: {
    cellValues: FieldCellValue[];
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
      nextBaseNo: number;
      nextsPattern: string;
    };
  };
} & Action;

export type BuildUpFieldAction = {
  type: typeof EditActionsType.BuildUpField;
  payload: {
    field: FieldState;
  };
} & Action;
