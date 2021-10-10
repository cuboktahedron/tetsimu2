import { EditState } from "stores/EditState";
import { ExplorerRootFolder, ExplorerState } from "stores/ExplorerState";
import { ReplayState } from "stores/ReplayState";
import { SidePanelState } from "stores/SidePanelState";
import { GarbageInfo, SimuState } from "stores/SimuState";
import {
  Action,
  ActiveTetromino,
  AttackType,
  BtbState,
  FieldState,
  HoldState,
  NextNote,
  ReplayStep,
  Tetromino,
  TetsimuMode
} from "types/core";
import { ReplayConfig, ReplayStateHistory } from "types/replay";
import { SimuConfig, SimuRetryState } from "types/simu";
import { SimulatorStrategyType } from "utils/SimulationStrategyBase";

export const RootActionsType = {
  ChangeTetsimuMode: "root/changeTetsimuMode",
  ClearError: "root/clearError",
  EditToSimuMode: "root/editToSimuMode",
  Error: "root/error",
  InitializeApp: "root/initializeApp",
  LoadConfigs: "root/loadConfigs",
  LoadExplorer: "root/loadExplorer",
  ReplayToSimuMode: "root/replayToSimuMode",
  SimuToEditMode: "root/simuToEditMode",
  SimuToReplayMode: "root/simuToReplayMode",
} as const;

export type RootActions =
  | ChangeTetsimuModeAction
  | ClearErrorAction
  | EditToSimuAction
  | ErrorAction
  | InitializeAppAction
  | LoadConfigsAction
  | LoadExplorerAction
  | ReplayToSimuAction
  | SimuToEditAction
  | SimuToReplayAction;

export type ChangeTetsimuModeAction = {
  type: typeof RootActionsType.ChangeTetsimuMode;
  payload: {
    mode: TetsimuMode;
  };
} & Action;

export type ClearErrorAction = {
  type: typeof RootActionsType.ClearError;
  payload: {};
} & Action;

export type EditToSimuAction = {
  type: typeof RootActionsType.EditToSimuMode;
  payload: {
    field: FieldState;
    garbages: GarbageInfo[];
    hold: HoldState;
    current: ActiveTetromino;
    lastRoseUpColumn: number;
    nexts: {
      settled: Tetromino[];
      unsettled: NextNote[];
      bag: NextNote;
    };
    retryState: SimuRetryState;
    seed: number;
  };
} & Action;

export type ErrorAction = {
  type: typeof RootActionsType.Error;
  payload: {
    title: string;
    message: string;
  };
} & Action;

export type InitializeAppAction = {
  type: typeof RootActionsType.InitializeApp;
  payload: {
    edit: EditState;
    explorer: ExplorerState;
    mode: TetsimuMode;
    replay: ReplayState;
    sidePanel: SidePanelState;
    simu: SimuState;
  };
} & Action;

export type LoadConfigsAction = {
  type: typeof RootActionsType.LoadConfigs;
  payload: {
    replay: ReplayConfig;
    simu: SimuConfig;
  };
} & Action;

export type LoadExplorerAction = {
  type: typeof RootActionsType.LoadExplorer;
  payload: {
    rootFolder: ExplorerRootFolder;
  };
} & Action;

export type ReplayToSimuAction = {
  type: typeof RootActionsType.ReplayToSimuMode;
  payload: {
    attackTypes: AttackType[];
    btbState: BtbState;
    current: ActiveTetromino;
    field: FieldState;
    garbages: GarbageInfo[];
    hold: HoldState;
    isDead: boolean;
    lastRoseUpColumn: number;
    nexts: {
      bag: NextNote;
      nextNum: number;
      settled: Tetromino[];
      unsettled: NextNote[];
    };
    offsetRange: number;
    ren: number;
    retryState: SimuRetryState;
    seed: number;
    strategy: SimulatorStrategyType;
  };
} & Action;

export type SimuToEditAction = {
  type: typeof RootActionsType.SimuToEditMode;
  payload: {
    field: FieldState;
    hold: HoldState;
    nexts: {
      nextNotes: NextNote[];
    };
    tools: {
      nextsPattern: string;
      noOfCycle: number;
    };
  };
} & Action;

export type SimuToReplayAction = {
  type: typeof RootActionsType.SimuToReplayMode;
  payload: {
    attackTypes: AttackType[];
    auto: {
      playing: boolean;
    };
    btbState: BtbState;
    current: ActiveTetromino;
    field: FieldState;
    garbages: GarbageInfo[];
    histories: ReplayStateHistory[];
    hold: HoldState;
    isDead: boolean;
    nexts: Tetromino[];
    noOfCycle: number;
    replayInfo: {
      nextNum: number;
      offsetRange: number;
    };
    replaySteps: ReplayStep[];
    ren: number;
    step: number;
    strategy: SimulatorStrategyType;
  };
} & Action;
