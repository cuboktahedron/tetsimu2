import { EditState } from "stores/EditState";
import { ReplayState } from "stores/ReplayState";
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
  TetsimuMode,
} from "types/core";
import { ReplayStateHistory } from "types/replay";
import { SimuRetryState } from "types/simu";

export const RootActionsType = {
  ChangeTetsimuMode: "root/changeTetsimuMode",
  ClearError: "root/clearError",
  EditToSimuMode: "root/editToSimuMode",
  Error: "root/error",
  InitializeApp: "root/initializeApp",
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
    mode: TetsimuMode;
    replay: ReplayState;
    simu: SimuState;
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
    ren: number;
    retryState: SimuRetryState;
    seed: number;
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
    histories: ReplayStateHistory[];
    hold: HoldState;
    isDead: boolean;
    nexts: Tetromino[];
    noOfCycle: number;
    replayInfo: {
      nextNum: number;
    };
    replaySteps: ReplayStep[];
    ren: number;
    step: number;
  };
} & Action;
