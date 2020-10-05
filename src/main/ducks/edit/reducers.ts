import { EditState } from "stores/EditState";
import { EditActions, EditActionsType } from "./types";

const reducer = (state: EditState, action: EditActions): EditState => {
  switch (action.type) {
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
    case EditActionsType.ChangeToolCellValue:
      return {
        ...state,
        tools: {
          ...state.tools,
          selectedCellType: action.payload.cellValue,
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
          nextsPattern: action.payload.tools.nextsPattern,
        },
      };
  }
  return state;
};

export default reducer;
