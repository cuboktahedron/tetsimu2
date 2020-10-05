import { FieldCellValue, MAX_FIELD_HEIGHT, Tetromino } from "types/core";
import NextNotesParser from "utils/tetsimu/nextNoteParser";
import {
  ChangeNextsPatternAction,
  ChangeToolCellValueAction,
  ChangeZoomAction,
  ClearEditAction,
  EditActionsType,
} from "./types";

export const changeNextsPattern = (
  nextsPattern: string
): ChangeNextsPatternAction => {
  const parser = new NextNotesParser();
  const nextNotes = parser.parse(nextsPattern);

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
        nextsPattern: "",
      }
    },
  };
};
