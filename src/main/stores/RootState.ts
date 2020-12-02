import { TetsimuMode } from "types/core";
import { EditState, initialEditState } from "./EditState";
import { initialReplayState, ReplayState } from "./ReplayState";
import { initialSimuState, SimuState } from "./SimuState";

export type RootState = {
  edit: EditState;
  mode: TetsimuMode;
  replay: ReplayState;
  simu: SimuState;
};

export const initialRootState: RootState = {
  edit: initialEditState,
  mode: TetsimuMode.Replay,
  replay: initialReplayState,
  simu: initialSimuState,
};
