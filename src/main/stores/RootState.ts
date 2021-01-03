import { TetsimuMode } from "types/core";
import { EditState, initialEditState } from "./EditState";
import { initialReplayState, ReplayState } from "./ReplayState";
import { initialSimuState, SimuState } from "./SimuState";

export type RootState = {
  dialog: {
    error?: {
      title: string;
      message: string;
    };
  };
  edit: EditState;
  mode: TetsimuMode;
  replay: ReplayState;
  simu: SimuState;
};

export const initialRootState: RootState = {
  dialog: {},
  edit: initialEditState,
  mode: TetsimuMode.None,
  replay: initialReplayState,
  simu: initialSimuState,
};
