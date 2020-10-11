import { TetsimuMode } from "types/core";
import { EditState, initialEditState } from "./EditState";
import { initialSimuState, SimuState } from "./SimuState";

export type RootState = {
  mode: TetsimuMode;
  simu: SimuState;
  edit: EditState;
};

export const initialRootState: RootState = {
  mode: TetsimuMode.Simu,
  simu: initialSimuState,
  edit: initialEditState,
};
