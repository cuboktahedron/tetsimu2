import { TetsimuMode } from "types/core";
import { ChangeTetsimuModeAction, RootActionsType } from "./types";

export const changeTetsimuMode = (
  mode: TetsimuMode
): ChangeTetsimuModeAction => {
  return {
    type: RootActionsType.ChangeTetsimuMode,
    payload: {
      mode,
    },
  };
};
