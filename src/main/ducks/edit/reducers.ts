import { EditState } from "stores/EditState";
import { Action } from "types/core";
import { EditActions, EditActionsType } from "./types";

const reducer = (state: EditState, anyAction: Action): EditState => {
  const action = anyAction as EditActions;

  switch (action.type) {
    case EditActionsType.BeginCellValueMultiSelection:
      return {
        ...state,
        tools: {
          ...state.tools,
          isCellValueMultiSelection: true,
        },
      };
    case EditActionsType.BuildUpField:
      return {
        ...state,
        field: action.payload.field,
      };
    case EditActionsType.ChangeField:
      if (!action.payload.succeeded) {
        return state;
      }

      return {
        ...state,
        field: action.payload.field,
      };
    case EditActionsType.ChangeHold:
      if (!action.payload.succeeded) {
        return state;
      }

      return {
        ...state,
        hold: action.payload.hold,
      };
    case EditActionsType.ChangeNext:
      if (!action.payload.succeeded) {
        return state;
      }

      return {
        ...state,
        nexts: {
          nextNotes: action.payload.nextNotes,
        },
        tools: {
          ...state.tools,
          nextsPattern: action.payload.nextsPattern,
        },
      };
    case EditActionsType.ChangeNextBaseNo:
      return {
        ...state,
        tools: {
          ...state.tools,
          nextBaseNo: action.payload.nextBaseNo,
        },
      };
    case EditActionsType.ChangeNextsPattern:
      return {
        ...state,
        nexts: {
          nextNotes: action.payload.nextNotes,
        },
        tools: {
          ...state.tools,
          nextsPattern: action.payload.nextsPattern,
        },
      };
    case EditActionsType.ChangeNoOfCycle:
      return {
        ...state,
        tools: {
          ...state.tools,
          noOfCycle: action.payload.noOfCycle,
        },
      };
    case EditActionsType.ChangeToolCellValues:
      return {
        ...state,
        tools: {
          ...state.tools,
          selectedCellValues: action.payload.cellValues,
        },
      };
    case EditActionsType.ChangeZoom:
      return {
        ...state,
        zoom: action.payload.zoom,
      };
    case EditActionsType.Clear:
      return {
        ...state,
        field: action.payload.field,
        hold: action.payload.hold,
        nexts: {
          nextNotes: action.payload.nexts.nextNotes,
        },
        tools: {
          ...state.tools,
          nextBaseNo: action.payload.tools.nextBaseNo,
          nextsPattern: action.payload.tools.nextsPattern,
        },
      };
    case EditActionsType.EndCellValueMultiSelection:
      return {
        ...state,
        tools: {
          ...state.tools,
          isCellValueMultiSelection: false,
          selectedCellValues: [state.tools.selectedCellValues[0]],
        },
      };
    case EditActionsType.FlipField:
      return {
        ...state,
        field: action.payload.field,
      };
    case EditActionsType.SlideField:
      return {
        ...state,
        field: action.payload.field,
      };
  }
  return state;
};

export default reducer;
