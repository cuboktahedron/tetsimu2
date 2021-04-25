import { TetsimuMode } from "types/core";
import { EditState, initialEditState } from "./EditState";
import { ExplorerState, initialExplorerState } from "./ExplorerState";
import { initialReplayState, ReplayState } from "./ReplayState";
import { initialSidePanelState, SidePanelState } from "./SidePanelState";
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
  sidePanel: SidePanelState;
  simu: SimuState;
};

export const initialRootState: RootState = {
  dialog: {},
  edit: initialEditState,
  explorer: initialExplorerState,
  mode: TetsimuMode.None,
  replay: initialReplayState,
  sidePanel: initialSidePanelState,
  simu: initialSimuState,
};
