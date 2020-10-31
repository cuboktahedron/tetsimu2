import {
  FieldCellValue,
  FieldState,
  HoldState,
  MAX_FIELD_HEIGHT,
  Tetromino,
  Vector2,
} from "types/core";
import { FieldHelper } from "utils/tetsimu/fieldHelper";
import NextNotesInterpreter from "utils/tetsimu/nextNotesInterpreter";
import {
  ChangeFieldAction,
  ChangeHoldAction,
  ChangeNextBaseNoAction,
  ChangeNextsPatternAction,
  ChangeToolCellValueAction,
  ChangeZoomAction,
  ClearEditAction,
  EditActionsType,
} from "./types";

export const changeField = (
  prevField: FieldState,
  cellType: FieldCellValue,
  pos: Vector2
): ChangeFieldAction => {
  const fieldHelper = new FieldHelper(prevField);
  if (fieldHelper.putCell(pos, cellType)) {
    return {
      type: EditActionsType.ChangeField,
      payload: {
        field: fieldHelper.state,
        succeeded: true,
      },
    };
  } else {
    return {
      type: EditActionsType.ChangeField,
      payload: {
        succeeded: false,
      },
    };
  }
};

export const changeHold = (
  prevHold: HoldState,
  type: Tetromino
): ChangeHoldAction => {
  if (type === FieldCellValue.NONE) {
    if (prevHold.type === Tetromino.NONE) {
      return {
        type: EditActionsType.ChangeHold,
        payload: {
          succeeded: false,
        },
      };
    } else {
      return {
        type: EditActionsType.ChangeHold,
        payload: {
          hold: {
            canHold: true,
            type,
          },
          succeeded: true,
        },
      };
    }
  } else if (prevHold.type === type) {
    if (prevHold.canHold) {
      return {
        type: EditActionsType.ChangeHold,
        payload: {
          hold: {
            canHold: false,
            type,
          },
          succeeded: true,
        },
      };
    } else {
      return {
        type: EditActionsType.ChangeHold,
        payload: {
          hold: {
            canHold: true,
            type: Tetromino.NONE,
          },
          succeeded: true,
        },
      };
    }
  } else {
    return {
      type: EditActionsType.ChangeHold,
      payload: {
        hold: {
          canHold: true,
          type,
        },
        succeeded: true,
      },
    };
  }
};

export const changeNextBaseNo = (
  nextBaseNo: number
): ChangeNextBaseNoAction => {
  return {
    type: EditActionsType.ChangeNextBaseNo,
    payload: {
      nextBaseNo,
    },
  };
};

export const changeNextsPattern = (
  nextsPattern: string
): ChangeNextsPatternAction => {
  const interpreter = new NextNotesInterpreter();
  const nextNotes = interpreter.interpret(nextsPattern);

  return {
    type: EditActionsType.ChangeNextsPattern,
    payload: {
      nextsPattern,
      nextNotes,
    },
  };
};

export const changeToolCellValue = (
  cellValue: FieldCellValue
): ChangeToolCellValueAction => {
  return {
    type: EditActionsType.ChangeToolCellValue,
    payload: {
      cellValue,
    },
  };
};

export const changeZoom = (zoom: number): ChangeZoomAction => {
  return {
    type: EditActionsType.ChangeZoom,
    payload: {
      zoom,
    },
  };
};

export const clearEdit = (): ClearEditAction => {
  return {
    type: EditActionsType.Clear,
    payload: {
      field: new Array(MAX_FIELD_HEIGHT).fill(
        new Array(10).fill(FieldCellValue.NONE)
      ),
      hold: {
        canHold: true,
        type: Tetromino.NONE,
      },
      nexts: {
        nextNotes: [],
      },
      tools: {
        nextBaseNo: 1,
        nextsPattern: "",
      },
    },
  };
};
