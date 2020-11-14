import {
  FieldCellValue,
  FieldState,
  HoldState,
  MAX_FIELD_HEIGHT,
  NextNote,
  Tetromino,
  Vector2
} from "types/core";
import { FieldHelper } from "utils/tetsimu/fieldHelper";
import { tetrominoToType } from "utils/tetsimu/functions";
import NextNotesInterpreter from "utils/tetsimu/nextNotesInterpreter";
import {
  BuildUpFieldAction,
  ChangeFieldAction,
  ChangeHoldAction,
  ChangeNextAction,
  ChangeNextBaseNoAction,
  ChangeNextsPatternAction,
  ChangeNoOfCycleAction,
  ChangeToolCellValueAction,
  ChangeZoomAction,
  ClearEditAction,
  EditActionsType
} from "./types";

export const buildUpField = (
  field: FieldState,
  upNum: number
): BuildUpFieldAction => {
  const fieldHelper = new FieldHelper(field);
  fieldHelper.buildUpLine(upNum);

  return {
    type: EditActionsType.BuildUpField,
    payload: {
      field: fieldHelper.state,
    },
  };
};

export const changeField = (
  prevField: FieldState,
  typeToSet: FieldCellValue,
  pos: Vector2
): ChangeFieldAction => {
  const fieldHelper = new FieldHelper(prevField);
  if (fieldHelper.putCell(pos, typeToSet)) {
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
  typeToSet: Tetromino
): ChangeHoldAction => {
  if (typeToSet === FieldCellValue.NONE) {
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
            type: typeToSet,
          },
          succeeded: true,
        },
      };
    }
  } else if (prevHold.type === typeToSet) {
    if (prevHold.canHold) {
      return {
        type: EditActionsType.ChangeHold,
        payload: {
          hold: {
            canHold: false,
            type: typeToSet,
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
          type: typeToSet,
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

export const changeNext = (
  nextNotes: NextNote[],
  nextNo: number,
  typesToSet: Tetromino[]
): ChangeNextAction => {
  // Decompose next notes to smallest unit
  let nextTypess: Tetromino[][] = nextNotes.flatMap((note) => {
    return new Array(note.take).fill([...note.candidates].sort());
  });
  const nextTypessLen = nextTypess.length;
  if (nextTypessLen < nextNo) {
    nextTypess = nextTypess.concat(new Array(nextNo - nextTypessLen).fill([]));
  }

  // Set new type
  nextTypess[nextNo - 1] = typesToSet.sort();

  // Remove trailing none notes
  do {
    const types = nextTypess.pop();
    if (types === undefined) {
      break;
    }

    if (types.length > 0) {
      nextTypess.push(types);
      break;
    }
  } while (nextTypess.length !== 0);

  // Recompose next notes
  const newNextNotes: NextNote[] = [];
  for (const nextTypes of nextTypess) {
    const prevNote = newNextNotes.pop();
    if (prevNote === undefined) {
      newNextNotes.push({ candidates: nextTypes, take: 1 });
    } else if (prevNote.candidates.length === prevNote.take) {
      newNextNotes.push(prevNote);
      newNextNotes.push({ candidates: nextTypes, take: 1 });
    } else if (prevNote.candidates.toString() === nextTypes.toString()) {
      prevNote.take++;
      newNextNotes.push(prevNote);
    } else {
      newNextNotes.push(prevNote);
      newNextNotes.push({ candidates: nextTypes, take: 1 });
    }
  }

  // Generate text patterns from new next notes
  const nextsPattern = newNextNotes
    .map((note) => {
      if (note.candidates.length === 0) {
        return `q${note.take}`;
      } else if (note.take === 1) {
        if (note.candidates.length === 1) {
          return tetrominoToType(note.candidates[0]);
        } else {
          return `[${note.candidates
            .map((candidate) => tetrominoToType(candidate))
            .join("")}]`;
        }
      } else {
        return `[${note.candidates
          .map((candidate) => tetrominoToType(candidate))
          .join("")}]p${note.take}`;
      }
    })
    .join(" ");

  return {
    type: EditActionsType.ChangeNext,
    payload: {
      nextsPattern,
      nextNotes: newNextNotes,
      succeeded: true,
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

export const changeNoOfCycle = (noOfCycle: number): ChangeNoOfCycleAction => {
  return {
    type: EditActionsType.ChangeNoOfCycle,
    payload: {
      noOfCycle,
    },
  };
};

export const changeToolCellValue = (
  cellValues: FieldCellValue[]
): ChangeToolCellValueAction => {
  return {
    type: EditActionsType.ChangeToolCellValues,
    payload: {
      cellValues,
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
