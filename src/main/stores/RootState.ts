import { TetsimuMode } from "types/core";
import { EditState, initialEditState } from "./EditState";
import { ExplorerState, initialExplorerState } from "./ExplorerState";
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
  explorer: ExplorerState;
  mode: TetsimuMode;
  replay: ReplayState;
  simu: SimuState;
};

export const initialRootState: RootState = {
  dialog: {},
  edit: initialEditState,
  explorer: initialExplorerState,
  mode: TetsimuMode.None,
  replay: initialReplayState,
  simu: initialSimuState,
};
